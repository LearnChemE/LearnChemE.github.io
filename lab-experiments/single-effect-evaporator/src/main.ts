import 'bootstrap';

import 'bootstrap/scss/bootstrap.scss';
import './style.css';
import './hamburger.css';
import { initButton, initHamburgerMenu, insertSVG } from './ts/helpers';
import svg from './media/Evaporator.svg?raw';
import worksheet from './media/Single-effect evaporator worksheet.pdf';
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/zoom';
import { initInteractions } from './ts/interactions';
import { Simulation } from './ts/classes/Simulation';
import { AnalogLabel, DigitalLabel } from './ts/classes/Label';
import { FirstOrder } from './ts/classes/Setpoint';
import { concentrateDescriptor, concScaleLabelDescriptor, condensateDescriptor, condScaleLabelDescriptor, evapLabelDescriptor, pressureLabelDescriptor, steamFlowLabelDescriptor, steamTempLabelDescriptor, tankTempLabelDescriptor } from './ts/config';
import { Outlet } from './ts/classes/Outlet';
import type { SimulationDescriptor } from './types';
import { Refractometer } from './ts/classes/Refractometer';
import { triggerShutdown } from './ts/shutdown';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.pdf"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Create label for steam temperature
const tankTempLabel = new DigitalLabel(tankTempLabelDescriptor);
// Create label for steam flowrate
const steamFlowLabel = new DigitalLabel(steamFlowLabelDescriptor);
const steamTempLabel = new DigitalLabel(steamTempLabelDescriptor);
// Scale labels
const condLabel = new DigitalLabel(condScaleLabelDescriptor);
const concLabel = new DigitalLabel(concScaleLabelDescriptor);

// Control variables for state
const flowCtrl = new FirstOrder(0,   500, 200);
const tempCtrl = new FirstOrder(25, 3000,1000);
const presCtrl = new FirstOrder(0,  1000,   0);

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
  presCtrl: presCtrl,
  steamFlowLabel: steamFlowLabel,
  steamTempLabel: steamTempLabel,
  pressureLabel: presLabel,
  evapLabel: evapLabel,
  concTempLabel: tankTempLabel,
  condensate: condOutlet,
  concentrate: concOutlet
}
const simulation = new Simulation(stateDescriptor);

// Initialize interactions
const [flowSp, tempSp, presSp] = initInteractions<FirstOrder>(flowCtrl, tempCtrl, presCtrl);
simulation.setOnSafetyShutdown(msg => {
  presSp.reset(0);
  triggerShutdown(msg);
});
const refractometer = new Refractometer(() => concOutlet.measureConcentration() * 100);

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();

const resetBtn = document.getElementById("reset-btn");
resetBtn?.addEventListener("click", () => {
  refractometer.reset();
  simulation.reset();
  concOutlet.reset();
  condOutlet.reset();

  flowSp.reset(0);
  tempSp.reset(25);
  presSp.reset(0);
});