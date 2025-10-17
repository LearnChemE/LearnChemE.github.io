import type { Component } from "solid-js";
import "./Button.css"

interface ButtonProps {
    coords?: { x: number, y: number };
    label: string;
    color?: string;
    textColor?: string;
    onClick: () => void;
    disabled?: () => boolean;
}

export const Button: Component<ButtonProps> = ({ coords, label, onClick, color, textColor, disabled }) => {
    const position = coords ? "absolute" : undefined;

    if (!disabled) disabled = () => false;

    return (
    <button 
        type="button" 
        class={"btn" + (disabled() ? " disabled aria-disabled" : "")} 
        onclick={onClick}
        style={{ 
            position: position,
            background: color ? color : '#388ae7ff', 
            color: textColor ? textColor : 'white',
            right: coords ? `${coords.x}px` : undefined,
            bottom: coords ? `${coords.y}px` : undefined,
        }}
        border-radius="5.5"
        >
        {label}
    </button>
  );
}