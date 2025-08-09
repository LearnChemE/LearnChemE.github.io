// script.js - Single Effect Evaporator with controls

// ─── MENU & MODAL BEHAVIOR ────────────────────────────────────────
const menuBtn     = document.querySelector('.menu-btn');
const dropdown    = document.getElementById('dropdownMenu');
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modalTitle');
const modalBody   = document.getElementById('modalBody');
const modalClose  = document.querySelector('.modal-close');

// Ensure modal starts hidden and initialize evaporator diagram
document.addEventListener('DOMContentLoaded', () => {
  modal.classList.add('hidden');
  dropdown.classList.add('hidden');
  
  // Initialize the evaporator diagram
  if (typeof initEvaporatorDiagram === 'function') {
    initEvaporatorDiagram('#evaporator-canvas');
  }
  
  // Initialize extracted components
  initializeExtractedComponents();
  
  // Update components with process data after a short delay to ensure everything is loaded
  setTimeout(() => {
    updateComponentsWithProcessData();
  }, 100);
  
  // Set up periodic updates for dynamic components
  setInterval(() => {
    updateComponentsWithProcessData();
  }, 1000); // Update every second
});

// 1. Toggle dropdown on hamburger click
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  dropdown.classList.toggle('hidden');
});

// 2. Hide dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// 3. Open modal with content when a menu item is clicked
dropdown.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', e => {
    e.stopPropagation();
    const opt = e.target.dataset.option;
    let title = '', body = '';

    if (opt === 'directions') {
      title = 'Directions';
      body  = `
        <!-- Content to be added -->
      `;
    }
    else if (opt === 'details') {
      title = 'Details';
      body  = `
        <!-- Content to be added -->
      `;
    }
    else if (opt === 'about') {
      title = 'About';
      body  = `
        <!-- Content to be added -->
      `;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML    = body;
    modal.classList.remove('hidden');
    dropdown.classList.add('hidden');
    // re-render MathJax formulas
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

// 4. Close modal when clicking the "×"
modalClose.addEventListener('click', (e) => {
  e.stopPropagation();
  modal.classList.add('hidden');
});

// 5. Close modal when clicking outside the content box
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// 6. Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.add('hidden');
    dropdown.classList.add('hidden');
  }
});

// ─── SIMPLE COMPONENTS INITIALIZATION ─────────────────

// Store component references for updates
let componentRefs = {
  flowmeter: null,
  pressureGauge: null,
  temperatureReader: null,
  valve: null,
  condenser: null
};

function initializeExtractedComponents() {
  // Initialize flowmeter
  if (typeof createFlowmeter === 'function') {
    componentRefs.flowmeter = createFlowmeter('#flowmeter', 5, 5, 25);
  }
  
  // Initialize pressure gauge
  if (typeof createPressureGauge === 'function') {
    componentRefs.pressureGauge = createPressureGauge('#pressure', 5, 5, 1.5);
  }
  
  // Initialize temperature reader with exact styling
  if (typeof createTemperatureReader === 'function') {
    componentRefs.temperatureReader = createTemperatureReader('#temperature-reader', 0, 0, 22.0);
  }

  // Initialize valve (simple visual, initial state open)
  if (typeof createValve === 'function') {
    componentRefs.valve = createValve('#valve', 0, 0, true);
  }

  // Initialize condenser (static graphic)
  if (typeof createCondenser === 'function') {
    componentRefs.condenser = createCondenser('#condenser', 0, 0);
  }
  
  // Update components with evaporator data
  updateComponentsWithProcessData();
}

function updateComponentsWithProcessData() {
  // Get process data from evaporator system (using gvs global variables if available)
  if (typeof gvs !== 'undefined') {
    // Update flowmeter with feed flow rate
    if (componentRefs.flowmeter) {
      // Scale the flow rate to fit the flowmeter range (0-100)
      const scaledFlow = (gvs.f_inlet / 15) * 100; // Assuming max flow of 15 for scaling
      componentRefs.flowmeter.updateReading(Math.min(scaledFlow, 100));
    }
    
    // Update pressure gauge with inlet pressure
    if (componentRefs.pressureGauge) {
      // Convert pressure to appropriate scale (gvs.p_inlet is in MPa, gauge shows bar)
      const pressureInBar = gvs.p_inlet * 10; // Convert MPa to bar
      componentRefs.pressureGauge.updatePressure(Math.min(pressureInBar, 8));
    }
    
    // Update temperature reader with evaporator temperature
    if (componentRefs.temperatureReader) {
      // Use evaporator temperature (gvs.t_evaporator is in K, convert to °C)
      const tempInCelsius = gvs.t_evaporator - 273.15;
      componentRefs.temperatureReader.updateTemperature(tempInCelsius);
    }
  } else {
    // Fallback: use default/demo values if gvs not available
    if (componentRefs.flowmeter) {
      componentRefs.flowmeter.updateReading(45);
    }
    
    if (componentRefs.pressureGauge) {
      componentRefs.pressureGauge.updatePressure(2.5);
    }
    
    if (componentRefs.temperatureReader) {
      // Demo temperature with variation
      const time = Date.now() / 1000;
      const baseTemp = 22.0;
      const variation = Math.sin(time * 0.5) * 3; // ±3°C variation
      componentRefs.temperatureReader.updateTemperature(baseTemp + variation);
    }
  }
}

