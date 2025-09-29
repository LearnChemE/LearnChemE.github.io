import { createSignal, createEffect, createMemo, type Component } from "solid-js";
import { Beaker, type RectState } from "./Beaker";

const rectHit = (a: RectState, bx: number, by: number, bw: number, bh: number) => {
  // AABB overlap
  return !(a.x + 90 < bx || a.x > bx + bw || a.y + 122 < by || a.y > by + bh);
};

const Scale: Component<{ rectsSignal: () => RectState[] }> = (props) => {
  const x = 533;
  const y = 647;
  const w = 180;
  const h = 100;
  const [weight, setHoverVal] = createSignal<string | number | null>(null);

  // compute the sum of each overlapping rect's value
  const sum = createMemo(() => {
    const rects = props.rectsSignal();
    // find overlapping rects
    const hits = rects.filter(r => rectHit(r, x, y, w, h));
    if (hits.length === 0) return null;
    // pick highest z, then last registered (end of array) as tiebreaker
    hits.sort((a,b) => (a.z - b.z) || 0);
    return hits.map((hit) => hit.value).reduce((acc, val) => acc + val, 0);
  });

  // reflect into weight for easy reactive display
  createEffect(() => {
    setHoverVal(sum());
  });

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={w} height={h} fill="rgba(0,0,0,0.04)" stroke="#555" stroke-dasharray="4 3" />
      <text x={w/2} y={h/2 + 5} font-size="14" text-anchor="middle" fill="#222">
        {weight() === null ? "(empty)" : `value: ${weight()}`}
      </text>
    </g>
  );
};

export const BeakerSystem: Component = () => {
  // central registry of rects
  const [beakers, setBeakers] = createSignal<RectState[]>([]);

  // Register a new beaker into the list
  const register = (r: RectState) => {
    setBeakers(prev => {
      // avoid duplicates
      if (prev.find(x => x.id === r.id)) return prev;
      return [...prev, r];
    });
  };

  const update = (id: string, patch: Partial<RectState>) => {
    setBeakers(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  // small debug: log beakers when they change
  createEffect(() => console.log(beakers()));

  return (<>

      {/* Draggable items */}
      <Beaker id="b1" initialX={40}  initialY={610} value={42} z={1} register={register} update={update} />
      <Beaker id="b2" initialX={300} initialY={660} value={10} z={2} register={register} update={update} />

      {/* Scale component - a fixed sensor box */}
      <Scale rectsSignal={beakers} />
    </>
  );
};

export default BeakerSystem;