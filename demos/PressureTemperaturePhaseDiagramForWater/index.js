window.g = {
  cnv : undefined,
  heat : 0,
  isotype : 'isothermal',
  transition : 'sublimation',

  R : 8.314*Math.pow(10,-6), // Gas constant (m^3*MPa/[mol-K])
  Tcrit : 647.096, // Critical temperature (K)
  Pcrit : 22.12, // Critical pressure (MPa)

  cp_water : 75.3, // J/mol-K
  cp_ice : 31.01, // J/mol-K
  cp_vapor : 33.75, // J/mol-K

  Hm : 6020, // Water standard heat of fusion (J/mol)
  Hv : 40650, // Water standard heat of vaporization (J/mol)
  Hv0 : 44480, // Approximate heat of vaporization at 0C [273K] (J/mol)
  Hs : 51000, // Approximate heat of sublimation at 250K (J/mol)
  
  // Values below are set arbitrarily to zero then filled first
  Ti : 0, // Initial temperature
  Pi : 0, // Initial pressure

  heatSublime : 0, // Heat required to get from Ti to sublimation point at 250K
  heatMelt : 0, // Heat required to get from Ti to melting point at 273K
  heatVapor : 0,
  heatTriple : 0,
}

function setup() {
  g.cnv = createCanvas(800, 600);
  g.cnv.parent("graphics-wrapper");
  document.getElementsByTagName("main")[0].remove();
 
  
}

function draw() {
  background(250);

  graphDraw();
  subGraphDraw();
  initialStateDetermine();
  
  
  curveDraw();
  gibbsPhase();

  
  
}
                
const heat = document.getElementById("heat");
const heat_label = document.getElementById("heat-value");
const isotype = document.getElementById("isotype");
const transition = document.getElementById("state-transition");

heat.addEventListener("input", function(){
  const heat_temp = Number(heat.value);
  heat_label.innerHTML = `${heat_temp}`;
  g.heat = heat_temp;
});

isotype.addEventListener("change", function(){
  const iso_temp = isotype.value;
  g.isotype = iso_temp;
});

transition.addEventListener("change", function(){
  const trans_temp = transition.value;
  g.transition = trans_temp;
});





