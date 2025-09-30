import { createSignal, createEffect, createMemo, type Component, For, onMount } from "solid-js";
import { Beaker, type RectState } from "./Beaker";
import { Scale } from "./Scale";

export const BeakerSystem: Component = () => {
  // central registry of rects
  const [beakers, setBeakers] = createSignal<RectState[]>([{
    "id": "b1",
    "x": 40,
    "y": 610,
    "value": 42,
    "z": 1
  },
  {
    "id": "b2",
    "x": 300,
    "y": 660,
    "value": 10,
    "z": 2
  }]);

  // Update the beaker list
  const update = (id: string, patch: Partial<RectState>) => {
    setBeakers(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  // small debug: log beakers when they change
  createEffect(() => console.log(beakers()));

  // Create an effect where the beakers are swapped 

  onMount(() => {
    console.log(beakers())
  })

  return (<>

      {/* Scale component - a fixed sensor box */}
      <Scale rectsSignal={beakers} />

      {/* Draggable items */}
      <For each={beakers()}>
        {item => <Beaker id={`b${item}`} initialX={item.x}  initialY={item.y} value={42} update={update} />}
      </For>

    </>
  );
};

export default BeakerSystem;
