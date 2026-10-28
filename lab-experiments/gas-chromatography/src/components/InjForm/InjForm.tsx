import type { Accessor, Component } from "solid-js";
import { Slider } from "../Slider/Slider";
import "./InjForm.css";

type InjFormProps = {
    prepBtnDisabled: Accessor<boolean>;
    startPrepping: () => void;
};

export const InjForm: Component<InjFormProps> = (props) => {
    return (<>
      <div class="inj-form">
        <h5>sample settings</h5>
        <Slider value={() => 1} label='option 1' />
        <Slider value={() => 2} label='option 2' />
        <button class="prep-btn" disabled={props.prepBtnDisabled()} onclick={props.startPrepping}>prepare sample</button>
      </div>
    </>);
}