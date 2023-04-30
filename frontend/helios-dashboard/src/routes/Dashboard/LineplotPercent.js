import Plotly from "plotly.js-dist";
import getDateRange from "./getDateRange";
export function outputIrradiancePercent(data, selectedIds) {
  const containerId = "plot-container-percent";
  const traces = [];
  const datesWithNaN = new Set(); // dates with nan irradiance
  let latestDate = new Date(0);
  const allDates = [];

  if (!selectedIds) {
    const { aggregatedData, latestDate: aggregatedLatestDate } =
      aggregateData(data);
    addTrace(traces, aggregatedData, "Aggregated", allDates, datesWithNaN);
    latestDate = aggregatedLatestDate;
  } else {
    for (const [id, arrayData] of Object.entries(data)) {
      if (selectedIds.includes(id)) {
        const arrayName = arrayData.name || `Array ${id}`;
        addTrace(traces, arrayData, arrayName, allDates, datesWithNaN);
      }
    }
  }
  traces.push({
    x: allDates,
    y: Array(allDates.length).fill(14),
    mode: "lines",
    name: `Typical % Efficiency`,
  });

  const layout = {
    xaxis: {
      title: "Date",
      range: getDateRange(data, selectedIds, latestDate),
    },
    yaxis: {
      title: "Efficiency (%)",
      fixedrange: true,
    },
    title: {
      text: "Solar Array Efficiency",
    },
    legend: {
      orientation: "h",
      y: -0.2,
    },
    margin: {
      t: 40,
      l: 45,
      r: 10,
      b: 80,
    },
    dragmode: "pan",
  };

  Plotly.newPlot(containerId, traces, layout, {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "autoScale2d",
      "select2d",
      "zoom2d",
      "lasso2d",
      "toImage",
      "pan2d",
    ],
    displayModeBar: true,
    scrollZoom: true,
  });
  return datesWithNaN;
}

function addTrace(traces, arrayData, arrayName, allDates, datesWithNaN) {
  const filteredDates = [];
  const filteredOutput = [];
  const filteredEfficiency = [];
  // Filter the data and store dates with NaN irradiance values
  for (let i = 0; i < arrayData.dates.length; i++) {
    const date = arrayData.dates[i];
    allDates.push(date);
    if (!arrayData.irradiance[i]) {
      // If irradiance value is NaN, store the date in datesWithNaN
      datesWithNaN.add(new Date(date).toISOString());
    } else {
      // If irradiance value is valid, add the data to the filtered arrays
      filteredDates.push(date);
      filteredOutput.push(arrayData.output[i]);
      filteredEfficiency.push(
        (arrayData.output[i] / arrayData.irradiance[i]) * 100
      );
    }
  }
  traces.push({
    x: filteredDates,
    y: filteredEfficiency,
    mode: "lines",
    name: `${arrayName} Efficiency`,
  });
}

function aggregateData(data) {
  const aggregatedData = {
    dates: [],
    output: [],
    irradiance: [],
  };

  let latestDate = new Date(0);
  for (const arrayData of Object.values(data)) {
    for (let i = 0; i < arrayData.dates.length; i++) {
      const index = aggregatedData.dates.findIndex(
        (date) =>
          new Date(date).getTime() === new Date(arrayData.dates[i]).getTime()
      );
      if (index !== -1) {
        aggregatedData.output[index] += arrayData.output[i];
        aggregatedData.irradiance[index] += arrayData.irradiance[i];
      } else {
        aggregatedData.dates.push(arrayData.dates[i]);
        aggregatedData.output.push(arrayData.output[i]);
        aggregatedData.irradiance.push(arrayData.irradiance[i]);
      }

      // Update the latest date if a more recent date is found
      const maxDateCandidate = new Date(
        arrayData.dates[arrayData.dates.length - 1]
      );
      if (maxDateCandidate > latestDate) {
        latestDate = maxDateCandidate;
      }
    }
  }

  // Sort aggregatedData by dates
  const sortedIndices = aggregatedData.dates
    .map((date, i) => i)
    .sort(
      (a, b) =>
        new Date(aggregatedData.dates[a]) - new Date(aggregatedData.dates[b])
    );

  aggregatedData.dates = sortedIndices.map((i) => aggregatedData.dates[i]);
  aggregatedData.output = sortedIndices.map((i) => aggregatedData.output[i]);
  aggregatedData.irradiance = sortedIndices.map(
    (i) => aggregatedData.irradiance[i]
  );
  return {
    aggregatedData,
    latestDate,
  };
}
