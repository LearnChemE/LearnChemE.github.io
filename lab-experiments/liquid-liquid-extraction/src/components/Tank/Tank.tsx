import type { Accessor, Component } from "solid-js";

interface TankProps {
  x: number;
  y: number;
  volume?: number | Accessor<number>;
  maxVolume?: number;
}

export const Tank: Component<TankProps> = (props) => {
  return (
    <g transform={`translate(${props.x}, ${props.y})`}>
        <rect x="4" y="15" width="90" height="148" fill="#356ADB"/>
        <rect x="4.5" y="8.5" width="89" height="154" fill="#D9D9D9" fill-opacity="0.4" stroke="black"/>
        <rect x="4.5" y="3.5" width="89" height="5" fill="#565656" stroke="black"/>
        <rect x="0.5" y="0.5" width="97" height="3" fill="#565656" stroke="black"/>
        <rect x="0.5" y="3.5" width="2" height="164" fill="#565656" stroke="black"/>
        <rect x="1.5" y="170.5" width="5" height="44" fill="#565656" stroke="black"/>
        <rect x="91.5" y="170.5" width="5" height="44" fill="#565656" stroke="black"/>
        <rect x="93.5" y="167.5" width="89" height="5" transform="rotate(180 93.5 167.5)" fill="#565656" stroke="black"/>
        <rect x="97.5" y="170.5" width="97" height="3" transform="rotate(180 97.5 170.5)" fill="#565656" stroke="black"/>
        <rect x="97.5" y="167.5" width="2" height="164" transform="rotate(180 97.5 167.5)" fill="#565656" stroke="black"/>
    </g>
    );
}

export default Tank;