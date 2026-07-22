import { createEffect, createSignal, useContext, type Component } from "solid-js"
import "./InjectMenu.css";
import { SelectList } from "../SelectList/SelectList";
import { Fluids } from "../../globals";
import { RxrContext } from "../Context";

interface InjectMenuProps {
    key: string;
    onInject: () => void;
    
};

export const InjectMenu: Component<InjectMenuProps> = (props: InjectMenuProps) => {
    // Ensure signals are never undefined by falling back to the first Fluid option
    const [topSelected, setTopSelected] = createSignal(Fluids.find(dye => dye.key === "y-dye")!);
    const [botSelected, setBotSelected] = createSignal(Fluids.find(dye => dye.key === "b-dye")!);
    const ctx = useContext(RxrContext)!;

    createEffect(() => {
        const topFluidContains = topSelected().contains;
        ctx.topFluid[1](topFluidContains);
    });
    createEffect(() => {
        const botFluidContains = botSelected().contains;
        ctx.botFluid[1](botFluidContains);
    });

    return <div class="inject-menu" style={`top: ${50}%;`}>
        <div class="inj-menu-content">
            {/* <div class="menu-header">
                <span style="margin-top: 10px;">inject liquid</span>
            </div> */}
            {/* <hr/> */}
            
            {/* <span class="close-btn" style="top: 0px;" onClick={props.onClose}>&times;</span> */}
            {/* Main Contents */}
            {/* <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} label="number of stages" fixed={0} />
            <Slider value={() => stageEfficiency() * 100} setValue={percent => setStageEfficieny(percent / 100)} min={MIN_EFFICIENCY} max={100} step={1} label="stage efficiency" fixed={0} unit="%"/> */}
            
            <SelectList key={`${props.key}-select`} label="top fluid:" options={Fluids} selected={topSelected} setSelected={setTopSelected} />
            <SelectList key={`${props.key}-select`} label="bottom fluid:" options={Fluids} selected={botSelected} setSelected={setBotSelected} />
            
            <span>amount to inject: 2.5 mL</span>
            <div class="confirm-wrapper">
                <button type="button" class="confirm-btn" onClick={props.onInject}>inject</button>
            </div>
        </div>
    </div>
}