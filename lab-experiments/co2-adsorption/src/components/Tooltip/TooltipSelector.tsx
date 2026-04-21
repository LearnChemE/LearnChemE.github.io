import { type Component, type Accessor, createSignal, onMount } from "solid-js";
import "./Tooltip.css";
import { resolveProperty } from "../../globals";

interface TooltipSelectorProps {
    x: number | Accessor<number>;
    y: number | Accessor<number>;
    label?: string | Accessor<string>;
    anchor: SVGGElement;
    width?: number;
    height?: number;
}

export const SVGTooltip: Component<TooltipSelectorProps> = (props) => {
    const [showing, setShowing] = createSignal<boolean>(false);
    const label = resolveProperty(props.label, "lorem ipsum");
    const x = resolveProperty(props.x);
    const y = resolveProperty(props.y);

    onMount(() => {
        if (!props.anchor) throw new Error("Anchor ref undefined");
        props.anchor.addEventListener("pointerenter", () => setShowing(true));
        props.anchor.addEventListener("pointerleave", () => setShowing(false));
    });

    return (
        <g class="tooltip" transform={`translate(${x()} ${y()})`} style={`opacity: ${showing() ? 1 : 0}`}>
            <rect x="0" y="0" rx={4} width={props.width ?? 100} height={props.height ??40} fill="rgba(0, 0, 0, 0.8)"/>
            <text x={0} y={0} font-family="Arial" font-size="14" fill="white">
                <tspan x={5} dy="1.2em">{label()}</tspan>
            </text>
            <polygon></polygon>
        </g>
    );
}
