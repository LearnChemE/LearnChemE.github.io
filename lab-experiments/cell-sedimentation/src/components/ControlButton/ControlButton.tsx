import type { Accessor, Component } from "solid-js"
import "./ControlButton.css"

interface ControlButtonProps {
    icon: string,
    label: string,
    top: number,
    active?: Accessor<boolean>,
    onClick: () => void
}

export const ControlButton: Component<ControlButtonProps> = ({ icon, label, onClick, top, active }) => {
    if (!active) active = () => false;
    return (
        <button class={active()? "control-button active" : "control-button"} style={`top: ${top}px`} onClick={onClick} title={label}>
            <i class={icon} />
        </button>
    )
}