import Plotly from "plotly.js-dist-min";
import { createEffect, createMemo, onCleanup, onMount, type Component } from "solid-js"
import { envelope } from "../calcs";
import { transpose } from "../ts/helpers";

interface PlotlyChartProps {
    // data: () => Profile,
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = ({ layout, config }) => {

    const plotdata = createMemo((): Plotly.Data[] => {
        const env = transpose(envelope)

        return [{
            x: [0, 1],
            y: [1, 0],
            type: 'scatter',
            line: { color: "black" }
        }, {
            x: env[0],
            y: env[1],
            type: 'scatter',
            line: { color: "black" }
        }];
    });

    let chartDiv!: HTMLDivElement;
    onMount(() => {
        Plotly.newPlot(chartDiv, plotdata(), layout, config)
    });

    // Update chartdiv when necessary
    createEffect(() => {
        if (chartDiv) {
            Plotly.react(chartDiv, plotdata(), layout, config);
        }
    });

    onCleanup(() => {
        if (chartDiv) {
            Plotly.purge(chartDiv);
        }
    })

    return <div ref={chartDiv} />;
}