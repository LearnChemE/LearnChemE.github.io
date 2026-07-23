import { createSignal, createEffect, onCleanup, Show, type Accessor } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { AnimationTimer } from '../../globals/animate';

export interface SvgColorTooltipProps {
  svgRef: () => SVGSVGElement | null;
  disabled: Accessor<boolean>;
  animate: AnimationTimer;
}

export function SvgColorTooltip(props: SvgColorTooltipProps) {
  const [tooltipVisible, setTooltipVisible] = createSignal(false);
  const [tooltipPos, setTooltipPos] = createSignal({ x: 0, y: 0 });
  const [sRgbColor, setSRgbColor] = createSignal<string>('');

  // Create an invisible, in-memory canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
  let rootSvg: SVGSVGElement | undefined;
  let elapsed = 0;
  const updateInterval = 0.5; // s

  const updateCanvas = async (svgNode: SVGSVGElement) => {
    if (!ctx) return;

    // Use the root SVG bounding box for accurate scaling and rendering
    const rect = svgNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clone the SVG and enforce explicit dimensions so the canvas draws it accurately
    const clone = svgNode.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', `${rect.width}px`);
    clone.setAttribute('height', `${rect.height}px`);

    // Serialize to an image
    const svgStr = new XMLSerializer().serializeToString(clone);
    const encoded = encodeURIComponent(svgStr).replace(/'/g, '%27').replace(/"/g, '%22');
    const url = `data:image/svg+xml;charset=utf-8,${encoded}`;

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    // Clear and draw onto the invisible canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const updateSRgb = () => {
    const pos = tooltipPos();
    if (!rootSvg || !ctx) return;

    // Calculate position relative to the root SVG
    const rect = rootSvg.getBoundingClientRect();
    const x = Math.max(0, Math.min(pos.x - rect.left, rect.width - 1));
    const y = Math.max(0, Math.min(pos.y - rect.top, rect.height - 1));

    try {
      // Read 1x1 pixel data at the exact mouse coordinate
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b, a] = pixelData;

      if (a === 0) {
        setSRgbColor('Transparent');
      } else {
        // Format as hex (or you can leave it as rgb(r, g, b))
        const hex = `${[r, g, b].map(v => v.toString(10).padStart(2, '0')).join(', ')}`;
        setSRgbColor(`rgb(${hex.toUpperCase()})`);
      }
      
      // setTooltipVisible(true);
    } catch (err) {
      // Fallback if the canvas gets tainted by cross-origin <image> tags inside the SVG
      setSRgbColor('Error: Tainted Canvas');
    }
  }

  createEffect(() => {
    const el = props.svgRef();
    if (!el) throw new Error("props.elem is undefined");

    // Get the parent <svg> to ensure we capture the whole context if a child element is passed
    rootSvg = el.tagName.toLowerCase() === 'svg' 
        ? (el as SVGSVGElement) 
        : el.ownerSVGElement!;

    const handleMouseEnter = async () => {
      if (props.disabled() || !rootSvg) return;
      await updateCanvas(rootSvg);
      setTooltipVisible(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (props.disabled() || !rootSvg || !ctx) {
        setTooltipVisible(false);
        return;
      }

      setTooltipPos({ x: e.clientX, y: e.clientY });
      updateSRgb();
    };

    const handleMouseLeave = () => {
      setTooltipVisible(false);
    };

    props.animate?.subscribe(async (dt: number) => {
      elapsed += dt;
      if (elapsed < updateInterval) return;
      elapsed -= updateInterval;

      await updateCanvas(rootSvg!);
      updateSRgb();
    });
    
    el.addEventListener('pointerenter', handleMouseEnter);
    el.addEventListener('pointermove', handleMouseMove);
    el.addEventListener('pointerleave', handleMouseLeave);

    onCleanup(() => {
      el.removeEventListener('pointerenter', handleMouseEnter);
      el.removeEventListener('pointermove', handleMouseMove);
      el.removeEventListener('pointerleave', handleMouseLeave);
    });
  });

  return (
    <Show when={tooltipVisible() && !props.disabled()}>
      <Portal>
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPos().x + 15}px`,
            top: `${tooltipPos().y + 15}px`,
            "z-index": 9999,
            "pointer-events": 'none',
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            padding: '4px 8px',
            "border-radius": '4px',
            "font-family": 'monospace',
            "font-size": '12px',
            "box-shadow": '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {sRgbColor()}
        </div>
      </Portal>
    </Show>
  );
}