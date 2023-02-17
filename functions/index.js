const functions = require("firebase-functions");
const csv = require("csv-parser");
const admin = require("firebase-admin");
const moment = require("moment");

admin.initializeApp();

const solarArraysRef = admin.firestore().collection("Solar Arrays");

exports.onFileUpload = functions.storage.object().onFinalize(async (object) => {
  try {
    const fileBucket = object.bucket;
    const filePath = object.name;
    const docFileRef = solarArraysRef.doc();

    if (!filePath.endsWith(".csv")) {
      console.log(`File ${filePath} is not in CSV format, skipping...`);
      return false;
    }

    // create a reference to the Cloud Storage file and set up a CSV parser
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const csvStream = csv();

    csvStream.on("data", async (data) => {
      // Find the column headers in the current row that contain the date and solar output values.
      const dateKey = Object.keys(data).find((key) => /date/i.test(key));
      const solarOutputValueKey = Object.keys(data).find((key) =>
        /total.*yield/i.test(key)
      );

      // If either column header is missing, skip the row.
      if (dateKey === undefined || solarOutputValueKey === undefined) {
        console.log("Skipping row - missing required column(s).");
        return;
      }

      // Extract data from the row and convert date to year.
      const date = data[dateKey].replace(/\//g, "-");
      const solarOutputValue = data[solarOutputValueKey];
      const year = new Date(date).getFullYear().toString();

      // Determine the collection name based on the file path.
      const collectionName =
        filePath.toLowerCase().includes("gordon") ||
        filePath.toLowerCase().includes("arboretum")
          ? filePath.slice(0, filePath.lastIndexOf(".csv"))
          : null;

      // If the file is not in the database, log an error and exit early.
      if (!collectionName) {
        console.log("File not in the database.");
        return false;
      }

      // Set the file name in the database.
      const fileName = { Name: collectionName };
      await docFileRef.set(fileName);

      // Get the subcollection for this year's document.
      const outputCollectionRef = docFileRef.collection("output");

      // Parse the date and format the timestamp.
      const timestamp = admin.firestore.Timestamp.fromMillis(
        Date.parse(date)
      ).toDate();
      const formattedTimestamp = moment(timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      // Query the output collection for documents with the same year.
      const snapshot = await outputCollectionRef
        .where("year", "==", year)
        .get();

      // If the query returns an empty snapshot, create a new document for the year.
      // Otherwise, use the first document in the snapshot.
      const currentDocRef = snapshot.empty
        ? outputCollectionRef.doc(year)
        : snapshot.docs[0].ref;

      // Create a batch object to batch the write operations.
      const batch = admin.firestore().batch();

      // Add the write operations to the batch.
      batch.set(
        currentDocRef,
        {
          Output: {
            [formattedTimestamp]: solarOutputValue,
          },
          year: year,
        },
        { merge: true }
      );

      // Commit the batch to the database.
      await batch.commit();
    });

    csvStream.on("end", () => {
      console.log("CSV parsing ended.");
    });

    await file.createReadStream().pipe(csvStream);

    return true;
  } catch (error) {
    console.error(`Error processing CSV file: ${error}`);
  }
});
