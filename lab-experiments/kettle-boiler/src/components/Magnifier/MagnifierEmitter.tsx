import { createEffect, onCleanup, type Accessor, type JSX } from "solid-js";
import { useMagnifier } from "./MagnifierContext";
import { getSVGCoords } from "../../ts/helpers";

// MagnifierEmitter component
interface MagnifierEmitterProps {
  emitterKey: string;
  svgRef: Accessor<SVGElement | null>;
  children?: JSX.Element;
  scale: number;
  moveX?: boolean;
  moveY?: boolean;
  offset?: { x: number; y: number };
}

export function MagnifierEmitter(props: MagnifierEmitterProps) {
  const magnifier = useMagnifier();
  const offset = props.offset || { x: 0, y: 0 };

  createEffect(() => {
    const ref = props.svgRef();
    if (ref) {
      magnifier.registerEmitter(props.emitterKey, ref);
    }
  });

  onCleanup(() => {
    magnifier.unregisterEmitter(props.emitterKey);
  });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = (e.currentTarget as SVGGElement).getBBox();
    const pt = getSVGCoords(e);
    const x = (props.moveX) ? pt.x : rect.x + rect.width/2;
    const y = (props.moveY) ? pt.y : rect.y + rect.height/2;
    magnifier.setLensPosition({ x: x + offset.x, y: y + offset.y });
    magnifier.setActiveKey(props.emitterKey);
    magnifier.setScale(props.scale);
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
