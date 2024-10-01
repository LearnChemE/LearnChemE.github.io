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
        if (
          currentLength < elts.intakeLiquidMaxLength &&
          Number(elts.sourceLiquid.getAttribute("height")) > 0
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
      }, 16.67);
    } else {
      elts.switchElt.setAttribute("x", switchX);
      elts.switchElt.setAttribute("y", switchY);
      elts.switchElt.setAttribute("transform", switchTransform);
      state.switchOn = false;
      let currentLength = elts.intakeLiquidMaxLength;
      if (Number(elts.sourceLiquid.getAttribute("height")) > 0) {
        const interval = setInterval(() => {
          if (currentLength > 0) {
            currentLength -= 2;
            elts.intakeLiquid.style.strokeDashoffset =
              elts.intakeLiquidMaxLength - currentLength;
          } else {
            clearInterval(interval);
          }
        }, 16.67);
      }
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
    }
  });
}

function flowThroughApparatus(elts) {
  let currentLength = 0;

  const sourceStartHeight = Number(elts.sourceLiquid.getAttribute("height"));
  const sourceStartY = Number(elts.sourceLiquid.getAttribute("y"));
  const wasteStartHeight = 26.25;
  const wasteStartY = Number(elts.wasteLiquid.getAttribute("y"));
  const r = 0.635 / 2; // tube radius (cm)
  const frameRate = 60; // frames per second
  const ms = 1000 / frameRate; // milliseconds per frame
  const s = ms / 1000; // seconds per frame
  let sourceHeight = sourceStartHeight;
  let wasteHeight = Number(elts.wasteLiquid.getAttribute("height"));
  let wasteY = wasteStartY;
  const emptySource = sourceHeight === 0;

  const tubePtsPerFrame = () => {
    const V = state.flowRate; // flow rate (mL/s)
    const tubeArea = Math.PI * Math.pow(r, 2);
    const tubeVelocity = V / tubeArea; // cm/s
    const tubeLength = 200; // pts
    const tubeCmPerFrame = tubeVelocity * s; // cm per frame
    const tubePtsPerCm = tubeLength / 40; // pts per cm
    return tubeCmPerFrame * tubePtsPerCm; // pts per frame
  };

  const handleBeakers = () => {
    const V = state.flowRate; // flow rate (mL/s)
    const beakerFractionPerSecond = V / 500; // s^-1
    const beakerFractionPerMillisecond = beakerFractionPerSecond / 1000; // ms^-1
    const beakerFractionPerFrame = beakerFractionPerMillisecond * ms; // frame^-1
    const beakerPtsPerFrame = beakerFractionPerFrame * sourceStartHeight;
    sourceHeight = Math.max(0, sourceHeight - beakerPtsPerFrame);
    const sourceHeightDiff = sourceStartHeight - sourceHeight;
    const sourceY = sourceStartY + sourceHeightDiff;
    elts.sourceLiquid.setAttribute("y", sourceY);
    elts.sourceLiquid.setAttribute("height", sourceHeight);
    wasteY = wasteY - beakerPtsPerFrame;
    wasteHeight = Math.min(wasteHeight + beakerPtsPerFrame, wasteStartHeight);
    elts.wasteLiquid.setAttribute("y", wasteY);
    elts.wasteLiquid.setAttribute("height", wasteHeight);
  };

  const interval = setInterval(() => {
    let beakerFilling = false;
    if (currentLength < elts.tubeLiquidMaxLength && !emptySource) {
      currentLength += tubePtsPerFrame();
      elts.tubeLiquid.style.strokeDashoffset =
        elts.tubeLiquidMaxLength - currentLength;
      handleBeakers();
    } else {
      clearInterval(interval);
      const beakerInterval = setInterval(() => {
        if (
          sourceHeight > 0 &&
          state.switchOn === true &&
          state.valveOpen === true
        ) {
          if (!beakerFilling) {
            elts.wasteBeakerStream.style.strokeDashoffset = 26.25;
            const fillingInterval = setInterval(() => {
              const streamOffset = Number(
                elts.wasteBeakerStream.style.strokeDashoffset
              );
              if (
                streamOffset > 0 &&
                state.switchOn === true &&
                state.valveOpen === true
              ) {
                elts.wasteBeakerStream.style.strokeDashoffset = Math.min(
                  52.5,
                  streamOffset + tubePtsPerFrame()
                );
              } else {
                clearInterval(fillingInterval);
              }
            }, ms);
            beakerFilling = true;
          }
          handleBeakers();
        } else {
          clearInterval(beakerInterval);
          if (!emptySource) {
            emptyApparatus(elts);
          }
        }
      }, ms);
    }
  }, ms);
}

function emptyApparatus(elts) {
  let currentTubeLiquidLength = elts.tubeLiquidMaxLength;
  let currentIntakeLiquidLength = elts.intakeLiquidMaxLength;
  let currentWasteStreamLength = elts.wasteBeakerStreamMaxLength;
  const interval = setInterval(() => {
    if (
      Number(elts.sourceLiquid.getAttribute("height")) === 0 &&
      currentIntakeLiquidLength < 2 * elts.intakeLiquidMaxLength
    ) {
      currentIntakeLiquidLength += 2;
      elts.intakeLiquid.style.strokeDashoffset =
        elts.intakeLiquidMaxLength - currentIntakeLiquidLength;
    } else {
      if (currentTubeLiquidLength < 2 * elts.tubeLiquidMaxLength) {
        currentTubeLiquidLength += 2;
        elts.tubeLiquid.style.strokeDashoffset =
          elts.tubeLiquidMaxLength - currentTubeLiquidLength;
      } else {
        elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;
        clearInterval(interval);
        const clearWasteStreamInterval = setInterval(() => {
          if (currentWasteStreamLength > 0) {
            currentWasteStreamLength -= 2;
            elts.wasteBeakerStream.style.strokeDashoffset = Math.min(
              26.25,
              elts.wasteBeakerStreamMaxLength - currentWasteStreamLength
            );
          } else {
            clearInterval(clearWasteStreamInterval);
          }
        }, 16.67);
      }
    }
  }, 16.67);
}
