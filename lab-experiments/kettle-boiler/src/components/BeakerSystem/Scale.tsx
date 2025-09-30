import { createMemo, createSignal, type Accessor, type Component, type Setter } from "solid-js";
import "./Scale.css"

type SignalT = [get: Accessor<number>, set: Setter<number>];

const EMPTY_BEAKER_WEIGHT = 538.1; // g

export interface ScaleProps {
  blockSignal: Accessor<Array<SignalT | null>>;
  blockIds: number[];
}

export const Scale: Component<ScaleProps> = ({ blockSignal, blockIds }) => {
  const [tare, setTare] = createSignal(0);

  // compute the sum of each overlapping rect's value
  const weight = createMemo(() => {
    const all = blockSignal();
    // select entries whose index is in blockIds
  const blocks = all.filter((_, idx) => blockIds.includes(idx));
    // type guard to filter out nulls
    const signals: SignalT[] = blocks.filter((block): block is SignalT => block !== null);

    const sum = signals.reduce((acc, s) => acc + s[0]() + EMPTY_BEAKER_WEIGHT, 0);
    return sum;
  });

  return (
    <g> 
      <text
        class="scale-label"
        x={`${631}`}
        y={`${720}`}
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="26"
      >
        {`${(weight() - tare()).toFixed(1)}`}
      </text>
      <text
        class="scale-label"
        x={`${651}`}
        y={`${722}`}
        fill="#d7ce1bff"
        font-family="'Digital-7 Mono', monospace"
        font-size="18"
      >
        g
      </text>
      <g class="button" onclick={() => setTare(weight())}>
        <rect
          id="upBtnbase"
          x="670.5"
          y="702.5"
          width="35"
          height="35"
          rx="5.5"
          fill="#D51F1F"
          stroke="black"
        />
        <path
          id="0_3"
          d="M688 733.44C685.52 733.44 683.613 732.333 682.28 730.12C680.947 727.907 680.28 724.76 680.28 720.68C680.28 716.733 680.947 713.627 682.28 711.36C683.613 709.067 685.52 707.92 688 707.92C690.48 707.92 692.387 709.067 693.72 711.36C695.053 713.627 695.72 716.733 695.72 720.68C695.72 724.76 695.053 727.907 693.72 730.12C692.387 732.333 690.48 733.44 688 733.44ZM683.16 720.68C683.16 722.387 683.28 723.907 683.52 725.24L692 714.32C691.6 713.067 691.053 712.093 690.36 711.4C689.693 710.707 688.907 710.36 688 710.36C686.48 710.36 685.293 711.293 684.44 713.16C683.587 715.027 683.16 717.533 683.16 720.68ZM688 731C689.52 731 690.707 730.107 691.56 728.32C692.413 726.533 692.84 723.987 692.84 720.68C692.84 719.213 692.747 717.88 692.56 716.68L684.08 727.44C684.907 729.813 686.213 731 688 731Z"
          fill="#320101"
        />
      </g>
    </g>
  );
};
