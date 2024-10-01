import "./animations.js";
import { switchLogic, valveLogic } from "./animations.js";

function setDefaults(elts) {
  elts.intakeLiquid.style.strokeDasharray = elts.intakeLiquidMaxLength;
  elts.intakeLiquid.style.strokeDashoffset = elts.intakeLiquidMaxLength;

  elts.tubeLiquid.style.strokeDasharray = elts.tubeLiquidMaxLength;
  elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;

  elts.wasteBeakerStream.style.strokeDasharray =
    elts.wasteBeakerStreamMaxLength;
  elts.wasteBeakerStream.style.strokeDashoffset =
    elts.wasteBeakerStreamMaxLength;

  elts.manometerLiquids.forEach((manometerLiquid) => {
    const manometerMaxHeight = manometerLiquid.getTotalLength();
    manometerLiquid.style.strokeDasharray = manometerMaxHeight;
    manometerLiquid.style.strokeDashoffset = manometerMaxHeight;
  });

  const wasteY = Number(elts.wasteLiquid.getAttribute("y"));
  const wasteHeight = Number(elts.wasteLiquid.getAttribute("height"));
  elts.wasteLiquid.setAttribute("y", `${wasteY + wasteHeight}`);
  elts.wasteLiquid.setAttribute("height", 0);
}

export default function addEvents() {
  const elts = {
    intakeLiquid: document.getElementById("intake-liquid"),
    tubeLiquid: document.getElementById("tube-liquid"),
    wasteBeakerStream: document.getElementById("waste-beaker-stream"),
    manometerLiquids: [
      document.getElementById("manometer-liquid-1"),
      document.getElementById("manometer-liquid-2"),
      document.getElementById("manometer-liquid-3"),
      document.getElementById("manometer-liquid-4"),
    ],
    switchElt: document.getElementById("switch"),
    switchG: document.getElementById("power-switch"),
    valve: document.getElementById("valve"),
    valveRect: document.getElementById("valve-rect"),
    sourceLiquid: document.getElementById("source-liquid"),
    wasteLiquid: document.getElementById("waste-liquid"),
  };

  elts.intakeLiquidMaxLength = elts.intakeLiquid.getTotalLength();
  elts.tubeLiquidMaxLength = elts.tubeLiquid.getTotalLength();
  elts.wasteBeakerStreamMaxLength = elts.wasteBeakerStream.getTotalLength();

  setDefaults(elts);
  switchLogic(elts);
  valveLogic(elts);
}
