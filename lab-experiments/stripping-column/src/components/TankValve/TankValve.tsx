import { createMemo, type Accessor, type Component, type Setter } from "solid-js";
import { animate, constrain, MAX_PRESSURE, MAX_TANK_VALVE_ROTATION, paddedHeight } from "../../globals";

type TankValveProps = {
    pressure: Accessor<number>;
    setPressure: Setter<number>;
}

function Sin(x: number) {
    return Math.sin(x * Math.PI / 180);
}
function Cos(x: number) {
    return Math.cos(x * Math.PI / 180);
}

const VALVE_WIDTH = 27;
const BAFFLE_WIDTH = 8;

export const TankValve: Component<TankValveProps> = (props) => {
    const rotation = createMemo(() => (1 - props.pressure() / MAX_PRESSURE) * MAX_TANK_VALVE_ROTATION % 60);

    let playing = false;
    const start = () => {
        if (playing) return;
        playing = true;

        // Determine direction
        const dthdt = (props.pressure() === 0) ? +90 : -90;
        const target = (props.pressure() === 0) ? 
                    (p: number) => p >= MAX_PRESSURE :
                    (p: number) => p <= 0;
        // Convert to pressure
        const dpdt = dthdt * MAX_PRESSURE / MAX_TANK_VALVE_ROTATION;

        // Create the animation callback
        const frame = (dt: number) => {
            let p = props.pressure();
            p += dpdt * dt;

            if (target(p)) {
                p = constrain(p, 0, MAX_PRESSURE);
                playing = false;
            }

            props.setPressure(p);
            return playing;
        }

        animate(frame);
    }

    return (<g transform={`translate(517.5, ${153 + paddedHeight()})`}
        class="drag-exempt globeValveHandle"
        onClick={start}>
    <rect x="0" y="1" width={VALVE_WIDTH} height="9" rx="2.5" fill="#67A8EF" stroke="black"/>
    <TValveBaffle offset={0}   rotation={rotation} />
    <TValveBaffle offset={60}  rotation={rotation} />
    <TValveBaffle offset={120} rotation={rotation} />
    </g>);
}

type TValveBaffleProps = {
    rotation: Accessor<number>;
    offset: number;
}

const TValveBaffle: Component<TValveBaffleProps> = (props) => {
    const angle = createMemo(() => (props.rotation() + props.offset) % 180);
    const width = createMemo(() => {
        const w = BAFFLE_WIDTH * Sin(angle());
        return w > .3 ? w : 0;
    });

    return (
    <rect x={VALVE_WIDTH / 2 * (1 - Cos(angle())) - width() / 2} y="0" 
        width={width()} height="11" rx="1.5" fill="#67A8EF" stroke="black"/>
    );
}