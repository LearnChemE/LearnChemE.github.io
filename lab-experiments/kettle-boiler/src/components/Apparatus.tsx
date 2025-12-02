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

// Note: The Apparatus component is the main SVG container for the kettle boiler experiment. 
// It includes static elements, interactable components like the rotameter and kettle, displays for temperature readings, waterfalls to represent fluid flow, 
// a pressure gauge, valves, and a beaker system. Each component is modular and can be developed and maintained independently.

export const Apparatus: Component = () => {
  // Signals
  const [ballValveOpen, setBallValveOpen] = createSignal(false); // State for BallValve
  const [regulatorPressure, setRegulatorPressure] = createSignal(0); // Pressure state for the PRegulator
  const [steamPressure, setSteamPressure] = createSignal(-1);
  const [feedRate, setFeedRate] = createSignal(0); // Feed flow rate
  const [outRate, setOutRate] = createSignal(0); // Kettle outlet
  const [condRate, setCondRate] = createSignal(0); // Condensate flowrate
  const [outTemp, setOutTemp] = createSignal(25);
  const [rotameterRef, setRotameterRef] = createSignal<SVGGElement | null>(null);
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
    <MagnifierEmitter emitterKey="rotameter" svgRef={rotameterRef()!}>
      <Rotameter flowrate={feedRate} onRef={setRotameterRef} />
    </MagnifierEmitter>
    <StaticElements/>

    {/* Interactables */}
    <Kettle 
      // Kettle Inputs
      feedRate={feedRate} 
      steamTemp={steamTemperature} 
      outTemp={outTemp}
      // Kettle Outputs
      onOutletChange={setOutRate}
      onEvaporateChange={() => {}}
      onSteamOutChange={setCondRate}
      onOutTempChange={setOutTemp}
    />
    <PRegulator setPressure={setRegulatorPressure}/>

    {/* Displays */}
    {/* Condensate Temperature Display */}
    <Display x={350.5} y={565.5} val={steamTemperature}/>
    {/* Feed Temperature Display */}
    <Display x={576.5} y={428.5} val={"25.0"} />
    {/* Steam Temperature Display */}
    <Display x={220.5} y={351.5} val={steamTemperature}/>
    {/* Outlet Temperature Display */}
    <Display x={820.5} y={479.5} val={outTempDisplay}/>

    {/* Waterfalls */}
    <Waterfall key="cond" cx={157} rate={condRate} rateRange={[0, 140]} />
    <Waterfall key="conc" cx={965} rate={outRate}  rateRange={[0, 40]} />

    <Gauge pressure={steamPressure}/>
    <BallValve onToggle={(open) => setBallValveOpen(open)} />
    <GlobeValve onLiftChange={(lift) => setFeedRate(lift * FEED_RATE_GAIN)}/>
    <BeakerSystem leftFlow={condRate} rightFlow={outRate} />

    <Steam showing={() => (regulatorPressure() > 1 && ballValveOpen())} x={230} y={90} w={5} h={7} />
  </g>
  <StaticDefs/>
</svg>);
}

export default Apparatus;
