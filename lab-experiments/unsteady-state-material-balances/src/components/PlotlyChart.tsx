import Plotly from "plotly.js-dist-min";
import { createEffect, createSignal, onCleanup, onMount, useContext, type Component } from "solid-js";
import { animate } from "../globals";
import { RxrContext } from "./Context";

interface PlotlyChartProps {
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
};

export const PlotlyChart: Component<PlotlyChartProps> = (props) => {
    const ctx = useContext(RxrContext);
    const x: number[] = [];
    const y: number[] = [];
    const maxSize = 1000;
    const [traceData, setTraceData] = createSignal<Plotly.Data[]>([
        {
            x: [],
            y: [],
            type: "scatter",
            mode: "lines",
            line: { color: "blue" },
            marker: { color: "red", size: 8 }
        }
    ]);

    const frame = (_: number, t: number) => {
        x.push(t/1000);
        y.push(ctx!.vol());

        if (x.length > maxSize) {
            x.shift();
            y.shift();
        }

        setTraceData([
            {
                x: [...x],
                y: [...y],
                type: "scatter",
                mode: "lines",
                line: { color: "blue" },
                marker: { color: "red", size: 8 }
            }
        ]);

        return true;
    };

    let chartDiv!: HTMLDivElement;
    let initialized = false;

    onMount(() => {
        createEffect(() => {
            const data = traceData();

            if (!chartDiv) return;
            if (!initialized) {
                Plotly.newPlot(chartDiv, data, props.layout, props.config);
                initialized = true;
            } else {
                Plotly.react(chartDiv, data, props.layout, props.config);
            }
        });

        animate(frame);
    });

    onCleanup(() => {
        if (chartDiv) {
            Plotly.purge(chartDiv);
        }
    });

    return <div ref={chartDiv} />;
};