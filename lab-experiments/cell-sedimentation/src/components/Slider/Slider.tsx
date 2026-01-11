import type { Accessor } from 'solid-js';
import './Slider.css';

export type SliderProps = {
  value?: Accessor<number> | number;
  setValue?: (v: number) => void;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  id?: string;
  unit?: string;
  class?: string;
};

export function Slider(props: SliderProps) {
  const read = (): number =>
    typeof props.value === 'function' ? (props.value as Accessor<number>)() : (props.value ?? 0);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const v = target.valueAsNumber ?? Number(target.value);
    if (typeof props.setValue === 'function') props.setValue(v);
    else if (typeof props.onChange === 'function') props.onChange(v);
  };

  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const id = props.id ?? `slider-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div class={`slider ${props.class ?? ''}`}>
      {props.label && (
        <label for={id} class="slider-label">
          {props.label}
        </label>
      )}
      <div class="slider-row">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={read()}
          onInput={handleInput}
        />
        <input
          type="number"
          class="slider-number"
          min={min}
          max={max}
          step={step}
          value={read()}
          onInput={handleInput}
        />
        {props.unit && <span class="slider-unit">{props.unit}</span>}
      </div>
    </div>
  );
}
