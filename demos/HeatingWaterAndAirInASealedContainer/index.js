
// DOM elements
const volumeSlider = document.getElementById('volumeSlider');
const tempSlider = document.getElementById('tempSlider');
const volumeValue = document.getElementById('volumeValue');
const tempValue = document.getElementById('tempValue');
const water = document.getElementById('water');
const air = document.getElementById('air');
const pressureGauge = document.getElementById('pressureGauge');
const menuBtn = document.getElementById('menuBtn');
const menuItems = document.getElementById('menuItems');

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
        rangemode: 'tozero'
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
menuBtn.addEventListener('click', toggleMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuItems.contains(e.target)) {
        menuItems.classList.remove('show');
    }
});

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

// Update the entire simulation
function updateSimulation() {
    // Calculate water expansion based on temperature
    const expansionFactor = 1 + (temperature - 25) * 0.00035;
    const currentWaterVolume = Math.min(initialVolume * expansionFactor, 0.99);
    
    // Calculate water and air heights
    const waterHeight = Math.min(currentWaterVolume * 100, 98);
    water.style.height = waterHeight + '%';
    air.style.height = (100 - waterHeight) + '%';
    air.style.bottom = waterHeight + '%';
    
    // Calculate pressure based on temperature and volume
    pressure = calculatePressure(temperature, currentWaterVolume);
    pressureGauge.textContent = pressure.toFixed(1) + ' bar';
    
    // Change air color based on pressure
    const intensity = Math.min(100 + pressure * 15, 255);
    
    // Update gas amounts
    updateGasAmounts(temperature, pressure, currentWaterVolume);
    
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

// Calculate pressure based on temperature and volume
function calculatePressure(temp, waterVol) {
    // Simplified model - in reality this would use Antoine equation and ideal gas law
    const vaporPressure = 0.01 * Math.exp(0.12 * (temp - 25));
    const gasVolume = 1 - waterVol;
    
    if (gasVolume < 0.01) {
        // When gas volume is very small, pressure increases dramatically
        return vaporPressure + 50 * (temp / 100);
    }
    
    const gasPressure = (0.8 / gasVolume) * (temp + 273) / 298;
    return vaporPressure + gasPressure;
}

// Update gas amounts display
function updateGasAmounts(temp, pressure, waterVol) {
    // Calculate dissolved gases based on temperature and pressure (Henry's law)
    const o2Dissolved = 2.1 * (1 - 0.012 * (temp - 25)) * pressure * waterVol;
    const n2Dissolved = 7.9 * (1 - 0.01 * (temp - 25)) * pressure * waterVol;
    
    const o2Gas = 2.1 - o2Dissolved;
    const n2Gas = 7.9 - n2Dissolved;
    
    // Update Plotly chart
    updatePlotlyChart(o2Gas, o2Dissolved, n2Gas, n2Dissolved);
}

// Update Plotly chart with new data
function updatePlotlyChart(o2Gas, o2Dissolved, n2Gas, n2Dissolved) {
    const updatedData = [{
        x: ['Oxygen (O₂)', 'Oxygen (O₂)'],
        y: [o2Gas, o2Dissolved],
        name: 'Gas Phase',
        type: 'bar',
        marker: {color: '#2ecc71'}
    }, {
        x: ['Oxygen (O₂)', 'Nitrogen (N₂)'],
        y: [o2Dissolved, n2Dissolved],
        name: 'Dissolved',
        type: 'bar',
        marker: {color: '#9b59b6'}
    }, {
        x: ['Nitrogen (N₂)'],
        y: [n2Gas],
        name: 'Gas Phase',
        type: 'bar',
        marker: {color: '#2ecc71'},
        showlegend: false
    }];
    
    Plotly.react('plotly-chart', updatedData, layout, config);
}

// Menu functions
function toggleMenu() {
    menuItems.classList.toggle('show');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    menuItems.classList.remove('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Initialize simulation
updateSimulation();
