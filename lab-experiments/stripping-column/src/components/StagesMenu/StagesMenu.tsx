import { Match, Switch, type Component } from "solid-js"
import { Slider } from "../Slider/Slider"
import { numberOfStages, setFeedPPM, setGasPPM, setNumberOfStages, setStageEfficieny, stageEfficiency } from "../../globals/signals"
import "./StagesMenu.css"
import { ABS_LINK, FEED_PPM_ABS, FEED_PPM_STR, GAS_PPM_ABS, GAS_PPM_STR, MAX_STAGES_MEB, MEB_LINK, MIN_EFFICIENCY, MIN_STAGES_MEB, SIM_MODE, STR_LINK } from "../../globals/config";
import { RadioButtons } from "../RadioButtons/RadioButtons";

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

        {/* Contents change with mode */}
        <Switch>
            <Match when={SIM_MODE === "stripping"}>
                <span class="menu-msg">This is the stripping efficiency version of the simulation. Also available are <a href={ABS_LINK}>absorption efficiency</a> and <a href={MEB_LINK}>material and energy balances</a> versions of this simulation.</span>
                <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} label="number of stages" fixed={0} />
                <Slider value={() => stageEfficiency() * 100} setValue={percent => setStageEfficieny(percent / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/>
            </Match>
            <Match when={SIM_MODE === "absorption"}>
                <span class="menu-msg">This is the absorption efficiency version of the simulation. Also available are <a href={STR_LINK}>stripping efficiency</a> and <a href={MEB_LINK}>material and energy balances</a> versions of this simulation.</span>
                <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} label="number of stages" fixed={0} />
                <Slider value={() => stageEfficiency() * 100} setValue={percent => setStageEfficieny(percent / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/>
            </Match>
            <Match when={SIM_MODE === "meb"}>
                <span class="menu-msg">This is the material and energy balances version of the simulation. Also available are <a href={STR_LINK}>stripping efficiency</a> and <a href={ABS_LINK}>absorption efficiency</a> versions of this simulation.</span>
                <div>column mode:</div>
                <RadioButtons selections={["stripping", "absorption"]} onSelect={mode => {
                    if (mode === "stripping") {
                        setFeedPPM(FEED_PPM_STR);
                        setGasPPM(GAS_PPM_STR);
                    }
                    else {
                        setFeedPPM(FEED_PPM_ABS);
                        setGasPPM(GAS_PPM_ABS);
                    }
                }} />
                <Slider value={numberOfStages} setValue={setNumberOfStages} min={MIN_STAGES_MEB} max={MAX_STAGES_MEB} step={1} label="number of stages" fixed={0} />
            </Match>
        </Switch>

        <div class="confirm-wrapper">
            <button type="button" class="confirm-btn" onClick={props.onClose}>confirm</button>
        </div>
    </div>
}