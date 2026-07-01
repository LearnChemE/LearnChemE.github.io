import { createEffect, createMemo, createSignal, type Accessor, type Component, type Setter } from "solid-js";
import { animate, constrain, resolveProperty } from "../../globals";
import "./CylinderValve.css";

type CylinderValveProps = {
    lift: Accessor<number>;
    setLift: Setter<number>;
    disabled?: Accessor<boolean>;
    maxRotation: number;
    x: number;
    y: number;
}

function Sin(x: number) {
    return Math.sin(x * Math.PI / 180);
}
function Cos(x: number) {
    return Math.cos(x * Math.PI / 180);
}

const VALVE_WIDTH = 47;
const BAFFLE_WIDTH = 12;

export const CylinderValve: Component<CylinderValveProps> = (props) => {
    const rotation = createMemo(() => (1 - props.lift()) * -props.maxRotation % 60);
    const disabled = resolveProperty(props.disabled, false);
    const [flash, setFlash] = createSignal(false);

    const flashAni = (_: number, time: number) => {
        const t = Math.floor(time / 500);
        const flashing = (t % 2 === 0);
        if (flashing !== flash()) {
            setFlash(flashing);
        }
        return time < 3000;
    }
    createEffect(() => {
        if (props.disabled && !disabled()) {
            animate(flashAni, () => setFlash(false));
        }
    });

    let playing = false;
    const start = () => {
        if (playing) return;
        playing = true;

        // Determine direction
        const dthdt = (props.lift() === 0) ? -90 : +90;
        const target = (props.lift() === 0) ? 
                    (p: number) => p >= 1 :
                    (p: number) => p <= 0;
        // Convert to pressure
        const dpdt = dthdt / -props.maxRotation;

        // Create the animation callback
        const frame = (dt: number) => {
            let p = props.lift();
            p += dpdt * dt;

            if (target(p)) {
                p = constrain(p, 0, 1);
                playing = false;
            }

            props.setLift(p);
            return playing;
        }

        animate(frame);
    }

    return (<g transform={`translate(${props.x}, ${props.y})`}
        class={"drag-exempt clickable " + (disabled() ? "tv-disabled" : "") + (flash() ? "tv-flash" : "")}
        onClick={start}
        style="transition: filter 400ms ease-in-out">
        {/* <rect x="0" y="1" width={VALVE_WIDTH} height="9" rx="2.5" fill="#67A8EF" stroke="black"/> */}
        <rect x="0.5" y="2.5" width={VALVE_WIDTH} height="13" rx="5.5" fill="#67A8EF" stroke="black"/>
        <TValveBaffle offset={60}   rotation={rotation} />
        <TValveBaffle offset={120}  rotation={rotation} />
        <TValveBaffle offset={180} rotation={rotation} />

        {/* <rect x="6.5" y="0.5" width="11" height="17" rx="1.5" fill="#67A8EF" stroke="black"/>
        <rect x="30.5" y="0.5" width="11" height="17" rx="1.5" fill="#67A8EF" stroke="black"/> */}

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
    <rect x={VALVE_WIDTH / 2 * (1 - Cos(angle())) - width() / 2 + 0.5} y="0.5" 
        width={width()} height="17" rx="1.5" fill="#67A8EF" stroke="black"/>
    );
}