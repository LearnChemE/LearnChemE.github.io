import Plotly from "plotly.js-dist-min";
import { createEffect, createMemo, onCleanup, onMount, type Component } from "solid-js"
import type { Profile } from "../types/globals";
import { CONC_ARRAY_SIZE, integrate } from "../ts/calcs";

interface PlotlyChartProps {
    data: () => Profile,
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = ({ data, layout, config }) => {

    const plotdata = createMemo((): Plotly.Data[] => {
        const dat = data();
        console.log("Time:", dat[0].toFixed(2), 
            "\nRed integral:", integrate(Array.from(dat).slice(2, 502),dat[1]).toFixed(2), 
            "\nWhite integral:", integrate(Array.from(dat).slice(502),dat[1]).toFixed(2));
        const top = dat[1];
        const dz = (305 - top) / 499;
        const z = Array.from({ length: CONC_ARRAY_SIZE }, (_,i) => top + i * dz);
        const cr = dat.slice(2,502);
        const cw = dat.slice(502);

        // Integrate the 
        
        // console.log("Red:", dz * cr.reduce((a,b) => a + b, 0));
        // console.log("White:", dz * cw.reduce((a,b) => a + b, 0));
        return [{
            x: z,
            y: cr,
            type: 'scatter',
            line: { color: "red" }
        }, {
            x: z,
            y: cw,
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