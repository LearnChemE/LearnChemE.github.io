// worker.js
import createJacketedPFRModule from "./wasm/calcs.js";

// Load the Emscripten-generated JS glue code as an ES module.
createJacketedPFRModule().then((module) => {

// Notify the main thread that the worker is ready
const { CoCurrentCalc } = module;
postMessage({ type: 'READY' });

// ---------- Physical constants (fixed) ----------
const Cpc = 4.185;      // kJ/(kg K), coolant heat capacity
const U = 300.0;        // kJ/(m^2 hr K)
const Cao = 15.0;       // kmol/m^3
const Cpo = 159.0;      // kJ/(kmol K)
const rhoC = 1000.0;    // kg/m^3
const Vc = 800.0;       // m/hr
const Vr = 3.4;         // m/s (reactant velocity)
const rhoA = 600.0;     // kg/m^3
const MWa = 58.12;      // kg/kmol
const Ef = 40000.0;     // J/mol
const Rgas = 8.314;     // J/(mol K)
const A1 = 1.0e6;       // 1/hr

const Vmax = 5.0;       // m^3, reactor volume span

// Listen for commands from the main thread
self.onmessage = (event) => {
    const { type, payload } = event.data;

    if (type === 'SOLVE') {

        try {

            // const ndot = 3600 * Vr * (Math.PI * payload.r ** 2) / 10000 * rhoA / MWa; // kmol / hr
            // const vdot = ndot / Cao; // m3 / hr
            // const tmax = Vmax / vdot;

            // Perform the calculation using the provided payload
            const calc = new CoCurrentCalc(payload.r, payload.dH, payload.TTAin, 0.0, Vmax, 401);
            calc.solve();

            const Tas= calc.getResultView(0).slice(); // Get the X values (conversion)
            const Xs = calc.getResultView(1).slice(); // Get the X values (conversion)
            const Ts = calc.getResultView(2).slice(); // Get the X values (conversion)
            const Vs = calc.getTEval().slice(); // Get the time evaluation array
            
            const result = {
                Vs: Vs,
                Tas: Tas,
                Xs: Xs,
                Ts: Ts
            };

            // console.log(`[WORKER] Calculation complete. Result:`, result);
            calc.delete();
            
            // Send the result back to the main UI thread
            postMessage({ 
                type: 'RESULT', 
                payload: result 
            });
        } catch (error) {
            console.error(`[WORKER] Error during calculation:`, error);
            postMessage({
                type: 'ERROR',
                payload: { message: error.message }
            });
        }
    }
};

});
