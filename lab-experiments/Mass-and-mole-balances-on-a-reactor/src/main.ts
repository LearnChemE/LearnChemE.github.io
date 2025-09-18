import 'bootstrap'
import 'bootstrap/scss/bootstrap.scss'

import './style.css'
import { enableWindowResize, GetElement, initHamburgerMenu, initSvgDrag, initSvgZoom, insertSVG } from './ts/helpers';
import worksheet from './media/massMoleBalancesWorksheet.pdf';
import svg from './media/canvas.svg?raw';
import { FirstOrder } from './classes/Setpoint';
import { BallValve } from './classes/Valve';
import { initBubbleMeter } from './classes/BubbleMeter';
import { Tube, type TubeDescriptor } from './classes/Tube';
import { PoweredController, type PoweredControllerDescriptor } from './classes/Control';
import { Waterfall } from './classes/Waterfall';
import { Evaporator, type EvaporatorDescriptor } from './classes/Evaporator';
import { Reactor, type ProductStream } from './ts/calcs';
import { initDial, initSwitch, initUpDownButtons } from './classes/Inputs';
import { DigitalLabel } from './classes/Label';
import { Beaker, type BeakerDescriptor } from './classes/Beaker';
import { Signal } from './classes/Signal';
import type { DigitalLabelDescriptor } from './types';

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

// Begin interactables
// const evaporatorPower = initSwitch("mantleSwitch","mantleSwitchOn","mantleSwitchOff");
const pumpPower = initSwitch("pumpSwitch","pumpSwitchOn","pumpSwitchOff");
const furnacePower = initSwitch("furnaceSwitch","furnaceSwitchOn","furnaceSwitchOff");
const furnaceSP = initUpDownButtons("furnaceUpBtn","furnaceDownBtn",200,500,10,300);
const pumpLift = initDial("flowDial", 270);

// Create the furnace controller
const furnaceCtrl = new FirstOrder(25, 3000, 0);
const furnaceDescriptor: PoweredControllerDescriptor<FirstOrder> = {
  restingSetpoint: 25,
  powerSignal: furnacePower,
  setpointSignal: furnaceSP,
  control: furnaceCtrl
};
const furnace = new PoweredController<FirstOrder>(furnaceDescriptor);

// Label for setpoint
const furnaceSPLabelDescriptor: DigitalLabelDescriptor = {
  id: "furnaceLabel",
  gid: "switch",
  centerId: "furnaceScreen",
  fill: "#F9F155",
  units: "°C",
  decimals: 0,
  initialValue: 100,
  range: {
    range: [100, 500],
    overflowString: "HOT",
    underflowString: ""
  },
  signal: furnaceSP
};
const furnaceSPLabel = new DigitalLabel(furnaceSPLabelDescriptor);
furnacePower.subscribe((isOn: boolean) => { isOn ? furnaceSPLabel.show(furnaceSP.get()) : furnaceSPLabel.hide() });
furnaceSPLabel.hide();


// Create the pump
const pumpDescriptor: PoweredControllerDescriptor<FirstOrder> = {
  restingSetpoint: -0.5,
  powerSignal: pumpPower,
  setpointSignal: pumpLift,
  control: new FirstOrder(0, 200, 0, 12)
};
const pump = new PoweredController<FirstOrder>(pumpDescriptor);

// Inlet tubes
export const tubeDescriptor: TubeDescriptor = {
  pathId: "inTubeFill",
  inFlowSignal: pump.output,
  crossArea: 5e-4,
  initialFill: 0
};
const inTube = new Tube(tubeDescriptor);
new Waterfall("evapWaterfall", inTube.outFlow);

// Evaporator
const evaporatorDescriptor: EvaporatorDescriptor = {
  id: "evapFill",
  flowInSignal: inTube.outFlow,
  mantleSignal: new Signal(true)
};
const evaporator = new Evaporator(evaporatorDescriptor);

// Reactor
const outSignal = Reactor(evaporator.flowOut, furnace.output);

// Valve to switch the output of the reactor
const valve = new BallValve("valveHandle", false, () => {}, { x: -1.5, y: 0 });

// Create a function to set the output
var outStream: ProductStream = outSignal.get();
var valveSetting: boolean = false;
// Split into two
const liqSignal = new Signal<number>(0);
const vapSignal = new Signal<number>(0);
// Define the logic for the outlets
const setOutlet = () => {
  if (valveSetting) {
    liqSignal.set(outStream.liquidFlowrate);
    vapSignal.set(outStream.gasFlowrate);
  }
  else {
    liqSignal.set(0);
    vapSignal.set(0);
  }
}
// Now subscribe to both
outSignal.subscribe((stream: ProductStream) => {
  outStream = stream;
  setOutlet();
});
valve.turned.subscribe((set: boolean) => {
  valveSetting = set;
  setOutlet();
});

// In beaker
const inBeakerDescriptor: BeakerDescriptor = {
  fillId: "inBeakerFill",
  flowSignal: evaporator.flowOut,
  initialVolume: 600,
  maxVolume: 600,
  flowOutInstead: true
};
const inBeaker = new Beaker(inBeakerDescriptor);
evaporator.flowOut.subscribe((val) => console.log(val))

// In Beaker is under
inBeaker.overflow.subscribe(() => {
  if (pumpPower.get() === true) {
    const e = GetElement("pumpSwitch");
    e.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    e.style.pointerEvents = "none";
  }
});

// Out liquid
new Waterfall("outLiquid", liqSignal);

// Out Beaker
const outBeakerDescriptor: BeakerDescriptor = {
  fillId: "outBeakerFill",
  flowSignal: liqSignal,
  initialVolume: 0,
  maxVolume: 600,
  flowOutInstead: false
};
const outBeaker = new Beaker(outBeakerDescriptor);

// Reset beakers
GetElement("reset-btn").addEventListener("click", () => {
  inBeaker.reset(600);
  outBeaker.reset(0);
  const e = GetElement("pumpSwitch");
  e.style.pointerEvents = "auto";
});

// Bubble Meter
initBubbleMeter("bulbDefault", "bulbSqueeze", vapSignal);