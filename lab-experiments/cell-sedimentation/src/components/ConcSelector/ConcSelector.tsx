import { createEffect, createMemo, createSignal, Show, type Accessor, type Component, type Setter } from "solid-js";
import "./ConcSelector.css";
import { RadioButtons } from "../RadioButtons/RadioButtons";
import { Slider } from "../Slider/Slider";
import type { InitConc } from "../../types/globals";

export type ConcSelectorProps = {
    showing: Accessor<boolean>;
    ics: Accessor<Array<InitConc>>;
    setIcs: Setter<Array<InitConc>>;
    resetMessage?: Accessor<boolean>;
};

const vialSelectors = [
    "1",
    "2",
    "3",
    "4",
    "5"
];

export const ConcSelector: Component<ConcSelectorProps> = (props) => {
    const [selected, setSelected] = createSignal(0);
    const [showMsg, setShowMsg] = createSignal(false);

    const ic = createMemo(() => {
        const ics = props.ics();
        const idx = selected();
        return ics[idx];
    });

    const setRed = (xr: number) => {
        const ics = props.ics();
        const idx = selected();
        props.setIcs([...ics.slice(0, idx), { ...ics[idx], xr0: xr }, ...ics.slice(idx + 1)]);
        setShowMsg(true);
    }


    const setWhite = (xw: number) => {
        const ics = props.ics();
        const idx = selected();
        props.setIcs([...ics.slice(0, idx), { ...ics[idx], xw0: xw }, ...ics.slice(idx + 1)]);
        setShowMsg(true);
    }

    const redVal = createMemo(() => ic().xr0);
    const whtVal = createMemo(() => ic().xw0);

    if (props.resetMessage) createEffect(() => {
        props.resetMessage!();
        setShowMsg(false);
    });
        
    return (
        <Show when={props.showing()}>
            <div class="cmenu">
                vial:
                <RadioButtons selections={vialSelectors} onSelect={(_, idx) => setSelected(4 - idx)} />
                <Slider value={redVal} setValue={setRed}   min={0} max={1 - whtVal()} step={.05} fixed={2} label="red cell volume fraction" />
                <Slider value={whtVal} setValue={setWhite} min={0} max={1 - redVal()} step={.05} fixed={2} label="white cell volume fraction" />
                <Show when={showMsg()}>
                    <div class="cmenu-msg">
                        hit reset button to see new concentrations
                    </div>
                </Show>
            </div>
        </Show>
    );
}
