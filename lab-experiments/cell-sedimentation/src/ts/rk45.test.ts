import { describe, it } from "vitest";
import { rk45 } from "./rk45";
import { plotArrs } from "../setupTests";

describe("rk45 solver tests", () => {
    it("plots e^t", async () => {
        const y0 = 1;
        const rhs = (_: number, y: number[]) => {
            return y;
        };
        const ts = [0];
        const ys = [y0];
        const dt = .2, tmax = 3;

        let y_cur = y0;
        for (let t=0;t<tmax;t+=dt) {
            const sol = rk45(rhs, [y_cur], t, t+dt);
            const y = sol.y[0]!;
            ys.push(y.at(-1)!);
            ts.push(sol.t.at(-1)!);
            y_cur = y.at(-1)!;
        }

        const theor = ts.map(t => Math.exp(t));
        await plotArrs(ts, [ys, theor], { title: { text: "exp(x) via rk45 integration" } });
    });
});