import { createEffect, createSignal, type Component } from "solid-js";

interface LabelProps {
    /** text may include newline characters ('\n') or be a function returning such a string */
    text: string | (() => string);
    x: number;
    y: number;
    /** CSS-like font size, e.g. '14px' or a numeric string; used for font-size and to compute line spacing */
    fontSize?: string;
    /** optional line-height multiplier (1.0 = font size, 1.2 = 20% extra) */
    lineHeight?: number;
    /** if true, horizontally center the text at x (text-anchor='middle') */
    center?: boolean;
}

export const Label: Component<LabelProps> = ({ text, x, y, fontSize = "14px", lineHeight = 1.2, center = false }) => {
    const textFn = (typeof text === "function") ? text : () => text;
    const [lines, setLines] = createSignal([textFn()]);

    // split on CRLF or LF so external strings with newlines are supported
    createEffect(() => {
        const raw = textFn() ?? "";
        const newlines = raw.split(/\r?\n/);
        setLines(newlines);
    });

    // derive a numeric px value from the fontSize if possible (e.g. '14px' -> 14)
    let fontSizePx = parseFloat(String(fontSize));
    if (Number.isNaN(fontSizePx) || fontSizePx <= 0) fontSizePx = 14;
    const lineDy = `${fontSizePx * lineHeight}px`;

    return (
        <g>
            <text
                class="label"
                x={x}
                y={y}
                fill="black"
                font-family="Arial, sans-serif"
                font-size={fontSize}
                text-anchor={center ? "middle" : "start"}
            >
                {lines().map((line, i) => (
                    // first line should sit at the provided y; subsequent lines shift by dy
                    <tspan x={x} dy={i === 0 ? "0" : lineDy}>{line}</tspan>
                ))}
            </text>
        </g>
    );
}