import { createSignal, onMount, type Accessor, type Component } from "solid-js";
import "./Magnifier.css"
import MagnifierCanvas from "./MagnifierCanvas";
import { constrain } from "../../ts/helpers";
import type { MagnifierParticleInfo } from "../../types/globals";

interface MagnifierProps {
    magnifying: Accessor<boolean>;
    particleInfo: (v: number, y: number) => MagnifierParticleInfo;
    paused?: Accessor<boolean>;
}

export const Magnifier: Component<MagnifierProps> = ({ magnifying, particleInfo, paused }) => {
    const [pInfo, setPInfo] = createSignal({ num: 0, fracR: 0, rVel: 0, wVel: 0 });
    const [coord, setCoord] = createSignal({ x: 0, y: 0 });

    const followMouse = (evt: MouseEvent | Touch) => {
        // Set new coordinates for the magnifier
        const bds = document.getElementById("main-cnv")!.getBoundingClientRect();
        // Y
        const topBd = .085;
        const botBd = .905;
        // X
        const vialWidth = .086;
        const lBd = .328 - vialWidth / 2;
        const x_cnv = (evt.clientX - bds.x) / bds.width;
        const y_cnv = (evt.clientY - bds.y) / bds.height;
        const y_cnv_constr = constrain(y_cnv, topBd, botBd);
        // Determine vial
        const vial = constrain(Math.floor((x_cnv - lBd) / vialWidth), 0, 4);

        // Calculate new coords
        const newCoord = {
            x: 32.8 + vial * vialWidth * 100, 
            y: y_cnv_constr * bds.height
        };
        
        setCoord(newCoord);
        const vialY = (y_cnv_constr - topBd) / (botBd - topBd) * 305;
        const partInfo = particleInfo(4 - vial, vialY);
        setPInfo(partInfo);
    }

    onMount(() => {
        window.addEventListener("pointermove", followMouse);
    });

    return (<>
        { magnifying() && <div class="lens" style={`left: ${coord().x}%; top: ${coord().y}px`}>
            <MagnifierCanvas particleInfo={pInfo} showing={magnifying} paused={paused} />
        </div> }
    </>);
}