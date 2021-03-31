const svgContainer = document.getElementById("svg-container");
const p5Container = document.getElementById("p5-container");
const app = document.getElementById("app");

window.gvs.setFlaskLiquidLevel = function(elt, lvl) {
  const flaskG = elt.firstChild;
  const flaskPoly = flaskG.children[0];
  const flaskBottomLiquid = flaskG.children[1];
  const flaskLiquidEllipse = flaskG.children[2];
  
  const polyVerticalDistance = 80 - 35;
  const polyHorizontalDistance = 40 - 25;
  const adjLvl = (lvl - 0.1) / 0.9;
  if ( lvl > 0.1 ) {
    // DRAW TRAPEZOID
    flaskPoly.style.opacity = "1";
    const coord1 = [25 + polyHorizontalDistance * adjLvl, 80 - polyVerticalDistance * adjLvl];
    const coord2 = [25, 81];
    const coord3 = [75, 81];
    const coord4 = [75 - polyHorizontalDistance * adjLvl, 80 - polyVerticalDistance * adjLvl];
    const path = `M ${coord1[0]},${coord1[1]} L ${coord2[0]},${coord2[1]} ${coord3[0]},${coord3[1]} ${coord4[0]},${coord4[1]} Z`;
    flaskPoly.setAttribute("d", path);

    // DRAW ELLIPSE
    flaskLiquidEllipse.style.opacity = "1";
    const centerCoords = [50, 80 - polyVerticalDistance * adjLvl];
    const radiusX = 25 - adjLvl * 15;
    flaskLiquidEllipse.setAttribute("cy", `${centerCoords[1]}`);
    flaskLiquidEllipse.setAttribute("rx", `${radiusX}`);
    flaskLiquidEllipse.setAttribute("ry", "1");

    // DRAW BOTTOM OF LIQUID
    flaskBottomLiquid.style.opacity = "1";
  } else if ( lvl > 0 ) {
    flaskPoly.style.opacity = "0";
    flaskLiquidEllipse.style.opacity = "1";
    const adjLvl = (lvl / 0.1);
    const angle = (1 - adjLvl) * Math.PI / 2;
    const liquidTopYCoord = 80 + 5 * Math.sin( angle );
    const liquidEllipseRadiusX = 25 * Math.cos( angle );
    const liquidEllipseRadiusY = adjLvl;
    flaskLiquidEllipse.setAttribute("cy", liquidTopYCoord);
    flaskLiquidEllipse.setAttribute("rx", liquidEllipseRadiusX);
    flaskLiquidEllipse.setAttribute("ry", liquidEllipseRadiusY);
    const m = [50 - liquidEllipseRadiusX, liquidTopYCoord];
    const path = `m ${m[0]},${m[1]} a 25,5 0 0 0 ${2 * liquidEllipseRadiusX},0`;
    flaskBottomLiquid.style.opacity = "1";
    flaskBottomLiquid.setAttribute("d", path);
  } else {
    flaskPoly.style.opacity = "0";
    flaskLiquidEllipse.style.opacity = "0";
    flaskBottomLiquid.style.opacity = "0";
  }
};

function resizeFlasks() {
  const flasks = [];
  for ( let i = 0; i < 9; i++ ) { flasks.push( document.getElementById( `flask-div-${i + 1}` ) ) }
  const svgs = document.getElementsByClassName("flask-svg");
  const containerRect = svgContainer.getBoundingClientRect();
  const dispenserRect = document.getElementById("dispenser-rect").getBoundingClientRect();
  const p5Rect = p5Container.getBoundingClientRect();
  const relativeSize = 0.07;
  for ( let i = 0; i < flasks.length; i++ ) {
    const flaskDiv = flasks[i];
    const svg = svgs[i];
    svg.style.width = `${relativeSize * containerRect.width}px`;
    let left = 0;
    let top = 0;
    if ( i === 0 ) {
      left = dispenserRect.left + dispenserRect.width / 2;
      top = dispenserRect.top + dispenserRect.height + 10;
    } else {
      const adjWidth = p5Rect.width * 0.45;
      const adjHeight = p5Rect.height * 0.12;
      const topMargin = p5Rect.height * 0.02;
      const leftMargin = p5Rect.width * 0.28;
      left = p5Rect.left + ( ( i - 1 ) % 2 ) * adjWidth + leftMargin;
      top = p5Rect.top + ( ( i - 1 ) * adjHeight ) - ( ( i - 1 ) % 2 ) * adjHeight + topMargin;
    }

    flaskDiv.style.left = `${left}px`;
    flaskDiv.style.top = `${top}px`;
  }
};

window.gvs.updateFlaskObjects = function() {
  let i = 0;
  for ( i = 0; i < window.gvs.flasks.length; i++ ) {
    const thisFlask = window.gvs.flasks[i];
    const flaskDiv = document.getElementById(`flask-div-${i + 1}`);
    flaskDiv.style.display = "grid";
    const label = `${thisFlask.name}<br>x<sub>B</sub> = ${Number(thisFlask.xB).toFixed(2)}`;
    flaskDiv.children[1].innerHTML = label;
    thisFlask.SVG = flaskDiv.children[0];
    thisFlask.div = flaskDiv;
    const lvl = thisFlask.V / thisFlask.maxVolume;
    window.gvs.setFlaskLiquidLevel(thisFlask.SVG, lvl);
  }
  for ( let j = i; j < 9; j++ ) {
    const flaskDiv = document.getElementById(`flask-div-${j + 1}`);
    flaskDiv.style.display = "none";
  }
};

window.gvs.addFlask = function() {
  const k = Math.round(window.gvs.flasks.length + 1);
  if ( k <= 9 ) {
    const flask = { 
      name: `flask #${k}`,
      xB : 0.00,
      V : 0.00,
      maxVolume: Number(document.getElementById("evap-quantity-slider").getAttribute("max")),
      SVG: document.getElementById(`flask-div-1`).children[0],
      div: document.getElementById(`flask-div-1`),
      updateImage: function() {
        const lvl = this.V / this.maxVolume;
        window.gvs.setFlaskLiquidLevel(this.SVG, lvl);
        this.div.children[1].innerHTML = `${this.name}<br>x<sub>B</sub> = ${Number(this.xB).toFixed(2)}`;
      },
    };
    window.gvs.flasks.unshift(flask);
    window.gvs.updateFlaskObjects();
  } else {
    throw "too many flasks added with addFlask()"
  }
};

function updateImage() {
  window.gvs.flasks[0].updateImage();
  window.gvs.still.updateImage();
};

module.exports = { resizeFlasks, updateImage };