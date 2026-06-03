import { Show, type Component } from "solid-js"
import { Slider } from "../Slider/Slider"
import { numberOfStages, setNumberOfStages, setStageEfficieny, stageEfficiency } from "../../globals"
import "./StagesMenu.css"
import { MAX_STAGES, MEB_MODE, MIN_EFFICIENCY, MIN_STAGES } from "../../ts/config";

interface StagesMenuProps {
    onClose: () => void;
};

export const StagesMenu: Component<StagesMenuProps> = (props: StagesMenuProps) => {
    return <div class="stages-menu">
        <div class="menu-header">
            <span style="margin-top: 10px;">column internals</span>
        </div>
        <hr/>
        <span class="close-btn" style="top: 0px;" onClick={props.onClose}>&times;</span>
        
        <Show when={MEB_MODE}>
            <span class="meb-msg">This is the material and energy balances version of the simulation. The full version including separation efficiency can be found <a href="http://learncheme.github.io/lab-experiments/liquid-liquid-extraction/dist">here</a>.</span>
        </Show>

        <Slider value={numberOfStages} setValue={setNumberOfStages} min={MIN_STAGES} max={MAX_STAGES} step={1} label="number of stages" fixed={0} />
        
        <Show when={!MEB_MODE}>
            <Slider value={() => stageEfficiency() * 100} setValue={val => setStageEfficieny(val / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/>
        </Show>

        <div class="confirm-wrapper">
            <button type="button" class="confirm-btn" onClick={props.onClose}>confirm</button>
        </div>
    </div>
}