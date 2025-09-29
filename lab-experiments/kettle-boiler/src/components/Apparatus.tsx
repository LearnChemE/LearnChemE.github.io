import { createMemo, createSignal, type Component } from "solid-js";
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

// Note: The Apparatus component is the main SVG container for the kettle boiler experiment. 
// It includes static elements, interactable components like the rotameter and kettle, displays for temperature readings, waterfalls to represent fluid flow, 
// a pressure gauge, valves, and a beaker system. Each component is modular and can be developed and maintained independently.

export const Apparatus: Component = () => {
  // Signals
  const [ballValveOpen, setBallValveOpen] = createSignal(false); // State for BallValve
  const [regulatorPressure, setRegulatorPressure] = createSignal(0); // Pressure state for the PRegulator
  const [feedRate, setFeedRate] = createSignal(0); // Feed flow rate

  // Memos
  const steamPressure = createMemo(() => ballValveOpen() ? Math.min(regulatorPressure(), 15) : 0); // Steam pressure depends on ball valve state
  const steamTemperature = createMemo(() => calculateSteamTemperature(steamPressure())); // Steam temperature based on pressure
  console.log(`Steam Pressure: ${steamPressure()} psi, Steam Temperature: ${steamTemperature().toFixed(2)} °C`);

return (<svg
  width="1133"
  height="777"
  viewBox="0 0 1133 777"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g id="canvas" clip-path="url(#clip0_6_626)">
    <rect width="1133" height="777" fill="white" />
    <Rotameter flowrate={feedRate}/>
    <StaticElements/>

    {/* Interactables */}
    <Kettle feedRate={feedRate} steamTemp={steamTemperature} />
    <PRegulator setPressure={setRegulatorPressure}/>

    {/* Displays */}
    {/* Condensate Temperature Display */}
    <Display x={350.5} y={565.5} val={calculateSteamTemperature(0)}/>
    {/* Feed Temperature Display */}
    <Display x={576.5} y={428.5} val={25}/>
    {/* Steam Temperature Display */}
    <Display x={220.5} y={351.5} val={steamTemperature}/>
    {/* Outlet Temperature Display */}
    <Display x={820.5} y={479.5} val={steamTemperature}/>

    {/* Waterfalls */}
    <Waterfall key="cond" cx={157} rate={feedRate} />
    <Waterfall key="conc" cx={965} rate={feedRate} />

    <Gauge pressure={steamPressure}/>
    <BallValve onToggle={(open) => setBallValveOpen(open)} />
    <GlobeValve onLiftChange={(lift) => setFeedRate(lift * FEED_RATE_GAIN)}/>
    <BeakerSystem/>
    
    
  </g>
  <StaticDefs/>
</svg>);
}

export default Apparatus;
