import { createEffect, createMemo, createSignal, For, onMount, type Accessor, type Component } from "solid-js";
import { FEED_MAX_RATE, STAGE_HEIGHT } from "../../ts/config";
import { columnVolume, numberOfStages, paddingTop, resetEvent, setColFull } from "../../globals";
import "./Column.css";
import { animate } from "../../ts/helpers";
import { Boils } from "../Boils/Boils";

type ColumnProps = {
    solvIn: Accessor<number>;
    feedIn: Accessor<number>;
};

export const Column: Component<ColumnProps> = (props) => {
    const { solvIn, feedIn } = props;
    const [fill, setFill] = createSignal(0);
    let animating = true;

    const fillAnimation = (dt: number) => {
        const rate = solvIn();
        if (rate <= 0) return true;

        const dV = rate * dt;
        setFill(fill() + dV);

        return (fill() < columnVolume());
    }

    const start = () => animate(fillAnimation, () => {
        animating = false;
        setColFull(true);
    });

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
    const bubbleRate = createMemo(() => feedIn() / FEED_MAX_RATE);

    return (
        // top
        <g id="Column" transform={`translate(0 ${paddingTop()})`}>
            {/* Fill */}
            <g clip-path="url(#col-fill-clip)">
                <path transform={`translate(325 ${92 + STAGE_HEIGHT * numberOfStages()})`} d="M2.12222e-07 38H70C70 38 70 27.5 70 19C70 9.5 65 9.5 65 0H5C5 9.5 1.93781e-06 9.5 2.12222e-07 19C-1.51337e-06 28.5 2.12222e-07 38 2.12222e-07 38Z" fill="#5b98e7" fill-opacity="0.6"/>
                <path transform="translate(325 54)" d="M2.12222e-07 0H70C70 0 70 10.5 70 19C70 28.5 65 28.5 65 38H5C5 28.5 1.93781e-06 28.5 2.12222e-07 19C-1.51337e-06 9.5 2.12222e-07 0 2.12222e-07 0Z" fill="#5b98e7" fill-opacity="0.6"/>
                <rect x="330" y="92" width="60" height={32 * numberOfStages()} fill="#5b98e7" fill-opacity="0.6"/>
                {/* Bubbles */}
                <Boils x={340} y={38} w={40} h={() => totalFillHeight() * .73 - 20} showing={() => feedIn() > 0} nbubbles={24} rate={bubbleRate} />
            </g>

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
            <g id="top-col" transform={`translate(325 38)`}>
                <rect x="7.5" y="0.5" width="18" height="8" rx="1.5" fill="url(#paint0_linear_9_80)" stroke="black"/>
                <rect x="44.5" y="0.5" width="18" height="8" rx="1.5" fill="url(#paint1_linear_9_80)" stroke="black"/>
                <path d="M2.12222e-07 16H70C70 16 70 26.5 70 35C70 44.5 65 44.5 65 54H5C5 44.5 1.93781e-06 44.5 2.12222e-07 35C-1.51337e-06 25.5 2.12222e-07 16 2.12222e-07 16Z" fill="url(#paint2_linear_9_80)"/>
                <path d="M64.5 54C64.5 44.5 69.5 44.5 69.5 35C69.5 25.5 69.5 16.5 69.5 16.5H0.500001C0.500001 16.5 0.499998 25.5 0.5 35C0.500002 44.5 5.5 44.5 5.5 54" stroke="black"/>
                <path d="M4 5.5H66C67.933 5.5 69.5 7.067 69.5 9V16.5H0.5V9C0.5 7.067 2.067 5.5 4 5.5Z" fill="url(#paint3_linear_9_80)" stroke="black"/>
            </g>

            {/* Stages */}
            <g id="stages" transform={`translate(330 92)`}>
                <For each={[...Array(numberOfStages()).keys()]}>{(stageIndex) => (
                    <g id={`stage-${stageIndex}`} transform={`translate(0 ${STAGE_HEIGHT * stageIndex})`}>
                        <mask id="path-1-inside-1_34_234" fill="white">
                        <path d="M0 0H60V32H0V0Z"/>
                        </mask>
                        <path d="M0 0H60V32H0V0Z" fill="url(#paint0_linear_34_234)"/>
                        <path d="M60 0H59V32H60H61V0H60ZM0 32H1V0H0H-1V32H0Z" fill="black" mask="url(#path-1-inside-1_34_234)"/>
                        <line y1="31.5" x2="60" y2="31.5" stroke="black" stroke-dasharray="3 1"/>
                    </g>
                )}</For>
            </g>

            {/* Bottom */}
            <g id="bottom-col" transform={`translate(325 ${92 + STAGE_HEIGHT * numberOfStages()})`}>
                <rect x="0.5" y="-0.5" width="18" height="8" rx="1.5" transform="matrix(1 0 0 -1 7 53)" fill="url(#paint0_linear_12_111)" stroke="black"/>
                <rect x="0.5" y="-0.5" width="18" height="8" rx="1.5" transform="matrix(1 0 0 -1 44 53)" fill="url(#paint1_linear_12_111)" stroke="black"/>
                <path d="M2.12222e-07 38H70C70 38 70 27.5 70 19C70 9.5 65 9.5 65 0H5C5 9.5 1.93781e-06 9.5 2.12222e-07 19C-1.51337e-06 28.5 2.12222e-07 38 2.12222e-07 38Z" fill="url(#paint2_linear_12_111)"/>
                <path d="M64.5 0C64.5 9.5 69.5 9.5 69.5 19C69.5 28.5 69.5 37.5 69.5 37.5H0.500001C0.500001 37.5 0.499998 28.5 0.5 19C0.500002 9.5 5.5 9.5 5.5 0" stroke="black"/>
                <path d="M4 48.5H66C67.933 48.5 69.5 46.933 69.5 45V37.5H0.5V45C0.5 46.933 2.067 48.5 4 48.5Z" fill="url(#paint3_linear_12_111)" stroke="black"/>
            </g>
        </g>
    );
}

