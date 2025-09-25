import type { Component } from "solid-js";

export interface WaterfallProps {
  d: string;
};

export const Waterfall: Component<WaterfallProps> = ({ d }) => {
  return (
  <path
    id="condFall"
    d={d}
    fill="#3B8CCF"
    fill-opacity="0.6"
  />
)};

export default Waterfall;