import { type Component, type Accessor, createSignal, onMount, createMemo } from "solid-js";
import "./Tooltip.css";

interface TooltipSelectorProps {
    x: number;
    y: number;
    before: boolean;
    comp: Accessor<Array<number>>;
    anchor: SVGGElement;
}

export const SVGTooltip: Component<TooltipSelectorProps> = ({ x, y, comp, anchor, before }) => {
    const [showing, setShowing] = createSignal<boolean>(false);

    onMount(() => {
        if (!anchor) throw new Error("Anchor ref undefined");
        anchor.addEventListener("pointerenter", () => setShowing(true));
        anchor.addEventListener("pointerleave", () => setShowing(false));
    });

    const xc = createMemo(() => {
        return 1 - comp()[0] - comp()[1];
    })

    return (
        <g class="tooltip" transform={`translate(${x} ${y})`} style={`opacity: ${showing() ? 1 : 0}`}>
            <rect x="0" y="0" rx={4} width={100} height={74} fill="rgba(0, 0, 0, 0.8)"/>
            <text x={0} y={0} font-family="Arial" font-size="14" fill="white">
                <tspan x={3} dy="1.2em">{before ? "aqueous" : "organic"} phase:</tspan>
                <tspan x={24} dy="1.2em">{comp()[0].toFixed(2)}% x</tspan>
                <tspan x={24} dy="1.2em">{comp()[1].toFixed(2)}% y</tspan>
                <tspan x={24} dy="1.2em">{xc().toFixed(2)}% z</tspan>
            </text>
            <polygon></polygon>
        </g>
    );
}
