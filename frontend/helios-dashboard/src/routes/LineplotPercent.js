import Plotly from "plotly.js-dist";

export function outputIrradiancePercent(data, selectedId) {
  const containerId = "plot-container";
  const traces = [];
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
      title: "Efficiency (%)",
    },
    title: "Solar Array Efficiency",
  };

  Plotly.newPlot(containerId, traces, layout);
}
