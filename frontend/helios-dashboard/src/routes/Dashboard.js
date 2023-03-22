import { aggregateOutputData } from "./FetchData";
import Page from "../layouts/Page";
import demo from "../assets/demo.png";
import { useEffect, useState } from "react";

export default function Dashboard() {

  let [data, setData] = useState()
  useEffect(() => {
    aggregateOutputData().then(data => {
      setData(data);
    });
  }, []);
  return (
    <Page title="Dashboard">
      <img src={demo} alt="demo" style={{ width: "100%" }} />
    </Page>
  );
}
