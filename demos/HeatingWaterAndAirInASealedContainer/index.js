
// DOM elements
const volumeSlider = document.getElementById('volumeSlider');
const tempSlider = document.getElementById('tempSlider');
const volumeValue = document.getElementById('volumeValue');
const tempValue = document.getElementById('tempValue');
const pressureValue = document.getElementById('pressureValue');
const water = document.getElementById('water');
const air = document.getElementById('air');
const pressureGauge = document.getElementById('pressureGauge');
const o2GasBar = document.getElementById('o2GasBar');
const o2DissolvedBar = document.getElementById('o2DissolvedBar');
const n2GasBar = document.getElementById('n2GasBar');
const n2DissolvedBar = document.getElementById('n2DissolvedBar');
const o2Value = document.getElementById('o2Value');
const n2Value = document.getElementById('n2Value');
const menuBtn = document.getElementById('menuBtn');
const menuItems = document.getElementById('menuItems');

// Initial values
let initialVolume = 0.8;
let temperature = 25;
let pressure = 1.0;

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
    pressureValue.textContent = pressure.toFixed(1) + ' bar';
    pressureGauge.textContent = pressure.toFixed(1);
    
    // Change air color based on pressure
    const intensity = Math.min(100 + pressure * 15, 255);
    air.style.background = `linear-gradient(to bottom, rgb(${intensity}, ${intensity}, ${intensity}), rgb(${intensity-20}, ${intensity-20}, ${intensity-20}))`;
    
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
    
    // Update bars
    o2GasBar.style.height = (o2Gas / 2.1 * 80) + '%';
    o2DissolvedBar.style.height = (o2Dissolved / 2.1 * 80) + '%';
    
    n2GasBar.style.height = (n2Gas / 7.9 * 80) + '%';
    n2DissolvedBar.style.height = (n2Dissolved / 7.9 * 80) + '%';
    
    // Update values
    o2Value.innerHTML = `Gas: ${o2Gas.toFixed(1)} mmol<br>Dissolved: ${o2Dissolved.toFixed(1)} mmol`;
    n2Value.innerHTML = `Gas: ${n2Gas.toFixed(1)} mmol<br>Dissolved: ${n2Dissolved.toFixed(1)} mmol`;
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
