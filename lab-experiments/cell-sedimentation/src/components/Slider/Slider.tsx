import { type Accessor } from 'solid-js';
import './Slider.css';

export type SliderProps = {
  value: Accessor<number>;
  setValue?: (v: number) => void;
  min?: number;
  max?: number | Accessor<number>;
  step?: number;
  label?: string;
  fixed?: number;
  id?: string;
  unit?: string;
  class?: string;
  softMax?: number | Accessor<number>;
};

export function Slider(props: SliderProps) {

  const min = props.min ?? 0;
  const max: () => number = (props.max === undefined) ? () => 100 : 
    typeof props.max === "number" ? () => props.max as number :
    props.max;
  const softmax: () => number = (props.softMax === undefined) ? max : 
    typeof props.softMax === "number" ? () => (props.softMax as number) :
    props.softMax;
  const step = props.step ?? 1;
  const id = props.id ?? `slider-${Math.random().toString(36).slice(2, 9)}`;
  const fixed = props.fixed ?? 1;

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let v = target.valueAsNumber ?? Number(target.value);
    if (v > softmax()) {
      v = softmax();
      target.value = `${softmax()}`;
    }
    if (typeof props.setValue === 'function') props.setValue(v);
  };

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
          max={max()}
          step={step}
          value={props.value()}
          onInput={handleInput}
          style={{
            "--primary-gradient-interpolant": `${props.value() / max() * 100}%`,
            "--secondary-gradient-interpolant": `${softmax() / max() * 100}%`
          }}
        />
        <div class="slider-value">
            {props.value().toFixed(fixed)}
        </div>
        {props.unit && <span class="slider-unit">{props.unit}</span>}
      </div>
    </div>
  );
}
