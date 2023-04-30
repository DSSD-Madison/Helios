import { Stack, Typography, useMediaQuery } from "@mui/material";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";

import { ESTIMATION_ARRAY_ID } from "../../config/whatIf";
import SavingsFigures from "../../components/SavingsFigures";
import { db } from "../../firebase";

const SavingsDisplay = ({ buildingData }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const solarRef = collection(db, "Solar Arrays");
  const [predictedKwh, setPredictedKwh] = useState(0);

  const name = buildingData.name || "";
  let isThe = false;
  if (name.includes("Center") || name.includes("Building")) isThe = true;

  const fetchSavingsData = async ({ area }) => {
    const estPanelRef = doc(solarRef, ESTIMATION_ARRAY_ID);
    const estPanelDoc = await getDoc(estPanelRef);

    const estOutputRef = collection(estPanelRef, "Output");
    const estOutputSnapshot = await getDocs(estOutputRef);

    const estPanelArea = estPanelDoc.data().area;

    let estOutputDays = 0;
    let estOutputTotal = 0;
    estOutputSnapshot.forEach((doc) => {
      const { Output: output } = doc.data();
      for (let dayOutput of Object.values(output)) {
        estOutputDays++;
        estOutputTotal += dayOutput;
      }
    });

    const estOutputPerDayMeter = estOutputTotal / estOutputDays / estPanelArea;
    const predictedTenYrOutput = estOutputPerDayMeter * 365 * 10 * area;
    setPredictedKwh(predictedTenYrOutput);

    /*console.log(
      estOutputDays,
      estOutputTotal,
      estPanelArea,
      estOutputPerDayMeter,
      predictedTenYrOutput,
      estOutputTotal / estOutputDays
    );*/
  };

  useEffect(() => {
    fetchSavingsData(buildingData);

    // eslint-disable-next-line
  }, [buildingData]);

  return (
    <>
      <Typography variant="h5" component="h2" sx={{ textAlign: "center" }}>
        If {isThe && "the"} {name} had solar panels on its {buildingData.area} m
        <sup>2</sup> of roof, over ten years the savings would be...
      </Typography>

      <Stack
        direction="row"
        spacing={isDesktop ? 6 : 2}
        sx={{ mt: 5, alignItems: "center" }}
      >
        <SavingsFigures kwhOutput={predictedKwh} />
      </Stack>
    </>
  );
};

export default SavingsDisplay;
