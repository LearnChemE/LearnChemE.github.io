import { plot, type Layout, type Plot } from "nodeplotlib"

export async function plotFn(xRange: number[], fn: (x: number) => number, options?: any) {
    const y = xRange.map(fn);
    plot([{ x: xRange, y, type: 'scatter', ...options }]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Arbitrary timeout to give client time to load
}

export async function plotArrs(xRange: number[] | number[][], yRanges: number[][], options?: Partial<Plot>, layout?: Layout) {
    if (!Array.isArray(xRange[0])) {
        xRange = new Array(yRanges.length).fill(xRange);
    } else {
        if (xRange.length !== yRanges.length) {
            throw new Error("xRange and yRanges must have same length if two dimensional.");
        }
    }
    xRange = xRange as number[][];
    
    const traces = yRanges.map((yRange: number[], i: number): Plot => {
        return { 
            type: 'scatter',
            x: xRange[i],
            y: yRange,
            ...options
        }
    });
    plot(traces, layout);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Arbitrary timeout to give client time to load
}