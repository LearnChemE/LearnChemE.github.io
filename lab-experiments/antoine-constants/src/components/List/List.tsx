import { For, type Component } from "solid-js";
import "./SelectList.css";

interface LabelledItem { label: string; };

interface SelectListProps {
    items: LabelledItem[];
    onSelect: (item: LabelledItem) => void;
    right: number;
    bottom: number;
}

export const SelectList: Component<SelectListProps> = (props) => {
    const onChange = (e: Event) => {
        const sel = e.currentTarget as HTMLSelectElement;
        const idx = sel.selectedIndex;
        const item = props.items[idx];
        if (item) props.onSelect(item);
    };

    return (
        <select class="select-list" onChange={onChange} style={{ position: "absolute", right: `${props.right}px`, bottom: `${props.bottom}px` }}>
            <For each={props.items}>{(item) => <option>{item.label}</option>}</For>
        </select>
    );
};

export default SelectList;