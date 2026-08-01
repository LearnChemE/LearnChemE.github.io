import Hamburger from "../assets/hamburger.svg";
import TiltedApparatus from "../assets/headloss-tilted.svg";
import Apparatus from "../assets/headloss.svg";

export function tiltApparatus() {
  let svg = document.getElementById("canvas");
  svg.remove();
  const graphicsContainer = document.getElementById("graphics-container");
  const html = String(graphicsContainer.innerHTML);
  if (state.tilted) {
    graphicsContainer.innerHTML = html + TiltedApparatus;
    svg = document.getElementById("canvas");
    svg.style.maxWidth = "calc(100vh * 154 / 121)";
  } else {
    graphicsContainer.innerHTML = html + Apparatus;
    svg = document.getElementById("canvas");
    svg.style.maxWidth = "";
  }
}

export default function populate() {
  const graphicsContainer = document.getElementById("graphics-container");
  const html = String(graphicsContainer.innerHTML);
  graphicsContainer.innerHTML = html + Apparatus;
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
}
