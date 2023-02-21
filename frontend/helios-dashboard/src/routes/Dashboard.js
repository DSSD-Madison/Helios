import Page from "../layouts/Page";
import demo from "../assets/demo.png";

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      <img src={demo} alt="demo" style={{ width: "100%" }} />
    </Page>
  );
}
