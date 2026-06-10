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
        const view2 = bed.view("total pressure");
        const view3 = bed.view("theta");
        const N = view.length;
        const x = Array.from({ length: N }).map((_,i) => i / (N - 1) * LENGTH_BED);
        
        const newData = {
            x: x,
            y: view,
            type: 'scatter',
            mode: 'lines',
            line: { color: "blue" },
            marker: { color: "red", size: 8 }
        } as Partial<Plotly.Data>;

        plotdata.push(newData);

        const newData2 = {
            x: x,
            y: view2,
            type: 'scatter',
            mode: 'lines',
            line: { color: "black" },
            marker: { color: "blue", size: 8 }
        } as Partial<Plotly.Data>;

        plotdata.push(newData2);

        const newData3 = {
            x: x,
            y: view3,
            type: 'scatter',
            mode: 'lines',
            line: { color: "green" },
            marker: { color: "orange", size: 8 }
        } as Partial<Plotly.Data>;

        plotdata.push(newData3);

        return plotdata as Plotly.Data[];
    });
    // let t: number[] = [];
    // let p: number[] = [];
    // let totalP: number[] = [];
    // let theta: number[] = [];

    // const plotdata = createMemo((): Plotly.Data[] => {
    //     const plotdata = [...data] as Partial<Plotly.Data>[];

    //     bedCtx!.bedUpdated();
    //     const bed = bedCtx!.bed;
    //     if (!bed) return [];

    //     const view = bed.view("p");
    //     const view2 = bed.view("total pressure");
    //     const view3 = bed.view("theta");
    //     const cur = window.performance.now();
    //     console.log("Current time: ", cur);
    //     t = [...t, cur];
    //     p = [...p, view.at(-1)!];
    //     totalP = [...totalP, view2.at(-1)!];
    //     theta = [...theta, view3.at(-1)!];
    //     if (t.length > 100) {
    //         t = t.slice(1);
    //         p = p.slice(1);
    //         totalP = totalP.slice(1);
    //         theta = theta.slice(1);
    //     }
    //     console.log("t length: ", t.length, "p length: ", p.length, "totalP length: ", totalP.length, "theta length: ", theta.length);
    //     // console.log("Time: ", t[t.length - 1], "p: ", p[p.length - 1], "totalP: ", totalP[totalP.length - 1], "theta: ", theta[theta.length - 1]);
        
    //     const newData = {
    //         x: t,
    //         y: p,
    //         type: 'scatter',
    //         mode: 'lines',
    //         line: { color: "blue" },
    //         marker: { color: "red", size: 8 }
    //     } as Partial<Plotly.Data>;

    //     plotdata.push(newData);

    //     const newData2 = {
    //         x: t,
    //         y: totalP,
    //         type: 'scatter',
    //         mode: 'lines',
    //         line: { color: "black" },
    //         marker: { color: "blue", size: 8 }
    //     } as Partial<Plotly.Data>;

    //     plotdata.push(newData2);

    //     const newData3 = {
    //         x: t,
    //         y: theta,
    //         type: 'scatter',
    //         mode: 'lines',
    //         line: { color: "green" },
    //         marker: { color: "orange", size: 8 }
    //     } as Partial<Plotly.Data>;

    //     plotdata.push(newData3);

    //     return plotdata as Plotly.Data[];
    // });

    let chartDiv!: HTMLDivElement;
    onMount(() => {
        Plotly.newPlot(chartDiv, plotdata(), props.layout, props.config)
    });

    // Update chartdiv when necessary
    createEffect(() => {
        const data = plotdata();
        if (chartDiv) {
            // console.log("plotly react")
            // Plotly.react(chartDiv, data, props.layout, props.config);
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