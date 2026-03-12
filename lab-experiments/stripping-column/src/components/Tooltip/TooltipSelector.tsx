import { type Component, createSignal, onMount, useContext, createEffect, type Accessor } from "solid-js";
import "./Tooltip.css";
import { ColumnContext, type Composition } from "../../calcs";
import { resolveProperty } from "../../ts/helpers";

interface TooltipSelectorProps {
    x: number;
    y: number | Accessor<number>;
    stage: number | Composition;
    stream?: "raffinate" | "extract";
    label?: string;
    anchor: SVGGElement;
}

export const SVGTooltip: Component<TooltipSelectorProps> = ({ x, y, anchor, stage, stream, label }) => {
    const [showing, setShowing] = createSignal<boolean>(false);
    const [comp, setComp] = createSignal<[number, number, number]>([0, 0, 100]);
    const colCtx = useContext(ColumnContext)!;
    y = resolveProperty(y, 0);

    onMount(() => {
        if (!anchor) throw new Error("Anchor ref undefined");
        anchor.addEventListener("pointerenter", () => setShowing(true));
        anchor.addEventListener("pointerleave", () => setShowing(false));
    });

    if (!Array.isArray(stage)) {
        if (!stream) throw new Error("Stream must be provided when stage is a number");
        createEffect(() => {
            if (showing() && colCtx.columnCreated()) {
                colCtx.column!.updated();
                const c_aa = colCtx.column!.viewComposition(stage, stream);
                setComp([ c_aa[0] * 100, c_aa[1] * 100, (1 - c_aa[0] - c_aa[1]) * 100 ]);
            }
        }); 
    }
    else {
        setComp([ stage[0] * 100, stage[1] * 100, (1 - stage[0] - stage[1]) * 100 ]);
    }

    if (stream) {
        label = (stream === "extract") ? "aqueous phase" : "organic phase";
    }
    else if (!label) {
        throw new Error("Tooltip must have a label if stream is not provided");
    }

    return (
        <g class="tooltip" transform={`translate(${x} ${y()})`} style={`opacity: ${showing() ? 1 : 0}`}>
            <rect x="0" y="0" rx={4} width={150} height={74} fill="rgba(0, 0, 0, 0.8)"/>
            <text x={0} y={0} font-family="Arial" font-size="14" fill="white">
                <tspan x={5} dy="1.2em">{label}:</tspan>
                <tspan x={24} dy="1.2em">{comp()[0].toFixed(1)}% chloroform</tspan>
                <tspan x={24} dy="1.2em">{comp()[1].toFixed(1)}% acetic acid</tspan>
                <tspan x={24} dy="1.2em">{comp()[2].toFixed(1)}% water</tspan>
            </text>
            <polygon></polygon>
        </g>
    );
}
