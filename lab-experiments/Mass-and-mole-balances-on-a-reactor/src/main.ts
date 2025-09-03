import './style.css'
import { enableWindowResize, initHamburgerMenu, initSvgDrag, initSvgZoom, initSwitch, insertSVG } from './ts/helpers';
import worksheet from './media/massMoleBalancesWorksheet.pdf';
import svg from './media/canvas.svg?raw';
import { FirstOrder, SetpointControl } from './classes/Setpoint';
import { DigitalLabel } from './classes/Label';
import { furnaceSPDescriptor, furnaceSPLabelDescriptor } from './ts/config';
import { BallValve, initDial } from './classes/Valve';
import { initBubbleMeter } from './classes/BubbleMeter';
import { Signal } from './classes/Signal';
import { Tube, type TubeDescriptor } from './classes/Tube';

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
new BallValve("valveHandle", false, () => {}, { x: -1.5, y: 0 });
const mantleIsOn = new Signal<boolean>(false);
const pumpIsOn = new Signal<boolean>(false);
const pumpLift = new Signal<number>(0);
initSwitch("mantleSwitch","mantleSwitchOn","mantleSwitchOff",    (isOn: boolean) => {mantleIsOn.set(isOn)});
initSwitch("pumpSwitch","pumpSwitchOn","pumpSwitchOff",          (isOn: boolean) => {pumpIsOn.set(isOn)});
initSwitch("furnaceSwitch","furnaceSwitchOn","furnaceSwitchOff", () => {furnaceSP.togglePower(25)});
initDial("flowDial", (lift: number) => {pumpLift.set(lift)});
initBubbleMeter("bulbDefault", "bulbSqueeze");

// const 

// Inlet tubes
const tubeDescriptor: TubeDescriptor = {
  pathId: "inTubeFill",
  inFlowSignal: new Signal(10),
  crossArea: 1e-3,
  initialFill: 0
};
new Tube(tubeDescriptor);