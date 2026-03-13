import { type Component, createSignal, onMount, useContext, createEffect, type Accessor } from "solid-js";
import "./Tooltip.css";
import { ColumnContext, resolveProperty } from "../../globals/";

interface TooltipSelectorProps {
    x: number;
    y: number | Accessor<number>;
    ppm?: number;
    stage?: number;
    stream?: "liquid" | "vapor";
    label?: string;
    anchor: SVGGElement;
}

export const SVGTooltip: Component<TooltipSelectorProps> = ({ x, y, anchor, ppm, stage, stream, label }) => {
    const [showing, setShowing] = createSignal<boolean>(false);
    const [dispPPM, setDispPPM] = createSignal<number>(0);
    const colCtx = useContext(ColumnContext)!;
    y = resolveProperty(y, 0);


    onMount(() => {
        if (!anchor) throw new Error("Anchor ref undefined");
        anchor.addEventListener("pointerenter", () => setShowing(true));
        anchor.addEventListener("pointerleave", () => setShowing(false));
    });

    if (stage !== undefined) {
        if (!stream) throw new Error("Stream must be provided when stage is a number");
        createEffect(() => {
            if (showing() && colCtx.columnCreated()) {
                colCtx.column!.updated();
                const newPPM = colCtx.column!.viewPPM(stage, stream);
                setDispPPM(newPPM);
            }
        }); 
    }
    else if (ppm !== undefined) {
        setDispPPM(ppm);
    }
    else {
        throw new Error("Must specify either stage to track or PPM value for tooltip hint");
    }

    if (stream) {
        label = (stream === "liquid") ? "liquid phase" : "vapor phase";
    }
    else if (!label) {
        throw new Error("Tooltip must have a label if stream is not provided");
    }

    return (
        <g class="tooltip" transform={`translate(${x} ${y()})`} style={`opacity: ${showing() ? 1 : 0}`}>
            <rect x="0" y="0" rx={4} width={150} height={74} fill="rgba(0, 0, 0, 0.8)"/>
            <text x={0} y={0} font-family="Arial" font-size="14" fill="white">
                <tspan x={5} dy="1.2em">{label}:</tspan>
                <tspan x={24} dy="1.2em">{dispPPM().toFixed(1)} PPM</tspan>
            </text>
            <polygon></polygon>
        </g>
    );
}
