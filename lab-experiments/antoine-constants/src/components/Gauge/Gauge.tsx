import { createMemo, createSignal, onMount, type Accessor, type Component } from "solid-js";
import { constrain } from "../../ts/helpers";

interface GaugeProps {
  pressure: Accessor<number>; // in psig
  maxPressure: number; // in psig
}

export const Gauge: Component<GaugeProps> = ({ pressure, maxPressure }) => {
  const [center, setCenter] = createSignal({ x: 0, y: 0 });
  // Range of needle angle: -135 to 135 degrees
  const minAngle = -135; // degrees
  const maxAngle = 135; // degrees

  // Angle of the needle
  const needleAngle = createMemo(() => pressure() / maxPressure * (maxAngle - minAngle) + minAngle);

  // Get the center of rotation
  let ref!: SVGPathElement;
  onMount(() => {
    const bbox = ref.getBBox();
    setCenter({ x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 });
  });

  // Render
  return (
  <>
    <path 
      id="needle" 
      class="gauge-needle"
      transform={`translate(248 45) rotate(${constrain(needleAngle(), minAngle, maxAngle)} ${center().x} ${center().y})`}
      d="M1.26703 33.9014C1.3736 33.3497 1.46313 32.798 1.53562 32.2463C1.68989 31.0723 1.76703 29.8983 1.76703 28.7244C1.76703 24.5573 1.76703 20.3902 1.76703 16.2231C1.76703 11.6336 1.63421 7.04418 1.36858 2.45473C1.33665 1.90304 1.3028 1.35135 1.26703 0.799649C1.23126 1.35135 1.19741 1.90304 1.16548 2.45473C0.899845 7.04418 0.767029 11.6336 0.767029 16.2231C0.767029 20.3902 0.767029 24.5573 0.767029 28.7244C0.767029 29.8983 0.844164 31.0723 0.998433 32.2463C1.07093 32.798 1.16046 33.3497 1.26703 33.9014Z" 
      fill="#E00000"
    />
    <path 
      ref={ref}
      id="center" 
      transform="translate(248 45)"
      d="M1.2666 27.1298C1.68497 27.1298 2.02335 27.4676 2.02344 27.8827C2.02344 28.2979 1.68502 28.6357 1.2666 28.6357C0.848367 28.6354 0.510742 28.2978 0.510742 27.8827C0.510825 27.4678 0.848418 27.13 1.2666 27.1298Z" 
      fill="#D9D9D9" 
      stroke="black" 
      stroke-width="0.5"
    />
  </>
)};

export default Gauge;