import { type Accessor, type Component } from "solid-js";
import { expMemo } from "../../globals";
import "./AniLines.css"
import { Portal } from "solid-js/web";

type AniLinesProps = {
    isShowing: Accessor<boolean>;
}

export const AniLines: Component<AniLinesProps> = (props) => {
    const opac = expMemo(() => props.isShowing() ? 0.9 : 0, 0.05);

    return (<>
    <g opacity={opac()} transform="translate(62, 99)" class="lines-ani" id="line-ani-holder">
        <DarkLines />

        {/* Colored lines */}
        <g transform="translate(1, 1)">
            {/* Before mfc */}
            <path d="M258 156L258 102L366.5 102" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            
            {/* Outlet - on with mfc */}
            <path d="M631 1L442 1L442 84" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            
            {/* On with mfc */}
            <path d="M424 102L366.5 102" stroke="#BF0000" stroke-width="2"/>
            
            {/* Bed - mfc and v2 */}
            <path d="M460 102L596 102V135" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            <path d="M442 120L442 380H596V346" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            
            {/* cyl lines - always same color */}
            <path d="M217 248H155V269.5" stroke="#EA6C6C" stroke-width="2" stroke-linejoin="round"/>
            <path d="M63 247H1L1 268.5" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            <path d="M371 248H309V269.5" stroke="#68A246" stroke-width="2" stroke-linejoin="round"/>
            
            {/* reg lines - always same color */}
            <path d="M63 247H104V158H240" stroke="#BF0000" stroke-width="2" stroke-linejoin="round"/>
            <path d="M371 248H412V158H276.5" stroke="#68A246" stroke-width="2" stroke-linejoin="round"/>
            <path d="M217 248H258V176" stroke="#EA6C6C" stroke-width="2" stroke-linejoin="round"/>
        </g>
    </g>

    {/* Valve 1 */}
    <Portal mount={document.getElementById("valve1-ani")!} isSVG={true}>
        <g opacity={opac()} class="lines-ani" transform="translate(15, 15)">
            <path d="M21.5 3L3 3" stroke="black" stroke-width="4"/>
            <circle cx="3" cy="3" r="2.5" fill="#BF0000" stroke="black"/>
            <path d="M21.5 3L3 3" stroke="#BF0000" stroke-width="2"/>
        </g>
    </Portal>

    {/* Valve 2 */}
    <Portal mount={document.getElementById("valve2-ani")!} isSVG={true}>
        <g opacity={opac()} class="lines-ani">
            <path d="M18 36C18 21 21 18 36 18" stroke="black" stroke-width="4"/>
            <path d="M18 0C18 15 15 18 0 18" stroke="black" stroke-width="4"/>
            <path d="M18 36C18 21 21 18 36 18" stroke="#BF0000" stroke-width="2"/>
            <path d="M18 0C18 15 15 18 0 18" stroke="#BF0000" stroke-width="2"/>
        </g>
    </Portal>
</>)}

const DarkLines = () => {
    return (<>
<path d="M259 157L259 103L367.5 103" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M443 121L443 381H597V347" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M632 2L443 2L443 85" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M425 103L367.5 103" stroke="black" stroke-width="4"/>
<path d="M461 103L597 103V136" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M64 248H105V159H241" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M372 249H413V159H277.5" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M218 249H259V177" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M218 249H156V270.5" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M64 248H2L2 269.5" stroke="black" stroke-width="4" stroke-linejoin="round"/>
<path d="M372 249H310V270.5" stroke="black" stroke-width="4" stroke-linejoin="round"/>
</>)
}