import { Show, type Component } from "solid-js";
import { numberOfStages, paddedHeight, paddingTop } from "../../globals";

export const TopPipes: Component = () => {
    return (
<g id="topPipes" transform="translate(151, 38)">
    {/* From rotameter */}
    <g transform={`translate(0, ${numberOfStages() < 3 ? paddedHeight() : 
                                    numberOfStages() === 3 ? 10 : 46})`}>
        <rect x="26.5" y="3.5" width={numberOfStages() <= 3 ? 109 : 145} height="10" fill="url(#paint0_linear_0_1)" stroke="black"/>
        <path d="M17.5 2.50586C12.0716 2.57013 8.39128 3.69075 6.04102 6.04102C3.69075 8.39128 2.57013 12.0716 2.50586 17.5H14.7607C14.8185 16.682 15.0315 16.0036 15.5176 15.5176C16.0036 15.0315 16.6819 14.8175 17.5 14.7598V2.50586Z" fill="url(#paint8_radial_0_1)" stroke="black"/>
        <rect x="0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(0 1 1 0 0 17)" fill="url(#paint9_linear_0_1)" stroke="black"/>
        <rect x="-0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(-1 0 0 1 26 0)" fill="url(#paint10_linear_0_1)" stroke="black"/>
    </g>
    {/* Resize based on num stages */}
    <rect x="158.5" y="26.5" width={Math.max(0, 90 - numberOfStages() * 32)} height="10" transform="rotate(90 158.5 26.5)" fill="url(#paint1_linear_0_1)" stroke="black"/>
    <rect x={36.5 + (numberOfStages() < 3 ? paddedHeight() : 
                                    numberOfStages() === 3 ? 10 : 46)} y="-2.5" 
        width={numberOfStages() === 3 ? 6 : Math.max(32 * numberOfStages() - 120, 0)} height="10" transform="rotate(90 10.5 0.5)" fill="url(#paint0_linear_23_340)" stroke="black"/>
    {/* Don't show if more than 3 stages */}
    <Show when={numberOfStages() < 4}>
    <g transform={`translate(0, ${numberOfStages() === 3 ? 10 : paddedHeight()})`}>
        <path d="M159.494 17.5C159.43 12.0716 158.309 8.39128 155.959 6.04102C153.609 3.69075 149.928 2.57013 144.5 2.50586V14.7607C145.318 14.8185 145.996 15.0315 146.482 15.5176C146.968 16.0036 147.182 16.6819 147.24 17.5H159.494Z" fill="url(#paint2_radial_0_1)" stroke="black"/>
        <rect x="-0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(-1 0 0 1 144 0)" fill="url(#paint3_linear_0_1)" stroke="black"/>
        <rect x="-0.5" y="-0.5" width="9" height="16" rx="0.5" transform="matrix(0 -1 -1 0 161 26)" fill="url(#paint4_linear_0_1)" stroke="black"/>
    </g>
    <g transform={`translate(0, ${paddingTop() - 48})`}>
        <path d="M147.506 93.5C147.57 98.9284 148.691 102.609 151.041 104.959C153.391 107.309 157.072 108.43 162.5 108.494V96.2393C161.682 96.1815 161.004 95.9685 160.518 95.4824C160.032 94.9964 159.818 94.3181 159.76 93.5H147.506Z" fill="url(#paint5_radial_0_1)" stroke="black"/>
        <rect x="0.5" y="-0.5" width="9" height="16" rx="0.5" transform="matrix(1 0 0 -1 162 110)" fill="url(#paint6_linear_0_1)" stroke="black"/>
        <rect x="0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(0 1 1 0 145 84)" fill="url(#paint7_linear_0_1)" stroke="black"/>
    </g>
    </Show>

    {/* Gas out */}
    <g transform={`translate(0, ${paddingTop() - 48})`}>
        <path d="M231.5 27.5078C229.331 27.5718 227.895 28.0619 226.979 28.9785C226.062 29.8952 225.572 31.3312 225.508 33.5H231.5V27.5078Z" fill="url(#paint11_radial_0_1)" stroke="black"/>
        <rect x="0.5" y="0.5" width="3" height="7" rx="0.5" transform="matrix(0 1 1 0 224 33)" fill="url(#paint12_linear_0_1)" stroke="black"/>
        <rect x="-0.5" y="0.5" width="3" height="7" rx="0.5" transform="matrix(-1 0 0 1 234 26)" fill="url(#paint13_linear_0_1)" stroke="black"/>
        <rect x="234.5" y="27.5" width="228" height="5" fill="url(#paint14_linear_0_1)" stroke="black"/>
        <rect x="230.5" y="36.5" width="15" height="5" transform="rotate(90 230.5 36.5)" fill="url(#paint15_linear_0_1)" stroke="black"/>
    </g>
</g>
    );
};



export default TopPipes;
        







{/*  */}