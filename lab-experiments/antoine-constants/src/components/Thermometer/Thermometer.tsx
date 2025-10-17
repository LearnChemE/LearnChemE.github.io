import type { Component } from "solid-js";

interface ThermometerProps {
    temperature: () => number;
}

export const Thermometer: Component<ThermometerProps> = ({ temperature }) => {
    return <>
    <rect x="79.787" y={319.6 - temperature() * 2.25} width="14" height={temperature() * 2.25 + 10} fill="#FF5151" stroke-width={1} stroke="#000000" />
    <rect x="80.287" y="328" width="13" height="2" fill="#FF5151" />
</>
}