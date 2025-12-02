import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useMagnifier } from "./MagnifierContext";

// MagnifierLens component
interface MagnifierLensProps {
  scale?: number;
  size?: number;
}

export function MagnifierLens(props: MagnifierLensProps) {
  const scale = props.scale || 2;
  const size = props.size || 150;
  const magnifier = useMagnifier();
  let lensRef: HTMLDivElement | undefined;
  let svgRef: SVGSVGElement | undefined;

  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });

  onMount(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    onCleanup(() => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    });
  });

  return (
    <Show when={magnifier.activeKey()}>
      <div
        ref={lensRef}
        style={{
          position: 'fixed',
          left: `${mousePos().x + 20}px`,
          top: `${mousePos().y + 20}px`,
          width: `${size}px`,
          height: `${size}px`,
          'border-radius': '50%',
          border: '3px solid #333',
          'box-shadow': '0 4px 12px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          'pointer-events': 'none',
          'z-index': 1000,
          background: 'white'
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: '100%',
            height: '100%',
            'transform-origin': 'top left'
          }}
          viewBox={`${magnifier.lensPosition().x - size / (2 * scale)} ${magnifier.lensPosition().y - size / (2 * scale)} ${size / scale} ${size / scale}`}
        >
          <Show when={magnifier.activeKey()}>
            {(() => {
              const emitterRef = magnifier.getEmitterRef(magnifier.activeKey()!);
              
              if (!emitterRef) return null;
              
              const id = emitterRef.id || `emitter-${magnifier.activeKey()}`;
              if (!emitterRef.id) emitterRef.id = id;

              return <use href={`#${id}`} />;
            })()}
          </Show>
        </svg>
      </div>
    </Show>
  );
}
