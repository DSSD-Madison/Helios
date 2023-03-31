import Plotly from "plotly.js-dist";
import { fetchPrecipData } from "../weatherData"

export function plotPrecipData(data, selectedId) {
    const containerId = "precip-container";
    const traces = [];
    let count = 0;
    for (const [id, arrayData] of Object.entries(data)) {
        // Skip if the ID does not match the selected ID
        if (selectedId && id !== selectedId) {
            continue;
        }

        const arrayName = arrayData.name || `Array ${id}`;
        let dates = []

        for (let i = 0; i < arrayData.dates.length; i++) {
            dates.push(new Date(arrayData.dates[i]))
        }

        fetchPrecipData(dates).then((precipData) => {
            count += 1
            traces.push({
                x: precipData,
                y: arrayData.output.map(
                    (output, i) => (output / arrayData.irradiance[i]) * 100
                ),
                name: `${arrayName}`,
                mode: 'markers',
                type: 'scatter'
            });


            if (Object.entries(data).length == count) {
                const layout = {
                    xaxis: {
                        title: "Precipitation (mm)",
                    },
                    yaxis: {
                        title: "Efficiency (%)",
                    },
                    title: "Precipitation & Efficiency Correlation",
                };

                Plotly.newPlot(containerId, traces, layout);
            }

        })


    }


}