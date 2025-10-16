import { createMemo, type Component } from "solid-js";

interface SyringeProps {
  vol: () => number;
}

export const Syringe: Component<SyringeProps> = ({ vol }) => {

    const dx = createMemo(() => {
        // Map 0-1.00 mL to -71.5 px -- 0 px
        return -71.5 + (vol() / 1.0) * 71.5;
    });

    return (
    <g id="syringe">
        <rect id="Rectangle 58" x="348.517" y="204.25" width="31.5" height="1.5" fill="#747474" stroke="black" stroke-width="0.5"/>
        <rect id="Rectangle 59" x="379.517" y="202.25" width="1.5" height="5.5" fill="#BABABA" stroke="black" stroke-width="0.5"/>
        <g id="plunger" transform={`translate(${dx()}, 0)`}>
            <rect id="Rectangle 62" x="454.517" y="204.25" width="84.5" height="1.5" fill="#BABABA" stroke="black" stroke-width="0.5"/>
            <rect id="Rectangle 61" x="453.517" y="201.25" width="1.5" height="7.5" rx="0.25" fill="#BABABA" stroke="black" stroke-width="0.5"/>
            <rect id="Rectangle 63" x="538.517" y="201.25" width="1.5" height="7.5" rx="0.25" fill="#BABABA" stroke="black" stroke-width="0.5"/>
        </g>
        <rect id="Rectangle 60" x="381.517" y="201.25" width="79.5" height="7.5" rx="0.25" stroke="black" stroke-width="0.5"/>
        <rect id="Rectangle 64" x="381.767" y="201.5" width={dx() + 71.5} height="7" fill="#8AC8EE"/>
    </g>
)}