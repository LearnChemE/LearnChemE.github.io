import { For, Show, type Accessor, type Component } from "solid-js";
import { numberOfStages, paddedHeight, paddingTop } from "../../globals";
import { SVGTooltip } from "../Tooltip/TooltipSelector";
import { FEED_COMP } from "../../ts/config";

type ColumnDataProps = {
    feedIsOn: Accessor<boolean>;
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
        <g transform={`translate(317 ${124 + paddingTop() + i() * 32})`}>
            <g class="col-data-anchor" ref={lrefs[i()]} >
                {/* Large anchor for easy readability */}
                <circle cx="0" cy="0" r="16" fill="red" opacity={0}/> 
                {/* Visible */}
                <circle cx="0" cy="0" r="4" fill="white"/>
                <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
            </g>
        </g>
        <g transform={`translate(401 ${124 + paddingTop() + i() * 32})`} ref={rrefs[i()]}> 
            <g class="col-data-anchor">
                <circle cx="0" cy="0" r="16" fill="red" opacity={0}/>
                <circle cx="0" cy="0" r="4" fill="white"/>
                <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
            </g>
        </g>

        {/* Tooltip */}
        <SVGTooltip x={150} y={100 + paddingTop() + i() * 32} stage={i()} stream={"raffinate"} anchor={lrefs[i()]} />
        <SVGTooltip x={418} y={100 + paddingTop() + i() * 32} stage={i()} stream={"extract"} anchor={rrefs[i()]} />
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
    <g transform={`translate(540 ${98 + paddedHeight()})`}>
        <g class="col-data-anchor" ref={solv} >
            {/* Large anchor for easy readability */}
            <circle cx="0" cy="0" r="16" fill="red" opacity={0}/> 
            {/* Visible */}
            <circle cx="0" cy="0" r="4" fill="white"/>
            <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
        </g>
    </g>

<SVGTooltip x={135} y={() => 58 + paddedHeight()} stage={FEED_COMP} label="feed" anchor={feed} />
<SVGTooltip x={465} y={() => 8 + paddedHeight()} stage={[0, 0]} label="solvent" anchor={solv} />
    </>
    )
}
