
// Current state
let currentView = 'phase1';
let tau = 38;
let T0 = 315;
let Ca0 = 1.0;

const FontSize = 16;

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
const T0ctrl = T0Slider.parentElement;

// Constants
const Ea = 15000;      // Activation energy (J/mol)
const k0 = 0.004;      // Pre-exponential factor (1/s)
const ΔH = -220000;    // J/mol (exothermic reaction)
const Cp = 4000;       // J/(kg·K)
const UA = 3400;       // W/K
const V = 10;          // m³

function displayConcSlider(show=true) {
    if (show) {
        Ca0ctrl.classList.remove("hidden");
    } else {
        Ca0ctrl.classList.add("hidden");
    }
}

function displayTempSlider(show=true) {
    if (show) {
        T0ctrl.classList.remove("hidden");
    } else {
        T0ctrl.classList.add("hidden");
    }
}

// Track the webworker's jobs
var currentJob = null;
var pendingJob = null;

// Send a job to the worker
function sendJob(job) {
    currentJob = job;
    worker.postMessage(job);
}

// Enqueue a job
function enqueueJob(job) {
    if (!currentJob) {
        sendJob(job);
    }
    else {
        pendingJob = job;
    }
}

// Request an update by sending a job to the webworker. Jobs are throttled such that pending jobs older than the last requested job are dropped.
function requestUpdate() {
    if (currentView === 'energy') {
        updatePlot();
    }
    else {
        enqueueJob({ Ca0, T0, tau, mode:currentView });
    }
}

// Worker init
const worker = new Worker("worker.js");
worker.onmessage = (event) => {
    const result = event.data // { times, Cas, Ts }[]
    updatePlot(result);
    
    // Clear the current job; if there is a pending job, request it
    currentJob = null;
    if (pendingJob) {
        const job = pendingJob;
        pendingJob = null;
        sendJob(job);
    }
}

// Event listeners
tauSlider.addEventListener('input', () => {
    tau = parseFloat(tauSlider.value);
    tauValue.textContent = tau;
    requestUpdate();
});

T0Slider.addEventListener('input', () => {
    T0 = parseFloat(T0Slider.value);
    T0Value.textContent = T0;
    requestUpdate();
});

Ca0Slider.addEventListener('input', () => {
    Ca0 = parseFloat(Ca0Slider.value);
    Ca0Value.textContent = Ca0.toFixed(1);
    requestUpdate();
});

viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentView = button.getAttribute('data-view');
        requestUpdate();
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

// Rate constant calculation
function k(T) {
    return k0 * Math.exp(-Ea * (1/T - 1/298));
}

// Calculate Qg and Qr for energy plot
function calculateEnergyData(tau) {
    const Tmin = 300;
    const Tmax = 420;
    const TValues = [];
    const QgValues = [];
    const QrValues = [];
    
    for (let T = Tmin; T <= Tmax; T += 2) {
        const k_val = k(T);
        const Qg = (-k_val/(1 + k_val * tau)) * ΔH * 2 / 1000; // kJ/(m³·min)
        const Qr = (Cp/tau * (T - 298) + (UA/V) * (T - 300)) / 1000; // kJ/(m³·min)
        
        TValues.push(T);
        QgValues.push(Qg);
        QrValues.push(Qr);
    }
    
    return { TValues, QgValues, QrValues };
}

// Update the plot based on current view and parameters
/**
 * 
 * @param {Array<{ times: number[], Cas: number[], Ts: number[]}>} result 
 */
function updatePlot(result) {
    let layout, data = [];
    
    switch(currentView) {
        case 'phase1':
            // Phase plane 1: Multiple initial concentrations
            data = [];
            const trajectories = [];
            
            result.forEach(solution => {
                const Ca_init = solution.Cas[0];
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
                xaxis: { 
                    title: {
                        text:'temperature (K)', 
                        font: { size: FontSize } 
                    }, 
                    tickfont: { size: FontSize },
                    showline: true
                },
                yaxis: { 
                    title: {text:'concentration (kmol/m³)', font: { size: FontSize } }, 
                    tickformat: ".1f", 
                    tickfont: { size: FontSize },
                    ticksuffix: ' ',
                    showline: true,
                    rangemode: 'tozero',
                    range: [0, 2]
                },
                showlegend: false,
                margin: {
                    l: 60,
                    r: 50,
                    b: 50,
                    t: 50
                }
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
                        size: 16,
                        color: markerSet.color,
                        angle: markerSet.angle
                    },
                    showlegend: false,
                    hoverinfo: 'skip'
                });
            });
            displayConcSlider(false);
            displayTempSlider(true);
            break;
            
        case 'phase2':
            // Phase plane 2: Conversion vs Temperature for current initial conditions
            const solution = result[0];
            const Xas = solution.Cas.map(ca => 1 - ca/2);
            console.log(Xas)
            const smoothed = smoothComplexTrajectory(solution.Ts, Xas, 21);
            console.log(smoothed)
            data = [{
                x: smoothed.x,
                y: smoothed.y,
                type: 'scatter',
                mode: 'lines',
                name: 'conversion vs temperature',
                line: { color: 'blue' }
            }];
            
            layout = {
                xaxis: { 
                    title: {text:'temperature (K)', font: { size: FontSize } }, 
                    tickfont: { size: FontSize },
                    showline: true
                },
                yaxis: { 
                    title: {text:'conversion', font: { size: FontSize } }, 
                    range: [0,1], 
                    tickformat: ".1f", 
                    tickfont: { size: FontSize },
                    ticksuffix: ' ',
                    showline: true
                },
                showlegend: false,
                margin: {
                    l: 60,
                    r: 50,
                    b: 50,
                    t: 50
                }
            };

            // Create a new plot just to have the correct axis ranges
            Plotly.newPlot(plotDiv, data, layout);

            const trajectory = [{xs: smoothed.x, ys: smoothed.y, ts: solution.times, line: { color: 'blue' }}];
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
                        size: 16,
                        color: markerSet.color,
                        angle: markerSet.angle
                    },
                    showlegend: false,
                    hoverinfo: 'skip'
                });
            });
            displayConcSlider(true);
            displayTempSlider(true);
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
                xaxis: { 
                    title: { text:'temperature (K)', font: { size: FontSize } }, 
                    range: [300, 420], 
                    tickfont: { size: FontSize },
                    showline: true
                },
                yaxis: { 
                    title: { text:'energy eate (MJ/m³ min)', font: { size: FontSize } }, 
                    range: [0, null], 
                    tickfont: { size: FontSize },
                    showline: true,
                    ticksuffix: ' ',
                },
                showlegend: false,
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50
                },
                annotations: [{
                    x: energyData.TValues[30],
                    y: energyData.QgValues[30],
                    text: "heat generated",
                    showarrow: false,
                    font: {
                        color: "green",
                        size: FontSize
                    },
                    xanchor: "center",
                    yanchor: "center",
                    bgcolor: "white"
                }, {
                    x: energyData.TValues[45],
                    y: energyData.QrValues[45],
                    text: "heat removed",
                    showarrow: false,
                    font: {
                        color: "blue",
                        size: FontSize
                    },
                    xanchor: "center",
                    yanchor: "center",
                    bgcolor: "white"
                }]
            };
            displayConcSlider(false);
            displayTempSlider(false);
            break;
            
        case 'temperature':
            // Temperature vs Time
            data = [{
                x: result[0].times,
                y: result[0].Ts,
                type: 'scatter',
                mode: 'lines',
                name: 'temperature',
                line: { color: 'purple' }
            }];
            
            layout = {
                xaxis: { 
                    title: {text:'time (min)', font: { size: FontSize }}, 
                    tickfont: { size: FontSize },
                    showline: true
                },
                yaxis: { 
                    title: {text:'temperature (K)', font: { size: FontSize }}, 
                    tickfont: { size: FontSize },
                    showline: true,
                    ticksuffix: ' '
                },
                showlegend: false,
                margin: {
                    l: 70,
                    r: 50,
                    b: 50,
                    t: 50
                }
            };
            displayConcSlider(true);
            displayTempSlider(true);
            break;
            
        case 'conversion':
            // Conversion vs Time
            const xas = result[0].Cas.map(ca => 1-ca/2);
            const smooth = smoothComplexTrajectory(result[0].times, xas, 11);
            data = [{
                x: smooth.x,
                y: smooth.y,
                type: 'scatter',
                mode: 'lines',
                name: 'conversion',
                line: { color: 'black' }
            }];
            
            layout = {
                xaxis: { 
                    title: {text:'time (min)', font: { size: FontSize }}, 
                    tickfont: { size: FontSize },
                    showline: true
                },
                yaxis: { 
                    title: {text:'conversion', font: { size: FontSize }}, 
                    range: [0,1], tickformat: ".1f", 
                    tickfont: { size: FontSize },
                    showline: true,
                    ticksuffix: ' '
                },
                showlegend: false,
                margin: {
                    l: 60,
                    r: 50,
                    b: 50,
                    t: 50
                }
            };
            displayConcSlider(true);
            displayTempSlider(true);
            break;
    }
    
    Plotly.newPlot(plotDiv, data, layout, { displayModeBar: false, staticPlot: true });
}

// Initial figure
requestUpdate();