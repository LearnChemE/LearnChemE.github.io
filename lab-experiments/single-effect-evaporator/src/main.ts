import 'bootstrap';

import 'bootstrap/scss/bootstrap.scss';
import './style.css'
import { initHamburgerMenu, insertSVG } from './ts/helpers';
import svg from './media/Evaporator.svg?raw';
import worksheet from './media/Single-effect evaporator worksheet.docx?raw';
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/zoom';
import { initInteractions } from './ts/interactions';
import { createLabels } from './ts/labels';
import { Simulation, type SimulationDescriptor } from './ts/classes/Simulation';
import { DigitalLabel } from './ts/classes/Label';
import type { DigitalLabelDescriptor } from './types';
import { FirstOrder } from './ts/classes/Setpoint';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.docx"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Initialize labels
createLabels();

// Create label for steam temperature
const steamTempLabelDescriptor: DigitalLabelDescriptor = {
  id: "evapTempLabel",
  gid: "evapTempGauge",
  centerId: "evapTempScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 25,
  range: {
    range: [0, 1000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};
const steamTempLabel = new DigitalLabel(steamTempLabelDescriptor);

// Create label for steam flowrate
const steamFlowLabelDescriptor: DigitalLabelDescriptor = {
  id: "steamFlowLabel",
  gid: "steamFlowGauge",
  centerId: "steamFlowScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 0,
  range: {
    range: [0, 10000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};
const steamFlowLabel = new DigitalLabel(steamFlowLabelDescriptor);

const flowCtrl = new FirstOrder(0,  1000);
const tempCtrl = new FirstOrder(25, 3000);

// Initialize State
const stateDescriptor: SimulationDescriptor = {
  flowCtrl: flowCtrl,
  tempCtrl: tempCtrl,
  steamFlowLabel: steamFlowLabel,
  steamTempLabel: steamTempLabel,
}
new Simulation(stateDescriptor);

// Initialize interactions
initInteractions<FirstOrder>(flowCtrl, tempCtrl);

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();