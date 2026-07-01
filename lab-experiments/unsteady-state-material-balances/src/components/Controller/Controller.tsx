import { createMemo, type Accessor, type Component, type Setter } from "solid-js";
import { constrain, repeatClick } from "../../globals";
import "./Controller.css";

type ControllerProps = {
    x: number;
    y: number;
    sp: Accessor<number>;
    setSP: Setter<number>;
    step: number;
    range: [min: number, max: number];
};

export const Controller: Component<ControllerProps> = (props) => {
    const [min, max] = props.range;

    const text = createMemo(() => {
        const gsp = props.sp();
        return `${gsp.toFixed(1)}`;
    });

    const increment = () => {
        let gsp = props.sp();
        gsp += props.step;
        props.setSP(constrain(gsp, min, max));
    }

    const decrement = () => {
        let gsp = props.sp();
        gsp -= props.step;
        props.setSP(constrain(gsp, min, max));
    }

    return (<g transform={`translate(${props.x}, ${props.y})`}>

<rect x="0.5" y="0.5" width="49" height="19" rx="1.5" fill="#141414" stroke="black"/>


<g class="drag-exempt clickable" onpointerdown={() => repeatClick(decrement)}>
<rect x="26.5" y="21.5" width="22" height="17" rx="0.5" fill="#D51F1F" stroke="black"/>
<path d="M37.7018 33.2734C37.5087 33.6032 37.0327 33.6032 36.8395 33.2734L33.3132 27.2529C33.118 26.9196 33.3585 26.5 33.7448 26.5H40.7975C41.1836 26.5003 41.4234 26.9197 41.2282 27.2529L37.7018 33.2734Z" fill="#590F0F" stroke="#310000"/>
</g>

<g class="drag-exempt clickable" onpointerdown={() => repeatClick(increment)}>
<rect x="1.5" y="21.5" width="22" height="17" rx="0.5" fill="#D51F1F" stroke="black"/>
<path d="M12.0732 26.6572C12.2682 26.3382 12.7318 26.3382 12.9268 26.6572L16.6436 32.7393C16.8472 33.0724 16.6073 33.5 16.2168 33.5H8.7832C8.39274 33.5 8.15284 33.0724 8.35645 32.7393L12.0732 26.6572Z" fill="#590F0F" stroke="#310000"/>
</g>

<g id="display">
    <text
        id="gmVal"
        class="digital-label"
        x="46"
        y="10.5"
        dominant-baseline="middle"
        text-anchor="end"
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="20"
    >
        {text()}
    </text>
</g>
    </g>)
}
