import { onCleanup, onMount, type JSX } from "solid-js";
import { useMagnifier } from "./MagnifierContext";
import { getSVGCoords } from "../../ts/helpers";

// MagnifierEmitter component
interface MagnifierEmitterProps {
  emitterKey: string;
  svgRef: SVGElement;
  children?: JSX.Element;
}

export function MagnifierEmitter(props: MagnifierEmitterProps) {
  const magnifier = useMagnifier();

  onMount(() => {
    magnifier.registerEmitter(props.emitterKey, props.svgRef);
  });

  onCleanup(() => {
    magnifier.unregisterEmitter(props.emitterKey);
  });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = (e.currentTarget as SVGGElement).getBBox();
    const pt = getSVGCoords(e);
    const x = rect.x + rect.width/2;
    const y = pt.y;
    magnifier.setLensPosition({ x, y });
    magnifier.setActiveKey(props.emitterKey);
  };

  const handleMouseLeave = () => {
    magnifier.setActiveKey(null);
  };

  return (
    <g
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'crosshair' }}
      id={props.emitterKey}
    >
      {props.children}
    </g>
  );
}
