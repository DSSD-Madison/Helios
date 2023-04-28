import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Divider from "@mui/material/Divider";
import FILTER_REMAPPINGS from "../../config/filterRemappings.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Page from "../../layouts/Page";
import Paper from "@mui/material/Paper";
import SavingsBanner from "./SavingsBanner";
import { aggregateOutputData } from "./FetchData";
import { createLinePlot } from "./Lineplot";
import { outputIrradiancePercent } from "./LineplotPercent";
import { plotPrecipData } from "./PrecipPlot";

export default function Dashboard() {
  const [data, setData] = useState();
  const [panelNames, setPanelNames] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedName, setSelectedName] = useState("all");
  const [datesWithNaN, setDatesWithNaN] = useState(new Set());

  useEffect(() => {
    aggregateOutputData().then((data) => {
      setData(data);

      let _panelNames = [];
      for (let [arrayId, array] of Object.entries(data)) {
        let inRemapping = false;
        for (let remapping of Object.values(FILTER_REMAPPINGS)) {
          if (remapping.panelIds.includes(arrayId)) {
            inRemapping = true;
          }
        }

        if (inRemapping) continue;

        _panelNames.push(array.name);
      }
      for (let remappingName of Object.keys(FILTER_REMAPPINGS)) {
        _panelNames.push(remappingName);
      }
      setPanelNames(_panelNames);

      let selectedIds_ = undefined;
      if (Object.keys(FILTER_REMAPPINGS).includes(selectedName)) {
        selectedIds_ = FILTER_REMAPPINGS[selectedName].panelIds;
      } else {
        let id_ = Object.keys(data).find(
          (id) => data[id].name === selectedName
        );
        if (id_) selectedIds_ = [id_];
      }

      setSelectedIds(selectedIds_);
      createLinePlot(data, selectedIds_);
      plotPrecipData(data, selectedIds_);
      const nanDates = outputIrradiancePercent(data, selectedIds_);

      setDatesWithNaN(() => new Set([...nanDates]));
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
          {panelNames &&
            panelNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </Stack>
      <SavingsBanner
        name={selectedName}
        data={data}
        selectedIds={selectedIds}
      />
      <Box
        id="plot-container-percent"
        sx={{ width: "100%", height: "400px" }}
      ></Box>
      <Box id="plot-container" sx={{ width: "100%", height: "400px" }}></Box>
      <Box id="precip-container" sx={{ width: "100%", height: "400px" }}></Box>
      <Paper sx={{ mt: 4, mb: 1, p: 1 }}>
        <Typography variant="h6" sx={{ mb: 0 }}>
          Omitted Dates (due to data collection errors):
        </Typography>
        <List>
          {[...datesWithNaN].map((date, index) => (
            <>
              <ListItem key={index}>
                <ListItemText primary={new Date(date).toLocaleDateString()} />
              </ListItem>
              {index !== datesWithNaN.size - 1 && <Divider />}
            </>
          ))}
        </List>
      </Paper>
    </Page>
  );
}
