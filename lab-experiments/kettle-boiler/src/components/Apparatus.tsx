import type { Component } from "solid-js";
import StaticElements from "./Static/StaticElements";
import StaticDefs from "./Static/StaticDefs";
import Rotameter from "./Interactables/Rotameter";
import Kettle from "./Kettle/Kettle";
import Display from "./Interactables/Display";
import Waterfall from "./Interactables/Waterfall";
import Gauge from "./Interactables/Gauge";
import BallValve from "./BallValve/BallValve";
import GlobeValve from "./GlobeValve/GlobeValve";
import BeakerSystem from "./BeakerSystem/BeakerSystem";

const waterfallPaths = [
  "M167 522C160.333 522 153.667 522 147 522C147.667 524.57 148.741 527.141 149 529.711C149.013 529.841 149.026 529.97 149.039 530.1C149.657 536.197 150.376 542.294 150.5 548.391C151.364 590.894 152.077 633.397 152.852 675.9C152.901 678.6 152.95 681.3 153 684C155.667 684 158.333 684 161 684C161.05 681.3 161.099 678.6 161.148 675.9C161.923 633.397 162.636 590.894 163.5 548.391C163.624 542.294 164.343 536.197 164.961 530.1C164.974 529.97 164.987 529.841 165 529.711C165.259 527.141 166.333 524.57 167 522Z",
  "M975 522C968.333 522 961.667 522 955 522C955.667 524.57 956.741 527.141 957 529.711C957.013 529.841 957.026 529.97 957.039 530.1C957.657 536.197 958.376 542.294 958.5 548.391C959.364 590.894 960.077 633.397 960.852 675.9C960.901 678.6 960.95 681.3 961 684C963.667 684 966.333 684 969 684C969.05 681.3 969.099 678.6 969.148 675.9C969.923 633.397 970.636 590.894 971.5 548.391C971.624 542.294 972.343 536.197 972.961 530.1C972.974 529.97 972.987 529.841 973 529.711C973.259 527.141 974.333 524.57 975 522Z"
];

export const Apparatus: Component = () => {

return (<svg
  width="1133"
  height="777"
  viewBox="0 0 1133 777"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g id="canvas" clip-path="url(#clip0_6_626)">
    <rect width="1133" height="777" fill="white" />
    <StaticElements/>

    {/* Interactables */}
    <Rotameter/>
    <Kettle/>

    {/* Displays */}
    {/* Condensate Temperature Display */}
    <Display x={350.5} y={565.5}/>
    {/* Feed Temperature Display */}
    <Display x={576.5} y={428.5}/>
    {/* Steam Temperature Display */}
    <Display x={220.5} y={351.5}/>
    {/* Outlet Temperature Display */}
    <Display x={820.5} y={479.5}/>

    {/* Waterfalls */}
    <Waterfall d={waterfallPaths[0]}/>
    <Waterfall d={waterfallPaths[1]}/>

    <Gauge/>
    <BallValve onToggle={() => {}} />
    <GlobeValve/>
    <BeakerSystem/>
    
    
  </g>
  <StaticDefs/>
</svg>);
}

export default Apparatus;