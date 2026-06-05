import type { Component } from "solid-js";


export const Label: Component<{ x: number; y: number; text: string }> = ({ x, y, text }) => {
    return (
        <text
            x={x}
            y={y}
            fill="black"
            font-family="Arial, sans-serif"
            font-size="24"
        >
            {text}
        </text>
    );
};