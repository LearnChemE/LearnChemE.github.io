import { createEffect, createMemo, createSignal, type Component } from "solid-js";
import "./Slider.css";

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    initValue: number;
    label?: string;
    units?: string;
    decimalPlaces?: number;
    onChange: (value: number) => void;
    disabled?: () => boolean;
}

export const Slider: Component<SliderProps> = ({ min, max, step, initValue, label, units, decimalPlaces, onChange, disabled }) => {
    const [val, setVal] = createSignal(initValue);

    const valLabel = createMemo(() => {
        if (decimalPlaces !== undefined) {
            return val().toFixed(decimalPlaces);
        }
        return val().toString();
    });

    createEffect(() => {
        onChange(val());
    });

    if (!disabled) disabled = () => false;

    return (
        <div class="slider-container">
            <div class={"slider-label" + disabled() ? " disabled aria-disabled" : ""}>{label}</div>
            <input
            type="range"
            class="slider"
            min={min}
            max={max}
            step={step}
            value={val()}
            onInput={(e) => setVal(parseFloat(e.currentTarget.value))}
            style={{ width: '100%' }}
            />
            <div class="slider-value">{`${valLabel()} ${units}`}</div>
        </div>
  );
};