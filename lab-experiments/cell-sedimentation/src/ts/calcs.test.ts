import { describe, expect, it } from 'vitest';
import { plotArrs, plotFn } from '../setupTests';
import { conc_r, conc_w, movingAverageConvolve, particle_velocities, phi_r, phi_w, rhs_adv_diff } from './calcs';
import { rk45 } from './rk45';


describe('calcs.ts function visualization', () => {
    // it('plots outputs of cr given xr', async () => {
    //     const xr = Array.from({ length: 101 }, (_,i) => i / 100);
    //     await plotFn(xr, conc_r);
    // });
    // it('plots particle velocities for xw=.05', async () => {
    //     const xr = Array.from({ length: 96 }, (_,i) => i / 100);
    //     const xw = .05;
    //     const cr = xr.map(xr => conc_r(xr));
    //     const cw = conc_w(xw);
    //     await plotFn(cr, (cr) => particle_velocities(cr,cw).red);
    //     await plotFn(cr, (cr) => particle_velocities(cr,cw).white);
    // });

    it("does a simple test run of the rhs function with the rk45 solver", async () => {
        console.log("starting test");
        const nz = 500;
        const lz = 305; // mm
        const dz = lz / nz;
        const xr0 = .05, xw0 = .05;
        const cr0: number[] = new Array(nz).fill(conc_r(xr0));
        const cw0: number[] = new Array(nz).fill(conc_w(xw0));
        cr0[0] = cw0[0] = 0;
        const smooth_fsize = 13;

        // rhs wrapper
        const rhs = (_: number, y: number[]) => {
            return rhs_adv_diff(y, dz);
        };
        const ts = [0];
        let y_cur = cr0.concat(cw0);
        const crs = [Array.from({ length: nz }, () => xr0)];
        const cws = [Array.from({ length: nz }, () => xw0)];
        const dt = 1, tmax = 2;

        console.log("[Test] beginning solve loop")
        // Solve
        for (let t=0;t<tmax;t+=dt) {
            console.log("[Test] starting overall solve for t=", t)
            const y_cpy = y_cur.slice()
            const sol = rk45(rhs, y_cur, t, t+dt);
            expect(y_cpy === y_cur)

            // Extract solution
            y_cur = sol.y.at(-1)!;
            let cr_cur = y_cur.slice(0,nz);
            let cw_cur = y_cur.slice(nz);

            // Smooth
            cr_cur = movingAverageConvolve(cr_cur, smooth_fsize);
            cw_cur = movingAverageConvolve(cr_cur, smooth_fsize);
            y_cur = cr_cur.concat(cw_cur);

            // Update results
            crs.push(cr_cur.map(cr => phi_r(cr)));
            cws.push(cw_cur.map(cw => phi_w(cw)));
            ts.push(t+dt);
        }

        // Make z array
        const zs = Array.from({ length: nz }, (_,i) => i / nz * lz);
        plotArrs(zs, crs);
        await plotArrs(zs, cws);
    }, 100000);
});