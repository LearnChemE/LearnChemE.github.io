const svgContainer = document.getElementById("svg-container");
const rightSideContainer = document.getElementById("right-side-container");
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
  const p5Rect = rightSideContainer.getBoundingClientRect();
  const relativeSize = 0.055;
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
    let thisFlask;
    if ( i > 0 ) {
      const index = window.gvs.flasks.length - i;
      thisFlask = window.gvs.flasks[index];
    } else {
      thisFlask = window.gvs.flasks[i];
    }
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
  if ( k > 1 ) { document.getElementById("flasks-here").style.opacity = "0" }
  if ( k <= 9 ) {
    const flask = {
      name: `container #${k}`,
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


const setStairCoordinates = function() {
  // First, set the equilibrium plot's stair coordinates
  let eqCoordList = [[ window.gvs.still.xB, window.gvs.eq( window.gvs.still.xB ) ]];
  let eqLabelCoords = [];
  if ( window.gvs.selectedPane !== 1 ) {
    for ( let i = 0; i < gvs.eqShapes.stairLines.length; i++ ) {
      const line = gvs.eqShapes.stairLines[i];
      if ( i >= gvs.stages * 2 + 1 && window.gvs.selectedPane === 2 ) {
        line.style.strokeOpacity = "0"
      } else {
        let coord1;
        if ( window.gvs.selectedPane === 2 ) {
          coord1 = gvs.eqPlot.coordToPix( ...eqCoordList[i] );
          line.style.strokeOpacity = "1";
        }
        
        if ( i === 0 && window.gvs.selectedPane === 2 ) {
          window.gvs.eqShapes.stillDot.setAttribute("cx", `${coord1[0]}`);
          window.gvs.eqShapes.stillDot.setAttribute("cy", `${coord1[1]}`)
        };
        
        if ( i % 2 == 0 ) {
          eqCoordList.push([ window.gvs.invOL(eqCoordList[i][1]), eqCoordList[i][1] ]);
        } else {
          eqCoordList.push([ eqCoordList[i][0], window.gvs.eq( eqCoordList[i][0] ) ]);
        };

        if( window.gvs.selectedPane === 2 ) {
          const coord2 = gvs.eqPlot.coordToPix( ...eqCoordList[i + 1] );
          line.setAttribute("x1", coord1[0]);
          line.setAttribute("y1", coord1[1]);
          line.setAttribute("x2", coord2[0]);
          line.setAttribute("y2", coord2[1]);
          if ( i % 2 === 0 ) {
            const rect = line.getBoundingClientRect();
            eqLabelCoords.push([rect.left, rect.top]);
          }
          if ( i === gvs.stages * 2 ) {
            window.gvs.eqShapes.distillateDot.setAttribute("cx", `${coord2[0]}`);
            window.gvs.eqShapes.distillateDot.setAttribute("cy", `${coord2[1]}`);
          }
        }
        
      }
    };
  
    if ( window.gvs.selectedPane === 2 ) {
      for ( let i = 0; i < gvs.eqShapes.stairLabels.length; i++ ) {
        const label = gvs.eqShapes.stairLabels[i];
        if ( i < gvs.stages + 1 ) {
          label.style.left = `${eqLabelCoords[i][0]}px`;
          label.style.top = `${eqLabelCoords[i][1]}px`;
          label.style.opacity = "1";
        } else {
          label.style.opacity = "0"
        }
      };
    }
  }

  if ( window.gvs.selectedPane === 3 ) {
    // Then, set the t-x-y plot's stair coordinates
    let txyCoordList = [[ window.gvs.still.xB, window.gvs.eqTempCelsius( window.gvs.still.xB ) ]];
    let txyLabelCoords = [];

    for ( let i = 0; i < gvs.txyShapes.stairLines.length; i++ ) {
      const line = gvs.txyShapes.stairLines[i];
      if ( i >= gvs.stages * 2 + 1 ) {
        line.style.strokeOpacity = "0"
      } else {
        line.style.strokeOpacity = "1";
        const coord1 = gvs.txyPlot.coordToPix( ...txyCoordList[i] );
        if ( i === 0 ) {
          window.gvs.txyShapes.stillDot.setAttribute("cx", `${coord1[0]}`);
          window.gvs.txyShapes.stillDot.setAttribute("cy", `${coord1[1]}`)
        };
        if ( i % 2 == 0 ) {
          txyCoordList.push([ window.gvs.invDewPointCelsius( txyCoordList[i][1] ), window.gvs.dewPointCelsius( eqCoordList[i][1] ) ]);
        } else {
          txyCoordList.push([ eqCoordList[i][0], window.gvs.eqTempCelsius( eqCoordList[i][0] ) ]);
        };
        const coord2 = gvs.txyPlot.coordToPix( ...txyCoordList[i + 1] );
        line.setAttribute("x1", coord1[0]);
        line.setAttribute("y1", coord1[1]);
        line.setAttribute("x2", coord2[0]);
        line.setAttribute("y2", coord2[1]);
        if ( i % 2 === 0 ) {
          const rect = line.getBoundingClientRect();
          txyLabelCoords.push([rect.left, rect.top]);
        }
        if ( i === gvs.stages * 2 ) {
          window.gvs.txyShapes.distillateDot.setAttribute("cx", `${coord2[0]}`);
          window.gvs.txyShapes.distillateDot.setAttribute("cy", `${coord2[1]}`);
          const rect = window.gvs.txyShapes.distillateDot.getBoundingClientRect();
          txyLabelCoords.push([rect.left, rect.top]);
        }
      }
    };

    for ( let i = 0; i < gvs.txyShapes.stairLabels.length; i++ ) {
      const label = gvs.txyShapes.stairLabels[i];
      if ( i < gvs.stages + 1 ) {
        label.style.left = `${txyLabelCoords[i][0]}px`;
        label.style.top = `${txyLabelCoords[i][1]}px`;
        label.style.opacity = "1";
      } else if ( i !== gvs.txyShapes.stairLabels.length - 1 ) {
        label.style.opacity = "0"
      } else {
        label.style.opacity = "1";
        label.style.left = `${txyLabelCoords[txyLabelCoords.length - 1][0]}px`
        label.style.top = `${txyLabelCoords[txyLabelCoords.length - 1][1]}px`
      }
    };
  }

};

window.gvs.setStagesInImage = function(stages) {
  let groups = [];
  for ( let i = 1; i <= 6; i++ ) {
    const group = document.getElementById(`stage-group-${i}`);
    if ( i > stages ) { group.style.opacity = "0" }
    else { group.style.opacity = "1"; groups.push(group) }
  };
  
  const minYTranslation = -64;
  const maxYTranslation = 26;
  const range = maxYTranslation - minYTranslation;
  const n = groups.length;
  const delta = range / ( n + 1 );
  let currentY = maxYTranslation;

  for ( let i = 0; i < n; i++ ) {
    currentY -= delta;
    let translationText;
    if ( i % 2 === 0 ) {
      translationText = `translate(0,${currentY})`;
    } else {
      translationText = `matrix(-1,0,0,1,146.02225,${currentY})`;
    };
    groups[i].setAttribute("transform", translationText);
  }
};

function updateTemperatures() {
  const condenserTempElt = document.getElementById("condenser-temperature");
  const stillTempElt = document.getElementById("still-temperature");
  const Tb = Math.round( window.gvs.eqTempCelsius(window.gvs.still.xB) );
  const Tc = Math.round( window.gvs.dewPointCelsius(window.gvs.xd) );
  condenserTempElt.textContent = `${Tc.toFixed(0)}° C`;
  stillTempElt.textContent = `${Tb.toFixed(0)}° C`;
};

const updateOperatingLine = function() {
  const eqShapes = window.gvs.eqShapes;
  const txyShapes = window.gvs.txyShapes;
  const eqPlot = window.gvs.eqPlot;
  const txyPlot = window.gvs.txyPlot;
  eqShapes.operatingLine.setAttribute("y1", `${eqPlot.coordToPix(0, window.gvs.OL(0))[1]}`);
  eqShapes.operatingLine.setAttribute("x2", `${eqPlot.coordToPix(window.gvs.xd, 0)[0]}`);
  eqShapes.operatingLine.setAttribute("y2", `${eqPlot.coordToPix(0, window.gvs.OL( window.gvs.xd ))[1]}`);
}

const updateGraphs = function() {
  updateOperatingLine();
  setStairCoordinates();
};

function updateImage() {
  updateGraphs();
  window.gvs.flasks[0].updateImage();
  window.gvs.still.updateImage();
  updateTemperatures();
};

module.exports = { resizeFlasks, updateImage };