import type { Component } from "solid-js";
import { paddedHeight } from "../../globals";


const Background: Component = () => {
  return (
<g transform={`translate(0 ${29 + paddedHeight()})`}>
  <path d="M1.07872e-05 279.5L740 279.5" stroke="black"/>
</g>
  );
};

export default Background;