import type { Accessor, Component } from "solid-js"
import "./ControlButton.css"
import { resolveProperty } from "../../globals";

interface ControlButtonProps {
    icon: string | (() => string),
    label: string | (() => string),
    top?: number | Accessor<number>,
    left?: number | Accessor<number>,
    active?: Accessor<boolean>,
    activeColor?: string | Accessor<string>,
    onClick: () => void
    disabled?: Accessor<boolean>;
}

export const ControlButton: Component<ControlButtonProps> = (props: ControlButtonProps) => {
    const active = resolveProperty(props.active, false);
    const disabled = resolveProperty(props.disabled, false);
    const top = resolveProperty(props.top, 25);
    const left = resolveProperty(props.left, 25);
    const label = resolveProperty(props.label);
    const icon = resolveProperty(props.icon);
    const activeColor = resolveProperty(props.activeColor, "#3498db");

    return (<>
            {disabled() ? (
            <button class="control-button disabled" style={`top: ${top}px; left: ${left}px`} title={label()} disabled>
                <i class={typeof icon === "function" ? icon() : icon} />
            </button>
            ) : (
            <button 
                class={active() ? "control-button active" : "control-button"} 
                style={`top: ${top()}px; left: ${left()}px; background-color: ${activeColor()};`} 
                onClick={() => { props.onClick(); }} 
                title={label()}
                >
                <i class={typeof icon === "function" ? icon() : icon} />
            </button> 
        )}  
    </>);
}