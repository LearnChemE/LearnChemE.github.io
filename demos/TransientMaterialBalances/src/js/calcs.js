function vOut(h) {
  // h is height of the liquid relative to the exit hole (m)
  // derivation of this equation here https://www.youtube.com/watch?v=PWZRoEQaEs4
  const g = 9.80665; // acceleration of gravity (m/s^2)
  const velocity = Math.sqrt( 2 * g * h );
  return velocity * gvs.Aout * 1000; // outlet volumetric flow rate (L/s)
}

function init() {
  gvs.V = gvs.V0;
  gvs.CA = 1.0;
  gvs.v = 0;
  gvs.N = 500;
}

function advance() {
  gvs.h = (gvs.V / 1000) / gvs.A; // height of liquid (m)
  gvs.v = vOut(gvs.h);
  const dt = gvs.speed / gvs.p.frameRate();
  gvs.V += dt * gvs.v0 - dt * gvs.v;
  gvs.N += dt * gvs.v0 * gvs.CA0 - dt * gvs.v * gvs.CA;
  gvs.CA = gvs.N / gvs.V;
}

function calcAll() {
  if(gvs.is_running === false) {
    init();
  } else {
    advance();
  }
}

module.exports = calcAll;