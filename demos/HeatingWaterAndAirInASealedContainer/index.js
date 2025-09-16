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
    
    // Calculate water and air heights
    const waterHeight = Math.min(liqVol * 100, 100);
    water.style.height = waterHeight + '%';
    air.style.height = (100 - waterHeight) + '%';
    air.style.bottom = waterHeight + '%';
    
    // Calculate pressure based on temperature and volume
    pressure = calculatePressure(temperature, liqVol);
    pressureGauge.textContent = pressure.toFixed(1) + ' bar';
    
    // Update gas amounts
    updateGasAmounts(temperature, pressure, liqVol);
    
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

// TODO: Fix me
// Calculate pressure based on temperature and volume
function calculatePressure(temp, waterVol) {
    // Simplified model - in reality this would use Antoine equation and ideal gas law
    const psat = Psat(temp);
    const vapVol = V - waterVol;
    
    const gasPressure = (0.8 / vapVol) * (temp + 273) / 298;
    return vaporPressure + gasPressure;
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
 * Update gas amounts display
 * @param {number} temp Temperature (C)
 * @param {number} pressure Pressure (bar)
 * @param {number} waterVol Water volume (L)
 */
function updateGasAmounts(temp, pressure, waterVol) {
    // Calculate dissolved gases based on temperature and pressure (Henry's law)
    // Initial moles
    const vol_vap = V - waterVol;
    const psat0 = Psat(T0);
    const no2_tot = .21 * (P0 - psat0) * vol_vap / R / (T0 + 273) + HO2(T0) * 0.21 * (P0 - psat0) * waterVol;
    const nn2_tot = .79 * (P0 - psat0) * vol_vap / R / (T0 + 273) + HN2(T0) * 0.79 * (P0 - psat0) * waterVol;
    // Moles dissolved
    const psat = Psat(temp);
    const no2_aq = HO2(temp) * 0.21 * (pressure - psat) * waterVol;
    const nn2_aq = HN2(temp) * 0.79 * (pressure - psat) * waterVol;
    // Moles gas
    const no2_vap = no2_tot - no2_aq;
    const nn2_vap = nn2_tot - nn2_aq;
    
    // Update Plotly chart
    updatePlotlyChart(no2_vap * 1000, no2_aq * 1000, nn2_vap * 1000, nn2_aq * 1000);
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
