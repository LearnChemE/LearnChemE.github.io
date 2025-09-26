import type { Component } from "solid-js";
import "./Display.css";

interface DisplayProps {
  x: number;
  y: number;
  val: (() => number) | number;
  // Future feature: add units (e.g., °C, °F)
};

export const Display: Component<DisplayProps> = ({ x, y, val }) => {
  const getVal = typeof val === "function" ? val : () => val;

  return (
    <g id="display">
      <rect
        x={`${x}`}
        y={`${y}`}
        width="80"
        height="33"
        rx="3.5"
        fill="#888888"
        stroke="black"
      />
      <rect
        id="condTempScreen"
        x={`${x + 3}`}
        y={`${y + 3}`}
        width="74"
        height="27"
        rx="3.5"
        fill="#111111"
        stroke="black"
      />
      <text
        id="condTempVal"
        class="digital-label"
        x={`${x + 38}`}
        y={`${y + 16.5}`}
        dominant-baseline="middle"
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="20"
      >
        { getVal().toFixed(1) } °C
      </text>
    </g>
)};

export default Display;