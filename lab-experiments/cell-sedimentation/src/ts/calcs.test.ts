import { describe, expect, it } from 'vitest';
import { plotArrs, plotFn } from '../setupTests';
import { conc_r, conc_w, movingAverageConvolve, particle_velocities, phi_r, phi_w, ProfileSolver, resize, rhs_adv_diff } from './calcs';
import { rk45 } from './rk45';
import * as fs from "fs";
import type { InitConc } from '../types/globals';


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

    it("tests the rhs function at initial conditions", async () => {
        const pydata = new Promise<number[]>((resolve, reject) => {

            fs.readFile("./test/pyRhs.csv", "utf8", (err, data: string) => {
                if (err) {
                    console.warn(err);
                    reject();
                }
                resolve(data.split('\n').map(str => Number(str)));
            });

        });

        const nz = 500;
        const lz = 305;
        const dz = lz / (nz-1);
        const xr0 = .05;
        const xw0 = .05;
        const cr0 = Array.from({ length: nz }, () => conc_r(xr0));
        const cw0 = Array.from({ length: nz }, () => conc_w(xw0));
        const y0 = cr0.concat(cw0);
        const rhs = rhs_adv_diff(y0, dz);
        
        const py = await pydata;
        const res = rhs.map((ts, i) => ts - py[i]);
        console.log(res)
        const ssqe = res.reduce((sum, err) => sum + err ** 2);
        console.log(ssqe)


        let zs = Array.from({ length: nz*2 }, (_,i) => i);
        await plotArrs(zs, [res], {}, { title: { text: "Residuals of RoC for initial function call" }});
        await plotArrs(zs, [rhs, py], {}, { title: { text: "RoC for initial function call" }});
    }, 10000); 

    it("tests the rhs function with a sinusoidal concentration profile", async () => {
        const pydata = new Promise<number[]>((resolve, reject) => {

            fs.readFile("./test/pySinRhs.csv", "utf8", (err, data: string) => {
                if (err) {
                    console.warn(err);
                    reject();
                }
                resolve(data.split('\n').map(str => Number(str)));
            });

        });

        const nz = 500;
        const lz = 305;
        const dz = lz / (nz-1);
        const xr0 = .05;
        const xw0 = .05;
        const cr0 = Array.from({ length: nz }, (_,i) => (.5 + .5 * Math.sin(i * Math.PI / 90)) * conc_r(xr0));
        const cw0 = Array.from({ length: nz }, (_,i) => (.5 + .5 * Math.cos(i * Math.PI / 90)) * conc_w(xw0));
        const y0 = cr0.concat(cw0);
        const rhs = rhs_adv_diff(y0, dz);
        
        const py = await pydata;
        const res = rhs.map((ts, i) => ts - py[i]);
        console.log(res)
        const ssqe = res.reduce((sum, err) => sum + err ** 2);
        console.log(ssqe) 


        let zs = Array.from({ length: nz*2 }, (_,i) => i);
        await plotArrs(zs, [rhs, py], {}, { title: { text: "RoC for sinusoidal concs" } });
        await plotArrs(zs, [res], {}, { title: { text: "Residuals for sinusoidal RoCs" }});
    }, 10000); 

    // it("does a simple test run of the rhs function with the rk45 solver", async () => {
    //     console.log("starting test");
    //     const nz = 500;
    //     const lz = 305; // mm
    //     const dz = lz / (nz - 1);
    //     const xr0 = .05, xw0 = .05;
    //     const cr0: number[] = new Array(nz).fill(conc_r(xr0));
    //     const cw0: number[] = new Array(nz).fill(conc_w(xw0));
    //     cr0[0] = cw0[0] = 0;
    //     const smooth_fsize = 13;

    //     // Make z array
    //     let zs = Array.from({ length: nz }, (_,i) => i / (nz-1) * lz);

    //     // rhs wrapper
    //     const rhs = (_: number, y: number[]) => {
    //         return rhs_adv_diff(y, dz);
    //     };
    //     const ts = [0];
    //     let y_cur = cr0.concat(cw0);
    //     const crs = [Array.from({ length: nz }, () => xr0)];
    //     const cws = [Array.from({ length: nz }, () => xw0)];
    //     const dt = 20, tmax = 200;

    //     console.log("[Test] beginning solve loop")
    //     // Solve
    //     for (let t=0;t<tmax;t+=dt) {
    //         console.log("[Test] starting overall solve for t=", t)
    //         const sol = rk45(rhs, y_cur, t, t+dt);

    //         // Extract solution
    //         y_cur = sol.y.at(-1)!;
    //         let cr_cur = y_cur.slice(0,nz);
    //         let cw_cur = y_cur.slice(nz);

    //         // Smooth
    //         cr_cur = movingAverageConvolve(cr_cur, smooth_fsize);
    //         cw_cur = movingAverageConvolve(cw_cur, smooth_fsize);
    //         y_cur = cr_cur.concat(cw_cur);
    //         console.log(y_cur)
    //         const resized = resize(y_cur, zs, .05);
    //         y_cur = resized.y;
    //         zs = resized.z;

    //         // Update results
    //         crs.push(cr_cur.map(cr => phi_r(cr)));
    //         cws.push(cw_cur.map(cw => phi_w(cw)));
    //         ts.push(t+dt);
    //     }

    //     plotArrs(zs, crs, {}, { title: { text: "Concentration of red particles" }});
    //     await plotArrs(zs, cws, {}, { title: { text: "Concentration of white particles" }});
    //     const tot = crs[crs.length-1].map((cr, i) => cr + cws[cws.length-1][i])
    //     await plotArrs(zs, [tot], {}, { title: { text: "Total concentration at final time" }})
    // }, 100000);

    it ("tests the solver capabilities to handle a single ic", async () => {
        let ic: InitConc = { xr0: 0.45, xw0: 0.05 };
        let sol = new ProfileSolver(ic.xr0, ic.xw0);
        const crs: number[][] = [], cws: number[][] = [];
        const zs = [];

        for (let i=0; i<100; i++) {
            const res = sol.calculate_step();
            crs.push([...res.slice(2,502)]);
            cws.push([...res.slice(502)]);

            const top = res[1];
            const l = 305 - top;
            const dz = (l - 1) / 500;
            zs.push(Array.from({ length: 500 }, (_,i) => top + i * dz));
        }

        plotArrs(zs, crs, {}, { title: { text: "cr" }});
        await plotArrs(zs, cws, {}, { title: { text: "cw" }});
    }, 100000);
});