const V0_slider = document.getElementById("V0-slider");
const V0_value = document.getElementById("V0-value");
const v0_slider = document.getElementById("v0-slider");
const v0_value = document.getElementById("v0-value");
const CA0_slider = document.getElementById("CA0-slider");
const CA0_value = document.getElementById("CA0-value");
const speed_slider = document.getElementById("speed-slider");
const speed_value = document.getElementById("speed-value");
const start_simulation_button = document.getElementById("start-button");
const reset_simulation_button = document.getElementById("reset-button");
const select_plot = document.getElementById("plot-select");

gvs.handle_V0 = function() {
  const V0 = Number(V0_slider.value);
  gvs.V0 = V0;
  V0_value.innerHTML = `${(V0).toFixed(0)}`;
  gvs.calcAll();
  gvs.V_array = [[0, gvs.V0], [0.001, gvs.V0]];
  gvs.CA_array = [[0, gvs.CA0], [0.001, gvs.CA0]];
  gvs.h_array = [[0, gvs.h], [0.001, gvs.h]];
  gvs.v_array = [[0, gvs.v0], [0.001, gvs.v0]];
}

gvs.handle_v0 = function() {
  const v0 = Number(v0_slider.value);
  gvs.v0 = v0;
  v0_value.innerHTML = `${(v0).toFixed(0)}`;
}

gvs.handle_CA0 = function() {
  const CA0 = Number(CA0_slider.value);
  gvs.CA0 = CA0;
  CA0_value.innerHTML = `${CA0.toFixed(1)}`;
}

gvs.handle_speed = function() {
  const speed = Number(speed_slider.value);
  gvs.speed = speed;
  speed_value.innerHTML = `${speed.toFixed(1)}`;
}

V0_slider.addEventListener("input", () => {
  gvs.handle_V0();
});

v0_slider.addEventListener("input", () => {
  gvs.handle_v0();
});

CA0_slider.addEventListener("input", () => {
  gvs.handle_CA0();
});

speed_slider.addEventListener("input", () => {
  gvs.handle_speed();
})

start_simulation_button.addEventListener("click", () => {
  gvs.is_running = true;
  gvs.start_simulation();
});

reset_simulation_button.addEventListener("click", () => {
  gvs.is_running = false;
  gvs.reset_simulation();
});

gvs.start_simulation = function() {
  gvs.start_frame = gvs.p.frameCount;
  V0_slider.setAttribute("disabled", "yes");
  v0_slider.setAttribute("disabled", "yes");
  CA0_slider.setAttribute("disabled", "yes");
  start_simulation_button.setAttribute("disabled", "yes");
  switch(gvs.plot_selection) {
    case "V" :
      document.getElementById("V-curve").style.opacity = "1";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "CA":
      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "1";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "h":
      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "1";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "v":
      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "1";
    break;
  }
}

gvs.reset_simulation = function() {
  V0_slider.removeAttribute("disabled");
  v0_slider.removeAttribute("disabled");
  CA0_slider.removeAttribute("disabled");
  start_simulation_button.removeAttribute("disabled");
  document.getElementById("V-curve").style.opacity = "0";
  gvs.V_graph.options.axes.x.range[1] = 30;
  gvs.V_graph.options.axes.y.range[0] = 400;
  gvs.V_graph.options.axes.y.range[1] = 600;
  gvs.V_graph.options.axes.x.step = 5;
  gvs.V_graph.options.axes.y.step = 50;
  gvs.V_graph.redrawAxes();
  gvs.CA_graph.options.axes.x.range[1] = 30;
  gvs.CA_graph.options.axes.x.step = 5;
  gvs.CA_graph.redrawAxes();
  gvs.h_graph.options.axes.x.range[1] = 30;
  gvs.h_graph.options.axes.x.step = 5;
  gvs.h_graph.redrawAxes();
  gvs.v_graph.options.axes.x.range[1] = 30;
  gvs.v_graph.options.axes.x.step = 5;
  gvs.v_graph.redrawAxes();
}

select_plot.addEventListener("change", () => {
  const plot = select_plot.value;
  gvs.plot_selection = plot;
  switch(gvs.plot_selection) {
    case "V" :
      document.getElementById("V-graph").style.opacity = "1";
      document.getElementById("CA-graph").style.opacity = "0";
      document.getElementById("h-graph").style.opacity = "0";
      document.getElementById("v-graph").style.opacity = "0";

      document.getElementById("V-graph-tick-labels").style.opacity = "1";
      document.getElementById("CA-graph-tick-labels").style.opacity = "0";
      document.getElementById("h-graph-tick-labels").style.opacity = "0";
      document.getElementById("v-graph-tick-labels").style.opacity = "0";

      document.getElementById("V-curve").style.opacity = "1";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "CA":
      document.getElementById("V-graph").style.opacity = "0";
      document.getElementById("CA-graph").style.opacity = "1";
      document.getElementById("h-graph").style.opacity = "0";
      document.getElementById("v-graph").style.opacity = "0";

      document.getElementById("V-graph-tick-labels").style.opacity = "0";
      document.getElementById("CA-graph-tick-labels").style.opacity = "1";
      document.getElementById("h-graph-tick-labels").style.opacity = "0";
      document.getElementById("v-graph-tick-labels").style.opacity = "0";

      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "1";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "h":
      document.getElementById("V-graph").style.opacity = "0";
      document.getElementById("CA-graph").style.opacity = "0";
      document.getElementById("h-graph").style.opacity = "1";
      document.getElementById("v-graph").style.opacity = "0";

      document.getElementById("V-graph-tick-labels").style.opacity = "0";
      document.getElementById("CA-graph-tick-labels").style.opacity = "0";
      document.getElementById("h-graph-tick-labels").style.opacity = "1";
      document.getElementById("v-graph-tick-labels").style.opacity = "0";

      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "1";
      document.getElementById("v-curve").style.opacity = "0";
    break;

    case "v":
      document.getElementById("V-graph").style.opacity = "0";
      document.getElementById("CA-graph").style.opacity = "0";
      document.getElementById("h-graph").style.opacity = "0";
      document.getElementById("v-graph").style.opacity = "1";

      document.getElementById("V-graph-tick-labels").style.opacity = "0";
      document.getElementById("CA-graph-tick-labels").style.opacity = "0";
      document.getElementById("h-graph-tick-labels").style.opacity = "0";
      document.getElementById("v-graph-tick-labels").style.opacity = "1";

      document.getElementById("V-curve").style.opacity = "0";
      document.getElementById("CA-curve").style.opacity = "0";
      document.getElementById("h-curve").style.opacity = "0";
      document.getElementById("v-curve").style.opacity = "1";
    break;
  }
})