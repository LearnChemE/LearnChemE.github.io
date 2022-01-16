require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  v0 : null, // Inlet flow rate ( m^3/s )
  V0 : null, // Initial volume in tank
  CA0 : null, // Initial mole fraciton
  is_running : false, // Is "true" once "start simulation" is pressed
  A : 0.785, // Area of the tank, m^2
  Aout : 0.00785, // Area of the outlet pipe (diameter 10 cm)
  V : null, // Volume of liquid in the tank ( L )
  v : 0, // Volumetric flow rate leaving the bottom of vessel ( L / s )
  CA : 1.0, // Concentration of A in the vessel ( mol / L )
  N : 500, // Total moles of A in the vessel
  Vmax : (0.785**2 * 1.5) * 1000, // Maximum volume of the tank ( L )
  h_tank : 0.785 * 1.5, // Height of the tank (m)
  h : null, // Height of the liquid (m)
  start_frame : 0, // Used for the liquid pouring out animation
  speed: 1, // Number of seconds simulated per second
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    p.frameRate(60);
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.calcAll = require("./js/calcs.js");
    const { SVG_Graph } = require("./js/svg-graph-library.js");
    gvs.SVG_Graph = SVG_Graph;
    require("./js/inputs.js");
    gvs.handle_V0();
    gvs.handle_v0();
    gvs.handle_CA0();
    gvs.handle_speed();
    gvs.V = gvs.V0;
    gvs.h = gvs.V / gvs.A;
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);