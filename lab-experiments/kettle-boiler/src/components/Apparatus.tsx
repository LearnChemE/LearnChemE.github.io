import { createMemo, createSignal, onMount, type Component } from "solid-js";
import StaticElements from "./Static/StaticElements";
import StaticDefs from "./Static/StaticDefs";
import Rotameter from "./Rotameter/Rotameter";
import Kettle from "./Kettle/Kettle";
import Display from "./Display/Display";
import Waterfall from "./Waterfall/Waterfall";
import Gauge from "./Gauge/Gauge";
import BallValve from "./BallValve/BallValve";
import GlobeValve from "./GlobeValve/GlobeValve";
import BeakerSystem from "./BeakerSystem/BeakerSystem";
import { PRegulator } from "./PRegulator/PRegulator";
import { calculateSteamTemperature, FEED_RATE_GAIN } from "../ts/calcs";
import { animate } from "../ts/helpers";
import { Steam } from "./Steam/Steam";
import { MagnifierEmitter } from "./Magnifier/MagnifierEmitter";
import { Label } from "./Label/Label";

// Note: The Apparatus component is the main SVG container for the kettle boiler experiment. 
// It includes static elements, interactable components like the rotameter and kettle, displays for temperature readings, waterfalls to represent fluid flow, 
// a pressure gauge, valves, and a beaker system. Each component is modular and can be developed and maintained independently.

export const Apparatus: Component = () => {
  // Signals
  const [ballValveOpen, setBallValveOpen] = createSignal(false); // State for BallValve
  const [regulatorPressure, setRegulatorPressure] = createSignal(0); // Pressure state for the PRegulator
  const [steamPressure, setSteamPressure] = createSignal(-1);
  const [feedRate, setFeedRate] = createSignal(0); // Feed flow rate
  const [evaporateRate, setEvaporateRate] = createSignal(0); // Evaporation rate
  const [outRate, setOutRate] = createSignal(0); // Kettle outlet
  const [condRate, setCondRate] = createSignal(0); // Condensate flowrate
  const [outTemp, setOutTemp] = createSignal(25);
  const [rotameterRef, setRotameterRef] = createSignal<SVGGElement | null>(null);
  const [gaugeRef, setGaugeRef] = createSignal<SVGGElement | null>(null);
  onMount(() => console.log("apparatus ref for rotameter:", rotameterRef))

  // Memos
  // const steamPressure = createMemo(() => ballValveOpen() ? Math.min(regulatorPressure(), 15) : 0); // Steam pressure depends on ball valve state
  const r = Math.exp(-1/1);
  animate((dt: number) => {
    const target = ballValveOpen() ? regulatorPressure() : -1;
    const current = steamPressure();
    let next = (current - target) * r ** dt + target;
    setSteamPressure(Math.min(next, 1));
    return true;
  });
  const steamTemperature = createMemo(() => calculateSteamTemperature(steamPressure())); // Steam temperature based on pressure

  const outTempDisplay = createMemo(() => outTemp().toFixed(1)); // Show internal temp always for debugging

return (<svg
  width="1133"
  height="777"
  viewBox="0 0 1133 777"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g id="canvas" clip-path="url(#clip0_6_626)">
    <rect width="1133" height="777" fill="white" />
    <MagnifierEmitter emitterKey="rotameter" svgRef={rotameterRef} scale={4} moveY={true}>
      <Rotameter flowrate={feedRate} onRef={setRotameterRef} />
    </MagnifierEmitter>
    <StaticElements/>

    <Label x={212}  y={20} text="1.0 bar" />
    <Label x={180}  y={44} text="release valve" />
    <Label x={972}  y={110} text="1.0 bar" />
    <Label x={940}  y={134} text="release valve" />
    <Label x={8}  y={154} text="saturated steam" />
    <Label x={18} y={180} text="inlet at 7 bar" />
    <Label x={858} y={80} text="vent" />
    <Label x={92} y={344} text="pressure" />
    <Label x={92} y={368} text="regulator" />
    <Label x={200} y={574} text="steam trap" />
    <Label x={354} y={624} text="flow-control" />
    <Label x={384} y={646} text="valve" />
    <Label x={410} y={700} text="cold water" />
    <Label x={442} y={726} text="inlet" />

    {/* Interactables */}
    <Kettle 
      // Kettle Inputs
      feedRate={feedRate} 
      evaporateRate={evaporateRate}
      steamTemp={steamTemperature} 
      outTemp={outTemp}
      // Kettle Outputs
      onOutletChange={setOutRate}
      onEvaporateChange={setEvaporateRate}
      onSteamOutChange={setCondRate}
      onOutTempChange={setOutTemp}
    />
    <PRegulator setPressure={setRegulatorPressure}/>

    {/* Displays */}
    {/* Condensate Temperature Display */}
    <Display x={320.5} y={550.5} val={steamTemperature}/>
    {/* Feed Temperature Display */}
    <Display x={576.5} y={428.5} val={"25.0"} />
    {/* Steam Temperature Display */}
    <Display x={190.5} y={351.5} val={steamTemperature}/>
    {/* Outlet Temperature Display */}
    <Display x={820.5} y={479.5} val={outTempDisplay}/>

    {/* Waterfalls */}
    <Waterfall key="cond" cx={157} rate={condRate} rateRange={[0, 30]} />
    <Waterfall key="conc" cx={965} rate={outRate}  rateRange={[0, 30]} />

    <MagnifierEmitter emitterKey="pgauge" svgRef={gaugeRef} scale={2.25} offset={{ x: 0, y: -3 }}>
      <Gauge pressure={steamPressure} onRef={setGaugeRef} />
    </MagnifierEmitter>
    <BallValve onToggle={(open) => setBallValveOpen(open)} />
    <GlobeValve onLiftChange={(lift) => setFeedRate(lift * FEED_RATE_GAIN)}/>
    <BeakerSystem leftFlow={condRate} rightFlow={outRate} />

    <Steam showing={() => (regulatorPressure() > 1 && ballValveOpen())} x={230} y={90} w={5} h={7} />
  </g>
  <StaticDefs/>
</svg>);
}

export default Apparatus;
