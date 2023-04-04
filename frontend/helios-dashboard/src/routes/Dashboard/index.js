import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Page from "../../layouts/Page";
import SavingsBanner from "./SavingsBanner";
import { aggregateOutputData } from "./FetchData";
import { createLinePlot } from "./Lineplot";
import { outputIrradiancePercent } from "./LineplotPercent";
import { plotPrecipData } from "./PrecipPlot";

export default function Dashboard() {
  const [data, setData] = useState();
  const [selectedName, setSelectedName] = useState("all");

  useEffect(() => {
    aggregateOutputData().then((data) => {
      setData(data);
      const selectedId = Object.keys(data).find(
        (id) => data[id].name === selectedName
      );
      createLinePlot(data, selectedId);
      outputIrradiancePercent(data, selectedId);
      plotPrecipData(data, selectedId);
    });
  }, [selectedName]);

  const handleChange = (event) => {
    setSelectedName(event.target.value);
  };

  return (
    <Page title="Dashboard">
      <Stack direction="row" sx={{ alignItems: "center", mb: 2 }}>
        <Typography htmlFor="solar-array-select" sx={{ mr: 2 }}>
          Select Solar Array:
        </Typography>
        <Select
          id="solar-array-select"
          value={selectedName}
          onChange={handleChange}
        >
          <MenuItem value="all" selected>
            All
          </MenuItem>
          {data &&
            Object.values(data).map((arrayData) => (
              <MenuItem key={arrayData.name} value={arrayData.name}>
                {arrayData.name}
              </MenuItem>
            ))}
        </Select>
      </Stack>
      <SavingsBanner />
      <Box
        id="plot-container-percent"
        sx={{ width: "100%", height: "400px" }}
      ></Box>
      <Box id="plot-container" sx={{ width: "100%", height: "400px" }}></Box>
      <Box id="precip-container" sx={{ width: "100%", height: "400px" }}></Box>
    </Page>
  );
}
