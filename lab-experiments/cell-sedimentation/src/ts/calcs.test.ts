import { describe, it } from 'vitest';
import { plotFn } from '../setupTests';
import { conc_r, conc_w, particle_velocities } from './calcs';


describe('calcs.ts function visualization', () => {
    it('plots outputs of cr given xr', async () => {
        const xr = Array.from({ length: 101 }, (_,i) => i / 100);
        await plotFn(xr, conc_r);
    });
    it('plots particle velocities for xw=.05', async () => {
        const xr = Array.from({ length: 96 }, (_,i) => i / 100);
        const xw = .05;
        const cr = xr.map(xr => conc_r(xr));
        const cw = conc_w(xw);
        await plotFn(cr, (cr) => particle_velocities(cr,cw).red);
        await plotFn(cr, (cr) => particle_velocities(cr,cw).white);
    });
});