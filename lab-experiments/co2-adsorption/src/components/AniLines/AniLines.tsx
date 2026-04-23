import { createMemo, Match, Show, Switch, type Accessor, type Component } from "solid-js";
import { expMemo, GasCylinder, SIM_MODE } from "../../globals";
import "./AniLines.css"
import { Portal } from "solid-js/web";

type AniLinesProps = {
    isShowing: Accessor<boolean>;
    cyls: GasCylinder[]; // For determining lines before valve
    cyl: Accessor<GasCylinder>;

    passMfc: Accessor<boolean>; // Whether to also show the lines from the mfc
    showLoop: Accessor<boolean>; // Whether to also show the loop lines around the bed
}

export const AniLines: Component<AniLinesProps> = (props) => {
    const opac = expMemo(() => props.isShowing() ? 0.9 : 0, 0.05);
    const color = createMemo(() => props.cyl().color);

    const FILL_WIDTH = 4;
    // Before mfc
    const showCyl = props.cyls.map(cyl => createMemo(() => (cyl.cylPres.get() > 0) ? FILL_WIDTH : 0));
    const showReg = props.cyls.map(cyl => createMemo(() => (cyl.linePres() > 0) ? FILL_WIDTH : 0));
    const passV1 = createMemo(() => {
        const cyl = props.cyl();
        return (cyl.linePres() > 0) ? FILL_WIDTH : 0;
    });

    // After mfc
    const passMfc = createMemo(() => props.passMfc() && (passV1() > 0) ? FILL_WIDTH : 0);
    const showLoop = createMemo(() => props.showLoop() && (passMfc() > 0) ? FILL_WIDTH : 0);

    return (<>
    <g opacity={opac()} transform="translate(62, 99)" class="lines-ani" id="line-ani-holder">
        <DarkLines />

        {/* Colored lines */}
        <g transform="translate(1, 1)">
            {/* Before mfc */}
            <path d="M258 156L258 102L366.5 102" stroke={color()} stroke-width={passV1()} stroke-linejoin="round" class="colored-line" />
            
            {/* Outlet - on with mfc */}
            <path d="M631 1L442 1L442 84" stroke={color()} stroke-width={passMfc()} stroke-linejoin="round" class="colored-line" />
            
            {/* On with mfc */}
            <path d="M424 102L366.5 102" stroke={color()} stroke-width={passMfc()} class="colored-line"/>
            
            {/* Bed - mfc and v2 */}
            <path d="M460 102L596 102V135" stroke={color()} stroke-width={showLoop()} stroke-linejoin="round" class="colored-line" />
            <path d="M442 120L442 380H596V346" stroke={color()} stroke-width={showLoop()} stroke-linejoin="round" class="colored-line"/>
            
            <Switch>
                <Match when={SIM_MODE === "adsorption"}>
                    {/* cyl lines - always same color */}
                    <path d="M217 248H155V269.5" stroke={props.cyls[1].color} stroke-width={showCyl[1]()} stroke-linejoin="round" class="colored-line" />
                    <path d="M63 247H1L1 268.5" stroke={props.cyls[0].color}  stroke-width={showCyl[0]()} stroke-linejoin="round" class="colored-line" />
                    <path d="M371 248H309V269.5" stroke={props.cyls[2].color} stroke-width={showCyl[2]()} stroke-linejoin="round" class="colored-line"/>
                    
                    {/* reg lines - always same color */}
                    <path d="M63 247H104V158H240" stroke={props.cyls[0].color}    stroke-width={showReg[0]()} stroke-linejoin="round" class="colored-line"/>
                    <path d="M371 248H412V158H276.5" stroke={props.cyls[2].color} stroke-width={showReg[2]()} stroke-linejoin="round" class="colored-line"/>
                    <path d="M217 248H258V176" stroke={props.cyls[1].color}       stroke-width={showReg[1]()} stroke-linejoin="round" class="colored-line"/>
                </Match>
                <Match when={SIM_MODE === "desorption"}>
                    <path d="M217 248H155V269.5" stroke={props.cyls[0].color}  stroke-width={showCyl[0]()} stroke-linejoin="round" class="colored-line" />
                    <path d="M217 248H258V176" stroke={props.cyls[0].color}    stroke-width={showReg[0]()} stroke-linejoin="round" class="colored-line"/>
                    <path d="M371 248H309V269.5" stroke={props.cyls[1].color} stroke-width={showCyl[1]()} stroke-linejoin="round" class="colored-line"/>
                    <path d="M371 248H412V158H276.5" stroke={props.cyls[1].color} stroke-width={showReg[1]()} stroke-linejoin="round" class="colored-line"/>
                </Match>
            </Switch>
        </g>
    </g>

    {/* Valve 1 */}
    <Portal mount={document.getElementById("valve1-ani")!} isSVG={true}>
        <g opacity={opac()} class="lines-ani" transform="translate(15, 15)">
            <path d="M21.5 3L3 3" stroke="black" stroke-width="6"/>
            <circle cx="3" cy="3" r="2.5" fill={passV1() ? color() : "black"} stroke="black" class="colored-line"/>
            <path d="M21.5 3L3 3" stroke={color()} stroke-width={passV1()} class="colored-line"/>
        </g>
    </Portal>

    {/* Valve 2 */}
    <Portal mount={document.getElementById("valve2-ani")!} isSVG={true}>
        <g opacity={opac()} class="lines-ani">
            <path d="M18 36C18 21 21 18 36 18" stroke="black" stroke-width="6"/>
            <path d="M18 0C18 15 15 18 0 18" stroke="black" stroke-width="6"/>
            <path d="M18 36C18 21 21 18 36 18" stroke={color()} stroke-width={passMfc()} class="colored-line"/>
            <path d="M18 0C18 15 15 18 0 18" stroke={color()} stroke-width={showLoop()} class="colored-line"/>
        </g>
    </Portal>
</>)}

const DarkLines = () => {
    return (<>
<path d="M259 157L259 103L367.5 103" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M443 121L443 381H597V347" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M632 2L443 2L443 85" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M425 103L367.5 103" stroke="black" stroke-width="6"/>
<path d="M461 103L597 103V136" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M372 249H413V159H277.5" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M218 249H259V177" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<path d="M218 249H156V270.5" stroke="black" stroke-width="6" stroke-linejoin="round"/>
<Show when={SIM_MODE === "adsorption"}>
    <path d="M64 248H105V159H241" stroke="black" stroke-width="6" stroke-linejoin="round"/>
    <path d="M64 248H2L2 269.5" stroke="black" stroke-width="6" stroke-linejoin="round"/>
</Show>
<path d="M372 249H310V270.5" stroke="black" stroke-width="6" stroke-linejoin="round"/>
</>)
}