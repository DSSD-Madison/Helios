import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";

export function aggregateOutputData() {
  return new Promise((resolve, reject) => {
    const solarArraysRef = collection(db, "Solar Arrays");
    const promises = [];

    // Store output data by arrayId
    const outputData = {};

    getDocs(solarArraysRef)
      .then((querySnapshot) => {
        console.log(querySnapshot.size);
        // Iterate over each Solar Array document
        querySnapshot.forEach((doc) => {
          const arrayId = doc.id;
          const outputRef = collection(doc.ref, "Output");

          // Fetch the Output subcollection for the current Solar Array
          promises.push(
            getDocs(outputRef).then((outputDocs) => {
              // Store output data for the current arrayId
              outputData[arrayId] = {};

              // Iterate over each year's document in the Output subcollection
              outputDocs.forEach((subDoc) => {
                const year = subDoc.id.split("-")[0];
                const outputDict = subDoc.data().Output;
                for (const date in outputDict) {
                  const day = date.split(" ")[0];
                  const month = date.substring(0, date.lastIndexOf("-"));
                  const output = outputDict[date];
                  if (!outputData[arrayId][year]) {
                    outputData[arrayId][year] = {};
                  }
                  if (!outputData[arrayId][year][month]) {
                    outputData[arrayId][year][month] = {};
                  }
                  outputData[arrayId][year][month][day] = output;
                }
              });
            })
          );
        });

        Promise.all(promises)
          .then(() => {
            resolve(outputData);
          })
          .catch((error) => {
            console.log(`Error aggregating Output data: ${error}`);
            reject(error);
          });
      })
      .catch((error) => {
        console.log(`Error fetching Solar Arrays collection: ${error}`);
        reject(error);
      });
  });
}
