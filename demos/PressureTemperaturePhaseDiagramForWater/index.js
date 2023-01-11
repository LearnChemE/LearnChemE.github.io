window.g = {
  cnv : undefined,
  slider : 2,
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

  P : 0, // These will be used for plotting the displayed point
  T : 0,

  comp : [0, 0, 0], // Percentage solid, liquid, vapor
}

// Object for storing the various necessary coefficients
let c = {
  g00 :  -0.632020233335886*(10**6),
  g01 : 0.655022213658955,
  g02 : -0.189369929326131*(10**-7),
  g03 : 0.339746123271053*(10**-14),
  g04 : -0.556464869058991*(10**-21),
  t1 : math.complex(0.368017112855051*(10**-1),0.510878114959572*(10**-1)),
  t2 : math.complex(0.337315741065416, 0.335449415919309),
  r1 : math.complex(0.447050716285388*(10**2), 0.656876847463481*(10**2)),
  r20 : math.complex(-0.725974574329220*(10**2), 0.781008427112870*(10**2)),
  r21 : math.complex(-0.557107698030123*(10**-4), -0.464578634580806*(10**-4)),
  r22 : math.complex(0.234801409215913*(10**-10), -0.285651142904972*(10**-10)),
  Tt : 273.16,
  pi0 : 101325/611.6571,
  R2 : 0.461526,

}

function setup() {
  g.cnv = createCanvas(800, 600);
  g.cnv.parent("graphics-wrapper");
  document.getElementsByTagName("main")[0].remove();
  //frameRate(2)
  initialStateDetermine();
}

function draw() {
  background(250);
  
  if(g.isotype == 'isothermal'){
    isothermPressure();
    isothermSliderLabel();
  }
  compositionDetermine();
  
  graphDraw();
  subGraphDraw();
  
  curveDraw();
  gibbsPhase();

  plotPoint();
}
                
const slider = document.getElementById("slider"); // Using slider as var name since it switches between specific volume and heat
const slider_label = document.getElementById("slider-label");
const slider_value = document.getElementById("slider-value");
const isotype = document.getElementById("isotype");
const transition = document.getElementById("state-transition");

slider.addEventListener("input", function(){
  const slider_temp = Number(slider.value);
  slider_value.innerHTML = `${slider_temp}`;
  g.slider = slider_temp;
});

isotype.addEventListener("change", function(){
  const iso_temp = isotype.value;
  g.isotype = iso_temp;
  sliderLimits();
  initialStateDetermine();
});

transition.addEventListener("change", function(){
  const trans_temp = transition.value;
  g.transition = trans_temp;
  sliderLimits();
  initialStateDetermine();
});

// Changes the range on the slider depending on isothermal/-baric and transition type
function sliderLimits(){
  switch (g.isotype){
    case 'isothermal':
      slider_label.innerHTML = "specific volume (L/mol)";
      switch (g.transition){
        case 'sublimation':
          slider.setAttribute("min", "-34");
          slider.setAttribute("max", "2");
          slider.value = "2";
          g.slider = slider.value;
          break;
        case 'melting':
          slider.setAttribute("min", "-2.25");
          slider.setAttribute("max", "1.5");
          slider.value = "1.5";
          g.slider = slider.value;
          break;
        case 'vaporization':
          slider.setAttribute("min", "-11.2");
          slider.setAttribute("max", "-1");
          slider.value = "-1";
          g.slider = slider.value;
          break;
        case 'triple-point':
          slider.setAttribute("min", "-14.2");
          slider.setAttribute("max", "-2");
          slider.value = "-2";
          g.slider = slider.value;
          break;
      }
      break;
    case 'isobaric':
      slider_label.innerHTML = "heat (kJ)";
      switch (g.transition){
        case 'sublimation':
          slider.setAttribute("min", "0");
          slider.setAttribute("max", "56");
          slider.value = "0";
          g.slider = slider.value;
          slider_value.innerHTML = `${g.slider}`;
          break;
        case 'melting':
          slider.setAttribute("min", "0");
          slider.setAttribute("max", "14");
          slider.value = "0";
          g.slider = slider.value;
          slider_value.innerHTML = `${g.slider}`;
          break;
        case 'vaporization':
          slider.setAttribute("min", "0");
          slider.setAttribute("max", "50");
          slider.value = "0";
          g.slider = slider.value;
          slider_value.innerHTML = `${g.slider}`;
          break;
        case 'triple-point':
          slider.setAttribute("min", "0");
          slider.setAttribute("max", "56");
          slider.value = "0";
          g.slider = slider.value;
          slider_value.innerHTML = `${g.slider}`;
          break;
      }
      break;
  }
}

function isothermSliderLabel(){
  let label, label1;
  switch (g.transition){
    case 'sublimation':
      if (g.slider > -9.4){
        label = nuIce(250,Math.exp(g.slider)*10**6);
        label1 = expLabel(label);
      } else if (g.slider <= -9.4 && g.slider >= -21.4){
        label = (g.slider + 9.4)/-12*nuVapor(250,Math.exp(-9.4)) + (g.slider+21.4)/12*nuIce(250,Math.exp(-9.4)*10**6);
        label1 = expLabel(label);
      } else if (g.slider < -21.4){
        label = nuVapor(250,Math.exp(-9.4 + (g.slider+21.4)/5))
        label1 = expLabel(label);
      }
      break;
    case 'melting':
      if (g.slider > .25){
        label = nuLiquid(273.07, Math.exp(g.slider));
        label1 = expLabel(label);
      } else if (g.slider <= .25 && g.slider >= -1){
        label = (g.slider - 0.25)/-1.25*nuIce(273.07,Math.exp(0.25)*10**6) + (g.slider + 1)/1.25*nuLiquid(273.07,Math.exp(0.25));
        label1 = expLabel(label);
      } else if (g.slider < -1){
        label = nuIce(273.07,Math.exp(1.25+g.slider)*10**6);
        label1 = expLabel(label);
      }
      break;
    case 'vaporization':
      if (g.slider > -4.4){
        label = nuLiquid(325,Math.exp(g.slider));
        label1 = expLabel(label);
      } else if (g.slider <= -4.4 && g.slider >= -7.8){
        label = (g.slider + 4.4)/-3.4*nuVapor(325,Math.exp(-4.4)) + (g.slider + 7.8)/3.4*nuLiquid(325,Math.exp(-4.4));
        label1 = expLabel(label);
      } else if (g.slider < -7.8){
        label = nuVapor(325,Math.exp(-4.4 - (-7.8-g.slider)/1.5));
        label1 = expLabel(label);
      }
      break;
    case 'triple-point':
      if (g.slider > -7.4){
        label = nuLiquid(273.16,Math.exp(g.slider));
        label1 = expLabel(label);
      } else if (g.slider <= -7.4 && g.slider >= -10.8){
        label =  ((g.slider + 7.4)/-3.4)**2*nuVapor(273.16,Math.exp(-7.4)) + (1-((g.slider+7.4)/-3.4)**2)*nuLiquid(273.16,Math.exp(-7.4))
        label1 = expLabel(label);
      } else if (g.slider < -10.8){
        label = nuVapor(273.16,Math.exp(-7.4-(-10.8-g.slider)/1.5));
        label1 = expLabel(label);
      }
      break;
  }
  actualLabel(label1);
}

// Used to determine the required exponent for the slider label
function expLabel(num){
  let pos = 0;
  let neg = 0;

  if(num > 10){
    while (num > 10){
      num = num/10;
      pos++;
    }
    num = num.toFixed(3);
    return([num,pos]);
  } 

  if(num < 1){
    while (num < 1){
      num = num*10;
      neg++;
    }
    num = num.toFixed(3);
    neg = -1*neg;
    return([num,neg]);
  }

  if(num > 1 && num < 10){
    return([num.toFixed(3),0])
  }
}

// Couldn't find a way to superscript the exponent since it's a variable so I'm hardcoding this system
function actualLabel(vec){
  let num = vec[0];
  let ex = vec[1];

  if(ex == -2){
    slider_value.innerHTML = `${num}` + '*10<sup>-2</sup>';
  } else if (ex == -1){
    slider_value.innerHTML = `${num}` + '*10<sup>-1</sup>';
  } else if (ex == 0){
    slider_value.innerHTML = `${num}`
  } else if (ex == 1){
    slider_value.innerHTML = `${num}` + '*10<sup>1</sup>';
  } else if (ex == 2){
    slider_value.innerHTML = `${num}` + '*10<sup>2</sup>' ; 
  } else if (ex == 3){
    slider_value.innerHTML = `${num}` + '*10<sup>3</sup>';
  } else if (ex == 4){
    slider_value.innerHTML = `${num}` + '*10<sup>4</sup>';
  } else if (ex == 5){
    slider_value.innerHTML = `${num}` + '*10<sup>5</sup>';
  }
}




