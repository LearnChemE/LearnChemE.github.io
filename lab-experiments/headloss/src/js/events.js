import "./animations.js";

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
}

function switchLogic(elts) {
  const switchX = elts.switchElt.getAttribute("x");
  const switchY = elts.switchElt.getAttribute("y");
  const destinationX = 108.44429;
  const destinationY = 32.344028;
  const switchTransform = elts.switchElt.getAttribute("transform");
  const destinationTransform = "rotate(38)";

  elts.switchG.addEventListener("click", () => {
    if (state.switchOn === false) {
      elts.switchElt.setAttribute("x", destinationX);
      elts.switchElt.setAttribute("y", destinationY);
      elts.switchElt.setAttribute("transform", destinationTransform);
      state.switchOn = true;
      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength < elts.intakeLiquidMaxLength) {
          currentLength += 2;
          elts.intakeLiquid.style.strokeDashoffset =
            elts.intakeLiquidMaxLength - currentLength;
        } else {
          if (state.valveOpen === true) {
            flowThroughApparatus(elts);
          }
          clearInterval(interval);
        }
      }, 16.67);
    } else {
      elts.switchElt.setAttribute("x", switchX);
      elts.switchElt.setAttribute("y", switchY);
      elts.switchElt.setAttribute("transform", switchTransform);
      state.switchOn = false;
      let currentLength = elts.intakeLiquidMaxLength;
      const interval = setInterval(() => {
        if (currentLength > 0) {
          currentLength -= 2;
          elts.intakeLiquid.style.strokeDashoffset =
            elts.intakeLiquidMaxLength - currentLength;
        } else {
          if (state.valveOpen === true) {
            emptyApparatus(elts);
          }
          clearInterval(interval);
        }
      }, 16.67);
    }
  });

  elts.switchG.addEventListener("mouseover", () => {
    elts.switchG.style.cursor = "pointer";
    elts.switchG.style.filter = "url(#shadow)";
  });

  elts.switchG.addEventListener("mouseout", () => {
    elts.switchG.style.filter = "none";
  });
}

function valveLogic(elts) {
  const valveRectX = elts.valveRect.getAttribute("x");
  const valveRectY = elts.valveRect.getAttribute("y");
  const valveRectDestinationX = 116.46883;
  const valveRectDestinationY = -64.357788;

  elts.valve.addEventListener("click", () => {
    if (state.valveOpen === false) {
      elts.valveRect.setAttribute("x", valveRectDestinationX);
      elts.valveRect.setAttribute("y", valveRectDestinationY);
      elts.valveRect.setAttribute("transform", "rotate(90)");
      state.valveOpen = true;
      if (state.switchOn === true) {
        flowThroughApparatus(elts);
      }
    } else {
      elts.valveRect.setAttribute("x", valveRectX);
      elts.valveRect.setAttribute("y", valveRectY);
      elts.valveRect.setAttribute("transform", "rotate(0)");
      state.valveOpen = false;
      if (state.switchOn === true) {
        emptyApparatus(elts);
      }
    }
  });
}

function flowThroughApparatus(elts) {
  let currentLength = 0;
  const interval = setInterval(() => {
    if (currentLength < elts.tubeLiquidMaxLength) {
      currentLength += 2;
      elts.tubeLiquid.style.strokeDashoffset =
        elts.tubeLiquidMaxLength - currentLength;
    } else {
      clearInterval(interval);
    }
  }, 16.67);
}

function emptyApparatus(elts) {
  let currentLength = elts.tubeLiquidMaxLength;
  const interval = setInterval(() => {
    if (currentLength < 2 * elts.tubeLiquidMaxLength) {
      currentLength += 2;
      elts.tubeLiquid.style.strokeDashoffset =
        elts.tubeLiquidMaxLength - currentLength;
    } else {
      elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;
      clearInterval(interval);
    }
  }, 16.67);
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
  };

  elts.intakeLiquidMaxLength = elts.intakeLiquid.getTotalLength();
  elts.tubeLiquidMaxLength = elts.tubeLiquid.getTotalLength();
  elts.wasteBeakerStreamMaxLength = elts.wasteBeakerStream.getTotalLength();

  setDefaults(elts);
  switchLogic(elts);
  valveLogic(elts);
}
