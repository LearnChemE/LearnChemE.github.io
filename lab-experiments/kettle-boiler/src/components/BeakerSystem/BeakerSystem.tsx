import { createSignal, type Component, For, type Accessor, type Setter, createEffect } from "solid-js";
import { Beaker, type RectState } from "./Beaker";
import { Scale } from "./Scale";
import { animate } from "../../ts/helpers";

type SignalT = [get: Accessor<number>, set: Setter<number>];

interface BeakerSystemProps {
  leftFlow: Accessor<number>; // in g/s
  rightFlow: Accessor<number>; // in g/s
};

export const BeakerSystem: Component<BeakerSystemProps> = ({ leftFlow, rightFlow }) => {
  // central registry of rects
  const [beakers, setBeakers] = createSignal<RectState[]> ([{
    idx: 0,
    x: 280,
    y: 610,
    value: 0,
    blocking: null
  },
  {
    idx: 1,
    x: 700,
    y: 610,
    value: 0,
    blocking: null
  }]);
  
  // Create stable signals for each beaker's value so any references (eg. stored in isBlocked)
  // remain valid even if the beaker component is re-created or the beakers array is re-ordered.
  const valueSignals = new Map<number, [get: Accessor<number>, set: Setter<number>]>();
  // Ensure signals exist for current beakers
  beakers().forEach(b => {
    if (!valueSignals.has(b.idx)) valueSignals.set(b.idx, createSignal(b.value));
  });

  // Update the beaker list
  const update = (idx: number, patch: Partial<RectState>) => {
    setBeakers(prev => {
      const updated = prev.map(r => r.idx === idx ? { ...r, ...patch } : r);
      // return a new, sorted array so Solid sees a new reference
      return [...updated].sort((a, b) => a.y - b.y);
    });
  };

  // Block a source
  const [isBlocked, setIsBlocked] = createSignal<Array<SignalT | null>> ([null, null, null, null]);
  const block = (which: number, value: SignalT | null) => {
    // update immutably so Solid's signal setter sees a new reference
    setIsBlocked(prev => {
      const arr = [...prev];
      arr[which] = value;
      return arr;
    });
  }

  // Create an effect for the fillers
  let playing = false;
  const play = () => {
    // Dont play two
    if (playing) return;
    playing = true;

    const frame = (dt: number) => {
      // Check the blocks to see if we should update
      const blocks = isBlocked();
      // Left drain
      if (blocks[0] !== null) {
        const val = blocks[0][0]();
        const setter = blocks[0][1];
        setter(val + leftFlow() * dt);
      // console.log("playing frame", val)
      }
      // Right drain
      if (blocks[3] !== null) {
        const val = blocks[3][0]();
        const setter = blocks[3][1];
        setter(val + rightFlow() * dt);
      }
      return playing;
    }

    animate(frame);
  }

  // Play the animation if a beaker is in a filler with nonzero flowrate
  createEffect(() => {
    const blocks = isBlocked();
    const fillers = [blocks[0], blocks[3]];
    if (fillers[0] !== null && leftFlow() !== 0) play();
    else if (fillers[1] !== null && rightFlow() !== 0) play();
    else playing = false;
  });

  return (<>

      {/* Scale component - a fixed sensor box */}
      <Scale blockSignal={isBlocked} blockIds={[1,2]} />

      {/* Draggable items */}
      <For each={beakers()}>
        {(item) => {
          // ensure a stable signal exists for this beaker
          let sig = valueSignals.get(item.idx);
          if (!sig) {
            sig = createSignal(item.value);
            valueSignals.set(item.idx, sig);
          }
          return (
            <Beaker idx={item.idx} initialX={item.x}  initialY={item.y} value={item.value}
              blocking={item.blocking}
              update={update} block={block} isBlocked={isBlocked}
              valueSignal={sig} />
          )
        }}</For>
    </>
  );
};

export default BeakerSystem;
