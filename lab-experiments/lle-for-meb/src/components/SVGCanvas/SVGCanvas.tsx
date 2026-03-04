import { onMount, type Accessor, type Component } from "solid-js";
import "./SVGCanvas.css";
import { enableWindowResize, initSvgDrag, initSvgZoom, resolveProperty } from "../../ts/helpers";

type SVGCanvasProps = {
    width?: number | Accessor<number>;
    height?: number | Accessor<number>;
    children?: any;
    defs?: any;
}

export const SVGCanvas: Component<SVGCanvasProps> = (props) => {
    const width = resolveProperty(props.width, 800);
    const height = resolveProperty(props.height, 600);
    const defaultWidth = width();
    const defaultHeight = height();

    onMount(() => {
        // Initialize SVG zooming
        initSvgZoom();
        // Initialize SVG dragging with exempt element IDs
        initSvgDrag();
        // Add the resizing handler
        enableWindowResize();
    });

    return (
        <svg
            width={width()}
            height={height()}
            viewBox={`0 0 ${defaultWidth} ${defaultHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="canvas">
                {/* Backdrop */}
                <rect width={width()} height={height()} fill="white" />
                { /* SVG content goes here */ }
                { props.children }
            </g>
            { props.defs && <defs>{props.defs}</defs> }
        </svg>
    )
}