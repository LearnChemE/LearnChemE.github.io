const svgText = require("../media/column-dist.svg");
const svgContainer = document.getElementById("svg-container");
const flaskText = require("../media/flask-dist.svg");
const flasksContainer = document.getElementById("flasks-container");
const app = document.getElementById("app");

for( let i = 0; i < 9; i++ ) {
  const flaskDiv = document.createElement("div");
  flaskDiv.innerHTML = flaskText;
  flaskDiv.classList.add("flask-div");
  flaskDiv.id = `flask-div-${i + 1}`;
  if( i === 0 ) { app.appendChild(flaskDiv) } else { flasksContainer.appendChild(flaskDiv) }
  const flaskSVG = flaskDiv.firstChild;
  flaskSVG.id = `flask-svg-${i + 1}`;
  const flaskLabelDiv = document.createElement("div");
  flaskLabelDiv.classList.add("flask-label");
  flaskLabelDiv.innerHTML = `flask #${i + 1}<br>x<sub>B</sub> = 0.00`;
  flaskDiv.appendChild(flaskLabelDiv);
};

function importSVG() {
  svgContainer.innerHTML = svgText;
};

function addStill() {
  const still = {
    xB: Number(document.getElementById("xBinit-slider").value),
    V: 10,
    maxVolume: 10,
    Tstill: 150 + 273.15,
    Tcond: 250 + 273.15,
    liquidElts: [
      document.getElementById("still-liquid"),
      document.getElementById("still-liquid-ellipse"),
    ],
    temperatureElts: [
      document.getElementById("still-temperature"),
      document.getElementById("condenser-temperature"),
    ],
    updateImage: function() {
      const adjLvl =  Math.max(0, (this.V - 0.1 * this.maxVolume) / (0.9 * this.maxVolume));
      const liquidTop = 217.94961;
      const liquidMaxHeight = 28.84352;
      const liquidPath = `m 93.247999,${liquidTop + (1 - adjLvl) * liquidMaxHeight} v ${adjLvl * liquidMaxHeight} c -0.26353,4.91962 -1.86939,7.08134 -6.04743,7.47887 H 73.02836 58.856157 c -4.473673,-0.39762 -5.988585,-3.13313 -6.047154,-7.47887 v ${-1 * adjLvl * liquidMaxHeight} z`;
      this.liquidElts[0].setAttribute("d", liquidPath);
      this.liquidElts[1].setAttribute("cy", `${liquidTop + (1 - adjLvl) * liquidMaxHeight}`);
      const TB = Math.round(this.Tstill - 273.15);
      const TC = Math.round(this.Tcond - 273.15);
      this.temperatureElts[0].innerHTML = `${Number(TB).toFixed(0)}° C`;
      this.temperatureElts[1].innerHTML = `${Number(TC).toFixed(0)}° C`;
    }
  };

  window.gvs.still = still;
};

const tooltips = [
  {
    hover: "eq-curve-path-invisible",
    highlight: "eq-curve-path",
    message: function() { return "This equilibrium line shows the mole fractions of B for liquid and vapor in equilibrium." },
    tooltipPosition: "top",
  },
  {
    hover: "txy-curve-path-invisible",
    highlight: "txy-curve-path",
    message: function() { return "Bubble point line" },
    tooltipPosition: "top",
  },
  {
    hover: "dew-point-curve-path-invisible",
    highlight: "dew-point-curve-path",
    message: function() { return "Dew point line" },
    tooltipPosition: "top",
  },
  {
    hover: "x-y-line-path-invisible",
    highlight: "x-y-line-path",
    message: function() { return "y<sub>B</sub> = x<sub>B</sub> line" },
    tooltipPosition: "top",
  },
  {
    hover: "operating-line-svg-invisible",
    highlight: "operating-line-svg",
    message: function() { return "Operating line, defined by a mass balance around the condenser" },
    tooltipPosition: "top",
  },
];

function addTooltips() {
  const formatNumber = function(n) {
    let out = n;
    if( out > 0.999 ) { out = Math.min(0.9999, out); return out.toFixed(4) }
    if( out > 0.99 ) { return out.toFixed(3) }
    if( out < 0.01 ) { return out.toPrecision(1) }
    return out.toFixed(2);
  };

  for ( let i = 1; i <= 6; i++ ) {
    const tooltip = {};
    const id = `stage-group-${i}`;
    tooltip.hover = id;
    tooltip.highlight = id;
    tooltip.message = function() {
      const line = window.gvs.eqShapes.stairLines[-1 + 2 * i];
      const xPix = Number(line.getAttribute("x2"));
      const yPix = Number(line.getAttribute("y2"));
      const coords = window.gvs.eqPlot.pixToCoord(xPix, yPix);
      const xB = formatNumber(coords[0]);
      const yB = formatNumber(coords[1]);
      const temperature = Math.round( window.gvs.eqTempCelsius(xB) );
      return `
      <div style="text-align:center; line-height: 1.75em;">
        stage ${i}<br>x<sub>B</sub>: ${xB}<br>y<sub>B</sub>: ${yB}<br>${temperature}° C
      </div>
      `;
    };
    tooltip.tooltipPosition = "left";
    tooltips.push(tooltip);
  };

  const SVGTooltip = (tooltip) => {
    const hoverElt = document.getElementById(tooltip.hover);
    const highlightElt = document.getElementById(tooltip.highlight);
    const tooltipElt = document.getElementById("tooltip-div");

    hoverElt.addEventListener("mouseover", (e) => {
      hoverElt.setAttribute("mouseisover", "yes");
      highlightElt.setAttribute("filter", "url(#drop-shadow)");
      if( !window.gvs.tooltipVisible ) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        tooltipElt.style.top = `${mouseY}px`;
        tooltipElt.style.left = `${mouseX}px`;
      };
      window.setTimeout(() => {
        if( hoverElt.getAttribute("mouseisover") === "yes" && !window.gvs.tooltipVisible ) {
          window.gvs.tooltipVisible = true;
          tooltipElt.innerHTML = tooltip.message();
          tooltipElt.style.opacity = "1";
          switch(tooltip.tooltipPosition) {
            case "top":
              tooltipElt.style.transform = "translateX(-50%) translateY( calc( -100% - 10px ))";
            break;

            case "left":
              tooltipElt.style.transform = "translateX( calc( -100% - 20px ) ) translateY( -50% )";
            break;

            case "right":
              tooltipElt.style.transform = "translateX( 20px ) translateY( -50% )";
            break;

            case "bottom":
              tooltipElt.style.transform = "translateX( -50% ) translateY( 20px )";
            break;

            default:
              tooltipElt.style.transform = "";
            break;
          }
        }
      }, 1000);
    });
    
    hoverElt.addEventListener("mouseleave", () => {
      hoverElt.setAttribute("mouseisover", "no");
      highlightElt.removeAttribute("filter");
      tooltipElt.style.opacity = "0";
      window.gvs.tooltipVisible = false;
    });

  };

  for ( let i = 0; i < tooltips.length; i++ ) {
    const tooltip = tooltips[i];
    SVGTooltip( tooltip );
  }
};

module.exports = { importSVG, addStill, addTooltips }
