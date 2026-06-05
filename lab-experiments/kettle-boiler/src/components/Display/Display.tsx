import type { Component } from "solid-js";
import "./Display.css";

interface DisplayProps {
  x: number;
  y: number;
  val: (() => string | number) | string | number;
  tofixed?: number;
  // Future feature: add units (e.g., °C, °F)
};

export const Display: Component<DisplayProps> = ({ x, y, val, tofixed }) => {
  const fn = typeof val === "function" ? val : () => val;
  const dec = (tofixed !== undefined) ? tofixed : 1;
  const strFn = (typeof fn() === "number") ? () => (fn() as number).toFixed(dec) : fn;

  const scale = 1.5; // Scale factor for the display size
  return (
    <g id="display" transform={`scale(${scale})`}>
      <rect
        x={`${x/scale}`}
        y={`${y/scale}`}
        width="80"
        height="33"
        rx="3.5"
        fill="#888888"
        stroke="black"
      />
      <rect
        id="condTempScreen"
        x={`${x/scale + 3}`}
        y={`${y/scale + 3}`}
        width="74"
        height="27"
        rx="3.5"
        fill="#111111"
        stroke="black"
      />
      <text
        id="condTempVal"
        class="digital-label"
        x={`${x/scale + 38}`}
        y={`${y/scale + 16.5}`}
        dominant-baseline="middle"
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="20"
      >
        { strFn() } °C
      </text>
    </g>
)};

export default Display;