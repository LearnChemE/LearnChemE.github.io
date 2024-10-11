import Hamburger from "../assets/hamburger.svg";

export default function populate(graphic) {
  const graphicsContainer = document.getElementById("graphics-container");
  const html = String(graphicsContainer.innerHTML);
  graphicsContainer.innerHTML = html + graphic;
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
}
