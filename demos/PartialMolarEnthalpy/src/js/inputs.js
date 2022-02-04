const nonIdealSlider = document.getElementById("NI-slider");
const nonIdealValue = document.getElementById("NI-value");
const xASlider = document.getElementById("z-slider");
const xAValue = document.getElementById("z-value");
const partial_B_div = document.getElementById("partial-B-div");
const partial_A_div = document.getElementById("partial-A-div");
const pure_A_label = document.getElementById("pure-A-label");
const pure_B_label = document.getElementById("pure-B-label");
const partial_A_label = document.getElementById("partial-A-label");
const partial_B_label = document.getElementById("partial-B-label");
const plot_label = document.getElementById("above-plot-label");

gvs.alpha = Number(nonIdealSlider.value);
gvs.xA = Number(xASlider.value);

gvs.updatePlot = function() {
  gvs.Hcurve_curve.updateCoords();
  gvs.Hcurve_curve.drawCurve();
  gvs.partial_molar_curve.updateCoords();
  gvs.partial_molar_curve.drawCurve();
  const partial_B_coords = gvs.graph.coordToPix(0, gvs.partialMolar(0));
  const partial_A_coords = gvs.graph.coordToPix(1, gvs.partialMolar(1));
  const pure_B_coords = gvs.graph.coordToPix(0, gvs.Hcurve(0));
  const pure_A_coords = gvs.graph.coordToPix(1, gvs.Hcurve(1));
  gvs.molar_partialB.setAttribute("cy", `${partial_B_coords[1]}`);
  gvs.molar_partialA.setAttribute("cy", `${partial_A_coords[1]}`);
  gvs.molar_pureB.setAttribute("cy", `${pure_B_coords[1]}`);
  gvs.molar_pureA.setAttribute("cy", `${pure_A_coords[1]}`);
  const molar_partialB_rect = gvs.molar_partialB.getBoundingClientRect();
  const molar_partialA_rect = gvs.molar_partialA.getBoundingClientRect();
  const molar_pureB_rect = gvs.molar_pureB.getBoundingClientRect();
  const molar_pureA_rect = gvs.molar_pureA.getBoundingClientRect();
  partial_B_div.style.left = `${molar_partialB_rect.left + molar_partialB_rect.width / 2}px`;
  partial_B_div.style.top = `${molar_partialB_rect.top + molar_partialB_rect.height / 2}px`;
  partial_A_div.style.left = `${molar_partialA_rect.left + molar_partialA_rect.width / 2}px`;
  partial_A_div.style.top = `${molar_partialA_rect.top + molar_partialA_rect.height / 2}px`;
  pure_A_label.style.left = `${molar_pureA_rect.left + 22}px`;
  pure_A_label.style.top = `${molar_pureA_rect.top + 2}px`;
  pure_B_label.style.left = `${molar_pureB_rect.left - 18}px`;
  pure_B_label.style.top = `${molar_pureB_rect.top + 2}px`;
  partial_A_label.style.left = `${molar_partialA_rect.left + 22}px`;
  partial_A_label.style.top = `${molar_partialA_rect.top}px`;
  partial_B_label.style.left = `${molar_partialB_rect.left - 18}px`;
  partial_B_label.style.top = `${molar_partialB_rect.top}px`;
  const mixture_coords = gvs.graph.coordToPix(gvs.xA, gvs.Hcurve(gvs.xA));
  gvs.tangentPoint.setAttribute("cx", `${mixture_coords[0]}`);
  gvs.tangentPoint.setAttribute("cy", `${mixture_coords[1]}`);

  // If we call MathJax.typset() too quickly in succession, it creates a lot of lag, so this just breaks up the function to be called every X milliseconds
  if(!gvs.pause) {
    setTimeout(() => {
      updateJax();
      gvs.pause = false;
    }, 50);
    gvs.pause = true;
  }
}

function updateJax() {
  const HbarA = Math.round(gvs.partialMolar(1)).toFixed(0);
  const HbarB = Math.round(gvs.partialMolar(0)).toFixed(0);
  MathJax.typesetClear([plot_label]);
  plot_label.innerHTML = `\\( \\overline{ H_{A} } = ${HbarA} \\; \\mathrm{ kJ / mol } \\qquad \\quad \\overline{ H_{B} } = ${HbarB} \\; \\mathrm{ kJ / mol } \\)`
  MathJax.typesetPromise([plot_label]);
}

document.addEventListener("mouseup", () => {
  updateJax();
  MathJax.typeset();
})

nonIdealSlider.addEventListener("input", () => {
  const alpha = Number(nonIdealSlider.value);
  gvs.alpha = alpha;
  nonIdealValue.innerHTML = `${Math.round(alpha).toFixed(0)}`;
  gvs.updatePlot();
});

xASlider.addEventListener("input", () => {
  const xA = Number(xASlider.value);
  gvs.xA = xA;
  xAValue.innerHTML = `${(Math.round(xA * 100) / 100).toFixed(2)}`;
  gvs.updatePlot();
})