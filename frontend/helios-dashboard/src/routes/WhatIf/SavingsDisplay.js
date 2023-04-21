import { Stack, Typography, useMediaQuery } from "@mui/material";

import SavingsFigures from "../../components/SavingsFigures";
import { getIrradianceDataForPrevYear } from "../../firebase";
import { useEffect } from "react";

const SavingsDisplay = ({ buildingData }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  const name = buildingData.name || "";
  let isThe = false;
  if (name.includes("Center") || name.includes("Building")) isThe = true;

  const fetchSavingsData = async (data) => {
    console.log(data);
    const irradiance = await getIrradianceDataForPrevYear({
      beta: data.beta,
      gamma: data.gamma,
      rho_g: data.rho_g,
      area: data.area,
    });
    console.log(irradiance);
  };

  useEffect(() => {
    fetchSavingsData(buildingData);

    // eslint-disable-next-line
  }, [buildingData]);

  return (
    <>
      <Typography variant="h5" component="h2">
        If {isThe && "the"} {name} had solar panels on its {buildingData.area} m
        <sup>2</sup> of roof...
      </Typography>

      <Stack
        direction="row"
        spacing={isDesktop ? 6 : 2}
        sx={{ mt: 5, alignItems: "center" }}
      >
        <SavingsFigures dollars={100} watts={100} co2={100} />
      </Stack>
    </>
  );
};

export default SavingsDisplay;
