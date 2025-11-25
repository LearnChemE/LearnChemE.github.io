import { type Accessor, type Component } from "solid-js";
import "./Magnifier.css"
import MagnifierCanvas from "./MagnifierCanvas";
import type { MagnifierParticleInfo } from "../../types/globals";

interface MagnifierProps {
    magnifying: Accessor<boolean>,
    particleInfo: Accessor<MagnifierParticleInfo>,
    coord: Accessor<{ x: number, y: number }>
}

export const Magnifier: Component<MagnifierProps> = ({ magnifying, particleInfo, coord }) => {
    return (<>
        { magnifying() && <div class="lens" style={`left: ${coord().x}%; top: ${coord().y}%`}>
            <MagnifierCanvas particleInfo={particleInfo} showing={magnifying} />
        </div> }
    </>);
}