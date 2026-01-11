import { createMemo, createSignal, Show, type Accessor, type Component, type Setter } from "solid-js";
import "./ConcSelector.css";
import { RadioButtons } from "../RadioButtons/RadioButtons";
import { Slider } from "../Slider/Slider";
import type { InitConc } from "../../types/globals";

export type ConcSelectorProps = {
    showing: Accessor<boolean>;
    ics: Accessor<Array<InitConc>>;
    setIcs: Setter<Array<InitConc>>;
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

    const ic = createMemo(() => {
        const ics = props.ics();
        const idx = selected();
        return ics[idx];
    });

    const setRed = (xr: number) => {
        const ics = props.ics();
        const idx = selected();
        ics[idx].xr0 = xr;
        props.setIcs(ics);
    }

    const setWhite = (xw: number) => {
        const ics = props.ics();
        const idx = selected();
        ics[idx].xw0 = xw;
        props.setIcs(ics);
    }
        
    return (
        <Show when={props.showing()}>
            <div class="cmenu">
                vial:
                <RadioButtons selections={vialSelectors} onSelect={(_, idx) => setSelected(idx)} />
                <Slider value={ic().xr0} setValue={setRed}   min={0} max={1} step={.05} label="red cell volume fraction" />
                <Slider value={ic().xw0} setValue={setWhite} min={0} max={1} step={.05} label="white cell volume fraction" />
            </div>
        </Show>
    );
}

// export type SliderProps = {
//   value?: Accessor<number> | number;
//   setValue?: (v: number) => void;
//   onChange?: (v: number) => void;
//   min?: number;
//   max?: number;
//   step?: number;
//   label?: string;
//   id?: string;
//   unit?: string;
//   class?: string;
// };