import { createEffect, createMemo, createSignal, type Component } from "solid-js";
import "./Slider.css";

interface SliderProps {
    min: number | (() => number);
    max: number | (() => number);
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
    const minFn = (typeof min === "function") ? min : () => min;
    const maxFn = (typeof max === "function") ? max : () => max;

    createEffect(() => {
        const min = minFn();
        const max = maxFn();
        if (val() < min) setVal(minFn());
        if (val() > max) setVal(maxFn());
    })

    return (
        <div class={"slider-container" + (disabled() ? " disabled aria-disabled" : "")}>
            <div class={"slider-label"}>{label}</div>
            <input
            type="range"
            class="slider"
            min={minFn()}
            max={maxFn()}
            step={step}
            value={val()}
            onInput={(e) => setVal(parseFloat(e.currentTarget.value))}
            style={{ width: '100%' }}
            />
            <div class="slider-value">{`${valLabel()} ${units}`}</div>
        </div>
  );
};