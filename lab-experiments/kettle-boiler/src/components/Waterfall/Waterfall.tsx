import { createEffect, createMemo, createSignal, type Accessor, type Component } from "solid-js";
import { animate, constrain } from "../../ts/helpers";

export interface WaterfallProps {
  key: string;
  cx: number;
  rate: Accessor<number>;
  rateRange?: [min: number, max: number];
};

export const Waterfall: Component<WaterfallProps> = ({ key, cx, rate, rateRange }) => {
  // Scale of x reacts to the flowrate
  const [min, max] = (rateRange?.length === 2) ? rateRange : [0, 1262];
  const range = max - min;
  const sx = createMemo(() => constrain(rate() - min, 0, range) / range);
  // createEffect(() => console.log(key, rate()))

  // ClipHeight
  const [clipHeight, setClipHeight] = createSignal(0);

  // Animation for the water falling
  const waterfallAni = (dt: number) => {
    let h = clipHeight();
    h += dt * 4;
    setClipHeight(Math.min(h, 1));
    // Stop the animation when max height is passed
    return (h < 1 && rate() !== 0);
  }
  let flowing = true;
  animate(waterfallAni);

  // Restart the clip height animation any time the flowrate hits zero
  createEffect(() => {
    if (sx() === 0) {
      flowing = false;
    }
    else if (flowing === false) {
      flowing = true;
      setClipHeight(0);
      animate(waterfallAni);
    }
  });

  return (
  <>
    <path
      id={key + "-fall"}
      d="M20 0C13.3333 0 6.66667 0 0 0C0.666667 2.72916 1.74142 5.45831 2 8.18747C2.01303 8.32498 2.02611 8.46249 2.03924 8.6C2.65716 15.0733 3.37604 21.5465 3.5 28.0198C4.36416 73.1465 5.07674 118.273 5.85154 163.4C5.90076 166.267 5.95022 169.133 6 172C8.66667 172 11.3333 172 14 172C14.0498 169.133 14.0992 166.267 14.1485 163.4C14.9233 118.273 15.6358 73.1465 16.5 28.0198C16.624 21.5465 17.3428 15.0733 17.9608 8.6C17.9739 8.46249 17.987 8.32498 18 8.18747C18.2586 5.45831 19.3333 2.72916 20 0Z"
      fill="#3B8CCF"
      fill-opacity="0.6"
      transform={`translate(${cx},522) scale(${sx()},1) translate(-10,0)`}
      // clip-path={`url(#${key}-clip)`}
      mask={`url(#${key}-mask)`}
    />
    <defs>
      <clipPath id={key + "-clip"} clipPathUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height={clipHeight()} />
      </clipPath>
      <mask maskUnits="objectBoundingBox" id={key + "-mask"} >
        <rect x="0" y="0" width="20" height="172" fill="white"/>
      </mask>
    </defs>
  </>
)};

export default Waterfall;

