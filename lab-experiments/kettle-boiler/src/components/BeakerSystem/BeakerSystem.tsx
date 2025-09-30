import { createSignal, type Component, For, type Accessor, type Setter } from "solid-js";
import { Beaker, type RectState } from "./Beaker";
import { Scale } from "./Scale";

type SignalT = [get: Accessor<number>, set: Setter<number>];

export const BeakerSystem: Component = () => {
  // central registry of rects
  const [beakers, setBeakers] = createSignal<RectState[]> ([{
    idx: 0,
    x: 40,
    y: 610,
    value: 42,
    blocking: null
  },
  {
    idx: 1,
    x: 300,
    y: 660,
    value: 10,
    blocking: null
  }]);

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
    if (value === null) console.log(`Unblocking`, which)
    else console.log(`Blocking`, which, value)
    // update immutably so Solid's signal setter sees a new reference
    setIsBlocked(prev => {
      const arr = [...prev];
      arr[which] = value;
      return arr;
    });
  }

  // Create an effect where the beakers are swapped 

  return (<>

      {/* Scale component - a fixed sensor box */}
      <Scale blockSignal={isBlocked} blockIds={[1,2]} />

      {/* Draggable items */}
      <For each={beakers()}>
        {(item) => <Beaker idx={item.idx} initialX={item.x}  initialY={item.y} value={item.value} 
        blocking={item.blocking}
        update={update} block={block} isBlocked={isBlocked} />}
      </For>

    </>
  );
};

export default BeakerSystem;
