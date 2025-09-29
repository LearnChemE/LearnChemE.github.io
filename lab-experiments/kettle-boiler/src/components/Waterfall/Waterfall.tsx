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
  const [min, max] = (rateRange?.length === 2) ? rateRange : [0, 20];
  const range = max - min;
  const sx = createMemo(() => constrain(rate() - min, 0, range) / range);

  // ClipHeight
  const [clipHeight, setClipHeight] = createSignal(0);

  // Animation for the water falling
  const waterfallAni = (dt: number) => {
    let h = clipHeight();
    h += dt * 4;
    setClipHeight(Math.min(h, 1));
    // Stop the animation when max height is passed
    return (h < 1 && rate() !== min);
  }
  animate(waterfallAni);

  // Restart the clip height animation any time the flowrate hits zero
  createEffect(() => {
    if (rate() === min) {
      setClipHeight(0);
      animate(waterfallAni);
    }
  });

  return (
  <>
    <path
      id={key + "-fall"}
      d="M20 0C13.3333 0 6.66667 0 0 0C0.666667 2.57048 1.74142 5.14097 2 7.71145C2.01303 7.84097 2.02611 7.97048 2.03924 8.1C2.65716 14.1969 3.37604 20.2938 3.5 26.3907C4.36416 68.8938 5.07674 111.397 5.85154 153.9C5.90076 156.6 5.95022 159.3 6 162C8.66667 162 11.3333 162 14 162C14.0498 159.3 14.0992 156.6 14.1485 153.9C14.9233 111.397 15.6358 68.8938 16.5 26.3907C16.624 20.2938 17.3428 14.1969 17.9608 8.1C17.9739 7.97048 17.987 7.84097 18 7.71145C18.2586 5.14097 19.3333 2.57048 20 0Z"
      fill="#3B8CCF"
      fill-opacity="0.6"
      transform={`translate(${cx},522) scale(${sx()},1) translate(-10,0)`}
      clip-path={`url(#${key}-clip)`}
    />
    <defs>
      <clipPath id={key + "-clip"} clipPathUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height={clipHeight()} />
      </clipPath>
    </defs>
  </>
)};

export default Waterfall;

