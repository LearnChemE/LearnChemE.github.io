const math = require("mathjs");

const cplA = 0.3;
const cplB = 0.3;
const cpvA = 0.3;
const cpvB = 0.3;
const HvA = 12;
const HvB = 12;

let findRootPrecision = 0.005;

// middle horizontal line
function f1(z) { return 77.3; };

// bottom-left - alpha liquid phase bottom line
function f2(z) { return -179.43*(z**2) + 112.39*z + 59.96; };

// bottom right - beta liquid phase bottom line
function f3(z) { return -506.61*(z**2) + 815.78*z - 251.09; };

// top left- alpha phase bubble point
function f4(z) { return -382.08*(z**3) + 253.87*(z**2) - 113.1*z + 97.252 };

// alpha phase dew point
function f5(z) { return -32.008*(z**2) - 13.96*z + 97.312; };

// beta phase dew point
function f6(z) { return -30*(z**2) + 86.675*z + 36.095; };

// top right- beta phase bubble point
function f7(z) { return 294.89*(z**2) - 451.53*z + 249.41; };

// Amount of heat required to reach the "horizontal line"
function heat1liquid(z) { return ( 77.3 - gvs.Tinit )*( z * cplB + ( 1 - z ) * cplA ) }

// Amount of heat required to reach said line and fully vaporize one of two liquid phases
function heat1alpha(z) { return heat1liquid(z) + ( ( z - 0.2752 ) / ( 0.6 - 0.2752 ) ) * ( 0.6 * HvB + 0.4 * HvA ) }
function heat1beta(z) { return heat1liquid(z) + ( ( 0.8109 - z ) / ( 0.8109 - 0.6 ) ) * ( 0.6 * HvB + 0.4 * HvA ) }

// Amount of heat required to reach any given point on f2(zB), f3(zB), etc.
function heat2(z) { return -3.012 + 33.717*z - 53.829*z**2 };
function heat3(z) { return -96.327 + 244.73*z - 151.98*z**2 };
function heat4(z) { return 8.0564 - 28.701*z + 28.707*z**2 };
function heat5(z) { return 20.194 - 4.188*z - 9.6024*z**2 };
function heat6(z) { return 1.8285 + 26.003*z - 9.0*z**2 };
function heat7(z) { return 53.823 - 135.46*z + 88.467*z**2 };

// Calculates temperature in the 2-phase VLE regions. Done with interpolation - not perfect, but it works for demonstration purposes
function alphaVLEa(z, heat, T0) { return (( heat - heat4(z) ) / ( heat5(z) - heat4(z) )) * ( f5(z) - T0 ) + T0 }
function alphaVLEb(z, heat, T0) { return (( heat - heat1alpha(z) ) / ( heat5(z) - heat1alpha(z) )) * ( f5(z) - T0 ) + T0 }
function betaVLEa(z, heat, T0) { return (( heat - heat1beta(z) ) / ( heat6(z) - heat1beta(z) )) * ( f6(z) - T0 ) + T0 }
function betaVLEb(z, heat, T0) { return (( heat - heat7(z) ) / ( heat6(z) - heat7(z) )) * ( f6(z) - T0 ) + T0 }

function heat2sol( H ) {
  const complex = math.evaluate(`0.000027866 * ( 11239 - sqrt( 5.4256 * 10^7 - ( 2.3924 * 10^7 ) * ${H} ) )`);
  if ( typeof( complex ) === "object" ) { return complex.re }
  return complex;
};

function heat3sol( H ) {
  const complex = math.evaluate(`0.000019739 * ( 40789. + 2.8284 * sqrt( 4.6336*10^6 - ( 2.1109 * 10^6 ) * ${H} ) )`);
  if ( typeof( complex ) === "object" ) { return complex.re }
  return complex;
};

function heat4asol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0; i < 0.276; i += findRootPrecision ) {
    const lhs = alphaVLEa( z, H, f4(z) );
    const rhs = f4( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat4bsol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0; i < 0.276; i += findRootPrecision ) {
    const lhs = alphaVLEb( z, H, 77.3 );
    const rhs = f4( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat5asol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0; i < 0.6; i += findRootPrecision ) {
    const lhs = alphaVLEa( z, H, f4(z) );
    const rhs = f5( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat5bsol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0; i < 0.6; i += findRootPrecision ) {
    const lhs = alphaVLEb( z, H, 77.3 );
    const rhs = f5( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat6asol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0.6; i < 1; i += findRootPrecision ) {
    const lhs = betaVLEa( z, H, 77.3 );
    const rhs = f6( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat6bsol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0.6; i < 1; i += findRootPrecision ) {
    const lhs = betaVLEb( z, H, f7(z) );
    const rhs = f6( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat7asol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0.81; i < 1; i += findRootPrecision ) {
    const lhs = betaVLEa( z, H, 77.3 );
    const rhs = f7( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function heat7bsol( H, z ) {
  let min = 1000;
  let j;
  for ( let i = 0.81; i < 1; i += findRootPrecision ) {
    const lhs = betaVLEa( z, H, f7(z) );
    const rhs = f7( i );
    const diff = Math.abs( Math.abs(lhs) - Math.abs(rhs) );
    if ( diff < min ) { min = diff; j = i }
  }
  return j;
};

function section() {
  if( gvs.z === 0.00 && heat4( gvs.z )  <  gvs.heat && gvs.heat < heat5( gvs.z ) ) { return 15 }
  if( gvs.z === 1.00 && heat7( gvs. z ) <= gvs.heat && gvs.heat < heat6( gvs.z ) ) { return 16 }
  if( gvs.z  <= 0.2752 && heat2( gvs.z )  <  gvs.heat && gvs.heat < heat4( gvs.z ) ) { return 1 }
  if( 0.2752 <  gvs.z  && gvs.z <= 0.6000 && gvs.heat <  heat1liquid( gvs.z ) || 0.0000 <= gvs.z && gvs.z <  0.2752 && gvs.heat <= heat2( gvs.z ) ) { return 2 }
  if( 0.6000 <  gvs.z  && gvs.z <  0.8109 && gvs.heat <  heat1liquid( gvs.z ) || 0.8109 <= gvs.z && gvs.z <= 1.0000 && gvs.heat <= heat3( gvs.z ) ) { return 3 }
  if( 0.8109 <= gvs.z  && heat3( gvs.z )  <  gvs.heat && gvs.heat < heat7( gvs.z ) ) { return 4 }
  if( 0.2752 <= gvs.z  && gvs.z <= 0.6000 && heat1liquid( gvs.z ) <= gvs.heat && gvs.heat <= heat1alpha( gvs.z ) ) { return 5 }
  if( 0.6000 <  gvs.z  && gvs.z <= 0.8109 && heat1liquid( gvs.z ) <= gvs.heat && gvs.heat <= heat1beta( gvs.z ) ) { return 6 }
  if( gvs.z  <= 0.2752 && heat4( gvs.z )  <  gvs.heat && gvs.heat < heat5( gvs.z ) ) { return 7 }
  if( 0.2752 <  gvs.z  && gvs.z < 0.6000 && heat1alpha( gvs.z ) < gvs.heat && gvs.heat < heat5( gvs.z ) ) { return 8 }
  if( 0.6000 <= gvs.z  && gvs.z < 0.8109 && heat1beta( gvs.z )  < gvs.heat && gvs.heat < heat6( gvs.z ) ) { return 9 }
  if( 0.8109 <= gvs.z  && heat7( gvs. z ) <= gvs.heat && gvs.heat < heat6( gvs.z ) ) { return 10 }
  if( 0.2752 <= gvs.z  && gvs.z < 0.6000 && gvs.heat >= heat5( gvs.z ) ) { return 11 }
  if( 0.2752 >  gvs.z  && gvs.heat >= heat5( gvs.z ) ) { return 12 }
  if( 0.6000 <= gvs.z  && gvs.z < 0.8109 && gvs.heat >= heat6( gvs.z ) ) { return 13 }
  if( 0.8109 <= gvs.z  && gvs.heat >= heat6( gvs.z ) ) { return 14 }
  throw "graph section not identified in section() function";
};

function data() {
  switch( section() ) {
    case 1:
      return [ gvs.Tinit + gvs.heat / ( gvs.z * cplB + ( 1 - gvs.z ) * cplA ), 1, 0, 0, gvs.z, -1, -1 ];
    case 2:
      return [ gvs.Tinit + gvs.heat / ( gvs.z * cplB + ( 1 - gvs.z ) * cplA ), ( heat3sol( gvs.heat ) - gvs.z ) / ( heat3sol( gvs.heat ) - heat2sol( gvs.heat ) ), ( gvs.z - heat2sol( gvs.heat ) ) / ( heat3sol( gvs.heat ) - heat2sol( gvs.heat ) ), 0, heat2sol( gvs.heat ), heat3sol( gvs.heat ), -1 ];
    case 3:
      return [ gvs.Tinit + gvs.heat / ( gvs.z * cplB + ( 1 - gvs.z ) * cplA ), ( heat3sol( gvs.heat ) - gvs.z ) / ( heat3sol( gvs.heat ) - heat2sol( gvs.heat ) ), ( gvs.z - heat2sol( gvs.heat ) ) / ( heat3sol( gvs.heat ) - heat2sol( gvs.heat ) ), 0, heat2sol( gvs.heat ), heat3sol( gvs.heat ), -1 ];
    case 4:
      return [ gvs.Tinit + gvs.heat / ( gvs.z * cplB + ( 1 - gvs.z ) * cplA ), 0, 1, 0, -1, gvs.z, -1 ];
    case 5:
      return [ 77.3, ( 0.6000 - gvs.z ) / 0.3240 + ( heat1alpha( gvs.z ) - gvs.heat ) / ( heat1alpha( gvs.z ) - heat1liquid( gvs.z ) ) * ( ( 0.8110 - gvs.z ) / 0.5340 - ( 0.6000 - gvs.z ) / 0.3240 ), ( gvs.z - 0.2760 ) / 0.5340 * ( heat1alpha( gvs.z ) - gvs.heat ) / ( heat1alpha( gvs.z ) - heat1liquid( gvs.z ) ), ( gvs.z - 0.2760 ) / 0.3240 * ( 1 - ( heat1alpha( gvs.z ) - gvs.heat ) / ( heat1alpha( gvs.z ) - heat1liquid( gvs.z ) ) ), 0.2760, 0.8110, 0.6000 ];
    case 6:
      return [ 77.3, ( 0.8110 - gvs.z ) / 0.5340 * ( heat1beta( gvs.z ) - gvs.heat ) / ( heat1beta( gvs.z ) - heat1liquid( gvs.z ) ), ( gvs.z - 0.6000 ) / 0.2110 + ( heat1beta( gvs.z ) - gvs.heat ) / ( heat1beta( gvs.z ) - heat1liquid( gvs.z ) ) * ( ( gvs.z - 0.2760 ) / 0.5340 - ( gvs.z - 0.6000 ) / 0.2110 ), ( 0.8110 - gvs.z ) / 0.2110 * ( 1 - ( heat1beta( gvs.z ) - gvs.heat ) / ( heat1beta( gvs.z ) - heat1liquid( gvs.z ) ) ), 0.2760, 0.8110, 0.6000 ];
    case 7:
      return [ alphaVLEa( gvs.z, gvs.heat, f4( gvs.z ) ), ( heat5asol( gvs.heat, gvs.z ) - gvs.z ) / ( heat5asol( gvs.heat, gvs.z ) - heat4asol( gvs.heat, gvs.z ) ), 0, ( gvs.z - heat4asol( gvs.heat, gvs.z ) ) / ( heat5asol( gvs.heat, gvs.z ) - heat4asol( gvs.heat, gvs.z ) ), heat4asol( gvs.heat, gvs.z ), -1, heat5asol( gvs.heat, gvs.z ) ];
    case 8:
      return [ alphaVLEb( gvs.z, gvs.heat, 77.3 ), ( heat5bsol( gvs.heat, gvs.z ) - gvs.z ) / ( heat5bsol( gvs.heat, gvs.z ) - heat4bsol( gvs.heat, gvs.z ) ), 0, ( gvs.z - heat4bsol( gvs.heat, gvs.z ) ) / ( heat5bsol( gvs.heat, gvs.z ) - heat4bsol( gvs.heat, gvs.z ) ), heat4bsol( gvs.heat, gvs.z ), -1, heat5bsol( gvs.heat, gvs.z ) ];
    case 9:
      return [ betaVLEa( gvs.z, gvs.heat, 77.3 ), 0, ( gvs.z - heat6asol( gvs.heat, gvs.z ) ) / ( heat7asol( gvs.heat, gvs.z ) - heat6asol( gvs.heat, gvs.z ) ), ( heat7asol( gvs.heat, gvs.z ) - gvs.z ) / ( heat7asol( gvs.heat, gvs.z ) - heat6asol( gvs.heat, gvs.z ) ), -1, heat7asol( gvs.heat, gvs.z ), heat6asol( gvs.heat, gvs.z ) ];
    case 10:
      return [ betaVLEb( gvs.z, gvs.heat, f7( gvs.z ) ), 0, ( gvs.z - heat6bsol( gvs.heat, gvs.z ) ) / ( heat7bsol( gvs.heat, gvs.z ) - heat6bsol( gvs.heat, gvs.z ) ), ( heat7bsol( gvs.heat, gvs.z ) - gvs.z ) / ( heat7bsol( gvs.heat, gvs.z ) - heat6bsol( gvs.heat, gvs.z ) ), -1, heat7bsol( gvs.heat, gvs.z ), heat6bsol( gvs.heat, gvs.z ) ];
    case 11:
      return [ f5( gvs.z ) + ( gvs.heat - heat5( gvs.z ) ) / ( gvs.z * cpvB + ( 1 - gvs.z ) * cpvA), 0, 0, 1, -1, -1, gvs.z ];
    case 12:
      return [ f5( gvs.z ) + ( gvs.heat - heat5( gvs.z ) ) / ( gvs.z * cpvB + ( 1 - gvs.z ) * cpvA), 0, 0, 1, -1, -1, gvs.z ];
    case 13:
      return [ f6( gvs.z ) + ( gvs.heat - heat6( gvs.z ) ) / ( gvs.z * cpvB + ( 1 - gvs.z ) * cpvA), 0, 0, 1, -1, -1, gvs.z ];
    case 14:
      return [ f6( gvs.z ) + ( gvs.heat - heat6( gvs.z ) ) / ( gvs.z * cpvB + ( 1 - gvs.z ) * cpvA), 0, 0, 1, -1, -1, gvs.z ];
    case 15:
      return [ 97.3, 1 - (gvs.heat - ((97.3 - 70) * cplA)) / HvA, 0, (gvs.heat - ((97.3 - 70) * cplA)) / HvA, 0, -1, 0 ];
    case 16:
      return [ 92.77, 0, 1 - (gvs.heat - ((92.77 - 70) * cplB)) / HvB, (gvs.heat - ((92.77 - 70) * cplB)) / HvB, -1, 1, 1 ];
  }
};

function calcAll() {
  if ( gvs.z === 0.01 || gvs.z === 0.99 ) { findRootPrecision = 0.001 }
  else if ( gvs.z === 0.02 || gvs.z === 0.98 ) { findRootPrecision = 0.0025 }
  else { findRootPrecision = 0.005 }
  gvs.data = data();
  gvs.T = gvs.data[0];
};

module.exports = { cplA, cplB, cpvA, cpvB, HvA, HvB, f1, f2, f3, f4, f5, f6, f7, heat1liquid, heat1alpha, heat1beta, heat2, heat3, heat4, heat5, heat6, heat7, alphaVLEa, alphaVLEb, betaVLEa, betaVLEb, heat2sol, heat3sol, heat4asol, heat4bsol, heat5asol, heat5bsol, heat6asol, heat6bsol, heat7asol, heat7bsol, section, data, calcAll };