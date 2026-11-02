import type { Accessor, Component } from "solid-js";
import { Slider } from "../Slider/Slider";
import "./InjForm.css";

type InjFormProps = {
    prepBtnDisabled: Accessor<boolean>;
    startPrepping: () => void;
    prepProgress: Accessor<number>;
};

export const InjForm: Component<InjFormProps> = (props) => {
    return (<>
      <div class="inj-form">
        <h5>sample settings</h5> 
        <select></select>


        <Slider value={() => 1} label='ethanol concentration' />
        <Slider value={() => 2} label='acetic acid concentration' />
        <Slider value={() => 1} label='ethyl acetate concentration' />
        <Slider value={() => 2} label='water concentration' />
        

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