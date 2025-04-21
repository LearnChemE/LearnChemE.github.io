import Graphic from "../assets/graphic.svg";

export function importGraphic(container) {
  const svgContainer = document.createElement("div");
  svgContainer.id = "svg-container";
  svgContainer.style.width = "100%";
  svgContainer.style.height = "100%";
  svgContainer.style.position = "absolute";
  svgContainer.style.top = "0";
  svgContainer.style.left = "0";
  svgContainer.style.zIndex = "1";
  svgContainer.innerHTML = Graphic;
  container.appendChild(svgContainer);
}