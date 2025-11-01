import { expect, test, describe, it } from 'vitest';
import { antoines, dHvap } from './calcs';
import { plot, type PlotData } from 'nodeplotlib';

test('antoines returns normal boiling pt', async () => {
    expect(antoines(373.15)).approximately(1, .05);
});

async function plotFn(xRange: number[], fn: (x: number) => number, options?: Partial<PlotData>) {
    const y = xRange.map(fn);
    plot([{ x: xRange, y, type: 'scatter', ...options }]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Arbitrary timeout to give client time to load
}

describe('function visualization', () => {
    it('plots dHvap', async () => {
        const x = Array.from({ length: 200 }, (_,i) => i * 2);
        await plotFn(x, dHvap);
    });
});