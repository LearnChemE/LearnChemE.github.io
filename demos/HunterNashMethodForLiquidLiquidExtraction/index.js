window.g = {
  cnv: undefined,

  gridTruth: false,
  pointType: 'plot-points',
  feedMassFracs: [0.53, 0.05, 0.42],
  mix: 'feed',
  tieSlider: 0,
  radius: 7,
  phaseInfopx: [],


  // Info about triangle 
  xtip: 475,
  ytip: 70,
  dx: 0,
  dy: 0,
  angle: 60,
  L: [], // m and b value for left edge of triangle
  R: [], // m and b values for right edge of triangle
}

let sFracs = {
  solu: 0,
  solv: 1,
  carr: 0,
}

let rFracs = {
  solu: 0.03,
  solv: 0.01,
  carr: 0.96,
}

// Holds info about tie lines slope and y-intercept and x & y coords of intercepts
let tie = {
  // x-coords of tie lines from mathematica
  xLeft: [0.03507, 0.05151, 0.07973, 0.1258, 0.1839],
  xRight: [0.976, 0.9318, 0.8286, 0.7182, 0.5766],
  m: [],
  b: [],
  pos: [],
  pix: [],
}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();

  // phaseToPixels();
  // tieInfo();
  triangleDataFill();
  phaseInfo();

}

function draw() {
  background(250);
  triangleDraw();



  switch (g.pointType) {
    case 'plot-points':
      plotPoints();
      break;
    case 'mixing-point':
      mixingPoint();
      break;
    case 'determine-e1':
      determineE1();
      break;
    case 'operating-point':
      operatingPoint();
      break;
    case 'count-stages':
      countStages();
      break;
  }




}

const plotPointsOptions = document.getElementById("plot-points-options");
const pointType = document.getElementById("point-type");
const sliderContainer = document.getElementById("slider-container");
const firstRadio = document.getElementById("point-type").children;
const gridLines = document.getElementById("grid-lines");
const feedFracs = document.getElementById("feed-mass-fracs");



const secondRadio = document.getElementById("plot-points-options").children;
const tie_slider = document.getElementById("tie-slider");
const tie_label = document.getElementById("tie-slider-value");



gridLines.addEventListener("change", () => {
  g.gridTruth = gridLines.checked;
});


for (let i = 0; i < firstRadio.length; i++) {
  firstRadio[i].addEventListener("click", function() {
    for (let j = 0; j < firstRadio.length; j++) {
      firstRadio[j].classList.remove("selected");
    };
    firstRadio[i].classList.add("selected");
    g.pointType = firstRadio[i].value;
  });
};


pointType.addEventListener("input", () => {
  if (firstRadio[0].checked) {
    plotPointsOptions.style.display = "inline-flex";
    sliderContainer.style.display = "none";
  }

  if (firstRadio[2].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }

  if (firstRadio[4].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }

  if (firstRadio[6].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }

  if (firstRadio[8].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "grid";
  }
});

feedFracs.addEventListener("change", function() {
  const temp = feedFracs.value;

  if (temp == "0.53/0.05/0.42") {
    g.feedMassFracs[0] = 0.53;
    g.feedMassFracs[1] = 0.05;
    g.feedMassFracs[2] = 0.42;
  } else if (temp == "0.45/0.08/0.48") {
    g.feedMassFracs[0] = 0.45;
    g.feedMassFracs[1] = 0.08;
    g.feedMassFracs[2] = 0.48;
  } else if (temp == "0.48/0.15/0.36") {
    g.feedMassFracs[0] = 0.48;
    g.feedMassFracs[1] = 0.15;
    g.feedMassFracs[2] = 0.36;
  }
});

for (let i = 0; i < secondRadio.length; i++) {
  secondRadio[i].addEventListener("click", function() {
    for (let j = 0; j < secondRadio.length; j++) {
      secondRadio[j].classList.remove("selected");
    };
    secondRadio[i].classList.add("selected");
    g.mix = secondRadio[i].value;
  });
}

tie_slider.addEventListener("input", function() {
  const temp = Number(tie_slider.value);
  tie_label.innerHTML = `${temp}`;
  g.tieSlider = temp;
});


// Data for generating squiggle thing in operating point mode
let squiggle = [
  [145.7205387205387, 11.176206509539844],
  [148.72951739618406, 16.334455667789],
  [154.31762065095398, 29.230078563411897],
  [147.86980920314255, 44.704826038159375],
  [154.74747474747474, 63.61840628507295],
  [147.43995510662177, 80.38271604938272],
  [154.74747474747474, 96.71717171717172],
  [147.86980920314255, 113.91133557800225],
  [147.86980920314255, 122.93827160493828]
]