import modal from "bootstrap";
import Graphic from "./assets/headloss.svg";
import addEvents from "./js/events.js";
import populate from "./js/populate.js";
import "./style/style.scss";

window.state = {
  switchOn: false,
  valveOpen: false,
};

populate(Graphic);
addEvents();
