import { createSignal, For, type Component, type Setter } from "solid-js"
import "./PRegulator.css";

interface PRegulatorProps {
    setPressure: Setter<number>;
}


const PRegLines: Component<{l: () => number}> = ({l}) => {
    const xMin = 135.5; // At 0 degrees
    const xMax = 196.5; // At 180 degrees
    const xAmp = (xMax - xMin) / 2;
    const cx = 166; // Center x
    const dTh = 180 / 10; // 10 segments of 18 degrees each

    return (
        <>
            <For each={Array.from({length: 10}, (_,i) => (i * dTh + dTh - (300 * l()) % 18))}>
                {th => {
                    // Calculate spoke angle
                    if (th > 180) return null; // Don't render past 180 degrees
                    const rad = th * Math.PI / 180; // Radians

                    // Calculate line position
                    const x = cx + xAmp * Math.cos(rad);
                    return <line x1={x} y1="191" x2={x} y2="200" stroke="#111D38" stroke-width="1" stroke-linecap="round"/>;
                }}
            </For>
        </>
    );
}

export const PRegulator: Component<PRegulatorProps> = ({ setPressure }) => {
    // lift signal for animation
    const [l, setL] = createSignal(0);

    const startDrag = (e: MouseEvent) => {
        e.preventDefault();
        var startX = e.clientX;
        
        const onDrag = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            startX = e.clientX;

            // Update lift with clamping
            const newL = Math.min(1, Math.max(0, l() + deltaX * 0.003));
            setL(newL);

            // Update pressure
            const newP = 20 * newL; // Scale lift to pressure (0-15 psi)
            setPressure(newP);
        };

        const endDrag = () => {
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", endDrag);
        };

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
    };

    return (
    <g id="pRegHandle" class="preg-valve drag-exempt" onmousedown={startDrag}>
        <rect id="pRegHandle_2" x="134" y="189.5" width="64" height="12" rx="6" fill="#5C8DF6" stroke="black"/>
        <PRegLines l={l}/>
    </g>
)}
