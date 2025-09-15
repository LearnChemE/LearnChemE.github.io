
// Constants
const Cp = 4000;       // J/(kg·K)
const UA = 3400;       // W/K
const V = 10;          // m³
const ΔH = -220000;    // J/mol (exothermic reaction)
const R = 8.314;       // J/(mol·K)
const Ea = 15000;      // Activation energy (J/mol)
const k0 = 0.004;      // Pre-exponential factor (1/s)

// Current state
let currentView = 'phase1';
let tau = 38;
let T0 = 315;
let Ca0 = 1.0;

// DOM elements
const tauSlider = document.getElementById('tau');
const tauValue = document.getElementById('tau-value');
const T0Slider = document.getElementById('T0');
const T0Value = document.getElementById('T0-value');
const Ca0Slider = document.getElementById('Ca0');
const Ca0Value = document.getElementById('Ca0-value');
const viewButtons = document.querySelectorAll('.view-btn');
const plotDiv = document.getElementById('plot');
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');
const Ca0ctrl = Ca0Slider.parentElement;

function displayConcSlider(show=true) {
    if (show) {
        Ca0ctrl.classList.remove("hidden");
    } else {
        Ca0ctrl.classList.add("hidden");
    }
}

// Event listeners
tauSlider.addEventListener('input', () => {
    tau = parseFloat(tauSlider.value);
    tauValue.textContent = tau;
    updatePlot();
});

T0Slider.addEventListener('input', () => {
    T0 = parseFloat(T0Slider.value);
    T0Value.textContent = T0;
    updatePlot();
});

Ca0Slider.addEventListener('input', () => {
    Ca0 = parseFloat(Ca0Slider.value);
    Ca0Value.textContent = Ca0.toFixed(1);
    updatePlot();
});

viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentView = button.getAttribute('data-view');
        updatePlot();
    });
});

// Hamburger menu functionality
menuBtn.addEventListener('click', () => {
    menuContent.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

// Menu items click handlers
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal') + '-modal';
        document.getElementById(modalId).style.display = 'block';
        menuContent.classList.remove('show');
    });
});

// Close modal buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Rate constant calculation
function k(T) {
    return k0 * Math.exp(-Ea * (1/T - 1/298));
}

// ODE system for the CSTR
function derivatives(Ca, T, tau) {
    const rate = (Ca > 0.01) ? k(T) * Ca : 0;
    const dCadt = (2 - Ca) / tau - rate;
    const dTdt = (UA/(V * Cp)) * (300 - T) + (298 - T)/tau - (ΔH/Cp) * rate;
    return [ dCadt, dTdt ];
}
/**
 * Single adaptive Runge–Kutta–Fehlberg (RK45) step.
 *
 * @param {function(number, number|Array): number|Array} f - derivative f(t, y)
 * @param {number|Array} y   - current state
 * @param {number} t         - current time
 * @param {number} h         - current timestep
 * @returns {{
 *   yNext: number|Array,  // 5th order solution
 *   tNext: number,        // new time (t + h)
 *   error: number|Array   // estimate of local truncation error
 * }}
 */
function rk45Step(f, y, t, h) {
  const isArray = Array.isArray(y);

  const add = (a, b) => isArray ? a.map((v, i) => v + b[i]) : a + b;
  const addScaled = (a, b, s) => isArray ? a.map((v, i) => v + s * b[i]) : a + s * b;
  const scale = (a, s) => isArray ? a.map(v => v * s) : a * s;

  // Coefficients for Dormand–Prince RK45 (Butcher tableau)
  const k1 = f(t, y);
  const k2 = f(t + h * 1/4, addScaled(y, k1, h * 1/4));
  const k3 = f(t + h * 3/8, addScaled(y, k1, h * 3/32, k2, h * 9/32));
  const k4 = f(t + h * 12/13, addScaled(y, k1, h * 1932/2197, k2, h * -7200/2197, k3, h * 7296/2197));
  const k5 = f(t + h, addScaled(y, k1, h * 439/216, k2, h * -8, k3, h * 3680/513, k4, h * -845/4104));
  const k6 = f(t + h * 1/2, addScaled(y, k1, h * -8/27, k2, h * 2, k3, h * -3544/2565, k4, h * 1859/4104, k5, h * -11/40));

  // 5th-order estimate
  const y5 = addScaled(y, k1, h * 16/135,
                          k3, h * 6656/12825,
                          k4, h * 28561/56430,
                          k5, h * -9/50,
                          k6, h * 2/55);

  // 4th-order estimate
  const y4 = addScaled(y, k1, h * 25/216,
                          k3, h * 1408/2565,
                          k4, h * 2197/4104,
                          k5, h * -1/5);

  // Error estimate (difference between 4th and 5th order)
  const error = isArray ? y5.map((v, i) => v - y4[i]) : y5 - y4;

  return { yNext: y5, tNext: t + h, error };
}

/**
 * Utility: addScaled with multiple terms
 */
function addScaled(base, ...pairs) {
  const isArray = Array.isArray(base);
  if (isArray) {
    const result = base.slice();
    for (let i = 0; i < pairs.length; i += 2) {
      const vec = pairs[i];
      const s = pairs[i + 1];
      for (let j = 0; j < result.length; j++) {
        result[j] += vec[j] * s;
      }
    }
    return result;
  } else {
    let result = base;
    for (let i = 0; i < pairs.length; i += 2) {
      result += pairs[i] * pairs[i + 1];
    }
    return result;
  }
}

/**
 * Adaptive RK45 integrator
 *
 * @param {function(number, number|Array): number|Array} f - derivative function f(t, y)
 * @param {number|Array} y0   - initial state
 * @param {number} t0         - start time
 * @param {number} tEnd       - end time
 * @param {object} opts       - options { h: initial step, tol: tolerance, hMin, hMax }
 * @returns {{ ts: Array<number>, ys: Array<number|Array>}} solution points
 */
function integrateRK45(f, y0, t0, tEnd, opts = {}) {
  let { h = 0.1, tol = 1e-6, hMin = 1e-6, hMax = 1.0 } = opts;

  let t = t0;
  let y = Array.isArray(y0) ? y0.slice() : y0;
  const solution = { ts: [t], ys: [y] };

  while (t < tEnd) {
    if (t + h > tEnd) h = tEnd - t; // don’t overshoot

    const { yNext, error } = rk45Step(f, y, t, h);

    // compute error norm
    const errNorm = Array.isArray(error)
      ? Math.sqrt(error.reduce((s, e) => s + e * e, 0) / error.length)
      : Math.abs(error);

    // check if within tolerance
    if (errNorm <= tol) {
      // accept step
      t += h;
      y = yNext;
      solution.ts.push(t);
      solution.ys.push(y);

      // adaptive step size update (safety factor 0.9)
      const safety = 0.9;
      const factor = safety * Math.pow(tol / (errNorm || 1e-16), 0.25);
      h = Math.min(hMax, Math.max(hMin, h * factor));
    } else {
      // reject step → shrink h and retry
      const safety = 0.9;
      const factor = safety * Math.pow(tol / (errNorm || 1e-16), 0.25);
      h = Math.max(hMin, h * Math.max(0.1, factor));
      if (h <= hMin) {
        // throw new Error("Step size underflow: cannot maintain tolerance.");
        console.warn(`Step size underflow: cannot maintain tolerance.\nCa:${y[0]}\nT:${y[1]}\nt:${t}`);
        // accept step anyways
        t += h;
        y = yNext;
        solution.ts.push(t);
        solution.ys.push(y);
      }
    }
  }

  return solution;
}


// Solve ODE using Euler's method
function solveODE(Ca0, T0, tau, tMax = 2000, step = 0.1) {
    let T = T0; // Number

    const rhs = (t, y) => { return derivatives( y[0], y[1], tau); };
    
    const sol = integrateRK45(rhs, [Ca0, T0], 0, tMax, {h: step, tol: 1e-2, hMin: step * 1e-8, hMax: step * 10});
    
    const times = sol.ts;
    const Cas = [];
    const Ts  = [];
    sol.ys.forEach(([Ca, T]) => { Cas.push(Ca); Ts.push(T); });
    const Xas = Cas.map((ca) => 1 - ca / 2);
    
    return { times, Cas, Ts, Xas };
}

// Calculate Qg and Qr for energy plot
function calculateEnergyData(tau) {
    const Tmin = 300;
    const Tmax = 500;
    const TValues = [];
    const QgValues = [];
    const QrValues = [];
    
    for (let T = Tmin; T <= Tmax; T += 1) {
        const k_val = k(T);
        const Qg = (-k_val/(1 + k_val * tau)) * ΔH * 2 / 1000; // kJ/(m³·min)
        const Qr = (Cp/tau * (T - 298) + (UA/V) * (T - 300)) / 1000; // kJ/(m³·min)
        
        TValues.push(T);
        QgValues.push(Qg);
        QrValues.push(Qr);
    }
    
    return { TValues, QgValues, QrValues };
}

// Add arrow annotations to phase plane plots
/**
 * 
 * @param {Array<{xs:number[], ys:number[], ts:number[], line:{color:string}}>} trajectories 
 * @param {*} xKey 
 * @param {*} yKey 
 * @param {*} arrowSpacing 
 * @returns 
 */
function createArrowMarkers(trajectories, spacing = 100, firstArrowTime=spacing) {
    const markers = [];
    // assuming your plot is in a <div id="plot">
    const gd = document.getElementById('plot');
    const rect = gd.getBoundingClientRect();
    // After plot is drawn:
    const xRange = gd.layout.xaxis.range; // [xmin, xmax]
    const yRange = gd.layout.yaxis.range; // [ymin, ymax]
    const xRes = rect.width / (xRange[1] - xRange[0]);
    const yRes = rect.height / (yRange[1] - yRange[0]);
    
    trajectories.forEach(trajectory => {
        const xs = trajectory.xs;
        const ys = trajectory.ys;
        const ts = trajectory.ts;
            
        
        const markerSet = {
            x: [],
            y: [],
            angle: [],
            color: trajectory.line.color
        };
        // Add arrows along the trajectory
        let nextArrowTime = firstArrowTime;
        for (let i = 0; i < ts.length - 1; i++) {
            // If its not arrow time, continue
            if (i < nextArrowTime) continue;
            nextArrowTime += spacing;

            // Calculate changes by looking at the next and last
            const dx = (xs[i + 3] - xs[i]) * xRes;
            const dy = (ys[i + 3] - ys[i]) * yRes;
            
            // Now append
            markerSet.x.push(xs[i]);
            markerSet.y.push(ys[i]);
            markerSet.angle.push(Math.atan2(dx, dy) * 180 / Math.PI);
        }

        markers.push(markerSet);
    });
    
    return markers;
}
/**
 * Smooths a trajectory by treating x,y coordinates as complex numbers
 * and convolving with a moving average filter
 * @param {number[]} xArray - Array of x coordinates
 * @param {number[]} yArray - Array of y coordinates  
 * @param {number} windowSize - Size of moving average window (default: 5)
 * @returns {Object} - Object with smoothed x and y arrays
 */
function smoothComplexTrajectory(xArray, yArray, windowSize = 5) {
    // Validate inputs
    if (!Array.isArray(xArray) || !Array.isArray(yArray)) {
        throw new Error('Both inputs must be arrays');
    }
    
    if (xArray.length !== yArray.length) {
        throw new Error('x and y arrays must have equal length');
    }
    
    if (xArray.length === 0) {
        return { x: [], y: [] };
    }
    
    if (windowSize < 1) {
        throw new Error('Window size must be at least 1');
    }
    
    // Ensure window size is odd for symmetric smoothing
    if (windowSize % 2 === 0) {
        windowSize += 1;
    }
    
    const n = xArray.length;
    const halfWindow = Math.floor(windowSize / 2);
    
    // Create moving average kernel (normalized)
    const kernel = new Array(windowSize).fill(1 / windowSize);
    
    // Initialize output arrays
    const smoothedX = new Array(n);
    const smoothedY = new Array(n);
    
    // Apply convolution with moving average
    for (let i = 0; i < n; i++) {
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        
        // Convolve at position i
        for (let j = 0; j < windowSize; j++) {
            const dataIndex = i - halfWindow + j;
            
            // Handle boundaries by skipping out-of-bounds indices
            if (dataIndex >= 0 && dataIndex < n) {
                sumX += xArray[dataIndex] * kernel[j];
                sumY += yArray[dataIndex] * kernel[j];
                count++;
            }
        }
        
        // Normalize by actual number of valid samples used
        if (count > 0) {
            const normalization = windowSize / count;
            smoothedX[i] = sumX * normalization;
            smoothedY[i] = sumY * normalization;
        } else {
            smoothedX[i] = xArray[i];
            smoothedY[i] = yArray[i];
        }
    }
    
    return {
        x: smoothedX,
        y: smoothedY
    };
}

// Update the plot based on current view and parameters
function updatePlot() {
    let layout, data, annotations = [];
    
    switch(currentView) {
        case 'phase1':
            // Phase plane 1: Multiple initial concentrations
            const initialConcentrations = [0.0, 0.5, 1.0, 1.5, 2.0];
            data = [];
            const trajectories = [];
            
            initialConcentrations.forEach(Ca_init => {
                const solution = solveODE(Ca_init, T0, tau);
                const smoothed = smoothComplexTrajectory(solution.Ts, solution.Cas, 21);
                const trace = {
                    x: smoothed.x,
                    y: smoothed.y,
                    type: 'scatter',
                    mode: 'lines',
                    name: `Cₐ₀ = ${Ca_init} kmol/m³`,
                    line: { color: `hsl(${Ca_init * 60}, 80%, 50%)` }
                };
                data.push(trace);
                trajectories.push({
                    xs: smoothed.x,
                    ys: smoothed.y,
                    ts: solution.times,
                    line: { color: trace.line.color }
                });
            });
            
            layout = {
                title: { text: 'phase plane: concentration vs temperature'},
                xaxis: { title:{text:'temperature (K)'} },
                yaxis: { title: {text:'concentration (kmol/m³)'} },
                showlegend: true
            };

            // Create a new plot just to have the correct ranges
            Plotly.newPlot(plotDiv, data, layout);
            
            // Create the arrow markers
            markers = createArrowMarkers(trajectories, 900, 10);
            markers.forEach(markerSet => {
                data.push({
                    x: markerSet.x,
                    y: markerSet.y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        symbol: 'arrow',
                        size: 12,
                        color: markerSet.color,
                        line: {color: 'white', width: 1},
                        angle: markerSet.angle
                    },
                    showlegend: false,
                    hoverinfo: 'skip'
                });
            });
            displayConcSlider(false);
            break;
            
        case 'phase2':
            // Phase plane 2: Conversion vs Temperature for current initial conditions
            const solution = solveODE(Ca0, T0, tau);
            const smoothed = smoothComplexTrajectory(solution.Ts, solution.Xas, 21);
            data = [{
                x: smoothed.x,
                y: smoothed.y,
                type: 'scatter',
                mode: 'lines',
                name: 'conversion vs temperature',
                line: { color: 'blue' }
            }];
            
            layout = {
                title: { text: 'phase plane: conversion vs temperature'},
                xaxis: { title: {text:'temperature (K)'} },
                yaxis: { title: {text:'conversion'} },
                showlegend: false
            };


            trajectory = [{xs: smoothed.x, ys: smoothed.y, ts: solution.times, line: { color: 'blue' }}];
            // Create the arrow markers
            markers = createArrowMarkers(trajectory, 800, 10);
            markers.forEach(markerSet => {
                data.push({
                    x: markerSet.x,
                    y: markerSet.y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        symbol: 'arrow',
                        size: 12,
                        color: markerSet.color,
                        line: {color: 'white', width: 1},
                        angle: markerSet.angle
                    },
                    showlegend: false,
                    hoverinfo: 'skip'
                });
            });
            displayConcSlider(true);
            break;
            
        case 'energy':
            // Energy vs Temperature
            const energyData = calculateEnergyData(tau);
            data = [
                {
                    x: energyData.TValues,
                    y: energyData.QgValues,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'heat generated',
                    line: { color: 'green' }
                },
                {
                    x: energyData.TValues,
                    y: energyData.QrValues,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'heat removed',
                    line: { color: 'blue' }
                }
            ];

            // Create a new plot just to have the correct ranges
            Plotly.newPlot(plotDiv, data, layout);
            
            layout = {
                title: { text: 'energy vs temperature'},
                xaxis: { title: {text:'temperature (K)'} },
                yaxis: { title: {text:'energy eate (MJ/m³ min)'} },
                showlegend: true
            };
            displayConcSlider(false);
            break;
            
        case 'temperature':
            // Temperature vs Time
            const tempSolution = solveODE(Ca0, T0, tau);
            data = [{
                x: tempSolution.times,
                y: tempSolution.Ts,
                type: 'scatter',
                mode: 'lines',
                name: 'temperature',
                line: { color: 'purple' }
            }];
            
            layout = {
                title: { text: 'temperature vs time'},
                xaxis: { title: {text:'time (min)'} },
                yaxis: { title: {text:'temperature (K)'} },
                showlegend: false
            };
            displayConcSlider(true);
            break;
            
        case 'conversion':
            // Conversion vs Time
            const convSolution = solveODE(Ca0, T0, tau);
            const smooth = smoothComplexTrajectory(convSolution.times, convSolution.Xas, 11);
            data = [{
                x: smooth.x,
                y: smooth.y,
                type: 'scatter',
                mode: 'lines',
                name: 'conversion',
                line: { color: 'black' }
            }];
            
            layout = {
                title: {text:'conversion vs time'},
                dragMode: false,
                xaxis: { title: {text:'time (min)'} },
                yaxis: { title: {text:'conversion'} },
                showlegend: false
            };
            displayConcSlider(true);
            break;
    }
    
    Plotly.newPlot(plotDiv, data, layout, { displayModeBar: false, staticPlot: true });
}

// Initialize the plot
updatePlot();