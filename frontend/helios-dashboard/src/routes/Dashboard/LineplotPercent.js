import Plotly from "plotly.js-dist";

export function outputIrradiancePercent(data, selectedId) {
  const containerId = "plot-container";
  const traces = [];
  for (const [id, arrayData] of Object.entries(data)) {
    // Skip if the ID does not match the selected ID
    if (selectedId && id !== selectedId) {
      continue;
    }

    const arrayName = arrayData.name || `Array ${id}`;
    traces.push({
      x: arrayData.dates,
      y: arrayData.output.map(
        (output, i) => (output / arrayData.irradiance[i]) * 100
      ),
      mode: "lines",
      name: `${arrayName} Efficiency`,
      line: {
        shape: "spline",
        smoothing: 1,
      },
    });
    traces.push({
      x: arrayData.dates,
      y: Array(arrayData.dates.length).fill(14),
      mode: "lines",
      name: `Typical % Efficiency`,
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
      title: "Efficiency (%)",
    },
    title: {
      text: "Solar Array Efficiency",
      automargin: true,
    },
    legend: { orientation: "h", y: -0.2 },
    margin: {
      t: 40,
      l: 45,
      r: 10,
      b: 80,
    },
  };

  Plotly.newPlot(containerId, traces, layout, {
    displayModeBar: false,
    responsive: true,
  });
}
