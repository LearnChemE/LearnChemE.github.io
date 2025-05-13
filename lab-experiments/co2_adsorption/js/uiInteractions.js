// js/uiInteractions.js
import * as state from './state.js';

// --- Gauge Input Popup ---
export function showGaugeInput(screenX, screenY, gaugeId) {
  // Remove any existing popup
  document.querySelectorAll('.gauge-input-container').forEach(el => el.remove());

  // Create container
  const container = document.createElement('div');
  container.className = 'gauge-input-container'; // Style this class in CSS

  // Position the popup relative to the click
  Object.assign(container.style, {
    position: 'fixed', // Use fixed for viewport positioning
    left: `${screenX + 15}px`, // Offset slightly from click point
    top: `${screenY - 20}px`, // Offset slightly
    zIndex: '1000', // Ensure it's on top
    background: 'white',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
  });

  // Create input row
  const inputRow = document.createElement('div');
  inputRow.style.display = 'flex';
  inputRow.style.alignItems = 'center';
  inputRow.style.marginBottom = '5px';

  // Input field
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1.0';
  input.max = '10'; // Max pressure in bar
  input.step = '0.1';
  input.value = state.getGaugeValue(gaugeId, 5.0); // Get current value from state
  input.style.width = '60px';
  input.style.marginRight = '5px';

  // Unit label
  const unitLabel = document.createElement('span');
  unitLabel.textContent = 'bar';
  unitLabel.style.marginRight = '10px';

  // Set button
  const button = document.createElement('button');
  button.textContent = 'Set';
  button.style.padding = '2px 8px';


  // Error message area
  const errorMsg = document.createElement('div');
  errorMsg.style.color = 'red';
  errorMsg.style.fontSize = '0.8em';
  errorMsg.style.marginTop = '5px';
  errorMsg.style.minHeight = '1em'; // Reserve space

  // Assemble the input row
  inputRow.append(input, unitLabel, button);

  // Assemble the container
  container.append(inputRow, errorMsg);
  document.body.appendChild(container); // Add to body

  // Focus the input field
  input.focus();

  // --- Event Listeners ---
  const saveValue = async() => {
    const val = parseFloat(input.value);
    if (isNaN(val) || val < 1.0 || val > 10) {
      errorMsg.textContent = 'Value must be 1.0 – 10.0 bar';
    } else {
      await state.setGaugeValue(gaugeId, val); // Update state
      console.log(`Gauge ${gaugeId} set to ${val} bar`);

      container.remove(); // Close popup
      document.removeEventListener('click', outsideClickListener); // Clean up listener
    }
  };

  button.addEventListener('click', () => saveValue());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveValue();
    } else if (e.key === 'Escape') {
      container.remove();
      document.removeEventListener('click', outsideClickListener);
    }
  });


  // Close on outside click (needs to be added *after* timeout to avoid immediate trigger)
  const outsideClickListener = e => {
    // Check if the click target is the container or inside it, or the original gauge element
    const gaugeElement = document.getElementById(gaugeId); // Assumes gauge group has ID
    if (!container.contains(e.target) && (!gaugeElement || !gaugeElement.contains(e.target))) {
      container.remove();
      document.removeEventListener('click', outsideClickListener); // Clean up
    }
  };
  setTimeout(() => document.addEventListener('click', outsideClickListener), 0);
}


// --- MFC Zoomed View Popup ---
export function showMFCZoomedView() {
  // Remove any existing MFC view
  document.querySelectorAll('.mfc-zoomed-view').forEach(el => el.remove());
  document.querySelectorAll('.magnifying-glass').forEach(el => el.remove());

  // Create magnifying glass/overlay
  const magnifyingGlass = document.createElement('div');
  magnifyingGlass.className = 'magnifying-glass';

  // Position the magnifying glass in the center of the screen
  magnifyingGlass.style.left = '50%';
  magnifyingGlass.style.top = '50%';

  document.body.appendChild(magnifyingGlass);

  // Create container for the zoomed view
  const container = document.createElement('div');
  container.className = 'mfc-zoomed-view';

  // Position the container in the center of the screen
  container.style.left = '50%';
  container.style.top = '50%';

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        color: white;
        cursor: pointer;
    `;
  closeBtn.onclick = () => {
    container.remove();
    magnifyingGlass.remove();
    document.removeEventListener('click', outsideClickListener);
  };

  // Create display
  const display = document.createElement('div');
  display.className = 'mfc-display';
  display.textContent = state.getMfcValue().toFixed(1);

  // Add unit label
  const unitLabel = document.createElement('span');
  unitLabel.className = 'mfc-unit';
  unitLabel.textContent = 'mg/min';
  display.appendChild(unitLabel);

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'mfc-controls';
  controls.style.cssText = `
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 15px 0;
    `;

  // Create triangle buttons
  const createTriangle = (direction) => {
    const btn = document.createElement('button');
    btn.innerHTML = direction === 'up' ? '&#9650;' : '&#9660;';
    btn.style.cssText = `
            background: #00b7bd;
            color: black;
            border: 1px solid black;
            padding: 8px 12px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
        `;
    btn.onclick = () => {
      let currentValue = state.getMfcValue();
      if (direction === 'up') {
        currentValue = Math.min(100, currentValue + 1);
      } else {
        currentValue = Math.max(1, currentValue - 1);
      }
      state.setMfcValue(currentValue);
      display.textContent = currentValue.toFixed(1);
      display.appendChild(unitLabel); // Re-add unit label after updating text
      input.value = currentValue.toFixed(1);
      errorMsg.textContent = '';

      // Update the small MFC value text
      const mfcElements = document.querySelectorAll('.mfc-value-text');
      mfcElements.forEach(element => {
        element.textContent = currentValue.toFixed(1);
      });
    };
    return btn;
  };

  const upTriangle = createTriangle('up');
  const downTriangle = createTriangle('down');

  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

  // Create input field
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.max = '100';
  input.step = '0.1';
  input.value = state.getMfcValue().toFixed(1);
  input.style.cssText = `
        width: 80px;
        padding: 5px;
        text-align: center;
        margin-bottom: 5px;
    `;

  // Create set button
  const setButton = document.createElement('button');
  setButton.textContent = 'Set';
  setButton.style.cssText = `
        padding: 4px 10px;
        background: #00b7bd;
        color: black;
        border: 1px solid black;
        border-radius: 4px;
        cursor: pointer;
    `;
  setButton.onclick = () => {
    const newValue = parseFloat(input.value);
    if (isNaN(newValue)) {
      errorMsg.textContent = 'Invalid number';
    } else if (newValue < 1 || newValue > 100) {
      errorMsg.textContent = 'Value: 1–100 mg/min';
    } else {
      state.setMfcValue(newValue);
      display.textContent = newValue.toFixed(1);
      display.appendChild(unitLabel); // Re-add unit label after updating text
      errorMsg.textContent = '';

      // Update the small MFC value text
      const mfcElements = document.querySelectorAll('.mfc-value-text');
      mfcElements.forEach(element => {
        element.textContent = newValue.toFixed(1);
      });
    }
  };

  // Assemble input container
  inputContainer.append(input, setButton);

  // Assemble controls
  controls.append(downTriangle, inputContainer, upTriangle);

  // Create error message
  const errorMsg = document.createElement('div');
  errorMsg.style.cssText = `
        color: orange;
        font-size: 0.9em;
        margin-top: 10px;
        min-height: 1.2em;
    `;

  // Assemble the container
  container.append(closeBtn, display, controls, errorMsg);
  document.body.appendChild(container);

  // Focus the input field
  input.focus();
  input.select();

  // Handle keyboard events
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      setButton.click();
    } else if (e.key === 'Escape') {
      closeBtn.click();
    }
  });

  // Close on outside click
  const outsideClickListener = e => {
    if (!container.contains(e.target)) {
      container.remove();
      magnifyingGlass.remove();
      document.removeEventListener('click', outsideClickListener);
    }
  };
  setTimeout(() => document.addEventListener('click', outsideClickListener), 0);
}

// --- Digital Pressure Gauge Update ---
export function updateDigitalPressureGauge() {
  const gauge = document.querySelector('.digital-pressure-gauge');
  if (!gauge) return;

  // Get current pressure values
  const gauge1Value = state.getGaugeValue('gauge1', 5.0);
  const gauge2Value = state.getGaugeValue('gauge2', 5.0);
  const gauge3Value = state.getGaugeValue('gauge3', 5.0);

  // Update all text elements in the gauge
  const textElements = gauge.querySelectorAll('text');
  if (textElements.length >= 3) {
    textElements[1].textContent = `${(gauge1Value + gauge2Value + gauge3Value).toFixed(1)}`;
  }
}

export function writeTextAtPosition(x, y, text, options = {}) {
  const {
    fontSize = '14px',
      fontFamily = 'Arial',
      fill = 'black',
      fontWeight = 'normal',
      textAnchor = 'middle',
      className = '',
      id = ''
  } = options;

  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', x);
  textElement.setAttribute('y', y);
  textElement.setAttribute('font-size', fontSize);
  textElement.setAttribute('font-family', fontFamily);
  textElement.setAttribute('fill', fill);
  textElement.setAttribute('font-weight', fontWeight);
  textElement.setAttribute('text-anchor', textAnchor);
  textElement.textContent = text;

  if (className) {
    textElement.setAttribute('class', className);
  }
  if (id) {
    textElement.setAttribute('id', id);
  }

  // Get the SVG container
  const svgContainer = document.querySelector('#svg-container svg');
  if (svgContainer) {
    svgContainer.appendChild(textElement);
    return textElement;
  }
  return null;
}