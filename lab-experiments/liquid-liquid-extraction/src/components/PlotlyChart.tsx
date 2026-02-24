import Plotly from "plotly.js-dist-min";
import { createEffect, createMemo, onCleanup, onMount, useContext, type Component } from "solid-js"
import { ColumnContext, envelope } from "../calcs";
import { transpose } from "../ts/helpers";
import { numberOfStages } from "../globals";
import { FEED_COMP } from "../ts/config";

interface PlotlyChartProps {
    // data: () => Profile,
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = ({ layout, config }) => {
    const env = transpose(envelope);
    const data = [{
            x: [0, 1],
            y: [1, 0],
            type: 'scatter',
            line: { color: "black" }
        }, {
            x: env[0],
            y: env[1],
            type: 'scatter',
            line: { color: "black" }
        }, {
            x: [0, FEED_COMP[0]],
            y: [0, FEED_COMP[1]],
            type: 'markers',
            marker: { color: "blue", size: 8 }
        }];

    const columnCtx = useContext(ColumnContext);

        

    const plotdata = createMemo((): Plotly.Data[] => {
        // // test data
        // const mix = [0.131, 0.109];
        // // const pts = [[0,0],[0,0]]
        // const pts = separate(mix[0], mix[1]);
        // console.log(pts)
        // const x_test = [mix[0]];
        // const y_test = [mix[1]];
        // pts.forEach(pt => {
        //     x_test.push(pt[0]);
        //     y_test.push(pt[1]);
        // });

        const plotdata = [...data] as Partial<Plotly.Data>[];

        // real data
        const x_test: number[] = [];
        const y_test: number[] = [];
        if (columnCtx!.columnCreated()) {
            columnCtx!.column!.updated()
            const col = columnCtx!.column!;
            const n = numberOfStages();
            for (let i = 0; i < n; i++) {
                const raf = col.viewComposition(i, "raffinate");
                x_test.push(raf[0]);
                y_test.push(raf[1]);
                const ext = col.viewComposition(i, "extract");
                x_test.push(ext[0]);
                y_test.push(ext[1]);
                // console.table({idx: i, raf, ext});
            }

            const newData = {
                x: x_test,
                y: y_test,
                type: 'scatter',
                mode: 'markers',
                line: { color: "red" },
                marker: { color: "red", size: 8 }
            } as Partial<Plotly.Data>;

            plotdata.push(newData);
        }

        // const plotdata = [...data, {
        //     x: x_test,
        //     y: y_test,
        //     type: 'scatter',
        //     mode: 'markers',
        //     line: { color: "red" },
        //     marker: { color: "red", size: 8 }
        // }];

        return plotdata as Plotly.Data[];
    });

    let chartDiv!: HTMLDivElement;
    onMount(() => {
        Plotly.newPlot(chartDiv, plotdata(), layout, config)
    });

    // Update chartdiv when necessary
    createEffect(() => {
        const data = plotdata();
        if (chartDiv) {
            Plotly.react(chartDiv, data, layout, config);
        }
    });

    onCleanup(() => {
        if (chartDiv) {
            Plotly.purge(chartDiv);
        }
    })

    return <div ref={chartDiv} />;
}