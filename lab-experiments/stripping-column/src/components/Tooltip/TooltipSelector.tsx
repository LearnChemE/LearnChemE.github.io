import { type Component, createSignal, onMount, useContext, createEffect, type Accessor } from "solid-js";
import "./Tooltip.css";
import { ColumnContext, feedPPM, gasPPM, resolveProperty } from "../../globals/";

interface TooltipSelectorProps {
    x: number;
    y: number | Accessor<number>;
    ppm?: number | Accessor<number>;
    stage?: number;
    stream?: "liquid" | "vapor";
    label?: string;
    override?: Accessor<string>;
    anchor: SVGGElement;
    width?: number;
    fixed?: number;
}

export const SVGTooltip: Component<TooltipSelectorProps> = ({ x, y, anchor, ppm, stage, stream, label, override, width, fixed }) => {
    let initPPM = (stream === "liquid") ? feedPPM() :
        (stream === "vapor") ? gasPPM() : 0;
    const [showing, setShowing] = createSignal<boolean>(false);
    const [dispPPM, setDispPPM] = createSignal<number>(initPPM);
    const colCtx = useContext(ColumnContext)!;
    if (fixed === undefined) fixed = 2;
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
        if (typeof ppm === "function") {
            createEffect(() => setDispPPM(ppm()));
        }
        else {
            setDispPPM(ppm);
        }
    }
    else if (!override) {
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
            <rect x="0" y="0" rx={4} width={width ?? 100} height={40} fill="rgba(0, 0, 0, 0.8)"/>
            <text x={0} y={0} font-family="Arial" font-size="14" fill="white">
                <tspan x={5} dy="1.2em">{label}:</tspan>
                <tspan x={override ? 8 : 24} dy="1.2em">{override ? override() : `${dispPPM().toFixed(fixed)} PPM`}</tspan>
            </text>
            <polygon></polygon>
        </g>
    );
}
