import { createMemo, type Accessor } from "solid-js";
import { expMemo } from "./signals";
import { type MenuFluidType } from "./config";
import { bisection, trapezoidalIntegrator } from "./solvers";

const L = 10  * .01; // cm to m
const r = 2.0 * .01; // cm to m
const R = 6.0 * .01; // cm to m
const arm_rad = .14; // cm to m

export function createForceMemo(rpm: Accessor<number>, fluid: Accessor<MenuFluidType>) {
    const force = createMemo(() => {
        const w0 = rpm() / 10;
        const props = fluid().props;

        // Fluid properties
        const t0 = props.shearThreshold ?? 0;
        const k = props.flowConsistencyIdx;
        const n = props.flowBehaviorIdx ?? 1;


        // Calculate yield radius for a given torque
        const calcOmega = (M: number) => {
            // Determine critical radius
            const ry = (t0 > 0) ? Math.sqrt(M / 2 / Math.PI / L / props.shearThreshold) : R;
            // console.log("At torque M=", M.toFixed(2), "N*m, yield radius:", ry.toFixed(5))
            if (ry <= r) return w0;
            const Rtarg = Math.min(R, ry);

            const integrand = (r: number) => {
                const torqueTerm = M / 2 / Math.PI / k / L / r ** 2;
                const yieldTerm = t0 / k;
                if (torqueTerm <= yieldTerm) return 0;
                return 1 / r * (torqueTerm - yieldTerm) ** (1/n); 
            }

            const omega = trapezoidalIntegrator(integrand, r, Rtarg)

            // console.log(`M=${M.toFixed(5)} omega=${omega.toFixed(6)} w0=${w0.toFixed(6)}`)
            return w0 - omega;
        }

        const torque = bisection(calcOmega, 0, 1); // N m
        const force = torque / arm_rad * 1000; // mN

        return force; // mN
    });

    const forceObserved = expMemo(force, 0.6, 0.002);
    const shearRadius = expMemo(() => {
        const f = force() / 1000; // N
        const torque = f * arm_rad; // N m
        
        // Fluid properties
        const props = fluid().props;
        const t0 = props.shearThreshold ?? 0;

        // Calculate radius
        const ry = (t0 > 0) ? Math.sqrt(torque / 2 / Math.PI / L / props.shearThreshold) : R;
        return ry;
    }, 0.6, 0.002);

    return { force: forceObserved, radius: shearRadius };
}
