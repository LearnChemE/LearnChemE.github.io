import type { Component } from "solid-js";

interface DisplayProps {
  x: number;
  y: number;
};

export const Display: Component<DisplayProps> = ({ x, y }) => {
  return (
    <g id="display">
      <rect
        x={`${x}`}
        y={`${y}`}
        width="66"
        height="33"
        rx="3.5"
        fill="#888888"
        stroke="black"
      />
      <rect
        id="condTempScreen"
        x={`${x + 3}`}
        y={`${y + 3}`}
        width="60"
        height="27"
        rx="3.5"
        fill="#111111"
        stroke="black"
      />
    </g>
)};

export default Display;