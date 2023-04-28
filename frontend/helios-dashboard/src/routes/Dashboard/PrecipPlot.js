import Plotly from "plotly.js-dist";
import { fetchPrecipData } from "../../weatherData";

export function plotPrecipData(data, selectedIds) {
  const containerId = "precip-container";
  const traces = [];
  const dates = [];
  // let count = 0;

  for (const [id, arrayData] of Object.entries(data)) {
    // Skip if the ID does not match the selected ID
    if (selectedIds && !selectedIds.includes(id)) {
      continue;
    }

    const arrayName = arrayData.name || `Array ${id}`;
    const filteredDates = [];
    const filteredOutput = [];
    const filteredEfficiency = [];

    for (let i = 0; i < arrayData.dates.length; i++) {
      if (arrayData.irradiance[i]) {
        // If irradiance value is valid, add the data to the filtered arrays
        filteredDates.push(new Date(arrayData.dates[i]));
        filteredOutput.push(arrayData.output[i]);
        filteredEfficiency.push(
          (arrayData.output[i] / arrayData.irradiance[i]) * 100
        );
        dates.push(new Date(arrayData.dates[i]).toLocaleDateString());
      }
    }

    // eslint-disable-next-line no-loop-func
    fetchPrecipData(filteredDates).then((precipData) => {
      // count += 1;
      traces.push({
        x: precipData,
        y: filteredEfficiency,
        name: `${arrayName}`,
        mode: "markers",
        text: dates,
        type: "scatter",
      });

      // if (Object.entries(data).length === count) {
      const layout = {
        xaxis: {
          title: "Precipitation (mm)",
        },
        yaxis: {
          title: "Efficiency (%)",
          fixedrange: true,
        },
        title: "Precipitation & Efficiency Correlation",
        margin: {
          t: 40,
          l: 45,
          r: 10,
          b: 80,
        },
        dragmode: false,
      };

      Plotly.newPlot(containerId, traces, layout, {
        responsive: true,
        displayModeBar: false,
      });
      // }
    });
  }
}
