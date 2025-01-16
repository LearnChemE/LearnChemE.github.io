import Hamburger from "../assets/hamburger.svg";
import Apparatus from "../assets/venturi.svg";

export default function populate() {
  const graphicsContainer = document.getElementById("graphics-container");
  const html = String(graphicsContainer.innerHTML);
  graphicsContainer.innerHTML = html + Apparatus;
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
}