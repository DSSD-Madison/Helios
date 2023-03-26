import { aggregateOutputData } from "./FetchData";
import Page from "../layouts/Page";
import demo from "../assets/demo.png";
import { useEffect, useState } from "react";
import { createLinePlot } from "./Lineplot";
import { outputIrradiancePercent } from "./LineplotPercent";

export default function Dashboard() {
  const [data, setData] = useState();
  const [selectedName, setSelectedName] = useState();

  useEffect(() => {
    aggregateOutputData().then((data) => {
      setData(data);
      const selectedId = Object.keys(data).find(
        (id) => data[id].name === selectedName
      );
      createLinePlot(data, selectedId);
      outputIrradiancePercent(data, selectedId);
    });
  }, [selectedName]);

  const handleChange = (event) => {
    setSelectedName(event.target.value);
  };

  return (
    <Page title="Dashboard">
      <div>
        <label htmlFor="solar-array-select">Select Solar Array:</label>
        <select
          id="solar-array-select"
          value={selectedName}
          onChange={handleChange}
        >
          <option value="">All</option>
          {data &&
            Object.values(data).map((arrayData) => (
              <option key={arrayData.name} value={arrayData.name}>
                {arrayData.name}
              </option>
            ))}
        </select>
      </div>
      <div id="plot-container" style={{ width: "100%", height: "400px" }}></div>
      <div
        id="plot-container-percent"
        style={{ width: "100%", height: "400px" }}
      ></div>
      <img src={demo} alt="demo" style={{ width: "100%" }} />
    </Page>
  );
}
