import Plotly from "plotly.js-dist-min";
import { createEffect, createMemo, onCleanup, onMount, useContext, type Component } from "solid-js"
import { BedContext } from "./Context";
import { LENGTH_BED } from "../globals";

interface PlotlyChartProps {
    // data: () => Profile,
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = (props) => {
    // const env = transpose(envelope);
    const data = [{
            x: [],
            y: [],
            type: 'scatter',
            line: { color: "black" }
        }];

    const bedCtx = useContext(BedContext);
    if (!bedCtx) throw new Error("Bed context undefined");
        

    const plotdata = createMemo((): Plotly.Data[] => {
        const plotdata = [...data] as Partial<Plotly.Data>[];

        bedCtx!.bedUpdated();
        const bed = bedCtx!.bed;
        if (!bed) return [];

        const view = bed.view("p");
        const N = view.length;
        const x = Array.from({ length: N }).map((_,i) => i / (N - 1) * LENGTH_BED);
        
        const newData = {
            x: x,
            y: view,
            type: 'scatter',
            mode: 'lines',
            line: { color: "black" },
            marker: { color: "red", size: 8 }
        } as Partial<Plotly.Data>;

        plotdata.push(newData);

        return plotdata as Plotly.Data[];
    });

    let chartDiv!: HTMLDivElement;
    onMount(() => {
        Plotly.newPlot(chartDiv, plotdata(), props.layout, props.config)
    });

    // Update chartdiv when necessary
    createEffect(() => {
        const data = plotdata();
        if (chartDiv) {
            // console.log("plotly react")
            Plotly.react(chartDiv, data, props.layout, props.config);
        }
    });

    onCleanup(() => {
        if (chartDiv) {
            Plotly.purge(chartDiv);
        }
    })

    return <div ref={chartDiv} />;
}