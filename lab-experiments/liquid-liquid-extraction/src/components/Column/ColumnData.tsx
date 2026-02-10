import { For, type Component } from "solid-js";
import { numberOfStages, paddingTop } from "../../globals";

interface ColumnDataProps {

}

export const ColumnData: Component<ColumnDataProps> = (props: ColumnDataProps) => {


    return (
    <For each={Array(numberOfStages())}>
      {(_,i) => (<>
        <g transform={`translate(317 ${124 + paddingTop() + i() * 32})`}>
            <g class="col-data-anchor">
                <circle cx="0" cy="0" r="16" fill="red" opacity={0}/>
                <circle cx="0" cy="0" r="4" fill="white"/>
                <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
            </g>
        </g>
        <g transform={`translate(401 ${124 + paddingTop() + i() * 32})`}> 
            <g class="col-data-anchor">
                <circle cx="0" cy="0" r="16" fill="red" opacity={0}/>
                <circle cx="0" cy="0" r="4" fill="white"/>
                <circle cx="0" cy="0" r="3" fill="var(--hamburger-color)"/>
            </g>
        </g>
      </>)}
    </For>
    )
}
