import type { Accessor, Component } from "solid-js"
import "./ControlButton.css"

interface ControlButtonProps {
    icon: string | (() => string),
    label: string,
    top: number,
    active?: Accessor<boolean>,
    onClick: () => void
    disabled?: Accessor<boolean>;
}

export const ControlButton: Component<ControlButtonProps> = ({ icon, label, onClick, top, active, disabled }) => {
    if (!active) active = () => false;
    if (!disabled) disabled = () => false;
    
    return (<>
            {disabled() ? (
            <button class="control-button disabled" style={`top: ${top}px`} title={label} disabled>
                <i class={typeof icon === "function" ? icon() : icon} />
            </button>
            ) : (
            <button class={active() ? "control-button active" : "control-button"} style={`top: ${top}px`} onClick={() => { onClick(); }} title={label}>
                <i class={typeof icon === "function" ? icon() : icon} />
            </button> 
        )}  
    </>);
}