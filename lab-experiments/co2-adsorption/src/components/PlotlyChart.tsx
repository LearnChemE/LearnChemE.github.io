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

        const view = bed.view("u");
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

/**
 * MM co2 = 44.01 g / mol
 * MM n2  = 28.01 g / mol
 * 
 * MM for 10% co2/n2 = 4.401 + 25.209 = 29.61 g / mol
 * MM for 90% co2/n2 = 39.609 + 2.801 = 42.41 g / mol
 * 
 * @  0%: 10 g/min = 0.357 mol/min
 * @ 10%: 10 g/min = 0.338 mol/min
 * @ 90%: 10 g/min = 0.236 mol/min
 * velocity of 10% is 1.43 times higher
 * 
 * flowrate of CO2 @ 10% is actually 0.034 mol/min
 * flowrate of CO2 @ 90% is actually 0.212 mol/min
 * 90% flowrate is 6.28 times higher
 */