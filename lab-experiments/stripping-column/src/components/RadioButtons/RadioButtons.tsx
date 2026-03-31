import { createEffect, createSignal, For, type Component } from "solid-js";
import "./RadioButtons.css";

type RadioButtonProps = {
    selections: Array<string>;
    onSelect?: (item: string, idx: number) => void;
}

export const RadioButtons: Component<RadioButtonProps> = ({ selections, onSelect }) => {
    const [selected, setSelected] = createSignal<{ item: string, idx: number }>({ item: selections[0], idx: 0 } );

    createEffect(() => {
        const { item, idx } = selected();
        onSelect?.(item, idx);
    });

    return <>
        <div class="radio-container">
            <For each={selections}>
                {(item, idx) => {
                    return <button 
                        type="button" 
                        class={`btn ${(idx() === selected().idx) ? "btn-primary" : "btn-primary-outline"}`}
                        onClick={() => setSelected({ item, idx: idx() })}
                    >
                        { item }
                    </button>
                }}
            </For>
        </div>
    </>;
}