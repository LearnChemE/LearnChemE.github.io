import { type Component } from "solid-js"
import "./InjectMenu.css";
import { SelectList } from "../SelectList/SelectList";
import { dyeLookup, Fluids } from "../../globals";

interface InjectMenuProps {
    key: string;
    onInject: () => void;
    top: number;
};

export const InjectMenu: Component<InjectMenuProps> = (props: InjectMenuProps) => {
    return <div class="inject-menu" style={`top: ${props.top}%;`}>
        <div class="inj-menu-content">
            {/* <div class="menu-header">
                <span style="margin-top: 10px;">inject liquid</span>
            </div> */}
            {/* <hr/> */}
            
            {/* <span class="close-btn" style="top: 0px;" onClick={props.onClose}>&times;</span> */}
            {/* Main Contents */}
            {/* <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} label="number of stages" fixed={0} />
            <Slider value={() => stageEfficiency() * 100} setValue={percent => setStageEfficieny(percent / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/> */}
            
            <SelectList key={`${props.key}-select`} label="top fluid:" options={Fluids} />
            <SelectList key={`${props.key}-select`} label="bottom fluid:" options={Fluids} default={Fluids.find(dye => dye.key === "b-dye")} />
            
            <span>amount to inject: 2.5 mL</span>
            <div class="confirm-wrapper">
                <button type="button" class="confirm-btn" onClick={props.onInject}>inject</button>
            </div>
        </div>
    </div>
}