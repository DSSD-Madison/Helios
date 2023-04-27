import { Stack, Typography, useMediaQuery } from "@mui/material";

import SavingsFigures from "../../components/SavingsFigures";

const SavingsDisplay = ({ buildingData }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  return (
    <>
      <Typography variant="h5" component="h2" align="center">
        If the {buildingData.name} had a {buildingData.area} m
        <sup>2</sup> solar array on its roof, the following
        savings would be made in {new Date().getFullYear() - 1} alone...
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
