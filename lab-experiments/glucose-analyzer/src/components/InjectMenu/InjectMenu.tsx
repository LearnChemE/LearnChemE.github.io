import { createEffect, createSignal, Show, useContext, type Component } from "solid-js"
import "./InjectMenu.css";
import { SelectList } from "../SelectList/SelectList";
import { Fluids } from "../../globals";
import { RxrContext } from "../Context";
import { Slider } from "../Slider/Slider";

interface InjectMenuProps {
    key: string;
    onInject: () => void;
    
};

export const InjectMenu: Component<InjectMenuProps> = (props: InjectMenuProps) => {
    // Ensure signals are never undefined by falling back to the first Fluid option
    const [topSelected, setTopSelected] = createSignal(Fluids.find(dye => dye.key === "y-dye")!);
    const [botSelected, setBotSelected] = createSignal(Fluids.find(dye => dye.key === "b-dye")!);
    const [topConc, setTopConc] = createSignal(1);
    const [botConc, setBotConc] = createSignal(1);

    const ctx = useContext(RxrContext)!;

    createEffect(() => {
        const topFluid = topSelected();
        const topFluidContains = topFluid.contains;
        if (topFluid.showSlider) {
            topFluidContains.conc = topConc();
        }

        ctx.topFluid[1](topFluidContains);
    });
    createEffect(() => {
        const botFluid = botSelected();
        const botFluidContains = botFluid.contains;
        if (botFluid.showSlider) {
            botFluidContains.conc = botConc();
        }

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
            <Show when={topSelected().showSlider}>
                <Slider value={topConc} setValue={setTopConc} min={0.05} max={3} step={0.05} label="sample concentration:" unit=" mM" fixed={2} />
            </Show>
            <span>amount to inject: 2.5 mL</span>
            <SelectList key={`${props.key}-select`} label="bottom fluid:" options={Fluids} selected={botSelected} setSelected={setBotSelected} />
            <span>amount to inject: 2.5 mL</span>
            <Show when={botSelected().showSlider}>
                <Slider value={botConc} setValue={setBotConc} min={0.05} max={3} step={0.05} label="sample concentration:" unit=" mM" />
            </Show>

            <div class="confirm-wrapper">
                <button type="button" class="confirm-btn" onClick={props.onInject}>inject</button>
            </div>
        </div>
    </div>
}