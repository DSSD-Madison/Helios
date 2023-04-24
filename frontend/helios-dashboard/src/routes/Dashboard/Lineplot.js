import Plotly from "plotly.js-dist";

export function createLinePlot(data, selectedIds) {
  const containerId = "plot-container";
  const traces = [];
  console.log(data);

  let latestDate = new Date(0);

  for (const [id, arrayData] of Object.entries(data)) {
    // Update the latest date if a more recent date is found
    const maxDateCandidate = new Date(
      arrayData.dates[arrayData.dates.length - 1]
    );
    if (maxDateCandidate > latestDate) {
      latestDate = maxDateCandidate;
    }

    if (!selectedIds || (selectedIds && selectedIds.includes(id))) {
      const arrayName = arrayData.name || `Array ${id}`;
      addTrace(traces, arrayData, arrayName);
    }
  }

  // Set sixMonthsAgo based on the latestDate (no id selected) or the latest date of the selected array

  let sixMonthsAgo = new Date(
    selectedIds && selectedIds[0]
      ? data[selectedIds[0]].dates[data[selectedIds[0]].dates.length - 1]
      : latestDate
  );

  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const layout = {
    xaxis: {
      title: "Date",
      range: [
        sixMonthsAgo,
        selectedIds && selectedIds[0]
          ? data[selectedIds[0]].dates[data[selectedIds[0]].dates.length - 1]
          : latestDate,
      ],
    },

    yaxis: {
      title: "Energy (kWh)",
      fixedrange: true,
    },
    title: "Solar Array Output and Irradiance",
    legend: {
      orientation: "h",
      y: -0.2,
    },
    margin: {
      t: 40,
      l: 45,
      r: 10,
      b: 0,
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
}

function addTrace(traces, arrayData, arrayName) {
  const output = [];
  const irradiance = [];
  const irradianceDates = [];
  const dates = [];

  for (let i = 0; i < arrayData.dates.length; i++) {
    dates.push(arrayData.dates[i]);
    output.push(arrayData.output[i] / 1000);
    if (arrayData.irradiance[i]) {
      irradianceDates.push(arrayData.dates[i]);
      irradiance.push(arrayData.irradiance[i] / 1000);
    }
  }
  traces.push({
    x: dates,
    y: output,
    mode: "lines",
    name: `Output (${arrayName})`,
  });

  traces.push({
    x: irradianceDates,
    y: irradiance,
    mode: "lines",
    name: `Irradiance (${arrayName})`,
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
        (date) => date === arrayData.dates[i]
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
  console.log(latestDate);
  return {
    aggregatedData,
    latestDate,
  };
}
