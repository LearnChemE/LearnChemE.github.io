import { For, Show, type Accessor, type Component } from "solid-js";
import { feedPPM, gasPPM, numberOfStages, paddedHeight, paddingTop } from "../../globals/";
import { SVGTooltip } from "../Tooltip/TooltipSelector";

type ColumnDataProps = {
    feedIsOn: Accessor<boolean>;
    gasIsOn: Accessor<boolean>;
};

export const ColumnData: Component<ColumnDataProps> = (props) => {
    const lrefs = new Array(8);
    const rrefs = new Array(8);
    let feed!: SVGGElement;
    let solv!: SVGGElement;

    return (
    <>
<Show when={props.feedIsOn()}>
    <For each={Array(numberOfStages())}>
      {(_,i) => (<>
        {/* Left: Liquid */}
        <g transform={`translate(317 ${108 + paddingTop() + i() * 32})`}>
            <g class="col-data-anchor" ref={lrefs[i()]} >
                {/* Large anchor for easy readability */}
                <circle cx="0" cy="0" r="16" fill="red" opacity={0}/> 
                {/* Visible */}
                <circle cx="0" cy="0" r="4" fill="white"/>
                <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
            </g>
        </g>
        <SVGTooltip x={200} y={80 + paddingTop() + i() * 32} stage={i()} stream={"liquid"} anchor={lrefs[i()]} />

        {/* Right: Vapor */}
        <Show when={props.gasIsOn()}>
            <g transform={`translate(401 ${88 + paddingTop() + i() * 32})`} ref={rrefs[i()]}> 
                <g class="col-data-anchor">
                    <circle cx="0" cy="0" r="16" fill="red" opacity={0}/>
                    <circle cx="0" cy="0" r="4" fill="#83dbdb"/>
                    <circle cx="0" cy="0" r="2.5" fill="white"/>
                </g>
            </g>
            <SVGTooltip x={418} y={80 + paddingTop() + i() * 32} stage={i()} fixed={1} stream={"vapor"} anchor={rrefs[i()]} />
        </Show>
      </>)}
    </For>
</Show>

    <g transform={`translate(115 ${98 + paddedHeight()})`}>
        <g class="col-data-anchor" ref={feed} >
            {/* Large anchor for easy readability */}
            <circle cx="0" cy="0" r="16" fill="red" opacity={0}/> 
            {/* Visible */}
            <circle cx="0" cy="0" r="4" fill="white"/>
            <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
        </g>
    </g>
    <g transform={`translate(562 ${178 + paddedHeight()})`}>
        <g class="col-data-anchor" ref={solv} >
            {/* Large anchor for easy readability */}
            <circle cx="0" cy="0" r="16" fill="red" opacity={0}/> 
            {/* Visible */}
            <circle cx="0" cy="0" r="4" fill="#83dbdb"/>
            <circle cx="0" cy="0" r="3" fill="white"/>
        </g>
    </g>

<SVGTooltip x={135} y={() => 78 + paddedHeight()} ppm={feedPPM} label="liquid feed" anchor={feed} />
<SVGTooltip x={550} y={() => 128 + paddedHeight()}  ppm={gasPPM} fixed={1} label="gas feed" anchor={solv} />
    </>
    )
}
