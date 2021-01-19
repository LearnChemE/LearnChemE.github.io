// Load libraries
require("./style/style.scss");
window.jQuery = require("jquery");
window.$ = window.jQuery;
require("bootstrap");
window.p5 = require("p5");
window.shapes = require("./js/shapes.js");

window.MathJax = {
  chtml: {
    displayAlign: 'left',
    displayIndent: '1em',
  }
};

require("../dist/mathjax.js");

// Declare global variables (sp represents "sketch properties")
window.sp = {
  width : 550,
  height : 400,
  pipeHeightInPixels : 50,
  pipeHeightInMeters : 2.7,
  pipeDiameterInletInPixels : 20,
  pipeDiameterInletInMeters : 0.05,
  pipeDiameterOutletInPixels : 20,
  pipeDiameterOutletInCentimeters: 5,
  inletPressure : 100,
  inletVelocity : 1,
  outletPressure : 74,
  outletVelocity : 1,
  display: 0,
}

window.setup = function() {
  createCanvas(sp.width, sp.height);

  windowResized = () => {
    console.log("resize window");
  }
}

window.draw = function() {
  background(245);
  translate(10, 20);
  shapes.pipeHorizontal(100, 300, Number(sp.pipeDiameterInletInPixels), 100);
  shapes.pipeVertical(200, 300, Number(sp.pipeDiameterInletInPixels), sp.pipeHeightInPixels);
  shapes.elbow1(200, 300, Number(sp.pipeDiameterInletInPixels));
  shapes.elbow2(200, 300 - sp.pipeHeightInPixels, Number(sp.pipeDiameterInletInPixels));
  shapes.pipeHorizontal(294, 256.75 - Number(sp.pipeHeightInPixels) - Number(sp.pipeDiameterOutletInPixels) / 2, window.sp.pipeDiameterOutletInPixels, 100);
  shapes.expander(254, 256.75 - Number(sp.pipeHeightInPixels) - Number(sp.pipeDiameterInletInPixels) / 2, Number(sp.pipeDiameterInletInPixels), Number(sp.pipeDiameterOutletInPixels));
  shapes.doubleArrow(250, 320, sp.pipeHeightInPixels - (Number(sp.pipeDiameterInletInPixels) - 20) / 2 - 5);

  textSize(16);
  text(`Δz = ${window.sp.pipeHeightInMeters} m`, 260, 300 - sp.pipeHeightInPixels / 2);
  push();
    if( window.sp.display == 0 ) {
      
      text(`D   = ${Number(Number(window.sp.pipeDiameterInletInMeters) * 100).toFixed(1)} cm`, 20, 235);
      text(`P   = ${window.sp.inletPressure} kPa`, 20, 260);
      text(`u   = ${Number( window.sp.inletVelocity ).toFixed(1) } m/s`, 20, 285);

      text(`D     = ${Number( window.sp.pipeDiameterOutletInCentimeters).toFixed(1)} cm`, 410, 290 - Number(window.sp.pipeHeightInPixels));
      text(`P     = ${window.sp.outletPressure} kPa`, 410, 315 - Number(window.sp.pipeHeightInPixels));
      text(`u     = ${Number( window.sp.outletVelocity).toFixed(1) } m/s`, 410, 340 - Number(window.sp.pipeHeightInPixels));
      
      text(`D = pipe diameter`, 20, 30);
      text(`P = pressure`, 20, 55);
      text(`u = fluid velocity`, 20, 80);

      textSize(12);
      text(`in`, 30, 290);
      text(`in`, 30, 265);
      text(`in`, 32, 240);
      text(`out`, 420, 320 - Number(window.sp.pipeHeightInPixels));
      text(`out`, 420, 345 - Number(window.sp.pipeHeightInPixels));
      text(`out`, 420, 295 - Number(window.sp.pipeHeightInPixels));
      
    } else {
      
      const KEin = Number( 1000 * window.sp.inletVelocity**2 / ( 2 * 1000 ) ).toFixed(1);
      const PEin = 0;
      const IEin = Number( window.sp.inletPressure ).toFixed(1);
      
      const KEout = Number( 1000 * window.sp.outletVelocity**2 / ( 2 * 1000 ) ).toFixed(1);
      const PEout = Number( 1000 * 9.81 * window.sp.pipeHeightInMeters / 1000 ).toFixed(1);
      const IEout = Number( window.sp.outletPressure ).toFixed(1);

      textAlign(LEFT);

      text(`K.E.`, 5, 235);
      text(`P.E.`, 5, 260);
      text(`P`, 5, 285);
      text(`K.E.`, 390, 295 - Number(window.sp.pipeHeightInPixels));
      text(`P.E.`, 390, 320 - Number(window.sp.pipeHeightInPixels));
      text(`P`, 390, 345 - Number(window.sp.pipeHeightInPixels));

      text(`=  ${KEin}`, 40, 235);
      text(`=  ${PEin}`, 40, 260);
      text(`=  ${IEin}`, 40, 285);
      text(`=  ${KEout}`, 425, 295 - Number(window.sp.pipeHeightInPixels));
      text(`=  ${PEout}`, 425, 320 - Number(window.sp.pipeHeightInPixels));
      text(`=  ${IEout}`, 425, 345 - Number(window.sp.pipeHeightInPixels));

      text(`K.E. = Kinetic energy`, 20, 30);
      text(`P.E. = Potential energy`, 20, 55);
      text(`P = Pressure`, 20, 80);

      text(`kJ/m`, 108, 235);
      text(`kJ/m`, 108, 260);
      text(`kJ/m`, 108, 285);   

      text(`kJ/m`, 495, 295 - Number(window.sp.pipeHeightInPixels));
      text(`kJ/m`, 495, 320 - Number(window.sp.pipeHeightInPixels));
      text(`kJ/m`, 495, 345 - Number(window.sp.pipeHeightInPixels));

      textSize(12);
      text(`3`, 143, 279);
      text(`3`, 143, 253);
      text(`3`, 143, 227);
      text(`3`, 529, 312 - Number(window.sp.pipeHeightInPixels));
      text(`3`, 529, 337 - Number(window.sp.pipeHeightInPixels));
      text(`3`, 529, 287 - Number(window.sp.pipeHeightInPixels));
      textSize(12);
    }
    
  pop();


  shapes.singleArrow(20, 310, 95, 310);
  shapes.singleArrow(400, 257 - sp.pipeHeightInPixels, 460, 257 - sp.pipeHeightInPixels);
}

function calculate() {
  const dz = Number.parseFloat(window.sp.pipeHeightInMeters); // change in height (m)
  const Pin = Number.parseFloat(window.sp.inletPressure) * 1000; // inlet pressure (Pa)
  const vin = Number.parseFloat(window.sp.inletVelocity); // inlet velocity (m/s)
  const Din = Number.parseFloat(window.sp.pipeDiameterInletInMeters); // inlet pipe diameter (m)
  const Dout = Number.parseFloat(window.sp.pipeDiameterOutletInCentimeters) / 100; // outlet pipe diameter (m)
  const g = 9.81; // gravitational acceleration (m/s^2)
  const rho = 1000; // fluid density (kg / m^3)
  
  const inletArea = PI * (Din / 2)**2;
  const outletArea = PI * (Dout / 2)**2;

  const outletVelocity = ( vin * inletArea ) / outletArea;
  const outletPressure = Pin + ( rho * (vin**2) / 2 ) - ( rho * (outletVelocity**2) / 2 ) - g * dz * rho;

  window.sp.outletPressure = Number(Math.round(outletPressure) / 1000).toFixed(0);
  window.sp.outletVelocity = Number(outletVelocity).toFixed(1);
};

const heightSlider = document.getElementById("heightSlider");

heightSlider.addEventListener("input", function () {
  window.sp.pipeHeightInPixels = heightSlider.value;
  window.sp.pipeHeightInMeters = Number(0.25 + ( 9.75 * Number(heightSlider.value) / 200 )).toFixed(1);
  document.getElementById("height-value").innerHTML = window.sp.pipeHeightInMeters;
  calculate();
});

const outletDiameterSlider = document.getElementById("outletDiameterSlider");

outletDiameterSlider.addEventListener("input", function () {
  window.sp.pipeDiameterOutletInPixels = outletDiameterSlider.value;
  window.sp.pipeDiameterOutletInCentimeters = Number( Number(outletDiameterSlider.value) / 4 ).toFixed(1);
  document.getElementById("outlet-diameter-value").innerHTML = window.sp.pipeDiameterOutletInCentimeters;
  calculate();
});

const inletPressureSlider = document.getElementById("inletPressureSlider");

inletPressureSlider.addEventListener("input", function () {
  window.sp.inletPressure = Number(inletPressureSlider.value).toFixed(0);
  document.getElementById("inlet-pressure-value").innerHTML = window.sp.inletPressure;
  calculate();
});

const inletVelocitySlider = document.getElementById("inletVelocitySlider");

inletVelocitySlider.addEventListener("input", function() {
  window.sp.inletVelocity = Number(inletVelocitySlider.value).toFixed(1);
  document.getElementById("inlet-velocity-value").innerHTML = window.sp.inletVelocity;
  calculate();
});

const directionsButton = document.getElementById("directions-button");
const detailsButton = document.getElementById("details-button");
const aboutButton = document.getElementById("about-button");

directionsButton.addEventListener("click", function() {
  const titles = document.getElementsByClassName("modal-title");
  const bodies = document.getElementsByClassName("modal-body");
  const directions = document.getElementsByClassName("directions");
  
  for ( let i = 0; i < titles.length; i++ ) {
    const title = titles[i];
    title.style.display = "none";
  };
  
  for ( let i = 0; i < bodies.length; i++ ) {
    const body = bodies[i];
    body.style.display = "none";
  };
  
  for ( let i = 0; i < directions.length; i++ ) {
    const elt = directions[i];
    elt.style.display = "block";
  };

});

detailsButton.addEventListener("click", function() {
  const titles = document.getElementsByClassName("modal-title");
  const bodies = document.getElementsByClassName("modal-body");
  const details = document.getElementsByClassName("details");
  
  for ( let i = 0; i < titles.length; i++ ) {
    const title = titles[i];
    title.style.display = "none";
  };
  
  for ( let i = 0; i < bodies.length; i++ ) {
    const body = bodies[i];
    body.style.display = "none";
  };
  
  for ( let i = 0; i < details.length; i++ ) {
    const elt = details[i];
    elt.style.display = "block";
  };

});

aboutButton.addEventListener("click", function() {
  const titles = document.getElementsByClassName("modal-title");
  const bodies = document.getElementsByClassName("modal-body");
  const abouts = document.getElementsByClassName("about");
  
  for ( let i = 0; i < titles.length; i++ ) {
    const title = titles[i];
    title.style.display = "none";
  };
  
  for ( let i = 0; i < bodies.length; i++ ) {
    const body = bodies[i];
    body.style.display = "none";
  };
  
  for ( let i = 0; i < abouts.length; i++ ) {
    const elt = abouts[i];
    elt.style.display = "block";
  };

});

window.toggles = document.getElementsByClassName("btn-success");

for ( let i = 0; i < toggles.length; i++ ) {
  const toggle = toggles[i];
  toggle.addEventListener("click", function() {
    if( toggles[0].firstChild.checked ) {
      window.sp.display = 0;
    } else {
      window.sp.display = 1;
    }
  });
}