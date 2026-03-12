import type { Component } from "solid-js"
import { Slider } from "../Slider/Slider"
import { numberOfStages, setNumberOfStages, setStageEfficieny, stageEfficiency } from "../../globals"
import "./StagesMenu.css"
import { MIN_EFFICIENCY } from "../../ts/config";

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
        <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} label="number of stages" fixed={0} />
        <Slider value={() => stageEfficiency() * 100} setValue={val => setStageEfficieny(val / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/>
        <div class="confirm-wrapper">
            <button type="button" class="confirm-btn" onClick={props.onClose}>confirm</button>
        </div>
    </div>
}