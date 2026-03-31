import { createEffect, createMemo, createSignal, For, onMount, useContext, type Accessor, type Component } from "solid-js";
import { STAGE_HEIGHT } from "../../globals/config";
import { feedPPM, gasPPM, numberOfStages, paddingTop, resetEvent, setColFull } from "../../globals/signals";
import "./Column.css";
import { animate, constrain } from "../../globals/helpers";
import { ColumnCalc, ColumnContext, type Stream } from "../../globals/calcs";

type ColumnProps = {
    gasIn: Accessor<number>;
    feedIn: Accessor<number>;
    gasPressure: Accessor<number>;
};

const FALL_HEIGHT = 37;
const LAST_FALL = 68;
// Give equal-time weights to each segment
const wt = 3; // tray
const wf = 1; // fall
const wl = wf * LAST_FALL / FALL_HEIGHT; // last fall
const w_per_stage = wt + wf;

export const Column: Component<ColumnProps> = (props) => {
    const { gasIn, feedIn, gasPressure } = props;
    const [fill, setFill] = createSignal(0);
    let animating = true;
    const columnVolume = createMemo(() => wt * numberOfStages() + wf * (numberOfStages() - 1) + wl);

    const fillAnimation = (dt: number) => {
        const rate = feedIn(); // mL
        if (rate <= 0) return true;

        const dV = rate * dt;
        setFill(fill() + dV);

        return (fill() < columnVolume());
    }

    const columnContext = useContext(ColumnContext);

    const onColFill = () => {
        animating = false;
        setColFull(true);
        // Create the calculation object and start the simulation
        const liqStream = createMemo(() => { return { ndot: feedIn() * 1000 / 18 / 60, ppm: feedPPM()     } as Stream});
        const gasStream = createMemo(() => { return { ndot: gasIn() / 60,              ppm: gasPPM() } as Stream});
        const col = new ColumnCalc(numberOfStages(), liqStream, gasStream, gasPressure);
        // Attach the column to context so other components can access it
        columnContext!.column = col;
        columnContext!.setColumnCreated(true);
        // Start the column simulation
        col.start();
    }

    const start = () => animate(fillAnimation, onColFill);

    onMount(start);

    createEffect(() => {
        resetEvent();
        setColFull(false);
        setFill(0);
        if (!animating) {
            animating = true;
            start();
        }
    })

    const totalFillHeight = createMemo(() => 76 + 32 * numberOfStages());
    const paddedFillHeight = createMemo(() => totalFillHeight() + 18);

    return (
        // top
        <g id="Column" transform={`translate(0 ${paddingTop()})`}>
            <defs>
                <clipPath id="col-fill-clip">
                    <rect x="325" y={54 + paddedFillHeight() * (1 - fill() / columnVolume())} width="70" height={paddedFillHeight() * fill() / columnVolume()} fill="red" />
                    <path 
                        transform={`translate(325 ${28 + (paddedFillHeight()) * (1 - fill() / columnVolume())}) scale(.049 .1)`} 
                        d={`M 0,400 L 0,150 C 85.33218825146,159.96221229817934 170.66437650292,169.92442459635865 234,153 C 297.33562349708,136.07557540364135 338.67468223978005,92.26451391274475 407,99 C 475.32531776021995,105.73548608725525 570.6368945379594,163.0175197526623 647,195 C 723.3631054620406,226.9824802473377 780.7777396083819,233.66540707660596 833,222 C 885.2222603916181,210.33459292339404 932.2521470285126,180.32085194091377 992,150 C 1051.7478529714874,119.67914805908622 1124.2136722775679,89.05118515973892 1201,89 C 1277.7863277224321,88.94881484026108 1358.8931638612162,119.47440742013055 1440,150 L 1440,400 L 0,400 Z`} 
                        stroke="none" 
                        stroke-width="0" 
                        fill="red" 
                        fill-opacity="1" 
                        class="transition-all duration-300 ease-in-out delay-150 path-0"
                    />
                </clipPath>
            </defs>
            

            {/* Top */}
            <g id="top-col" transform={`translate(322 40)`}>
                <path d="M3 14H73C73 14 73 24.5 73 33C73 42.5 68 42.5 68 52H8C8 42.5 3 42.5 3 33C3 23.5 3 14 3 14Z" fill="url(#paint0_linear_0_12)"/>
                <path d="M67.5 52C67.5 42.5 72.5 42.5 72.5 33C72.5 23.5 72.5 14.5 72.5 14.5H3.5C3.5 14.5 3.5 23.5 3.5 33C3.5 42.5 8.5 42.5 8.5 52" stroke="black"/>
                <path d="M7 3.5H69C70.933 3.5 72.5 5.067 72.5 7V14.5H3.5V7C3.5 5.067 5.067 3.5 7 3.5Z" fill="url(#paint1_linear_0_12)" stroke="black"/>
                <rect x="0.5" y="59.5" width="14" height="8" rx="1.5" transform="rotate(-90 0.5 59.5)" fill="url(#paint2_linear_0_12)" stroke="black"/>
                <rect x="53.5" y="3.5" width="3" height="7" rx="0.5" transform="rotate(-90 53.5 3.5)" fill="#989898" stroke="black"/>
            </g>

            {/* Stages */}
            <g id="stages" transform={`translate(330 92)`}>
                <For each={[...Array(numberOfStages()).keys()]}>
                    {(stageIndex) => {
                    const stageFill = createMemo(() => Math.max(0, fill() - stageIndex * w_per_stage));

                    return (
                        <g id={`stage-${stageIndex}`} transform={`translate(0 ${STAGE_HEIGHT * stageIndex})`}>
                            <Stage fill={stageFill} index={stageIndex} />
                        </g>
                    )}}
                </For>
            </g>

            {/* Bottom */}
            <g id="bottom-col" transform={`translate(325 ${92 + STAGE_HEIGHT * numberOfStages()})`}>
                <rect x="0.5" y="-0.5" width="18" height="8" rx="1.5" transform="matrix(1 0 0 -1 7 53)" fill="url(#paint0_linear_12_111)" stroke="black"/>
                <path d="M2.12222e-07 38H70C70 38 70 27.5 70 19C70 9.5 65 9.5 65 0H5C5 9.5 1.93781e-06 9.5 2.12222e-07 19C-1.51337e-06 28.5 2.12222e-07 38 2.12222e-07 38Z" fill="url(#paint2_linear_12_111)"/>
                <path d="M64.5 0C64.5 9.5 69.5 9.5 69.5 19C69.5 28.5 69.5 37.5 69.5 37.5H0.500001C0.500001 37.5 0.499998 28.5 0.5 19C0.500002 9.5 5.5 9.5 5.5 0" stroke="black"/>
                <path d="M4 48.5H66C67.933 48.5 69.5 46.933 69.5 45V37.5H0.5V45C0.5 46.933 2.067 48.5 4 48.5Z" fill="url(#paint3_linear_12_111)" stroke="black"/>
            </g>


<defs>
<linearGradient id="paint0_linear_133_34" x1="-6" y1="16" x2="64.5" y2="16" gradientUnits="userSpaceOnUse">
<stop stop-color="#305789" stop-opacity="0.6"/>
<stop offset="0.625" stop-color="#D9D9D9" stop-opacity="0"/>
<stop offset="1" stop-color="#305789" stop-opacity="0.6"/>
</linearGradient>
</defs>
        </g>
    );
}

type StageProps = {
    fill: Accessor<number>;
    index: number;
}


const Stage: Component<StageProps> = ({ fill, index }) => {
    const flip  = index % 2 === 1; 
    const first = index === 0;
    const last  = createMemo(() => index === numberOfStages() - 1); 

    const trayHeight = createMemo(() => {
        const tfill = Math.min(fill(), wt);
        return tfill / wt * 5;
    });
    const fallHeight = createMemo(() => {
        const height = last() ? LAST_FALL : FALL_HEIGHT;
        const w = last() ? wl : wf;
        const ffill = constrain(fill() - wt, 0, w);
        return ffill / w * height;
    });

return (<>
<g transform={ flip ? "scale(-1,1) translate(-60, 0)" : "" }>
    <rect x={first ? 0 : 4} y={6 - trayHeight()} width={first ? 56 : 52} height={trayHeight()} fill="#398CF9" fill-opacity="0.6"/>
    <mask id="path-2-inside-1_133_34" fill="white">
    <path d="M0 0H60V32H0V0Z"/>
    </mask>
    <line x1="10" y1="6.5" x2="56" y2="6.5" stroke="black" stroke-dasharray="3 1"/>
    <line y1="6.5" x2="10" y2="6.5" stroke="black"/>
    <line x1="55.5" y1="28" x2="55.5" y2="2" stroke="black"/>
    <rect x="56" y="1" width="3" height={fallHeight()} fill="#398CF9" fill-opacity="0.6"/>
</g>
<path d="M0 0H60V32H0V0Z" fill="url(#paint0_linear_133_34)"/>
<path d="M60 0H59V32H60H61V0H60ZM0 32H1V0H0H-1V32H0Z" fill="black" mask="url(#path-2-inside-1_133_34)"/>
</>);
}
