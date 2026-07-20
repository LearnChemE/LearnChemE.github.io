import { createEffect, createSignal, For, type JSX } from "solid-js";
import "./SelectList.css";

interface ListItem {
    key: string;
    label: string;
};

type SelectListProps<T extends ListItem> = {
    key: string;
    label: string;
    options: Array<T>;
    default?: T;
};

export const SelectList = <T extends ListItem>(props: SelectListProps<T>) => {
    const def = props.default ?? props.options[0];
    const [selected, setSelected] = createSignal<T>(def);

    createEffect(() => console.log(selected().label))

    const select: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = (e) => {
        const val = e.currentTarget.value;
        const parent = props.options.find(entry => entry.key === val);
        if (!parent) return;
        setSelected((_prev) => parent as T);
    }

    return (<>
<div class="select-container">
    <label for={props.key}>{props.label}</label>
    <select id={props.key}
        onChange={select}
        value={selected().key}>
        <For each={props.options}>
            {entry => <option value={entry.key}>{entry.label}</option>}
        </For>
    </select>
</div>
    </>);
}