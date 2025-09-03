import './style.css'
import { enableWindowResize, initHamburgerMenu, initSvgDrag, initSvgZoom, initSwitch, insertSVG } from './ts/helpers';
import worksheet from './media/massMoleBalancesWorksheet.pdf';
import svg from './media/canvas.svg?raw';
import { FirstOrder, SetpointControl } from './classes/Setpoint';
import { DigitalLabel } from './classes/Label';
import { furnaceSPDescriptor, furnaceSPLabelDescriptor } from './ts/config';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  </div>
`;


// Get the app container
const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.pdf"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();


const furnaceCtrl = new FirstOrder(100, 3000, 0);

const furnaceSPLabel = new DigitalLabel(furnaceSPLabelDescriptor);

furnaceSPDescriptor.ctrl = furnaceCtrl;
furnaceSPDescriptor.spLabel = furnaceSPLabel;

const furnaceSP = new SetpointControl(furnaceSPDescriptor);


// Begin interactables
initSwitch("mantleSwitch","mantleSwitchOn","mantleSwitchOff",    (isOn: boolean) => {});
initSwitch("pumpSwitch","pumpSwitchOn","pumpSwitchOff",          (isOn: boolean) => {});
initSwitch("furnaceSwitch","furnaceSwitchOn","furnaceSwitchOff", (isOn: boolean) => {furnaceSP.togglePower(25)});