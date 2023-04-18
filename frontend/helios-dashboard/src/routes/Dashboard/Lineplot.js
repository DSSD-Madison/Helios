import Plotly from "plotly.js-dist";

export function createLinePlot(data, selectedId) {
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

    if (!selectedId || (selectedId && id === selectedId)) {
      const arrayName = arrayData.name || `Array ${id}`;
      addTrace(traces, arrayData, arrayName);
    }
  }

  // Set sixMonthsAgo based on the latestDate (no id selected) or the latest date of the selected array
  let sixMonthsAgo = new Date(
    selectedId
      ? data[selectedId].dates[data[selectedId].dates.length - 1]
      : latestDate
  );
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const layout = {
    xaxis: {
      title: "Date",
      range: [
        sixMonthsAgo,
        selectedId
          ? data[selectedId].dates[data[selectedId].dates.length - 1]
          : latestDate,
      ],
    },
    yaxis: {
      title: "Energy (kWh)",
      // type: "log",
      range: [0, 2000],
      fixedrange: true,
    },
    title: "Solar Array Output and Irradiance",
    legend: { orientation: "h", y: -0.2 },
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

    if (!isNaN(arrayData.irradiance[i])) {
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
