import { type Accessor, type Component } from "solid-js";
import { AnimationSequence } from "../../globals";

type CylindricalProps = {
    transition: AnimationSequence;
    fillColor: Accessor<string>;
};

export const Cylindrical: Component<CylindricalProps> = (props) => {
    const t = props.transition.createSolidSignal("rotate");
    const f = props.transition.createSolidSignal("fade-out");

    // const co_cx = 30;
    const co_cy = 59;

    const trans_lerp = (a: number, b: number) => a + (b - a) * t();

    return (<g transform="translate(21, 47)">

{/* Bottom rod */}
<ellipse cx="30" cy={trans_lerp(111, co_cy)} rx="4" ry={trans_lerp(2, 4)} 
    fill="#D9D9D9" stroke="black" stroke-width="0.5"/>
<rect x="26" y={trans_lerp(85, co_cy)} width="8" height={trans_lerp(26, 0)} fill="#D9D9D9" />
<line x1="26" y1={trans_lerp(85, co_cy)} x2="26" y2={trans_lerp(111, co_cy)} stroke="black" stroke-width=".5" />
<line x1="34" y1={trans_lerp(85, co_cy)} x2="34" y2={trans_lerp(111, co_cy)} stroke="black" stroke-width=".5" />

{/* beaker floor */}
<ellipse cx="30" cy={trans_lerp(81, co_cy)} rx="30" ry={trans_lerp(7, 30)} 
    fill="#E8FCFC" stroke="black" stroke-width="0.5" />

{/* Beaker walls */}
<rect x="0" y={trans_lerp(22, co_cy)} width="60" height={trans_lerp(60, 0)} fill="#E8FCFC" />
<line x1="0" y1={trans_lerp(22, co_cy)} x2="0" y2={trans_lerp(82, co_cy)} stroke="black" stroke-width=".5" />
<line x1="60" y1={trans_lerp(22, co_cy)} x2="60" y2={trans_lerp(82, co_cy)} stroke="black" stroke-width=".5" />

{/* Beaker Top */}
<ellipse cx="30" cy={trans_lerp(21, co_cy)} rx="30" ry={trans_lerp(7, 30)} 
    fill="#E8FCFC" stroke="black" stroke-width="0.5"/>
<ellipse cx="30" cy={trans_lerp(81, co_cy)} rx="30" ry={trans_lerp(7, 30)} 
    fill-opacity="0.5" stroke="black" stroke-width="0.5"/>

{/* Die */}
<ellipse cx="30" cy={trans_lerp(77, co_cy)} rx="10" ry={trans_lerp(3, 10)} 
    fill="url(#paint0_linear_0_1)" stroke="black" stroke-width="0.5" />
<rect x="20" y={trans_lerp(32, co_cy)} width="20" height={trans_lerp(45, 0)} fill="url(#paint0_linear_0_1)" />
<line x1="20" y1={trans_lerp(32, co_cy)} x2="20" y2={trans_lerp(77, co_cy)} stroke="black" stroke-width=".5" />
<line x1="40" y1={trans_lerp(32, co_cy)} x2="40" y2={trans_lerp(77, co_cy)} stroke="black" stroke-width=".5" />

{/* Fill */}
<path d={`M0 ${trans_lerp(32, co_cy)}
    A30 ${trans_lerp(7, 30)} 0 0 1 60 ${trans_lerp(32, co_cy)}
    V${trans_lerp(81, co_cy)}
    A30 ${trans_lerp(7, 30)} 0 0 1 0 ${trans_lerp(81, co_cy)}
    Z`}
    fill={props.fillColor()} stroke="black" stroke-width="0.5" />

<ellipse cx="30" cy={trans_lerp(32, co_cy)} rx="30" ry={trans_lerp(7, 30)} 
    stroke="black" stroke-width="0.5"/>
<ellipse cx="30" cy={trans_lerp(32, co_cy)} rx="10" ry={trans_lerp(3, 10)} 
    fill="#D9D9D9" stroke="black" stroke-width="0.5"/>

<ellipse cx="30" cy={trans_lerp(32, co_cy)} rx="2" ry={trans_lerp(1, 2)} 
    fill="#D9D9D9" stroke="black" stroke-width="0.5"/>

<rect x="28" y={trans_lerp(1, co_cy)} width={4} height={trans_lerp(31, 0)} fill="#D9D9D9"/>
<line x1="28" y1={trans_lerp(1, co_cy)} x2="28" y2={trans_lerp(32, co_cy)} stroke="black" stroke-width=".5" />
<line x1="32" y1={trans_lerp(1, co_cy)} x2="32" y2={trans_lerp(32, co_cy)} stroke="black" stroke-width=".5" />

<ellipse cx="30" cy={trans_lerp(1, co_cy)} rx="2" ry={trans_lerp(1, 2)} 
    fill="#888888" stroke="black" stroke-width="0.5"/>

{/* Top rim towards camera */}
<path d={`M0 ${trans_lerp(21, co_cy)}
    A30 ${trans_lerp(7, 30)} 0 0 0 60 ${trans_lerp(21, co_cy)}`}
    stroke="black" stroke-width="0.5"/>

<path d="M59.7539 81.0156L59.7559 81.0303C59.7577 81.045 59.7577 81.0639 59.7568 81.0938C59.7561 81.1169 59.7539 81.1647 59.7539 81.2031C59.7539 81.6089 59.5783 82.0247 59.2061 82.4492C58.8323 82.8753 58.27 83.2982 57.5254 83.709C56.0362 84.5305 53.8648 85.2781 51.1602 85.9092C45.7548 87.1704 38.2748 87.9531 30.0039 87.9531C21.7331 87.9531 14.253 87.1704 8.84766 85.9092C6.14319 85.2781 3.9716 84.5304 2.48242 83.709C1.73774 83.2982 1.17449 82.8753 0.800781 82.4492C0.428525 82.0247 0.253906 81.6089 0.253906 81.2031C0.253906 81.1647 0.250706 81.1169 0.25 81.0938C0.249089 81.0639 0.250149 81.045 0.251953 81.0303L0.253906 81.0156V21.6064L0.305664 21.6592C0.876335 22.565 2.0893 23.3806 3.76367 24.0986C5.46699 24.829 7.69034 25.4767 10.3125 26.0166C15.5586 27.0968 22.4312 27.75 30 27.75C37.5688 27.75 44.4414 27.0968 49.6875 26.0166C52.3097 25.4767 54.533 24.829 56.2363 24.0986C57.91 23.3809 59.1224 22.5656 59.6934 21.6602L59.7539 21.5996V81.0156Z" 
    fill="url(#paint1_linear_0_1)" stroke="black" stroke-width="0.5" opacity={0.6 * (1 - f())}/>

    </g>);
}