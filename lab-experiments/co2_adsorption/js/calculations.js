import * as state from './state.js';

export function updateDigitalPressureGauge(P) {
  const gauge = document.querySelector('.digital-pressure-gauge');
  if (!gauge) return;

  // Get current pressure values and calculate sum
  const gauge1Value = state.getGaugeValue('gauge1', P);
  const gauge2Value = state.getGaugeValue('gauge2', P);
  const gauge3Value = state.getGaugeValue('gauge3', P);

  const gaugePosition = state.getCurrentMultiValvePosition();
  let pressure, tankNum;
  switch (gaugePosition) {
    case 270:
      tankNum = "outlet";
      break;
    case 0:
      tankNum = "3";
      break;
    case 90:
      tankNum = "2";
      break;
    case 180:
      tankNum = "1";
      break;
    default:
      tankNum = "outlet";
      break;
  }
  const tankValveId = `tankValve${tankNum}`;
  const pressureValveId = `pressureValve${tankNum}`;

  const isOpen = tankNum !== "outlet" ? state.getValveState(tankValveId)?.isOpen && state.getValveState(pressureValveId)?.isOpen : false;

  if (tankNum === "outlet") {
    pressure = `0.0`;
  } else if (tankNum === "1" && isOpen) {
    pressure = gauge1Value.toFixed(1)
  } else if (tankNum === "2" && isOpen) {
    pressure = gauge2Value.toFixed(1);
  } else if (tankNum === "3" && isOpen) {
    pressure = gauge3Value.toFixed(1);
  } else {
    pressure = `0.0`;
  }

  // Update the text element with the total pressure
  const textElements = gauge.querySelectorAll('text');
  if (textElements.length > 0) {
    textElements[0].textContent = pressure;
  }
}