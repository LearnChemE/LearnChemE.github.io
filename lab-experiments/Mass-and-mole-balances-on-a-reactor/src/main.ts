import './style.css'
import { enableWindowResize, initHamburgerMenu, initSvgDrag, initSvgZoom, insertSVG } from './ts/helpers';
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
import { furnaceSPLabelDescriptor } from './ts/config';
import { Beaker, type BeakerDescriptor } from './classes/Beaker';
import { Signal } from './classes/Signal';

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
new BallValve("valveHandle", false, () => {}, { x: -1.5, y: 0 });
const evaporatorPower = initSwitch("mantleSwitch","mantleSwitchOn","mantleSwitchOff");
const pumpPower = initSwitch("pumpSwitch","pumpSwitchOn","pumpSwitchOff");
const furnacePower = initSwitch("furnaceSwitch","furnaceSwitchOn","furnaceSwitchOff");
const furnaceSP = initUpDownButtons("furnaceUpBtn","furnaceDownBtn",200,500,10,300);
const pumpLift = initDial("flowDial");
initBubbleMeter("bulbDefault", "bulbSqueeze");

// Create the furnace controller
const furnaceCtrl = new FirstOrder(25, 3000, 0);
const furnaceDescriptor: PoweredControllerDescriptor<FirstOrder> = {
  restingSetpoint: 25,
  powerSignal: furnacePower,
  setpointSignal: furnaceSP,
  control: furnaceCtrl
};
const furnace = new PoweredController<FirstOrder>(furnaceDescriptor);
furnace.output.subscribe((val:number) => console.log(val));

// Label for setpoint
furnaceSPLabelDescriptor.signal = furnaceSP;
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
const tubeDescriptor: TubeDescriptor = {
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
  mantleSignal: evaporatorPower
};
const evaporator = new Evaporator(evaporatorDescriptor);

// Reactor
const outSignal = Reactor(evaporator.flowOut, furnace.output);

// Split the outlet signal
const liqSignal = new Signal<number>(0);
const vapSignal = new Signal<number>(0);
outSignal.subscribe((stream: ProductStream) => {
  liqSignal.set(stream.liquidFlowrate);
  vapSignal.set(stream.gasFlowrate);
});

// In beaker
const inBeakerDescriptor: BeakerDescriptor = {
  fillId: "inBeakerFill",
  flowSignal: evaporator.flowOut,
  initialVolume: 600,
  maxVolume: 600,
  flowOutInstead: true
};
new Beaker(inBeakerDescriptor);

// Out Beaker
const outBeakerDescriptor: BeakerDescriptor = {
  fillId: "outBeakerFill",
  flowSignal: liqSignal,
  initialVolume: 0,
  maxVolume: 600,
  flowOutInstead: false
};
new Beaker(outBeakerDescriptor);