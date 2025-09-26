import "./BallValve.css";
import { createSignal, type Component } from "solid-js";

interface BallValveProps {
  onToggle?: (open: boolean) => void;
}

export const BallValve: Component<BallValveProps> = ({ onToggle }) => {
  // State
  const [isOpen, setIsOpen] = createSignal(false);

  // Rotation transform
  const rotation = () => `rotate(${isOpen() ? -90 : 0} 75 278)`;

  // Toggle function
  const toggleValve = () => {
    const open = !isOpen();
    setIsOpen(open);
    onToggle?.(open);
  };

  // Render
  return (
    <g id="ballValve" transform="translate(15, 0)">
      <g id="body_7">
        <rect
          id="Rectangle 48_8"
          x="60.5"
          y="266.5"
          width="29"
          height="23"
          fill="url(#paint80_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 49_7"
          x="87.5"
          y="263.5"
          width="14"
          height="29"
          rx="0.5"
          fill="url(#paint81_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 50_8"
          x="48.5"
          y="263.5"
          width="14"
          height="29"
          rx="0.5"
          fill="url(#paint82_linear_6_626)"
          stroke="black"
        />
      </g>
      <g class="valveHandle" onclick={toggleValve} transform={rotation()}>
        <rect
          id="Rectangle 51_8"
          x="69.5"
          y="266.5"
          width="11"
          height="17"
          rx="0.5"
          fill="#D9D9D9"
          stroke="black"
        />
        <path
          id="steamValveCenter"
          d="M76.3565 280.348H73.6445L72.2891 278L73.6445 275.652H76.3565L77.7119 278L76.3565 280.348Z"
          fill="#CECECE"
          stroke="black"
          stroke-width="0.5"
        />
        <path
          id="Rectangle 52_5"
          d="M72 189.5H78C81.0375 189.5 83.5 191.962 83.5 195V267C83.5 267.828 82.8284 268.5 82 268.5H68C67.1716 268.5 66.5 267.828 66.5 267V195C66.5 191.962 68.9624 189.5 72 189.5Z"
          fill="#EE6300"
          stroke="black"
        />
      </g>
    </g>
)};

export default BallValve;