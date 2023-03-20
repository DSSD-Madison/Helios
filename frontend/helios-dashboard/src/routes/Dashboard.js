import ScatterPlot from "./Scatterplot";
import { aggregateOutputData } from "./FetchData";
export default function Dashboard() {
  aggregateOutputData();
  return <ScatterPlot />;
}
