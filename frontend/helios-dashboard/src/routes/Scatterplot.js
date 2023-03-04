import React, { useState, useEffect } from "react";
import { aggregateOutputData } from "./OutputByYear";
import Page from "../layouts/Page";
import Plot from "react-plotly.js";

export default function ScatterPlot() {
  const [outputData, setOutputData] = useState(null);
  const [selectedArray, setSelectedArray] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    aggregateOutputData()
      .then((data) => {
        setOutputData(data);
        setSelectedArray(Object.keys(data)[0]);
        setSelectedYear(Object.keys(data[Object.keys(data)[0]])[0]);
        setSelectedMonth(
          Object.keys(
            data[Object.keys(data)[0]][
              Object.keys(data[Object.keys(data)[0]])[0]
            ]
          )[0]
        );
      })
      .catch((error) => console.log(error));
  }, []);

  const handleArrayChange = (event) => {
    setSelectedArray(event.target.value);
    setSelectedYear(Object.keys(outputData[event.target.value])[0]);
    setSelectedMonth(
      Object.keys(
        outputData[event.target.value][
          Object.keys(outputData[event.target.value])[0]
        ]
      )[0]
    );
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth(
      Object.keys(outputData[selectedArray][event.target.value])[0]
    );
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredData =
    outputData &&
    outputData[selectedArray] &&
    outputData[selectedArray][selectedYear] &&
    outputData[selectedArray][selectedYear][selectedMonth];

  return (
    <Page title="Dashboard">
      {outputData && (
        <>
          <div>
            <label htmlFor="array">Solar Array:</label>
            <select
              id="array"
              value={selectedArray}
              onChange={handleArrayChange}
            >
              {Object.keys(outputData).map((array) => (
                <option key={array} value={array}>
                  {array}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <select id="year" value={selectedYear} onChange={handleYearChange}>
              {outputData[selectedArray] &&
                Object.keys(outputData[selectedArray]).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="month">Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {outputData[selectedArray] &&
                outputData[selectedArray][selectedYear] &&
                Object.keys(outputData[selectedArray][selectedYear]).map(
                  (month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  )
                )}
            </select>
          </div>
          <div>
            {filteredData ? (
              <Plot
                data={[
                  {
                    x: Object.keys(filteredData),
                    y: Object.values(filteredData),
                    type: "scatter",
                    mode: "markers",
                    marker: {
                      size: 10,
                      color: "#3F51B5",
                    },
                  },
                ]}
                layout={{
                  width: "100%",
                  height: 500,
                  title: `${selectedArray} Output for ${selectedMonth} ${selectedYear}`,
                  xaxis: { title: "Day" },
                  yaxis: { title: "Output (kWh)" },
                }}
              />
            ) : (
              <p>No data found for selected filters.</p>
            )}
          </div>
        </>
      )}
    </Page>
  );
}
