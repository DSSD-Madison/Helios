import Plotly from "plotly.js-dist";

export function outputIrradiancePercent(data, selectedId) {
  const containerId = "plot-container-percent";
  const traces = [];
  const datesWithNaN = new Set();
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
      const filteredDates = [];
      const filteredOutput = [];
      const filteredEfficiency = [];

      // Filter the data and store dates with NaN irradiance values
      arrayData.dates.forEach((date, i) => {
        if (isNaN(arrayData.irradiance[i])) {
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
      });
      console.log(datesWithNaN);
      traces.push({
        x: filteredDates,
        y: filteredEfficiency,
        mode: "lines",
        name: `${arrayName} Efficiency`,
      });
      traces.push({
        x: filteredDates,
        y: Array(filteredDates.length).fill(14),
        mode: "lines",
        name: `Typical % Efficiency`,
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
      range: [0, 40],
      fixedrange: true,
    },
    title: {
      text: "Solar Array Efficiency",
    },
    legend: { orientation: "h", y: -0.2 },
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
