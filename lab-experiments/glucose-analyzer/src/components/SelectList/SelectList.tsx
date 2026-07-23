import { createEffect, For, type Accessor, type JSX, type Setter } from "solid-js";
import "./SelectList.css";

interface ListItem {
    key: string;
    label: string;
};

type SelectListProps<T extends ListItem> = {
    key: string;
    label: string;
    options: Array<T>;
    selected: Accessor<T>;
    setSelected: Setter<T>;
};

export const SelectList = <T extends ListItem>(props: SelectListProps<T>) => {
    createEffect(() => console.log(props.selected().label))

    const select: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = (e) => {
        const val = e.currentTarget.value;
        const parent = props.options.find(entry => entry.key === val);
        if (!parent) return;
        props.setSelected((_prev) => parent as T);
    }

    return (<>
<div class="select-container">
    <label for={props.key}>{props.label}</label>
    <select id={props.key}
        onChange={select}
        value={props.selected().key}>
        <For each={props.options}>
            {entry => <option value={entry.key}>{entry.label}</option>}
        </For>
    </select>
</div>
    </>);
}