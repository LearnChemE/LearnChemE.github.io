import { type Component, createSignal, onMount, onCleanup } from "solid-js";

interface MagnifierProps {
    /** id of the element to copy with <use> (should exist in the same SVG) */
    targetId: string;
    /** magnification factor */
    scale?: number;
    /** initial circle center and radius in SVG coordinates */
    circle?: { cx: number; cy: number; r: number };
    /** if true the magnifier will follow the mouse over the first <svg> in the document */
    followMouse?: boolean;
    hideOnMouseLeave?: boolean;
    show?: () => boolean;
}

export const Magnifier: Component<MagnifierProps> = (props) => {
    const scale = props.scale ?? 2.2;
    const follow = props.followMouse ?? true;
    const mOver = props.hideOnMouseLeave ?? false;
    const initial = props.circle ?? { cx: 150, cy: 150, r: 75 };

    const [cx, setCx] = createSignal(initial.cx);
    const [cy, setCy] = createSignal(initial.cy);
    const [r] = createSignal(initial.r);
    const [opacity, setOpacity] = createSignal(1);

    // unique ids for clipPath to avoid collisions when multiple magnifiers exist
    const uid = `magnifier-${Math.floor(Math.random() * 1e9)}`;
    const clipId = `clip-${uid}`;
    const showFn = (props.show === undefined) ? () => true : props.show;

    // compute SVG coordinates from client mouse event
    function clientToSVG(evt: PointerEvent) {
        const svg = document.querySelector("svg");
        if (!svg) return null;
        const pt = (svg as unknown as SVGSVGElement).createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const svgP = pt.matrixTransform((svg as SVGSVGElement).getScreenCTM()!.inverse());
        return svgP;
    }

    let onPointerMove: (e: PointerEvent) => void;

    let ref!: SVGGElement;
    onMount(() => {
        if (mOver) {
            ref.addEventListener("mouseover", () => setOpacity(1));
            ref.addEventListener("mouseleave", () => setOpacity(0));
            setOpacity(0);
        }
        if (!follow) return;
        onPointerMove = (e: PointerEvent) => {
            const p = clientToSVG(e);
            if (!p) return;
            setCx(p.x);
            setCy(p.y);
        };
        window.addEventListener("pointermove", onPointerMove);
    });

    onCleanup(() => {
        if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
    });

    // The trick: we render a clipped group containing a <use> of the target element,
    // and transform it so the region around (cx,cy) is scaled about that point.
    // Transform = translate(cx,cy) scale(s) translate(-cx,-cy)
    const transform = () => `translate(${cx()} ${cy()}) scale(${scale}) translate(${-cx()} ${-cy()})`;

    return (
        <g class={"magnifier" + (showFn() ? "" : " hidden")} ref={ref} opacity={opacity()}>
            <defs>
                <clipPath id={clipId}>
                    <circle cx={cx()} cy={cy()} r={r() / scale} />
                </clipPath>
            </defs>
            
            {/* background */}
            <circle cx={cx()} cy={cy()} r={r()} fill="white" />
            
            {/* scaled copy clipped to circle */}
            <g clip-path={`url(#${clipId})`} transform={transform()}>
                <use href={`#${props.targetId}`} z-index="4" />
            </g>

            {/* rim */}
            <circle cx={cx()} cy={cy()} r={r()} fill="none" stroke="#111" stroke-width="2" opacity=".9" />
        </g>
    );
};

export default Magnifier;