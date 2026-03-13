import { Match, Switch, type Component } from "solid-js";
import { numberOfStages, paddedHeight, paddingTop } from "../../globals";

export const TopPipes: Component = () => {
    return (
<g id="topPipes" transform="translate(151, 18)">
    <Switch>
        {/* <Match when={numberOfStages() < 3}>
            <rect x="26.5" y="69.5" width="145" height="10" fill="url(#paint5_linear_0_1)" stroke="black"/>
            <rect x="13.5" y="92.5" width="130" height="10" transform="rotate(90 13.5 92.5)" fill="url(#paint6_linear_0_1)" stroke="black"/>
            <path d="M17.5 68.5059C12.0716 68.5701 8.39128 69.6907 6.04102 72.041C3.69075 74.3913 2.57013 78.0716 2.50586 83.5H14.7607C14.8185 82.682 15.0315 82.0036 15.5176 81.5176C16.0036 81.0315 16.6819 80.8175 17.5 80.7598V68.5059Z" fill="url(#paint7_radial_0_1)" stroke="black"/>
            <rect x="0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(0 1 1 0 0 83)" fill="url(#paint8_linear_0_1)" stroke="black"/>
            <rect x="-0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(-1 0 0 1 26 66)" fill="url(#paint9_linear_0_1)" stroke="black"/>
        </Match> */}
        <Match when={true}>
            <rect x="26.5" y="3.5" width="109" height="10" fill="url(#paint0_linear_0_1)" stroke="black"/>
            <rect x="158.5" y="26.5" width="58" height="10" transform="rotate(90 158.5 26.5)" fill="url(#paint1_linear_0_1)" stroke="black"/>
            <path d="M159.494 17.5C159.43 12.0716 158.309 8.39128 155.959 6.04102C153.609 3.69075 149.928 2.57013 144.5 2.50586V14.7607C145.318 14.8185 145.996 15.0315 146.482 15.5176C146.968 16.0036 147.182 16.6819 147.24 17.5H159.494Z" fill="url(#paint2_radial_0_1)" stroke="black"/>
            <rect x="-0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(-1 0 0 1 144 0)" fill="url(#paint3_linear_0_1)" stroke="black"/>
            <rect x="-0.5" y="-0.5" width="9" height="16" rx="0.5" transform="matrix(0 -1 -1 0 161 26)" fill="url(#paint4_linear_0_1)" stroke="black"/>
            <path d="M147.506 93.5C147.57 98.9284 148.691 102.609 151.041 104.959C153.391 107.309 157.072 108.43 162.5 108.494V96.2393C161.682 96.1815 161.004 95.9685 160.518 95.4824C160.032 94.9964 159.818 94.3181 159.76 93.5H147.506Z" fill="url(#paint5_radial_0_1)" stroke="black"/>
            <rect x="0.5" y="-0.5" width="9" height="16" rx="0.5" transform="matrix(1 0 0 -1 162 110)" fill="url(#paint6_linear_0_1)" stroke="black"/>
            <rect x="0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(0 1 1 0 145 84)" fill="url(#paint7_linear_0_1)" stroke="black"/>
            <path d="M17.5 2.50586C12.0716 2.57013 8.39128 3.69075 6.04102 6.04102C3.69075 8.39128 2.57013 12.0716 2.50586 17.5H14.7607C14.8185 16.682 15.0315 16.0036 15.5176 15.5176C16.0036 15.0315 16.6819 14.8175 17.5 14.7598V2.50586Z" fill="url(#paint8_radial_0_1)" stroke="black"/>
            <rect x="0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(0 1 1 0 0 17)" fill="url(#paint9_linear_0_1)" stroke="black"/>
            <rect x="-0.5" y="0.5" width="9" height="16" rx="0.5" transform="matrix(-1 0 0 1 26 0)" fill="url(#paint10_linear_0_1)" stroke="black"/>
        </Match>
    </Switch>

    {/* Gas out */}
    <path d="M229.5 1.50781C227.331 1.57178 225.895 2.06185 224.979 2.97852C224.062 3.89518 223.572 5.3312 223.508 7.5H229.5V1.50781Z" fill="url(#paint0_radial_0_1)" stroke="black"/>
    <rect x="0.5" y="0.5" width="3" height="7" rx="0.5" transform="matrix(0 1 1 0 222 7)" fill="url(#paint1_linear_0_1)" stroke="black"/>
    <rect x="-0.5" y="0.5" width="3" height="7" rx="0.5" transform="matrix(-1 0 0 1 232 0)" fill="url(#paint2_linear_0_1)" stroke="black"/>
    <rect x="232.5" y="1.5" width="228" height="5" fill="url(#paint3_linear_0_1)" stroke="black"/>
    <rect x="228.5" y="10.5" width="12" height="5" transform="rotate(90 228.5 10.5)" fill="url(#paint4_linear_0_1)" stroke="black"/>
</g>
    );
};

export default TopPipes;
        







{/*  */}