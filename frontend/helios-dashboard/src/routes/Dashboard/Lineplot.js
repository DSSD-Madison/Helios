import Plotly from "plotly.js-dist";

export function createLinePlot(data, selectedId) {
  const containerId = "plot-container-percent";
  const traces = [];
  for (const [id, arrayData] of Object.entries(data)) {
    // Skip if the ID does not match the selected ID
    if (selectedId && id !== selectedId) {
      continue;
    }

    const arrayName = arrayData.name || `Array ${id}`;
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

  const layout = {
    xaxis: {
      title: "Date",
    },
    yaxis: {
      title: "Power (kW) (log-scaled)",
      type: "log",
    },
    title: "Solar Array Output and Irradiance",
    legend: { orientation: "h", y: -0.2 },
    margin: {
      t: 40,
      l: 45,
      r: 10,
      b: 0,
    },
  };

  Plotly.newPlot(containerId, traces, layout, {
    responsive: true,
    displayModeBar: false,
  });
}
