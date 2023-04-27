const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const { parse } = require("csv-parse");
const { calcSolarValues, convertStringToID, convertIDtoString } = require("./solarCalc");

admin.initializeApp();

const solarArraysRef = admin.firestore().collection("Solar Arrays");

const prod = process.env.NODE_ENV === "production";

/**
 * Cloud Function that reads a CSV file uploaded to Cloud Storage, parses the data, and writes the solar output data
 * to a Firestore database.
 *
 * @param {Object} object - The object metadata that triggered the function.
 * @param {string} object.bucket - Name of the Cloud Storage bucket containing the file.
 * @param {string} object.name - Name of the file uploaded to Cloud Storage.
 * @returns {boolean} - Returns true if the function executed successfully, false otherwise.
 */
exports.onFileUpload = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 60
  })
  .storage.object()
  .onFinalize(async (object) => {
    return new Promise(async (resolve, reject) => {
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

        let arrayDoc = await docFileRef.get();

        let { rho_g, gamma, beta, area } = arrayDoc.data();

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
          const key = convertStringToID(date)
          const year = 2000 + parseInt(key.substring(0, 2))
          // const year = new Date(date).getFullYear().toString();

          // // Parse the date and format the timestamp.
          // const timestampMillis = Date.parse(date);
          // if (isNaN(timestampMillis)) {
          //   console.log(`Skipping row - invalid date: ${date}`);
          //   return;
          // }

          //Add the solar output data to the yearData object.
          if (!yearData.hasOwnProperty(year)) {
            yearData[year] = {};
          }

          yearData[year][convertIDtoString(key)] = solarOutputValue;
        });

        let calc;

        csvStream.on("end", async () => {
          const outputCollectionRef = docFileRef.collection("Output");
          // Write the solar output data to the database based on the docFileRef
          const batch = admin.firestore().batch();
          for (const year in yearData) {
            const yearDocRef = outputCollectionRef.doc(year);
            const yearDataObj = {
              Output: yearData[year],
            };

            days = Object.keys(yearData[year]).map((dateStr) => {
              const id = convertStringToID(dateStr)
              return parseInt(id.substring(2))
            });

            await new Promise((resolve, reject) => {
              calcSolarValues(
                year,
                days,
                beta,
                gamma,
                rho_g,
                area,
                undefined,
                (irradianceObj) => {
                  yearDataObj.irradiance = irradianceObj;
                  batch.set(yearDocRef, yearDataObj, { merge: true });
                  resolve();
                },
                (err) => reject(err)
              );
            });
          }
          await batch.commit();
          console.log("CSV parsing and database write completed successfully.");
          await file.delete();
          resolve(true);
        });
        file.createReadStream().pipe(csvStream);
      } catch (error) {
        console.error(`Error processing CSV file: ${error}`);
        reject(error);
      }
    });
  });

/**
 * Cloud function that creates a new document for a user in the users collection when a user signs up
 */
exports.createUserDoc = functions.auth.user().onCreate((user) => {
  const userDoc = admin.firestore().collection("users").doc(user.uid);
  return userDoc.set({
    email: user.email,
    isAdmin: false,
  });
});

/**
 * Cloud function that returns the total irradiance for the whole year previous to current year given the parameters and enforces AppCheck
 * 
 * @param {*} beta 
 * @param {*} gamma 
 * @param {*} rho_g 
 * @param {*} arrayarea 
 */
exports.getIrradianceDataForPrevYear = functions
  .runWith({
    enforceAppCheck: prod,
    memory: "128MB",
    timeoutSeconds: 60
  })
  .https.onCall((beta, gamma, rho_g, area) => {
    if (prod && context.app == undefined) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.')
    }

    const year = new Date().getFullYear() - 1;

    const isLeapYear = (year % 4 === 0);
    const daysInYear = isLeapYear ? 366 : 365;
    const daysList = [];
    for (let i = 1; i <= daysInYear; i++) {
      daysList.push(i);
    }

    return new Promise((resolve, reject) => {
      calcSolarValues(
        year,
        daysList,
        beta,
        gamma,
        rho_g,
        area,
        undefined,
        (irradiance) => {
          // console.log(irradiance);
          let result = Object.values(irradiance).reduce((a, b) => a + (Number(b) || 0), 0);
          // console.log(result);
          resolve(result);
        },
        (err) => reject(err)
      );
    });
  });
