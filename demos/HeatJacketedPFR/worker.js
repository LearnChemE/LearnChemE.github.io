// worker.js

// Load the Emscripten-generated JS glue code
// In a worker, importScripts brings the Emscripten Module into scope
importScripts('main.js');

// Wait for the module to initialize before accepting tasks
Module.onRuntimeInitialized = () => {
    // Notify the main thread that the worker is ready
    postMessage({ type: 'READY' });
};

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

// ---------- ODE right-hand side ----------
function create_rhs(r, dH) {
    return (t, y) => {
        const Ta = y[0], X = y[1], T = y[2];
        const kf = A1 * Math.exp(-Ef / (Rgas * T));
        const kr = A1 * Math.exp(-((Ef - dH * 1000) / (Rgas * T)));
        const rate = -(kf * Cao * (1 - X) - kr * Cao * X);
        const areaFactor = Math.PI * r * r / 10000;
        const jacketFactor = (Math.PI * 4 - Math.PI * r * r) / 10000;
        const dTa = U * (2 / r) * ((T - Ta) / (Vc * jacketFactor * rhoC)) / Cpc;
        const dX = (-rate) / (Vr * 3600 * areaFactor * (rhoA / MWa));
        const dT = (rate * dH * 1000 - U * (2 / r) * (T - Ta)) / (Cpo * Vr * 3600 * areaFactor * (rhoA / MWa));
        return [dTa, dX, dT];
    }
}

// ---------- RK4 solver ----------
// Helper function to add scaled vectors
function addScaled(y, k, h) {
    return [y[0] + h * k[0], y[1] + h * k[1], y[2] + h * k[2]];
}

function isFinite3(y) {
    return isFinite(y[0]) && isFinite(y[1]) && isFinite(y[2]);
}


function rk4Step(y, r, dH, h) {
    const rhs = create_rhs(r, dH);
    const k1 = rhs(0, y);
    const k2 = rhs(0, addScaled(y, k1, h / 2));
    const k3 = rhs(0, addScaled(y, k2, h / 2));
    const k4 = rhs(0, addScaled(y, k3, h));
    return [
        y[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
        y[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
        y[2] + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2])
    ];
}

// Adaptive fixed-step RK4: doubles step count until stable across [0, Vmax]
function solve(r, dH, TTAin, counter) {
    let n = 4000;
    const maxN = 320000;
    while (n <= maxN) {
        const h = Vmax / n;
        let y = [TTAin, 0.0, 305.0];
        const Vs = new Float64Array(n + 1);
        const Tas = new Float64Array(n + 1);
        const Xs = new Float64Array(n + 1);
        const Ts = new Float64Array(n + 1);
        Vs[0] = 0; Tas[0] = y[0]; Xs[0] = y[1]; Ts[0] = y[2];
        let ok = true;
        for (let i = 0; i < n; i++) {
        y = rk4Step(y, r, dH, h);
        if (!isFinite3(y)) { ok = false; break; }
        Vs[i + 1] = (i + 1) * h;
        Tas[i + 1] = y[0];
        Xs[i + 1] = y[1];
        Ts[i + 1] = y[2];
        }
        if (ok) return { Vs, Tas, Xs, Ts };
        n *= 2;
    }
    // fallback: return whatever last attempt (may contain NaNs, clipped by caller)
    return null;
}

// 3. Listen for commands from the main thread
self.onmessage = (event) => {
    const { type, payload } = event.data;
    console.log(`[WORKER] Worker received command:`, type, payload);

    if (type === 'SOLVE') {
        // // Instantiate the C++ class
        // const calc = new Module.Calculator(data.baseValue);
        
        // // Execute the heavy Wasm function
        // const result = calc.add(data.addValue);
        
        // // Delete the C++ instance to free WebAssembly memory
        // calc.delete();

        try {
            // Perform the calculation using the provided payload
            const result = solve(payload.r, payload.dH, payload.TTAin, payload.counter);
            console.log(`[WORKER] Calculation complete. Result:`, result);
            
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

