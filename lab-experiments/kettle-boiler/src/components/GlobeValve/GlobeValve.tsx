import { getAngleFromDown, getSVGCoords } from "../../ts/helpers";
import "./GlobeValve.css";
import { createSignal, type Component } from "solid-js";

interface GlobeValveProps {
  onLiftChange?: (lift: number) => void;
}

export const GlobeValve: Component<GlobeValveProps> = ({ onLiftChange }) => {
  const maxAngle = -720; // Degrees for fully open

  // State
  let [currentAngle, setCurrentAngle] = createSignal(0); // in pixels, range from 0 (closed) to 20 (fully open)
  let isDragging = false;
  let prevTh = 0;

  // Begin drag
  const beginDrag = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    const svgMozCoords = getSVGCoords(e);
    prevTh = getAngleFromDown({x:498, y:629}, {x:svgMozCoords.x, y:svgMozCoords.y});
    document.addEventListener("pointermove", onDrag);
    document.addEventListener("pointerup", endDrag);
  };

  // On drag
  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    // Calculate angle change
    const angle = currentAngle();
    const svgMozCoords = getSVGCoords(e);
    const th = getAngleFromDown({x:498, y:629}, {x:svgMozCoords.x, y:svgMozCoords.y});
    let deltaTh = th - prevTh; // Positive if moving up
    if (Math.abs(deltaTh) > 180) {
      // Handle wrap-around
      if (deltaTh > 0) {
        // Moving from 359 to 0
        deltaTh -= 360;
      } else {
        // Moving from 0 to 359
        deltaTh += 360;
      }
    }

    // Update angle with clamping
    let newAngle = angle + deltaTh;
    newAngle = Math.min(0, Math.max(maxAngle, newAngle)); // Clamp between 0 and 20

    // Update state and callback if changed
    if (newAngle !== angle) {
      setCurrentAngle(newAngle);
      onLiftChange?.(newAngle / maxAngle); // Normalize to [0, 1]
    }
    
    // Update previous angle
    prevTh = th;
  };

  // End drag
  const endDrag = () => {
    isDragging = false;
    document.removeEventListener("pointermove", onDrag);
    document.removeEventListener("pointerup", endDrag);
  };

  // Render
  return (
    <g id="globeValve">
      <g id="body_8">
        <rect
          id="Rectangle 48_9"
          x="509.5"
          y="614.5"
          width="29"
          height="23"
          transform="rotate(90 509.5 614.5)"
          fill="url(#paint83_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 49_8"
          x="512.5"
          y="641.5"
          width="14"
          height="29"
          rx="0.5"
          transform="rotate(90 512.5 641.5)"
          fill="url(#paint84_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 50_9"
          x="512.5"
          y="602.5"
          width="14"
          height="29"
          rx="0.5"
          transform="rotate(90 512.5 602.5)"
          fill="url(#paint85_linear_6_626)"
          stroke="black"
        />
      </g>
      <g id="feedValve" class="drag-exempt globeValveHandle" onpointerdown={beginDrag} transform={`rotate(${currentAngle()} 498 629)`}>
        <circle cx="498" cy="629" r="20" fill="red" opacity={0} />
        <path
          id="valve"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M514.391 610.729C515.395 610.809 516.192 611.606 516.272 612.61L516.901 620.488C516.936 620.919 517.104 621.327 517.384 621.656L522.51 627.67C523.164 628.437 523.164 629.565 522.51 630.332L517.384 636.346C517.105 636.675 516.936 637.083 516.901 637.514L516.272 645.392C516.192 646.396 515.395 647.193 514.391 647.273L506.513 647.902C506.083 647.936 505.674 648.105 505.346 648.385L499.332 653.511L499.183 653.626C498.424 654.161 497.388 654.123 496.67 653.511L490.655 648.385C490.327 648.105 489.918 647.936 489.488 647.902L481.61 647.273L481.424 647.25C480.57 647.103 479.898 646.431 479.751 645.577L479.729 645.391L479.1 637.513C479.07 637.137 478.937 636.777 478.716 636.473L478.617 636.346L473.49 630.332C472.837 629.565 472.837 628.437 473.49 627.67L478.617 621.656C478.861 621.368 479.022 621.019 479.081 620.648L479.1 620.488L479.729 612.61C479.809 611.606 480.606 610.809 481.61 610.729L489.488 610.1C489.864 610.07 490.224 609.937 490.528 609.717L490.655 609.617L496.669 604.491C497.436 603.837 498.565 603.837 499.331 604.491L505.346 609.617C505.633 609.862 505.982 610.022 506.353 610.082L506.513 610.1L514.391 610.729ZM483.148 636.818C483.154 636.861 483.161 636.903 483.166 636.946L483.19 637.188L483.519 641.306L487.546 637.279C487.094 636.709 486.695 636.112 486.349 635.493L483.148 636.818ZM491.508 640.651C490.889 640.306 490.292 639.907 489.722 639.455L485.696 643.482L489.814 643.812L490.055 643.835C490.098 643.84 490.14 643.846 490.183 643.852L491.508 640.651ZM479.06 630.539L481.74 633.685C481.82 633.779 481.897 633.876 481.971 633.975L485.173 632.647C484.977 631.955 484.84 631.25 484.758 630.539L479.06 630.539ZM496.462 642.242C495.751 642.16 495.046 642.024 494.353 641.828L493.027 645.03C493.125 645.104 493.222 645.181 493.316 645.262L496.462 647.941L496.462 642.242ZM481.97 624.026C481.944 624.061 481.919 624.096 481.893 624.13L481.74 624.317L479.058 627.462L484.758 627.462C484.841 626.751 484.976 626.045 485.173 625.353L481.97 624.026ZM501.648 641.828C500.955 642.024 500.25 642.162 499.539 642.244L499.54 647.941L502.685 645.262C502.779 645.181 502.876 645.104 502.974 645.03L501.648 641.828ZM498.795 631.971C498.274 632.109 497.727 632.109 497.206 631.971L491.917 637.261C495.523 639.924 500.478 639.924 504.084 637.261L498.795 631.971ZM489.741 622.917C487.078 626.523 487.078 631.478 489.741 635.084L495.03 629.795C494.892 629.275 494.892 628.727 495.03 628.207L489.741 622.917ZM483.189 620.814C483.18 620.937 483.165 621.06 483.148 621.182L486.349 622.508C486.695 621.888 487.094 621.291 487.546 620.722L483.518 616.694L483.189 620.814ZM506.279 639.455C505.709 639.907 505.112 640.306 504.493 640.651L505.819 643.853C505.941 643.836 506.064 643.822 506.187 643.812L510.306 643.483L506.279 639.455ZM490.182 614.147C490.06 614.165 489.937 614.18 489.814 614.19L485.694 614.518L489.722 618.547C490.292 618.095 490.889 617.694 491.509 617.348L490.182 614.147ZM500.971 628.206C501.11 628.727 501.109 629.275 500.97 629.795L506.26 635.085C508.923 631.478 508.924 626.523 506.261 622.916L500.971 628.206ZM504.084 620.741C500.478 618.078 495.523 618.078 491.917 620.741L497.206 626.031C497.727 625.892 498.275 625.892 498.795 626.03L504.084 620.741ZM509.652 635.493C509.306 636.112 508.907 636.709 508.455 637.278L512.482 641.305L512.811 637.188C512.821 637.064 512.836 636.941 512.853 636.819L509.652 635.493ZM493.316 612.74C493.222 612.82 493.124 612.897 493.026 612.971L494.353 616.172C495.046 615.976 495.751 615.839 496.461 615.757L496.461 610.058L493.316 612.74ZM511.244 630.539C511.162 631.249 511.024 631.955 510.828 632.647L514.03 633.974C514.105 633.876 514.181 633.779 514.261 633.685L516.941 630.539L511.244 630.539ZM502.974 612.97C502.876 612.896 502.779 612.82 502.685 612.74L499.54 610.058L499.539 615.758C500.249 615.84 500.955 615.976 501.648 616.173L502.974 612.97ZM510.828 625.353C511.024 626.046 511.16 626.751 511.243 627.462L516.942 627.461L514.261 624.317C514.181 624.222 514.105 624.125 514.03 624.026L510.828 625.353ZM506.187 614.19C506.064 614.18 505.941 614.165 505.819 614.147L504.493 617.349C505.112 617.695 505.71 618.094 506.279 618.546L510.307 614.519L506.187 614.19ZM508.455 620.722C508.907 621.292 509.307 621.889 509.652 622.508L512.853 621.182C512.836 621.06 512.821 620.937 512.811 620.814L512.483 616.695L508.455 620.722Z"
          fill="#FF3B3B"
          stroke="black"
          stroke-linejoin="round"
        />
        <path
          id="feedValveCenter"
          d="M496.518 629.855V628.146L498 627.289L499.483 628.146V629.855L498 630.712L496.518 629.855Z"
          fill="#CECECE"
          stroke="black"
          stroke-width="0.5"
        />
      </g>
    </g>
)};

export default GlobeValve;