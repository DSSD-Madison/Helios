import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { CO2_PER_KW, COST_PER_KW } from "../../config/savings";
import { useEffect, useState } from "react";

import SavingsFigures from "../../components/SavingsFigures";

const SavingsBanner = ({ name, data, selectedIds }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  const [kwOutput, setKwOutput] = useState();

  useEffect(() => {
    if (!data) return;

    let kwOutput_ = 0;
    for (const [id, arrayData] of Object.entries(data)) {
      if (selectedIds && !selectedIds.includes(id)) continue;

      for (let dayOutput of arrayData.output) {
        kwOutput_ += dayOutput / 1000;
      }
    }
    setKwOutput(kwOutput_);
  }, [data, selectedIds]);

  const getSavingsText = () => {
    if (name && selectedIds) {
      return `The ${name} solar panel array has saved, to date:`;
    } else {
      return "Campus solar panels have saved, to date:";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#181818",
        px: 3,
        py: 2,
        mx: [-2, -5],
        mb: 2,
        color: "white",
      }}
    >
      <Typography
        variant={isDesktop ? "h3" : "h4"}
        component="h2"
        sx={{ textAlign: "center" }}
      >
        {getSavingsText()}
      </Typography>
      <Stack
        direction="row"
        spacing={isDesktop ? 6 : 3}
        sx={{
          width: "100%",
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SavingsFigures
          dollars={kwOutput * COST_PER_KW}
          watts={kwOutput}
          co2={kwOutput * CO2_PER_KW}
        />
      </Stack>
    </Box>
  );
};

export default SavingsBanner;
