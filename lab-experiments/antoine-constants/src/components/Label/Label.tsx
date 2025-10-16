import type { Component } from "solid-js";

interface LabelProps {
    text: string;
    x: number;
    y: number;
    fontSize?: string;
}

export const Label: Component<LabelProps> = ({ text, x, y, fontSize }) => {
    return (
        <g>
        <text
            class="label"
            x={x}
            y={y}
            fill="black"
            font-family="Arial, sans-serif"
            font-size={fontSize ? fontSize : "14px"}
        >
            {text}
        </text>
        </g>
    );
}