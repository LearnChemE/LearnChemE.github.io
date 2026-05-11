import { createMemo, type Accessor, type Component, type Setter } from "solid-js";
import { constrain, repeatClick } from "../../globals";
import "./Controller.css";

type ControllerProps = {
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

    return (<g transform="translate(310, 116)">

<rect x="0.5" y="0.5" width="57" height="64" rx="1.5" fill="#888888" stroke="black"/>
<path d="M4 19.5H54C54.8284 19.5 55.5 20.1716 55.5 21V61C55.5 61.8284 54.8284 62.5 54 62.5H4C3.17157 62.5 2.5 61.8284 2.5 61V21C2.5 20.1716 3.17157 19.5 4 19.5Z" fill="#CECECE" stroke="black"/>
<rect x="4.5" y="21.5" width="49" height="19" rx="1.5" fill="#141414" stroke="black"/>

<g class="drag-exempt clickable" onpointerdown={() => repeatClick(decrement)}>
<rect x="30.5" y="42.5" width="22" height="17" rx="0.5" fill="#D51F1F" stroke="black"/>
<path d="M41.7018 54.2734C41.5087 54.6032 41.0326 54.6032 40.8395 54.2734L37.3131 48.2529C37.1179 47.9196 37.3585 47.5 37.7448 47.5H44.7975C45.1835 47.5003 45.4233 47.9197 45.2281 48.2529L41.7018 54.2734Z" fill="#590F0F" stroke="#310000"/>
</g>

<g class="drag-exempt clickable" onpointerdown={() => repeatClick(increment)}>
<rect x="5.5" y="42.5" width="22" height="17" rx="0.5" fill="#D51F1F" stroke="black"/>
<path d="M16.0732 47.6572C16.2682 47.3382 16.7318 47.3382 16.9268 47.6572L20.6436 53.7393C20.8472 54.0724 20.6073 54.5 20.2168 54.5H12.7832C12.3927 54.5 12.1528 54.0724 12.3564 53.7393L16.0732 47.6572Z" fill="#590F0F" stroke="#310000"/>
</g>

<rect x="8" y="3.5" width="40" height="14" rx="1.5" fill="#CECECE" stroke="black"/>
<text
    id="sccm-label"
    class="plain-label"
    x="10"
    y="15"
    font-family="Arial"
    font-size="12"
    fill="black">SCCM</text>
<path d="M58 11.214C89 11.214 119.5 -0.786012 119.5 15.714" stroke="black"/>

<g id="display">
    <text
        id="gmVal"
        class="digital-label"
        x="50"
        y="31"
        dominant-baseline="middle"
        text-anchor="end"
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="16"
    >
        {text()}
    </text>
</g>

    </g>)
}