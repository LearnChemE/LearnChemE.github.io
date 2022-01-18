const tooltip_elt = document.getElementById("tooltip");
const eq_no_azeotrope_curve = document.getElementById("eq-no-azeotrope-curve");
const eq_minimum_azeotrope_curve = document.getElementById("eq-minimum-temperature-azeotrope-curve");
const eq_maximum_azeotrope_curve = document.getElementById("eq-maximum-temperature-azeotrope-curve");
const xy_line = document.getElementById("x-y-line");
const eq_plot_point = document.getElementById("eq-plot-point");

[
  eq_no_azeotrope_curve,
  eq_minimum_azeotrope_curve,
  eq_maximum_azeotrope_curve
].forEach(elt => {
  elt.addEventListener("mouseenter", (e) => {
    tooltip_elt.innerHTML = "Equilibrium curve";
    tooltip_elt.style.left = `${e.clientX}px`;
    tooltip_elt.style.top = `${e.clientY}px`;
    tooltip_elt.style.opacity = "1";
    elt.style.strokeWidth = "4px";
  });

  elt.addEventListener("mouseleave", (e) => {
    tooltip_elt.innerHTML = "";
    tooltip_elt.style.opacity = "0";
    elt.style.strokeWidth = "2px";
  });
});

xy_line.addEventListener("mouseenter", (e) => {
  tooltip_elt.innerHTML = "x = y line";
  tooltip_elt.style.left = `${e.clientX}px`;
  tooltip_elt.style.top = `${e.clientY}px`;
  tooltip_elt.style.opacity = "1";
  xy_line.style.strokeWidth = "2px";
});

xy_line.addEventListener("mouseleave", (e) => {
  tooltip_elt.innerHTML = "";
  tooltip_elt.style.opacity = "0";
  xy_line.style.strokeWidth = "1px";
});

eq_plot_point.addEventListener("mouseenter", (e) => {
  tooltip_elt.innerHTML = `Vapor/liquid equilibrium point<br>x<sub>B</sub> = ${gvs.xB.toFixed(2)}<br>y<sub>B</sub> = ${gvs.xD.toFixed(2)}`;
  tooltip_elt.style.left = `${e.clientX}px`;
  tooltip_elt.style.top = `${e.clientY}px`;
  tooltip_elt.style.opacity = "1";
  eq_plot_point.style.fill = "blue";
});

eq_plot_point.addEventListener("mouseleave", (e) => {
  tooltip_elt.innerHTML = "";
  tooltip_elt.style.opacity = "0";
  eq_plot_point.style.fill = "white";
});