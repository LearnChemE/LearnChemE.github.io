import { createEffect, createSignal, For, type Accessor, type Component, type Setter } from "solid-js";
import "./Boils.css";
import { animate } from "../../ts/helpers";

/**
 * Generate a value around a given mean with a given standard deviation
 * @param mean 
 * @param stdev 
 * @returns random value in distribution
 */
function randNormal(mean: number, stdev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // avoid 0 to prevent log(0)
    while (v === 0) v = Math.random();
    // Box-Muller transform
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdev;
}

type Bubble = {
    cx: number;
    cy: number;
    r: number;
    aniScale: number;
    interpolant: { get: Accessor<number>, set: Setter<number> };
    timeScale: number;
    render: { get: Accessor<boolean>, set: Setter<boolean> };
};

export const Boils: Component<{ showing: () => boolean, x: number, y: number, w: number, h: () => number, nbubbles: number }> = ({ showing, x, y, w, h, nbubbles }) => {
    // Initialize the bubbles
    const bubbles: Array<Bubble> = [];
    for (let i=0; i<nbubbles; i++) {
        const [get, set] = createSignal(Math.random())
        const [gr, sr] = createSignal(false);
        const bubble: Bubble = {
            cx: Math.random() * w + x,
            cy: Math.random() * 30 + y,
            r: randNormal(4, 2),
            aniScale: randNormal(1.4, .05),
            interpolant: { get, set },
            timeScale: randNormal(.5, .1),
            render: { get:gr, set:sr }
        };
        bubbles.push(bubble);
    }

    // Animate while showing
    let playing = false;
    createEffect(() => {
        if (showing()) {
            // Dont double-enqueue
            if (playing) return;
            playing = true;
            // Animation
            animate((dt: number) => {
                let lingering = false;
                for (const b of bubbles) {
                    // Interpolate the 
                    let next = b.interpolant.get() + b.timeScale * dt;
                    // Only change whether it's rendering when b 
                    if (next > 1) {
                        next -= 1;
                        b.render.set(showing());
                    }
                    b.interpolant.set(next);
                    lingering = lingering || b.render.get();
                }
                // Exit when the animation is done playing and all bubbles are not rendered
                return playing || lingering;
            }, () => playing = false);
        }
    });

  return (
    <g>
      <For each={bubbles}>
          {
          b => <circle 
                  fill="none"
                  stroke="white"
                  stroke-width="2px"
                  cx={b.cx + .05 * w * Math.cos(4 * b.interpolant.get() + 100 * b.cx)}
                  cy={b.cy - b.interpolant.get() * h()}
                  r={b.r}
                  transform={`translate(${b.cx}, ${b.cy}) scale(${1 + (b.aniScale - 1) * b.interpolant.get()}) translate(${-b.cx}, ${-b.cy})`}
                  opacity={b.render.get() ? 1 - (2 * b.interpolant.get() - 1) ** 6 : 0}
              />
          }
      </For>
    </g>
  );
};
