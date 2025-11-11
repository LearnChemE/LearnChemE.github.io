import { plot, type Plot, type PlotData } from "nodeplotlib"

export async function plotFn(xRange: number[], fn: (x: number) => number, options?: Partial<PlotData>) {
    const y = xRange.map(fn);
    plot([{ x: xRange, y, type: 'scatter', ...options }]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Arbitrary timeout to give client time to load
}

export async function plotArrs(xRange: number[], yRanges: number[][], options?: Partial<Plot>) {
    const traces = yRanges.map((yRange: number[]): Plot => {
        return { 
            type: 'scatter',
            x: xRange,
            y: yRange,
            ...options
        }
    });
    plot(traces);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Arbitrary timeout to give client time to load
}