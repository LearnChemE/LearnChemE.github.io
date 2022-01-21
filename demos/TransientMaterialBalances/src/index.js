require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  v0 : 23, // Inlet flow rate ( m^3/s )
  V0 : 500, // Initial volume in tank
  CA0 : 1.0, // Initial concentration A
  k : 0.050, // Reaction rate constant (s^-1)
  r : 0.0, // Reaction rate (mol / (L s))
  is_running : false, // Is "true" once "start simulation" is pressed
  A : 0.785, // Area of the tank cross-section, m^2
  Aout : 0.00785, // Area of the outlet pipe (diameter 10 cm)
  V : 500, // Volume of liquid in the tank ( L )
  v : 0, // Volumetric flow rate leaving the bottom of vessel ( L / s )
  CA : 1.0, // Concentration of A in the vessel ( mol / L )
  N : 500, // Total moles of A in the vessel
  Vmax : (0.785**2 * 1.5) * 1000, // Maximum volume of the tank ( L )
  h_tank : 0.785 * 1.5, // Height of the tank (m)
  h : 0.636943, // Height of the liquid (m)
  start_frame : 0, // Used for the liquid pouring out animation
  speed: 1, // Number of seconds simulated per second
  V_array : [[0, 500], [1, 500]], // Used to graph volume over time
  CA_array : [[0, 1.0], [1, 1.0]], // Used to graph concentration over time
  h_array : [[0, 0.636943], [1, 0.636943]], // Used to graph height over time
  v_array : [[0, 27.7], [1, 27.7]], // Used to graph volumetric flow rate over time
  t : 0, // Time since "start simulation" button was pressed
  plot_selection : "V", // Select which plot to show next to the vessel
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 560);
    p.frameRate(60);
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.calcAll = require("./js/calcs.js");
    require("./js/inputs.js");
    gvs.handle_V0();
    gvs.handle_v0();
    gvs.handle_CA0();
    gvs.handle_speed();
    gvs.handle_k();
    gvs.V = gvs.V0;
    gvs.h = (gvs.V / 1000) / gvs.A;
    gvs.drawGraphs = require("./js/graph.js");
    document.getElementById("V-curve").style.opacity = "0";
    p.windowResized = function() {
      gvs.V_graph.resize();
      gvs.CA_graph.resize();
      gvs.h_graph.resize();
      gvs.v_graph.resize();
    }
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
    gvs.drawGraphs();
  };

};

const P5 = new p5(sketch, containerElement);