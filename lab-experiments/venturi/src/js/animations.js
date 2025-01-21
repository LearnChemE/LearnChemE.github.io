import calcAll from "./calcs.js";

const frameRate = 60; // frames per second

export function switchLogic(elts) {
  const switchX = elts.switchElt.getAttribute("x");
  const switchY = elts.switchElt.getAttribute("y");
  const destinationX = 108.44429;
  const destinationY = 32.344028;
  const switchTransform = elts.switchElt.getAttribute("transform");
  const destinationTransform = "rotate(38)";

  elts.switchG.addEventListener("click", () => {
    if (state.resetting) {
      return;
    }

    if (state.switchOn === false) {
      elts.switchElt.setAttribute("x", destinationX);
      elts.switchElt.setAttribute("y", destinationY);
      elts.switchElt.setAttribute("transform", destinationTransform);
      state.switchOn = true;
      let currentLength = 0;

      if (beakerEmpty(elts)) { return }

      const interval = setInterval(() => {
        if (state.switchTilt) {
          clearInterval(interval);
          return;
        }
        if (
          currentLength < elts.intakeLiquidMaxLength
        ) {
          currentLength += 2;
          elts.intakeLiquid.style.strokeDashoffset = Math.max(
            0,
            elts.intakeLiquidMaxLength - currentLength
          );
        } else {
          if (state.valveOpen === true) {
            flowThroughApparatus(elts);
          }
          clearInterval(interval);
        }
      }, 1000 / frameRate);
    } else {
      elts.switchElt.setAttribute("x", switchX);
      elts.switchElt.setAttribute("y", switchY);
      elts.switchElt.setAttribute("transform", switchTransform);
      state.switchOn = false;
      let currentLength = elts.intakeLiquidMaxLength;

      if (beakerEmpty(elts)) { return }

      const interval = setInterval(() => {
        if (state.switchTilt) {
          clearInterval(interval);
          return;
        }
        if (currentLength > 0) {
          currentLength -= 2;
          elts.intakeLiquid.style.strokeDashoffset =
            elts.intakeLiquidMaxLength - currentLength;
        } else {
          clearInterval(interval);
        }
      }, 1000 / frameRate);
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

export function valveLogic(elts) {
  let mouseX = 0;
  let mouseY = 0;

  document.body.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const setValveOpen = () => {
    const rect = elts.valveCircle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const diffX = Math.max(0, mouseX - cx);
    const diffY = Math.max(0, cy - mouseY);
    let open = 0;
    if (diffX === 0 && diffY === 0) {
      open = 0;
    } else {
      open = 1 - (2 * Math.atan(diffY / diffX)) / Math.PI;
    }

    if (open > 0) {
      state.valveOpen = true;
    } else {
      state.valveOpen = false;
    }
    const angle = open * 90;
    const circlePtX = elts.valveCircle.getAttribute("cx");
    const circlePtY = elts.valveCircle.getAttribute("cy");
    elts.valveRect.setAttribute(
      "transform",
      `rotate(${angle} ${circlePtX} ${circlePtY})`
    );

    state.flowRate = state.maxFlowRate * open;

    if (
      state.switchOn === true &&
      state.flowing === false &&
      state.valveOpen &&
      !beakerEmpty(elts)
    ) {
      flowThroughApparatus(elts);
    }
  };

  let mouse = false;

  const callEvent = () => {
    if (mouse) {
      setTimeout(() => {
        setValveOpen();
        callEvent();
      }, 1000 / frameRate);
    } else {
      return;
    }
  };

  elts.valve.addEventListener("mousedown", () => {
    mouse = true;
    callEvent();
  });

  document.body.addEventListener("mouseup", () => {
    mouse = false;
  });
}

function tubePtsPerFrame(elts) {
  const D = state.outer_diameter / 1000; // m
  const A = Math.PI * (D / 2) ** 2; // m^2
  const v = state.flowRate / 1e6 / A; // m/s
  const ms = 1000 / frameRate;
  const ptsPerSecond = v * 100 / 5;
  const ptsPerFrame = ptsPerSecond * ms;
  return ptsPerFrame / 10;
}

function strokeDashoffset(elt) {
  return Number(elt.style.strokeDashoffset.replace(/px/, ""));
}

function handleManometers(elts, pts, up) {
  const tubeLiquid = elts.tubeLiquid;
  const tubeLiquidMaxLength = elts.tubeLiquidMaxLength;
  const manometerMaxLength = Number(elts.manometerLiquids[0].getTotalLength());
  const currentLength = strokeDashoffset(tubeLiquid);
  const H1 = 5 * state.manometer_1_pressure / 10; // pts
  const H2 = 5 * state.manometer_2_pressure / 10;
  const H3 = 5 * state.manometer_3_pressure / 10;
  const H4 = 5 * state.manometer_4_pressure / 10;
  const H5 = 5 * state.manometer_5_pressure / 10;

  const sdo1 = manometerMaxLength - H1;
  const sdo2 = manometerMaxLength - H2;
  const sdo3 = manometerMaxLength - H3;
  const sdo4 = manometerMaxLength - H4;
  const sdo5 = manometerMaxLength - H5;

  if (up) {
    if (currentLength < tubeLiquidMaxLength - 40) {
      elts.manometerLiquids[0].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo1,
        strokeDashoffset(elts.manometerLiquids[0]) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 55) {
      elts.manometerLiquids[1].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo2,
        strokeDashoffset(elts.manometerLiquids[1]) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 63) {
      elts.manometerLiquids[2].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo3,
        strokeDashoffset(elts.manometerLiquids[2]) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 71) {
      elts.manometerLiquids[3].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo4,
        strokeDashoffset(elts.manometerLiquids[3]) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 86) {
      elts.manometerLiquids[4].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo5,
        strokeDashoffset(elts.manometerLiquids[4]) + pts
      );
    }
  } else {
    elts.manometerLiquids[0].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      strokeDashoffset(elts.manometerLiquids[0]) - pts
    );
    elts.manometerLiquids[1].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      strokeDashoffset(elts.manometerLiquids[1]) - pts
    );
    elts.manometerLiquids[2].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      strokeDashoffset(elts.manometerLiquids[2]) - pts
    );
    elts.manometerLiquids[3].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      strokeDashoffset(elts.manometerLiquids[3]) - pts
    );
    elts.manometerLiquids[4].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      strokeDashoffset(elts.manometerLiquids[4]) - pts
    );
  }
}

function flowThroughApparatus(elts) {
  const tubeLiquid = elts.tubeLiquid;

  state.flowing = true;
  const interval = setInterval(() => {
    if (state.resetting) {
      clearInterval(interval);
      return;
    }

    calcAll();
    const pts = tubePtsPerFrame();

    handleManometers(elts, pts, true);

    if (strokeDashoffset(tubeLiquid) > 0 && !beakerEmpty(elts)) {
      tubeLiquid.style.strokeDashoffset = Math.max(
        0,
        strokeDashoffset(tubeLiquid) - pts
      );
      emptySourceBeaker(elts);
    } else if (!state.switchOn || !state.valveOpen || beakerEmpty(elts)) {
      clearInterval(interval);
      emptyApparatus(elts);
    } else {
      fillWasteBeaker(elts);
      emptySourceBeaker(elts);
    }
  }, 1000 / frameRate);
}

function emptyApparatus(elts) {
  if (state.resetting) {
    return;
  }

  const tubeLiquid = elts.tubeLiquid;
  const tubeLiquidMaxLength = elts.tubeLiquidMaxLength;
  const intakeLiquid = elts.intakeLiquid;
  const intakeLiquidMaxLength = elts.intakeLiquidMaxLength;

  state.flowing = false;
  tubeLiquid.style.strokeDashoffset = 2 * tubeLiquidMaxLength;
  intakeLiquid.style.strokeDashoffset = 2 * intakeLiquidMaxLength;

  let intakeLiquidGone = false;

  let pts = 1;

  const interval = setInterval(() => {
    calcAll();

    if (beakerEmpty(elts)) {
      intakeLiquid.style.strokeDashoffset = Math.max(
        intakeLiquidMaxLength,
        strokeDashoffset(intakeLiquid) - pts
      );

      if (Math.abs(strokeDashoffset(intakeLiquid) - intakeLiquidMaxLength) < 0.001) {
        intakeLiquidGone = true;
      }
    }

    if (
      strokeDashoffset(tubeLiquid) > tubeLiquidMaxLength &&
      !beakerEmpty(elts) ||
      beakerEmpty(elts) &&
      intakeLiquidGone
    ) {
      tubeLiquid.style.strokeDashoffset = Math.max(
        tubeLiquidMaxLength,
        strokeDashoffset(tubeLiquid) - pts
      );

      handleManometers(elts, pts, false);
      fillWasteBeaker(elts);
    }

    if (strokeDashoffset(tubeLiquid) === tubeLiquidMaxLength) {
      clearInterval(interval);
    }
  }, 1000 / frameRate);
}

function beakerEmpty(elts) {
  return Number(elts.sourceLiquid.getAttribute("height")) <= 0;
}

function beakerHeightPerFrame() {
  const V = state.flowRate;
  const maxHeight = 26.25;
  const maxVolume = 1000;
  const frameTime = 1 / frameRate;
  const VPerFrame = frameTime * V;
  const framesToFill = maxVolume / VPerFrame;
  return maxHeight / framesToFill;
}

function fillWasteBeaker(elts) {
  const wasteLiquid = elts.wasteLiquid;
  const wasteLiquidHeight = Number(wasteLiquid.getAttribute("height"));
  const wasteLiquidY = Number(wasteLiquid.getAttribute("y"));
  const dH = beakerHeightPerFrame();
  if (wasteLiquidHeight < 26.25) {
    wasteLiquid.setAttribute("height", Math.min(26.25, wasteLiquidHeight + dH));
    wasteLiquid.setAttribute("y", Math.max(212.91513, wasteLiquidY - dH));
  }
}

function emptySourceBeaker(elts) {
  const sourceLiquid = elts.sourceLiquid;
  const sourceLiquidHeight = Number(sourceLiquid.getAttribute("height"));
  const sourceLiquidY = Number(sourceLiquid.getAttribute("y"));
  const dH = beakerHeightPerFrame();
  if (sourceLiquidHeight > 0) {
    sourceLiquid.setAttribute("height", Math.max(0, sourceLiquidHeight - dH));
    sourceLiquid.setAttribute("y", Math.max(212.8763, sourceLiquidY + dH));
  }
}