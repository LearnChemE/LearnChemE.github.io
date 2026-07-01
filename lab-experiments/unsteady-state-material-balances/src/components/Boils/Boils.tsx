import { createEffect, createSignal, For, Show, type Accessor, type Component, type Setter } from "solid-js";
import "./Boils.css";
import { animate, resolveProperty } from "../../globals";

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
    hrel: number;
    r: number;
    aniScale: number;
    interpolant: { get: Accessor<number>, set: Setter<number> };
    timeScale: number;
    render: { get: Accessor<boolean>, set: Setter<boolean> };
};

interface BoilProps {
    showing: () => boolean; 
    x: number | (() => number);
    y: number | (() => number);
    w: number | (() => number);
    h: number | (() => number);
    maxBubbles: number;
    nbubbles?: number | Accessor<number>;
    rate?: () => number;
}

function bcx(b: Bubble, amp: number) {
    return b.cx + amp * Math.cos(4 * b.interpolant.get() + 100 * b.cx);
}

function bcy(b: Bubble, h: Accessor<number>) {
    return b.cy - b.interpolant.get() * b.hrel * h();
}

export const Boils: Component<BoilProps> = (props) => {
    const x = resolveProperty(props.x);
    const y = resolveProperty(props.y);
    const w = resolveProperty(props.w);
    const h = resolveProperty(props.h);
    const rate = resolveProperty(props.rate, 1);
    const nbubbles = resolveProperty(props.nbubbles, props.maxBubbles);

    const amplitude = 0.05 * w();

    // Initialize the bubbles
    const bubbles: Array<Bubble> = [];
    for (let i=0; i<props.maxBubbles; i++) {
        const [get, set] = createSignal(Math.random())
        const [gr, sr] = createSignal(false);

        const r = randNormal(4, 2);
        const minx = x() + r + amplitude;
        const maxx = x() + w() - r - amplitude;
        const miny = y() + h() - r
        const maxy = y() + r;

        const bubble: Bubble = {
            cx: Math.random() * (maxx - minx) + minx,
            cy: miny,
            hrel: (miny - maxy) / h(),
            r,
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
        if (props.showing()) {
            // Dont double-enqueue
            if (playing) return;
            playing = true;
            // Animation
            animate((dt: number) => {
                let lingering = false;
                for (const [i, b] of bubbles.entries()) {
                    // Interpolate the 
                    let next = b.interpolant.get() + b.timeScale * dt * rate();
                    // Only change whether it's rendering when b 
                    if (next > 1) {
                        next -= 1;
                        b.render.set(props.showing() && i < nbubbles());
                    }
                    b.interpolant.set(next);
                    lingering = lingering || b.render.get();
                }
                // Exit when the animation is done playing and all bubbles are not rendered
                return playing || lingering;
            }, () => playing = false);
        }
    });

  return (<>
    {/* <Show when={showing()}> */}
      <For each={bubbles}>
          {
          (b, i) => <Show when={(i() <= rate() * props.maxBubbles)}>
                <circle 
                    fill="none"
                    stroke="white"
                    stroke-width="1.5px"
                    cx={bcx(b, amplitude)}
                    cy={bcy(b, h)}
                    r={b.r}
                    transform={`translate(${bcx(b, amplitude)}, ${bcy(b, h)}) scale(${1 + (b.aniScale - 1) * b.interpolant.get()}) translate(${-bcx(b, amplitude)}, ${-bcy(b, h)})`}
                    opacity={b.render.get() ? 1 - (2 * b.interpolant.get() - 1) ** 6 : 0}
                />    
            </Show>
          }
      </For>
    {/* </Show> */}
  </>);
};
