import Hamburger from "../assets/hamburger.svg";
import Apparatus from "../assets/headloss.svg";
import { getFluidProperties } from "./fluids";



export function changeFluid(fluidName) {
  state.selectedFluid = getFluidProperties(fluidName);

  const sourceLiquid = document.getElementById("source-liquid");
  const intakeLiquid = document.getElementById("intake-liquid");
  const wasteLiquid = document.getElementById("waste-liquid");
  const tubeLiquid = document.getElementById("tube-liquid");
  const wasteBeakerStream = document.getElementById("waste-beaker-stream");
  const manometerLiquids = [document.getElementById("manometer-liquid-1"), 
    document.getElementById("manometer-liquid-2"),
    document.getElementById("manometer-liquid-3"),
    document.getElementById("manometer-liquid-4")];

  const col = state.selectedFluid.color;
  sourceLiquid.style.fill = col;
  intakeLiquid.style.stroke = col;
  tubeLiquid.style.stroke = col;
  manometerLiquids.forEach((liquid) => {
    liquid.style.stroke = col;
  });
  wasteBeakerStream.style.stroke = col;

  // For waste liquid, blend the fluid color with white to make it non-transparent
  const containsAlpha = col.length === 9; // Check if color has alpha channel
  if (containsAlpha) {
    const alpha = parseInt(col.slice(7, 9), 16) / 255; // Extract alpha value
    const blendedColor = `#${Math.round(parseInt(col.slice(1, 3), 16) * alpha + 255 * (1 - alpha)).toString(16).padStart(2, '0')}${Math.round(parseInt(col.slice(3, 5), 16) * alpha + 255 * (1 - alpha)).toString(16).padStart(2, '0')}${Math.round(parseInt(col.slice(5, 7), 16) * alpha + 255 * (1 - alpha)).toString(16).padStart(2, '0')}`;
    wasteLiquid.style.fill = blendedColor;
  } else {
    wasteLiquid.style.fill = col;
  }

}

export default function populate() {
  const graphicsContainer = document.getElementById("graphics-container");
  const html = String(graphicsContainer.innerHTML);
  graphicsContainer.innerHTML = html + Apparatus;
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
  changeFluid("water");
}
