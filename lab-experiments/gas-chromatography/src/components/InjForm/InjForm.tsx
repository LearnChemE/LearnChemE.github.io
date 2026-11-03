import { createSignal, type Accessor, type Component } from "solid-js";
import { Slider } from "../Slider/Slider";
import "./InjForm.css";
import { injConcStep, maxInjConc, minInjConc } from "../../globals";

type InjFormProps = {
    prepBtnDisabled: Accessor<boolean>;
    startPrepping: () => void;
    prepProgress: Accessor<number>;
};

export const InjForm: Component<InjFormProps> = (props) => {
    const [etOH, setEtOH] = createSignal(1);
    const [acOH, setAcOH] = createSignal(2);
    const [eaOH, setEaOH] = createSignal(1);
    const [wOH, setWOH] = createSignal(2);

    return (<>
      <div class="inj-form">
        <h5>sample settings</h5> 
        <select></select>


        <Slider value={etOH} setValue={setEtOH} min={minInjConc} max={maxInjConc} step={injConcStep} unit='M' label='ethanol concentration' />
        <Slider value={acOH} setValue={setAcOH} min={minInjConc} max={maxInjConc} step={injConcStep} unit='M' label='acetic acid concentration' />
        <Slider value={eaOH} setValue={setEaOH} min={minInjConc} max={maxInjConc} step={injConcStep} unit='M' label='ethyl acetate concentration' />
        <Slider value={wOH}  setValue={setWOH}  min={minInjConc} max={maxInjConc} step={injConcStep} unit='M' label='water concentration' />
        

        <button
          class="prep-btn"
          classList={{
            "prep-btn-complete": props.prepProgress() === 1,
          }}
          disabled={props.prepBtnDisabled() || props.prepProgress() === 1}
          onclick={props.startPrepping}
        >
          <span
            class="prep-progress-fill"
            aria-hidden="true"
            style={{ width: `${props.prepProgress() * 100}%` }}
          />
          <span class="prep-btn-label">
            {props.prepProgress() === 1
              ? "sample ready to inject"
              : props.prepProgress() > 0
                ? "prepping..."
                : "prepare sample"}
          </span>
        </button>
      </div>
    </>);
}