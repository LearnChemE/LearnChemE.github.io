import * as state from './state.js';

export function updateDigitalPressureGauge() {
  const gauge = document.querySelector('.digital-pressure-gauge');
  if (!gauge) return;

  // Get current pressure values and calculate sum
  const gauge1Value = state.getGaugeValue('gauge1', 0.1);
  const gauge2Value = state.getGaugeValue('gauge2', 0.1);
  const gauge3Value = state.getGaugeValue('gauge3', 0.1);

  const gaugePosition = state.getCurrentMultiValvePosition();
  let pressure;

  if (gaugePosition === 270) {
    pressure = `0.0`;
  } else if (gaugePosition === 0) {
    pressure = gauge3Value.toFixed(1)
  } else if (gaugePosition = 90) {
    pressure = gauge2Value.toFixed(1);
  } else {
    pressure = gauge1Value.toFixed(1);
  }

  // Update the text element with the total pressure
  const textElements = gauge.querySelectorAll('text');
  if (textElements.length > 0) {
    textElements[0].textContent = pressure;
  }
}