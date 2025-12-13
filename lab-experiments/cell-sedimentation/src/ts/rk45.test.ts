import { describe, it } from "vitest";
import rk45 from "./rk45";
import { plotArrs } from "../setupTests";

describe("rk45 solver tests", () => {
    it("plots e^t", async () => {
        const y0 = 1;
        const rhs = (_: number, y: number[]) => {
            return y;
        };
        const ts = [0];
        const ys_dp = [y0];
        const dt = .1, tmax = 10;

        let y_cur_dp = y0;
        for (let t=0;t<tmax;t+=dt) {
            const dp = rk45(rhs, [y_cur_dp], t, t+dt);
            const ydp = dp.y.at(-1)!;
            console.log(`t=${t} to ${t+dt}: Dormand-Prince y=${ydp}`);
            
            ys_dp.push(ydp.at(-1)!);
            ts.push(dp.t.at(-1)!);
            y_cur_dp = ydp.at(-1)!;
        }

        const theor = ts.map(t => Math.exp(t));
        await plotArrs(ts, [ys_dp, theor], {}, { title: { text: "exp(x) via rk45 integration" } });
        const res_dp = ys_dp.map((y, i) => y - theor[i]);
        await plotArrs(ts, [res_dp], {}, { title: { text: "Residuals for rk45 exp(x) integration" } });
    });
});