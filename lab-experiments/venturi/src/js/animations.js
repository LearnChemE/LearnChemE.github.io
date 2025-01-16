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
    if (state.switchOn === false) {
      elts.switchElt.setAttribute("x", destinationX);
      elts.switchElt.setAttribute("y", destinationY);
      elts.switchElt.setAttribute("transform", destinationTransform);
      state.switchOn = true;
      let currentLength = 0;
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

    if (state.switchOn === true && state.flowing === false && state.valveOpen) {
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

function handleManometers(elts, pts, up) {
  const tubeLiquid = elts.tubeLiquid;
  const tubeLiquidMaxLength = elts.tubeLiquidMaxLength;
  const manometerMaxLength = elts.manometerLiquids[0].getTotalLength();
  const currentLength = Number(tubeLiquid.style.strokeDashoffset);
  const H1 = 5 * state.manometer_1_pressure / 10; // pts
  const H2 = 5 * state.manometer_2_pressure / 10;
  const H3 = 5 * state.manometer_3_pressure / 10;
  const H4 = 5 * state.manometer_4_pressure / 10;
  const H5 = 5 * state.manometer_5_pressure / 10;

  const sdo1 = Number(manometerMaxLength) - H1;
  const sdo2 = Number(manometerMaxLength) - H2;
  const sdo3 = Number(manometerMaxLength) - H3;
  const sdo4 = Number(manometerMaxLength) - H4;
  const sdo5 = Number(manometerMaxLength) - H5;

  if (up) {
    if (currentLength < tubeLiquidMaxLength - 40) {
      elts.manometerLiquids[0].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo1,
        Number(elts.manometerLiquids[0].style.strokeDashoffset) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 55) {
      elts.manometerLiquids[1].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo2,
        Number(elts.manometerLiquids[1].style.strokeDashoffset) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 63) {
      elts.manometerLiquids[2].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo3,
        Number(elts.manometerLiquids[2].style.strokeDashoffset) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 71) {
      elts.manometerLiquids[3].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo4,
        Number(elts.manometerLiquids[3].style.strokeDashoffset) + pts
      );
    }
    if (currentLength < tubeLiquidMaxLength - 86) {
      elts.manometerLiquids[4].style.strokeDashoffset = Math.min(
        2 * manometerMaxLength - sdo5,
        Number(elts.manometerLiquids[4].style.strokeDashoffset) + pts
      );
    }
  } else {
    elts.manometerLiquids[0].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      Number(elts.manometerLiquids[0].style.strokeDashoffset) - pts
    );
    elts.manometerLiquids[1].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      Number(elts.manometerLiquids[1].style.strokeDashoffset) - pts
    );
    elts.manometerLiquids[2].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      Number(elts.manometerLiquids[2].style.strokeDashoffset) - pts
    );
    elts.manometerLiquids[3].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      Number(elts.manometerLiquids[3].style.strokeDashoffset) - pts
    );
    elts.manometerLiquids[4].style.strokeDashoffset = Math.max(
      manometerMaxLength,
      Number(elts.manometerLiquids[4].style.strokeDashoffset) - pts
    );
  }
}

function flowThroughApparatus(elts) {
  const tubeLiquid = elts.tubeLiquid;

  state.flowing = true;
  const interval = setInterval(() => {
    calcAll();
    const pts = tubePtsPerFrame();

    handleManometers(elts, pts, true);

    if (Number(tubeLiquid.style.strokeDashoffset) > 0) {
      tubeLiquid.style.strokeDashoffset = Math.max(
        0,
        Number(
          tubeLiquid.style.strokeDashoffset
        ) - pts
      );
    } else if (!state.switchOn || !state.valveOpen) {
      clearInterval(interval);
      emptyApparatus(elts);
    }
  }, 1000 / frameRate);
}

function emptyApparatus(elts) {
  const tubeLiquid = elts.tubeLiquid;
  const tubeLiquidMaxLength = elts.tubeLiquidMaxLength;

  state.flowing = false;
  tubeLiquid.style.strokeDashoffset = 2 * tubeLiquidMaxLength;

  const interval = setInterval(() => {
    calcAll();
    const pts = 2;

    if (Number(tubeLiquid.style.strokeDashoffset) > tubeLiquidMaxLength) {
      tubeLiquid.style.strokeDashoffset = Math.max(
        tubeLiquidMaxLength,
        Number(
          tubeLiquid.style.strokeDashoffset
        ) - pts
      );

      handleManometers(elts, pts, false);
    } else {
      clearInterval(interval);
    }
  }, 1000 / frameRate);
}