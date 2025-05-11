import Graphic from "../assets/graphic.svg";

const svgContainer = document.getElementById("svg-container");

export function importSVG() {
  let graphic_xml = Graphic;
  graphic_xml = graphic_xml.replace(/width=".*?"/, "");
  graphic_xml = graphic_xml.replace(/height=".*?"/, "");
  svgContainer.innerHTML = graphic_xml;
  state.svg = svgContainer.querySelector("svg");
}