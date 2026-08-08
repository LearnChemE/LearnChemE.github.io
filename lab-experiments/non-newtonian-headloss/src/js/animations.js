import { calculateViscosity } from "./fluids";

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
        if (state.switchFluid) {
          clearInterval(interval);
          return;
        }
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
      }, 1000 / 60);
    } else {
      elts.switchElt.setAttribute("x", switchX);
      elts.switchElt.setAttribute("y", switchY);
      elts.switchElt.setAttribute("transform", switchTransform);
      state.switchOn = false;
      let currentLength = elts.intakeLiquidMaxLength;
      if (Number(elts.sourceLiquid.getAttribute("height")) > 0) {
        const interval = setInterval(() => {
          if (state.switchFluid) {
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
        }, 1000 / 60);
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
  let mouseX = 0;
  let mouseY = 0;

  document.body.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const setValveOpen = () => {
    calculateState();
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

    open = Math.sin((open ** 1.5 * Math.PI) / 2);

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
      }, 1000 / 60);
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

function calculateState() {
  const V = state.pinching ? Math.min(state.flowRate / 2, 4) : state.flowRate; // flow rate (mL/s)
  console.log(`Flow rate (V): ${V} mL/s`);
  const tubeArea = Math.PI * Math.pow(state.r, 2);
  state.v = V / tubeArea; // cm/s
  const fl = state.selectedFluid;
  const d = state.r * 2; // tube diameter (cm)

  const n = fl.viscosity.flowBehaviorIndex || 1; // flow behavior index
  const K = fl.viscosity.consistencyIndex || fl.viscosity.value; // Pa·s^n
  const t0 = fl.viscosity.yieldStress || 0; // Pa

  console.log(`Flow behavior index (n): ${n}`);
  console.log(`Consistency index (K): ${K}`);

  state.rho = fl.density;
  state.Re = fl.density * state.v ** (2 - n) * d ** n / K / ((3 * n + 1) / 4 / n) ** n / 8 ** (n - 1); // Reynolds number
  const Re_crit = 2200 * n ** -0.15 + 100 * n ** -2; // critical Reynolds number for transition to turbulence

  state.laminar = state.Re < Re_crit;
  console.log(`Reynolds number (Re): ${state.Re}\nCritical: ${Re_crit}\nLaminar: ${state.laminar}`);

  let dPdL; // pressure drop per unit length (Pa/cm)
  if (state.laminar) {
    const shearRate = (3 * n + 1) / 4 / n * (8 * state.v) / d; // s^-1
    const shearStress = t0 + K * Math.pow(shearRate, n); // Pa
    dPdL = 4 * shearStress / d; // Pa/cm
  } else {
    let num = 42 * n ** 1.4 * (n ** 1.4 + 2) + 0.33;
    let den = n ** 1.4 + 0.211;
    const a = num / den;
    const b = (1 + 413.6 * n) ** -0.23;
    const f = (a * state.Re) ** -b; // friction factor
    const Pdyn = 0.5 * state.rho * state.v ** 2 / 10; // dynamic pressure (Pa)
    dPdL = f * Pdyn / d; // Pa/cm
  }

  console.log("dPdL: ", dPdL);

  const L4 = 10 / 3; // characteristic length (cm)
  const L3 = L4 + 7.62;
  const L2 = L3 + 7.62;
  const L1 = L2 + 7.62;

  const P1 = dPdL * L1; // pressure drop (Pa)
  const P2 = dPdL * L2;
  const P3 = dPdL * L3;
  const P4 = dPdL * L4;

  // Convert pressure drop from Pa to cm of head
  const rho = state.rho * 1000; // convert g/cm^3 to kg/m^3
  const g = 9.81; // m/s^2
  state.P1 = P1 / (rho * g) * 100; // cm of head
  state.P2 = P2 / (rho * g) * 100;
  state.P3 = P3 / (rho * g) * 100;
  state.P4 = P4 / (rho * g) * 100;

  console.log(`P1: ${state.P1} cm of head`);
  console.log(`P2: ${state.P2} cm of head`);
  console.log(`P3: ${state.P3} cm of head`);
  console.log(`P4: ${state.P4} cm of head`);
}

function flowThroughApparatus(elts) {
  let currentLength = 0;
  state.flowing = true;

  const sourceStartHeight = Number(elts.sourceLiquid.getAttribute("height"));
  const sourceStartY = Number(elts.sourceLiquid.getAttribute("y"));
  const wasteStartHeight = 26.25;
  const wasteStartY = Number(elts.wasteLiquid.getAttribute("y"));
  const frameRate = 60; // frames per second
  const ms = 1000 / frameRate; // milliseconds per frame
  const s = ms / 1000; // seconds per frame
  let sourceHeight = sourceStartHeight;
  let wasteHeight = Number(elts.wasteLiquid.getAttribute("height"));

  let wasteY = wasteStartY;
  const emptySource = sourceHeight === 0;

  const tubePtsPerFrame = () => {
    const tubeCmPerFrame = state.v * s; // cm per frame
    const tubePtsPerCm = 3; // pts per cm
    return tubeCmPerFrame * tubePtsPerCm; // pts per frame - slowed down a bit
  };

  const handleBeakers = () => {
    const V = state.pinching ? Math.min(state.flowRate / 2, 4) : state.flowRate; // flow rate (mL/s)
    const beakerFractionPerSecond = V / 1000; // s^-1
    const beakerFractionPerMillisecond = beakerFractionPerSecond / 1000; // ms^-1
    const beakerFractionPerFrame = beakerFractionPerMillisecond * ms; // frame^-1
    state.beakerPtsPerFrame = beakerFractionPerFrame * sourceStartHeight;
    sourceHeight = Math.max(0, sourceHeight - state.beakerPtsPerFrame);
    const sourceHeightDiff = sourceStartHeight - sourceHeight;
    const sourceY = sourceStartY + sourceHeightDiff;
    elts.sourceLiquid.setAttribute("y", sourceY);
    elts.sourceLiquid.setAttribute("height", sourceHeight);

    const wasteBeakerStreamOffset = Number(elts.wasteBeakerStream.style.strokeDashoffset.replace(/px/, ""));
    if (wasteBeakerStreamOffset >= 52.5) {
      wasteY = wasteY - state.beakerPtsPerFrame;
      wasteHeight = Math.min(wasteHeight + state.beakerPtsPerFrame, wasteStartHeight);
    }
    elts.wasteLiquid.setAttribute("y", wasteY);
    elts.wasteLiquid.setAttribute("height", wasteHeight);

    const m1MaxHeight = state.P1 * 3;
    const m2MaxHeight = state.P2 * 3;
    const m3MaxHeight = state.P3 * 3;
    const m4MaxHeight = state.P4 * 3;

    const sdo = Number(elts.tubeLiquid.style.strokeDashoffset.replace(/px/, ""));

    if (sdo < 100 && !state.pinching) {
      m1Height = Math.min(m1MaxHeight, m1Height + tubePtsPerFrame());
    } else if (state.pinching) {
      m1Height = Math.max(0, m1Height - tubePtsPerFrame());
    }

    if (sdo < 70 && !state.pinching) {
      m2Height = Math.min(m2MaxHeight, m2Height + tubePtsPerFrame());
    } else if (state.pinching) {
      m2Height = Math.max(0, m2Height - tubePtsPerFrame());
    }

    if (sdo < 40 && !state.pinching) {
      m3Height = Math.min(m3MaxHeight, m3Height + tubePtsPerFrame());
    } else if (state.pinching) {
      m3Height = Math.max(0, m3Height - tubePtsPerFrame());
    }

    if (sdo < 10 && !state.pinching) {
      m4Height = Math.min(m4MaxHeight, m4Height + tubePtsPerFrame());
    } else if (state.pinching) {
      m4Height = Math.max(0, m4Height - tubePtsPerFrame());
    }

    const bubbleOffset = Number(elts.bubbleStream.style.strokeDashoffset.replace(/px/, ""));
    const bubbleMaxLength = Number(elts.bubbleStream.getTotalLength());

    if (bubbleOffset < 0) {
      elts.bubbleStream.style.strokeDashoffset = bubbleMaxLength * 2;
    }
    elts.bubbleStream.style.strokeDashoffset = bubbleOffset - tubePtsPerFrame();

    if (sdo < 102 && state.pinching) {
      const bubbleCoverOffset = Number(elts.bubbleCover.style.strokeDashoffset.replace(/px/, ""));
      const bubbleCoverMaxLength = Number(elts.bubbleCover.getTotalLength());
      if (bubbleCoverOffset === 0) {
        elts.bubbleCover.style.strokeDashoffset = 2 * bubbleCoverMaxLength;
      }
      if (bubbleCoverOffset > bubbleCoverMaxLength) {
        elts.bubbleCover.style.strokeDashoffset = Math.max(
          bubbleCoverMaxLength,
          bubbleCoverOffset - tubePtsPerFrame()
        );
      }
    } else {
      const bubbleCoverOffset = Number(elts.bubbleCover.style.strokeDashoffset.replace(/px/, ""));
      if (bubbleCoverOffset > 0) {
        elts.bubbleCover.style.strokeDashoffset = Math.max(
          0,
          bubbleCoverOffset - tubePtsPerFrame()
        );
      }
    }

    elts.manometerLiquids[0].style.strokeDashoffset = 30.055 - m1Height;
    elts.manometerLiquids[1].style.strokeDashoffset = 30.055 - m2Height;
    elts.manometerLiquids[2].style.strokeDashoffset = 30.055 - m3Height;
    elts.manometerLiquids[3].style.strokeDashoffset = 30.055 - m4Height;
  };

  let m1Height = 0;
  let m2Height = 0;
  let m3Height = 0;
  let m4Height = 0;

  const interval = setInterval(() => {
    if (state.switchFluid) {
      clearInterval(interval);
      return;
    }
    let beakerFilling = false;
    if (state.valveOpen === false) {
      state.flowing = false;
      clearInterval(interval);
      return;
    }
    if (currentLength < elts.tubeLiquidMaxLength && !emptySource) {
      currentLength += tubePtsPerFrame();
      elts.tubeLiquid.style.strokeDashoffset = Math.max(
        0,
        elts.tubeLiquidMaxLength - currentLength
      );
      handleBeakers();
    } else {
      clearInterval(interval);
      const beakerInterval = setInterval(() => {
        if (state.switchFluid) {
          clearInterval(interval);
          clearInterval(beakerInterval);
          return;
        }
        if (
          sourceHeight > 0 &&
          state.switchOn === true &&
          state.valveOpen === true
        ) {
          if (!beakerFilling) {
            elts.wasteBeakerStream.style.strokeDashoffset = 26.25;
            const fillingInterval = setInterval(() => {
              if (state.switchFluid) {
                clearInterval(interval);
                clearInterval(beakerInterval);
                clearInterval(fillingInterval);
                return;
              }
              const streamOffset = Number(
                elts.wasteBeakerStream.style.strokeDashoffset.replace(/px/, "")
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
  state.flowing = false;
  calculateState();
  let currentTubeLiquidLength = elts.tubeLiquidMaxLength;
  let currentIntakeLiquidLength = elts.intakeLiquidMaxLength;
  let currentWasteStreamLength = elts.wasteBeakerStreamMaxLength;

  const bubbleCoverMaxLength = Number(elts.bubbleCover.getTotalLength());
  elts.bubbleCover.style.strokeDashoffset = 2 * bubbleCoverMaxLength;
  elts.bubbleCover.style.opacity = "0";
  elts.bubbleStream.style.opacity = "0";

  const interval = setInterval(() => {
    if (state.switchFluid) {
      clearInterval(interval);
      return;
    }
    const wasteCurrentHeight = Number(elts.wasteLiquid.getAttribute("height"));
    const wasteCurrentY = Number(elts.wasteLiquid.getAttribute("y"));
    elts.wasteLiquid.setAttribute("height", Math.min(26.25, wasteCurrentHeight + state.beakerPtsPerFrame));
    if (wasteCurrentHeight < 26.25) {
      elts.wasteLiquid.setAttribute("y", wasteCurrentY - state.beakerPtsPerFrame);
    }
    elts.manometerLiquids.forEach((man) => {
      const height = Number(man.style.strokeDashoffset.replace(/px/, ""));
      const maxHeight = 30.055;
      if (height < maxHeight) {
        man.style.strokeDashoffset = Math.min(maxHeight, height + 2);
      }
    });
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

        const bubbleCoverMaxLength = Number(elts.bubbleCover.getTotalLength());
        elts.bubbleCover.style.strokeDashoffset = 2 * bubbleCoverMaxLength;
        elts.bubbleCover.style.opacity = "0";
        elts.bubbleStream.style.opacity = "0";

        elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;
        clearInterval(interval);

        elts.bubbleCover.style.strokeDashoffset = 2 * bubbleCoverMaxLength;

        const clearWasteStreamInterval = setInterval(() => {
          if (state.switchFluid) {
            clearInterval(interval);
            clearInterval(clearWasteStreamInterval);
            return;
          }
          if (currentWasteStreamLength > 0) {
            currentWasteStreamLength -= 2;
            elts.wasteBeakerStream.style.strokeDashoffset = Math.min(
              26.25,
              elts.wasteBeakerStreamMaxLength - currentWasteStreamLength
            );
          } else {
            clearInterval(clearWasteStreamInterval);
          }
        }, 1000 / 60);
      }
    }
  }, 1000 / 60);
}

export function pinchLogic(elts) {
  const p = elts.pinchGroup;
  const outletHose = elts.outletHose;
  const bubbleStream = elts.bubbleStream;
  const bubbleCover = elts.bubbleCover;

  p.addEventListener("mousedown", () => {
    state.pinching = true;
    calculateState();
    p.style.opacity = "1";
    outletHose.style.opacity = "0";
    if (state.switchOn && state.valveOpen && state.flowing) {
      bubbleStream.style.opacity = "1";
      bubbleCover.style.opacity = "1";
    }
  });

  document.addEventListener("mouseup", () => {
    state.pinching = false;
    calculateState();
    p.style.opacity = "0";
    outletHose.style.opacity = "1";
  });
}