// Constants
const P0 = 1; // bar
const R = 0.08314; // L bar / mol / K
const V = 1; // L
const T0 = 25;

// DOM elements
const volumeSlider = document.getElementById('volumeSlider');
const tempSlider = document.getElementById('tempSlider');
const volumeValue = document.getElementById('volumeValue');
const tempValue = document.getElementById('tempValue');
const water = document.getElementById('water');
const air = document.getElementById('air');
const pressureGauge = document.getElementById('pressureGauge');
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');

/* ******** Hamburger Menu ********** */
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

/* *********** End Hamburger Menu *********** */

// Insert an svg image 
function insertSVG(svg) {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "crack-wrapper";
    div.innerHTML = svg;
    return div;
}

// Create div containing svg
const svg = `<svg width="200" height="300" viewBox="0 0 181 215" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path transform="scale(1.1, 1.1) translate(-10, 0)" d="M0.5 17.5L36.5 30.5L62.5 15M62.5 15L75.5 16.5M62.5 15L68 1.5M1 213L58 198M58 198L42 161.5L58 144L53.75 138.5L38 118.5M58 198L88 190.5V180M179.5 108L138.5 85.5M138.5 85.5L113 95M138.5 85.5L145 69.5L137 60L140.5 51M113 95L94.5 87L95 77M113 95L118.5 105L102 121L106.5 127.5M57.5 144.5L68 137.5M42.5 161.5L30.5 153.5M88 180H104.5M88 180L91 165.5" stroke="black" stroke-width="3"/>
        </svg>`;
const crack = insertSVG(svg);

// Find wrapper and append svg div
document.getElementById('containerVis').appendChild(crack);
crack.classList.add("hidden");

// Initial values
let initialVolume = 0.8;
let temperature = 25;
let pressure = 1.0;

// Initialize Plotly chart
let layout = {
    title: 'Gas Composition',
    barmode: 'stack',
    showlegend: true,
    legend: {
        x: 0.5,
        y: -0.2,
        xanchor: 'center',
        orientation: 'h'
    },
    xaxis: {
        title: 'Gas Type',
        tickvals: [0, 1],
        ticktext: ['Oxygen (O₂)', 'Nitrogen (N₂)']
    },
    yaxis: {
        title: 'Amount (mmol)',
        range: [0, 6.5]
    },
    paper_bgcolor: '#f8f9fa',
    plot_bgcolor: '#f8f9fa',
    margin: {t: 50, b: 80, l: 60, r: 40}
};

let config = {
    staticPlot: true,
    displayModeBar: false
};

// Initial data for Plotly
let data = [{
    x: ['Oxygen (O₂)', 'Oxygen (O₂)'],
    y: [2.1, 0.5],
    name: 'Gas Phase',
    type: 'bar',
    marker: {color: '#2ecc71'}
}, {
    x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
    y: [0.5, 1.2],
    name: 'Dissolved',
    type: 'bar',
    marker: {color: '#9b59b6'}
}, {
    x: ['Nitrogen (N₂)'],
    y: [7.9],
    name: 'Gas Phase',
    type: 'bar',
    marker: {color: '#2ecc71'},
    showlegend: false
}];

// Create the initial chart
Plotly.newPlot('plotly-chart', data, layout, config);

// Event listeners
volumeSlider.addEventListener('input', updateVolume);
tempSlider.addEventListener('input', updateTemperature);

// Update volume
function updateVolume() {
    initialVolume = parseFloat(volumeSlider.value);
    volumeValue.textContent = initialVolume.toFixed(2) + ' L';
    resetTemperature();
    updateSimulation();
}

// Update temperature
function updateTemperature() {
    temperature = parseInt(tempSlider.value);
    tempValue.textContent = temperature + '°C';
    updateSimulation();
}

// Reset temperature to 25°C when volume changes
function resetTemperature() {
    tempSlider.value = 25;
    temperature = 25;
    tempValue.textContent = '25°C';
}

function calculateLiqVolume() {
    const T = temperature;
    return (-1e-8*T ** 3 + 6e-6*T ** 2 - 2e-5*T + 0.99695) * initialVolume;
}

// Update the entire simulation
function updateSimulation() {
    // Calculate water expansion based on temperature
    const liqVol = calculateLiqVolume();
    const waterHeight = Math.min(liqVol * 100, 100);
    
    if (waterHeight < 100) {
        // Calculate water and air heights
        water.style.height = waterHeight + '%';
        air.style.height = (100 - waterHeight) + '%';
        air.style.bottom = waterHeight + '%';
        // Update gas amounts
        updateGasAmounts(temperature, liqVol);
    }
    else {
        water.style.height = '0%';
        air.style.height = '100%';
        air.style.bottom = '100%';
        // Overflow
        boom();
    }
    
    // Warning if pressure is too high
    if (pressure > 20) {
        pressureGauge.style.color = 'red';
        pressureGauge.style.fontSize = '1.6rem';
        pressureGauge.style.fontWeight = 'bold';
    } else if (pressure > 15) {
        pressureGauge.style.color = 'orange';
        pressureGauge.style.fontSize = '1.5rem';
        pressureGauge.style.fontWeight = 'bold';
    } else {
        pressureGauge.style.color = 'black';
        pressureGauge.style.fontSize = '1.4rem';
        pressureGauge.style.fontWeight = 'normal';
    }
}

/**
 * Calculate the saturation pressure of water using Antoine's equation
 * @param {number} T Temperature (C)
 */
function Psat(T) {
    if (T <= 100) {
        return (1/750.06)*10 ** (8.07131 - 1730.63/(T + 233.426));
    }
    else {
        return (1/750.06)*10 ** (8.14019 - 1810.94/(T + 244.485));
    }
}

/**
 * Calculate Henry's law constant for Oxygen
 * @param {number} T Temperature (C)
 * @returns Henry's law constant
 */
function HO2(T) {
    return 4.342e-6 * Math.exp(1700 / (T + 273));
}

/**
 * Calculate Henry's law constant for Nitrogen
 * @param {number} T Temperature (C)
 * @returns Henry's law constant
 */
function HN2(T) {
    return 7.863e-6 * Math.exp(1300 / (T + 273));
}

/**
 * Secant method solver for finding roots of equations
 * @param {Function} f - The function to find the root of
 * @param {number} x0 - First initial guess
 * @param {number} x1 - Second initial guess
 * @param {number} tolerance - Convergence tolerance (default: 1e-10)
 * @param {number} maxIterations - Maximum number of iterations (default: 100)
 * @returns {Object} - Result object with root, iterations, and convergence info
 */
function secantMethod(f, x0, x1, tolerance = 1e-10, maxIterations = 100) {
    let iterations = 0;
    let f0 = f(x0);
    let f1 = f(x1);
    
    // Store iteration history for analysis
    const history = [
        { iteration: 0, x: x0, fx: f0 },
        { iteration: 1, x: x1, fx: f1 }
    ];
    
    // Check if we already have a root
    if (Math.abs(f0) < tolerance) {
        return {
            root: x0,
            iterations: 0,
            converged: true,
            finalError: Math.abs(f0),
            history: history.slice(0, 1)
        };
    }
    
    if (Math.abs(f1) < tolerance) {
        return {
            root: x1,
            iterations: 1,
            converged: true,
            finalError: Math.abs(f1),
            history: history
        };
    }
    
    let x2;
    
    for (iterations = 2; iterations <= maxIterations; iterations++) {
        // Check for division by zero
        if (Math.abs(f1 - f0) < Number.EPSILON) {
            throw new Error(`Division by zero at iteration ${iterations}. Function values are too close.`);
        }
        
        // Secant method formula: x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
        x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
        
        const f2 = f(x2);
        
        // Add to history
        history.push({
            iteration: iterations,
            x: x2,
            fx: f2
        });
        
        // Check for convergence
        if (Math.abs(f2) < tolerance || Math.abs(x2 - x1) < tolerance) {
            return {
                root: x2,
                iterations: iterations,
                converged: true,
                finalError: Math.abs(f2),
                history: history
            };
        }
        
        // Update values for next iteration
        x0 = x1;
        f0 = f1;
        x1 = x2;
        f1 = f2;
    }
    
    // If we reach here, method didn't converge
    return {
        root: x2,
        iterations: maxIterations,
        converged: false,
        finalError: Math.abs(f1),
        history: history
    };
}

/**
 * Update gas amounts display
 * @param {number} temp Temperature (C)
 * @param {number} pressure Pressure (bar)
 * @param {number} waterVol Water volume (L)
 */
function updateGasAmounts(temp, waterVol) {
    crack.classList.add('hidden');
    // Calculate dissolved gases based on temperature and pressure (Henry's law)
    // Initial moles
    const vol_vap = V - waterVol;
    const psat0 = Psat(T0);
    const no2_tot = .21 * (P0 - psat0) * (V - initialVolume) / R / (T0 + 273) + HO2(T0) * 0.21 * (P0 - psat0) * initialVolume;
    const nn2_tot = .79 * (P0 - psat0) * (V - initialVolume) / R / (T0 + 273) + HN2(T0) * 0.79 * (P0 - psat0) * initialVolume;

    const moles_gas = (p) => { return p * vol_vap / R / (temp+273) };
    const moles_aq = (p, h) => { return h(temp) * p * waterVol };
    // Solve
    const sol1 = secantMethod((p) => {return moles_gas(p) + moles_aq(p, HO2) - no2_tot}, 1, 60);
    const sol2 = secantMethod((p) => {return moles_gas(p) + moles_aq(p, HN2) - nn2_tot}, 1, 60);
    const po2 = sol1.root;
    const pn2 = sol2.root;

    // Set the pressure
    const pressure = po2 + pn2 + Psat(temp);
    pressureGauge.textContent = pressure.toFixed(1) + ' bar';
    
    // Update Plotly chart
    updatePlotlyChart(moles_gas(po2) * 1000, moles_aq(po2, HO2) * 1000, moles_gas(pn2) * 1000, moles_aq(pn2, HN2) * 1000);
}

function boom() {
    pressureGauge.textContent = 'boom!';
    crack.classList.remove('hidden');
    const updatedData = [{
        x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
        y: [0, 0],
        name: 'Dissolved',
        type: 'bar',
        marker: {color: '#9b59b6'},
    }, {
        x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
        y: [0, 0],
        name: 'Gas Phase',
        type: 'bar',
        marker: {color: '#2ecc71'}
    }];
    Plotly.react('plotly-chart', updatedData, layout, config);
}

/**
 * Update Plotly chart with new data
 * @param {number} o2Gas mmol O2 in the gas phase
 * @param {number} o2Dissolved mmol O2 in the aq phase
 * @param {number} n2Gas mmol N2 in the gas phase
 * @param {number} n2Dissolved mmol N2 in the aq phase
 */
function updatePlotlyChart(o2Gas, o2Dissolved, n2Gas, n2Dissolved) {
    const updatedData = [{
        x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
        y: [o2Dissolved, n2Dissolved],
        name: 'Dissolved',
        type: 'bar',
        marker: {color: '#9b59b6'},
    }, {
        x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
        y: [o2Gas, n2Gas],
        name: 'Gas Phase',
        type: 'bar',
        marker: {color: '#2ecc71'}
    }];
    
    Plotly.react('plotly-chart', updatedData, layout, config);
}

// Initialize simulation
updateSimulation();
