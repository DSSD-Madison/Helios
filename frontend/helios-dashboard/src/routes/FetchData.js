import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";

export function aggregateOutputData() {
  return new Promise((resolve, reject) => {
    const solarArraysRef = collection(db, "Solar Arrays");
    const promises = [];

    const outputData = {};

    getDocs(solarArraysRef)
      .then((querySnapshot) => {
        // Iterate over each Solar Array document
        querySnapshot.forEach((doc) => {
          const arrayId = doc.id;
          const outputRef = collection(doc.ref, "Output");
          const arrayInfo = doc.data();

          promises.push(
            Promise.all([getDocs(outputRef)]).then(([outputDocs]) => {
              const data = {
                dates: [],
                output: [],
                irradiance: [],
              };

              // Fetch the Output subcollection for the current Solar Array
              outputDocs.forEach((outputDoc) => {
                const outputDict = outputDoc.data().Output;
                const irradianceDict = outputDoc.data().irradiance;

                for (const dateStr in outputDict) {
                  const dateObj = new Date(parseInt(dateStr, 10));
                  const output = outputDict[dateStr];
                  const irradiance = irradianceDict[dateStr];

                  data.dates.push(dateObj);
                  data.output.push(output);
                  data.irradiance.push(irradiance);
                }
              });

              const sortedData = data.dates
                .map((date, index) => ({
                  date,
                  output: data.output[index],
                  irradiance: data.irradiance[index],
                }))
                .sort((a, b) => a.date - b.date);

              outputData[arrayId] = Object.assign({
                dates: sortedData.map((item) => item.date),
                output: sortedData.map((item) => item.output),
                irradiance: sortedData.map((item) => item.irradiance),
              }, arrayInfo);
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
