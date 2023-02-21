const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const { parse } = require("csv-parse");

admin.initializeApp();

const solarArraysRef = admin.firestore().collection("Solar Arrays");

/**
 * Cloud Function that reads a CSV file uploaded to Cloud Storage, parses the data, and writes the solar output data
 * to a Firestore database.
 *
 * @param {Object} object - The object metadata that triggered the function.
 * @param {string} object.bucket - Name of the Cloud Storage bucket containing the file.
 * @param {string} object.name - Name of the file uploaded to Cloud Storage.
 * @returns {boolean} - Returns true if the function executed successfully, false otherwise.
 */
exports.onFileUpload = functions.storage.object().onFinalize(async (object) => {
  try {
    const fileBucket = object.bucket;
    const filePath = object.name;

    if (!filePath.endsWith(".csv")) {
      console.log(`File ${filePath} is not in CSV format, skipping...`);
      return false;
    }

    // create a reference to the Cloud Storage file and set up a CSV parser
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const csvStream = file.createReadStream().pipe(
      parse({
        delimiter: [";", ",", "\t", "|"],
        columns: true, // use the first row as column headers
      })
    );

    // // Determine the document id based on the file path.
    const docID = filePath.slice(0, filePath.lastIndexOf("_"));

    // Set the file name in the database.
    const docFileRef = solarArraysRef.doc(docID);

    const yearData = {};

    csvStream.on("data", (data) => {
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

      // Extract date from the row and convert solar output value to an integer if possible.
      const solarOutputValue = parseInt(data[solarOutputValueKey], 10);
      if (isNaN(solarOutputValue)) {
        return;
      }

      const date = data[dateKey].replace(/\//g, "-");
      const year = new Date(date).getFullYear().toString();

      // Parse the date and format the timestamp.
      const timestampMillis = Date.parse(date);
      if (isNaN(timestampMillis)) {
        console.log(`Skipping row - invalid date: ${date}`);
        return;
      }

      const timestamp =
        admin.firestore.Timestamp.fromMillis(timestampMillis).toDate();
      const formattedTimestamp = moment(timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      // Add the solar output data to the yearData object.
      if (!yearData.hasOwnProperty(year)) {
        yearData[year] = {};
      }

      yearData[year][formattedTimestamp] = solarOutputValue;
    });

    csvStream.on("end", async () => {
      // Write the solar output data to the database based on the docFileRef
      const outputCollectionRef = docFileRef.collection("Output");
      const batch = admin.firestore().batch();
      for (const year in yearData) {
        const yearDocRef = outputCollectionRef.doc(year);
        const yearDataObj = {
          Output: yearData[year],
        };
        batch.set(yearDocRef, yearDataObj, { merge: true });
      }

      await batch.commit();
      console.log("CSV parsing and database write completed successfully.");
    });

    await file.createReadStream().pipe(csvStream);

    return true;
  } catch (error) {
    console.error(`Error processing CSV file: ${error}`);
    return false;
  }
});
