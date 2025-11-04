import { createEffect, createSignal, onMount, type Accessor, type Component } from "solid-js";
import "./Magnifier.css"
import MagnifierCanvas from "./MagnifierCanvas";

interface MagnifierProps {
    magnifying: Accessor<boolean>
}

export const Magnifier: Component<MagnifierProps> = ({ magnifying }) => {
    const [coord, setCoord] = createSignal({ x: 0, y: 0 });

    const followMouse = (evt: MouseEvent | Touch) => {
        const bds = document.getElementById("root")!.getBoundingClientRect();
        const newCoord = { x: evt.clientX - bds.x, y: evt.clientY - bds.y };
        setCoord(newCoord);
    }

    createEffect(() => {
        if (magnifying()) window.addEventListener("pointermove", followMouse);
        else window.removeEventListener("pointermove", followMouse);
    });

    return (<>
        { magnifying() && <div class="lens" style={`left: ${coord().x}px; top: ${coord().y}px`}>
            <MagnifierCanvas />
        </div> }
    </>);
}