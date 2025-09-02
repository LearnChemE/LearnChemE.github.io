import 'bootstrap';

import 'bootstrap/scss/bootstrap.scss';
import './style.css'
import { initButton, initHamburgerMenu, insertSVG } from './ts/helpers';
import svg from './media/Evaporator.svg?raw';
import worksheet from './media/Single-effect evaporator worksheet.pdf';
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/zoom';
import { initInteractions } from './ts/interactions';
import { Simulation } from './ts/classes/Simulation';
import { AnalogLabel, DigitalLabel } from './ts/classes/Label';
import { FirstOrder } from './ts/classes/Setpoint';
import { concentrateDescriptor, concScaleLabelDescriptor, condensateDescriptor, condScaleLabelDescriptor, evapLabelDescriptor, pressureLabelDescriptor, steamFlowLabelDescriptor, steamTempLabelDescriptor } from './ts/config';
import { Outlet } from './ts/classes/Outlet';
import type { SimulationDescriptor } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.pdf"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Create label for steam temperature
const steamTempLabel = new DigitalLabel(steamTempLabelDescriptor);
// Create label for steam flowrate
const steamFlowLabel = new DigitalLabel(steamFlowLabelDescriptor);
// Scale labels
const condLabel = new DigitalLabel(condScaleLabelDescriptor);
const concLabel = new DigitalLabel(concScaleLabelDescriptor);

// Control variables for state
const flowCtrl = new FirstOrder(0,   500, 200);
const tempCtrl = new FirstOrder(25, 3000,1000);

// Outlets
concentrateDescriptor.label = concLabel;
condensateDescriptor.label = condLabel;
const concOutlet = new Outlet(concentrateDescriptor);
const condOutlet = new Outlet(condensateDescriptor);
initButton("concentrateTareBtn", () => {concOutlet.tare()});
initButton("condensateTareBtn", () => {condOutlet.tare()});

//  Analog labels
const presLabel = new AnalogLabel(pressureLabelDescriptor);
const evapLabel = new AnalogLabel(evapLabelDescriptor);

// Initialize State
const stateDescriptor: SimulationDescriptor = {
  flowCtrl: flowCtrl,
  tempCtrl: tempCtrl,
  steamFlowLabel: steamFlowLabel,
  steamTempLabel: steamTempLabel,
  pressureLabel: presLabel,
  evapLabel: evapLabel,
  condensate: condOutlet,
  concentrate: concOutlet
}
new Simulation(stateDescriptor);

// Initialize interactions
initInteractions<FirstOrder>(flowCtrl, tempCtrl);

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();