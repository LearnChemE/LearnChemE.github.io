import Plotly from "plotly.js-dist-min";
import { createEffect, createMemo, onCleanup, onMount, useContext, type Component } from "solid-js"
import { ColumnContext, Henrys } from "../globals/";
import { numberOfStages } from "../globals/";

interface PlotlyChartProps {
    // data: () => Profile,
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = ({ layout, config }) => {
    // const env = transpose(envelope);
    const data = [{
            x: [],
            y: [],
            type: 'scatter',
            line: { color: "black" }
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

            columnCtx!.column!.updated();
            const col = columnCtx!.column!;

            const P = col.currentPressure() + 1;

            const n = numberOfStages();
            for (let i = 0; i < n; i++) {
                const liq = col.viewPPM(i, "liquid");
                const vap = col.viewPPM(i, "vapor");
                x_test.push(liq);
                y_test.push(vap);
            }

            const newData = {
                x: x_test,
                y: y_test,
                type: 'scatter',
                mode: 'markers',
                line: { color: "red" },
                marker: { color: "red", size: 8 }
            } as Partial<Plotly.Data>;

            const eqm_x = Math.max(...x_test) * 1.1;
            const eqm_y = eqm_x * Henrys(298) / P;
            const eqm_line = {
                x: [0, eqm_x],
                y: [0, eqm_y],
                type: 'scatter',
                mode: 'lines',
                line: { color: "orange" }
            } as Partial<Plotly.Data>;
            plotdata.push(eqm_line);
            plotdata.push(newData);

            const ol = col.operatingLine();
            const x_int = Math.max(- ol.intercept / ol.slope, 0);
            const op_line = {
                x: [x_int, eqm_x],
                y: [x_int * ol.slope + ol.intercept, eqm_x * ol.slope + ol.intercept],
                type: 'scatter',
                mode: 'lines',
                line: { color: "pink" }
            } as Partial<Plotly.Data>;
            plotdata.push(op_line);
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