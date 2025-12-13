import { type Component, type Accessor, createSignal, onMount, type Setter, Show, createMemo } from "solid-js";
import "./Tooltip.css";
import { constrain } from "../../ts/helpers";
import type { InitConc } from "../../types/globals";

interface TooltipSelectorProps {
    showing: Accessor<boolean>;
    ics: Accessor<Array<InitConc>>;
    setIcs: Setter<Array<InitConc>>;
}

type ConcsType = {
    red: number;
    white: number;
};

export const TooltipSelector: Component<TooltipSelectorProps> = ({ showing, ics }) => {
    const [selected, setSelected] = createSignal<number | null>(null);
    // Use mouse coordinate 
    const concs = createMemo<ConcsType | -1>(() => {
        if (selected() === null) return -1;
        else {
            const idx = 4 - selected()!;
            return {
                red: ics()[idx].xr0 * 100,
                white: ics()[idx].xw0 * 100
            };
        }
    });

    const followMouse = (evt: MouseEvent | Touch) => {
        // Set new coordinates for the magnifier
        const bds = document.getElementById("main-cnv")!.getBoundingClientRect();
        // X
        const vialWidth = .086;
        const lBd = .328 - vialWidth / 2;
        const x_cnv = (evt.clientX - bds.x) / bds.width;
        // Determine vial
        const vial = (x_cnv > lBd && x_cnv < lBd + vialWidth * 5) ? constrain(Math.floor((x_cnv - lBd) / vialWidth), 0, 4) : null;

        // // Calculate new coords
        // const newCoord = {
        //     x: 32.8 + vial * vialWidth * 100, 
        // };
        
        if (vial === null) setSelected(null);
        else
            setSelected(vial);
    }

    onMount(() => {
        window.addEventListener("pointermove", followMouse);
    });

    return (
        <Show when={showing() && (selected() !== null)}>
            <div class="tooltip" style={`left: ${32.8 + (selected()! * 8.6)}%; opacity: 1`}>
                vial {selected()! + 1} volume %:
                <br />
                {`${(concs() as ConcsType).red.toFixed(0)}% red cells`}
                <br />
                {`${(concs() as ConcsType).white.toFixed(0)}% white cells`}
            </div>
        </Show>
    );
}
