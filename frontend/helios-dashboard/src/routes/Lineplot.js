import Plotly from "plotly.js-dist";

export function createLinePlot(data, selectedId) {
  const containerId = "plot-container-percent";
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
      title: "Power (kW) (log-scaled)",
      type: "log",
    },
    title: "Solar Array Output and Irradiance",
  };

  Plotly.newPlot(containerId, traces, layout);
}

function addTrace(traces, arrayData, arrayName) {
  traces.push({
    x: arrayData.dates,
    y: arrayData.output,
    mode: "lines",
    name: `Output (${arrayName})`,
    line: {
      shape: "spline",
      smoothing: 1,
    },
  });

  traces.push({
    x: arrayData.dates,
    y: arrayData.irradiance,
    mode: "lines",
    name: `Irradiance (${arrayName})`,
    line: {
      shape: "spline",
      smoothing: 1,
    },
  });

  const typicalOutput = arrayData.irradiance.map(
    (irradiance) => irradiance * 0.14
  );
  traces.push({
    x: arrayData.dates,
    y: typicalOutput,
    mode: "lines",
    name: `Typical Efficiency Output (${arrayName})`,
    line: {
      shape: "spline",
      smoothing: 1,
    },
  });
}