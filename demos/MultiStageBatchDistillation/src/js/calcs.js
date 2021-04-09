window.gvs.eq = function(x) {
  return 2.24*x - 2.06*x**2 + 0.82*x**2.7;
};

window.gvs.eqTempKelvin = function(x) {
  return 379 - 29*x - 5 * Math.sin(Math.PI * x);
};

window.gvs.eqTempCelsius = function(x) {
  return 379 - 273.15 - 29*x - 5 * Math.sin(Math.PI * x);
};

const dewPointCoords = [];
for ( let i = 0; i < 201; i++ ) {
  dewPointCoords.push([window.gvs.eq(i / 200), window.gvs.eqTempKelvin(i / 200)]);
};

window.gvs.dewPointKelvin = function(x) {
  if ( x <= 0 ) { return dewPointCoords[0][1] }
  if ( x >= 1 ) { return dewPointCoords[dewPointCoords.length - 1][1] }
  for ( let i = 1; i < dewPointCoords.length; i++ ) {
    if( x < dewPointCoords[i][0] ) {
      const between = (x - dewPointCoords[i - 1][0]) / (dewPointCoords[i][0] - dewPointCoords[i - 1][0]);
      return (between * dewPointCoords[i][1] + (1 - between) * dewPointCoords[i - 1][1]);
    }
  }
};

window.gvs.dewPointCelsius = function(x) {
  return window.gvs.dewPointKelvin(x) - 273.15;
};

function OL(x, xd) {
  const LV = window.gvs.R / ( 1 + window.gvs.R );
  return LV * x + ( 1 - LV ) * xd;
};

function invOL(y, xd) {
  const LV = window.gvs.R / ( 1 + window.gvs.R );
  return ((LV - 1) * xd + y) / LV;
};

window.gvs.findXd = function() {
  let xdCandidate = 0;
  let difference = 100;
  for ( let xd = 0.001; xd < 1; xd += 0.001 ) {
    let currentLoc = window.gvs.eq( window.gvs.still.xB );
    for ( let i = 0; i < window.gvs.stages; i++ ) {
      currentLoc = invOL(currentLoc, xd);
      currentLoc = window.gvs.eq(currentLoc);
    };
    const delta = Math.abs( currentLoc - xd );
    if ( delta < difference ) {
      xdCandidate = xd;
      difference = delta;
    }
  };
  window.gvs.xd = Number( Number(xdCandidate).toFixed(3) );
  window.gvs.OL = function(x) {
    return OL(x, window.gvs.xd);
  };
  window.gvs.invOL = function(y) {
    return invOL(y, window.gvs.xd);
  };
};


function calcAll() {
  window.gvs.findXd();
  
  if ( window.gvs.isCollecting ) {
    const flask = window.gvs.flasks[0];
    let flaskTotalB = flask.V * flask.xB;
    flaskTotalB += window.gvs.dV * window.gvs.xd;
    flask.V += window.gvs.dV;
    flask.xB = flaskTotalB / flask.V;
    flask.xB = window.gvs.p.constrain(flask.xB, 0.001, 0.999);
  
    const still = window.gvs.still;
    let stillTotalB = still.V * still.xB;
    stillTotalB -= window.gvs.dV * window.gvs.xd;
    still.V -= window.gvs.dV;
    still.xB = stillTotalB / still.V;
    still.xB = window.gvs.p.constrain(still.xB, 0.001, 0.999);

    if ( flask.V >= window.gvs.evapQuantity ) { window.gvs.isCollecting = false }
    if ( still.V / still.maxVolume < 0.1 ) {
      window.gvs.isCollecting = false;
      window.gvs.isEmpty = true;
    } else {
      window.gvs.isEmpty = false;
    }
  }

};

module.exports = { calcAll }