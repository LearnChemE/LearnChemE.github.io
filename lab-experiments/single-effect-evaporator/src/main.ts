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
import { FirstOrder } from './ts/classes/Setpoint';
import { concentrateDescriptor, condensateDescriptor, steamFlowLabelDescriptor, steamTempLabelDescriptor } from './ts/config';
import { Outlet } from './ts/classes/Outlet';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.docx"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Initialize labels
createLabels();

// Create label for steam temperature
const steamTempLabel = new DigitalLabel(steamTempLabelDescriptor);

// Create label for steam flowrate
const steamFlowLabel = new DigitalLabel(steamFlowLabelDescriptor);

const flowCtrl = new FirstOrder(0,   500, 200);
const tempCtrl = new FirstOrder(25, 3000,1000);

new Outlet(concentrateDescriptor);
new Outlet(condensateDescriptor);

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