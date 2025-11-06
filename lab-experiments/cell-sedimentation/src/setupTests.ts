import { plot, type PlotData } from "nodeplotlib"

export async function plotFn(xRange: number[], fn: (x: number) => number, options?: Partial<PlotData>) {
    const y = xRange.map(fn);
    plot([{ x: xRange, y, type: 'scatter', ...options }]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Arbitrary timeout to give client time to load
}
