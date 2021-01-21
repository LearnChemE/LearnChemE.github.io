require("./dragCoeffLists");

function dragCoeff(roughness, Re) {
  
  const dArray = window.dragCoeffs[roughness];
  
  if( Number(Re) <= 50000 ) {
    return dArray[0][1];
  }

  for ( let i = 0; i < dArray.length - 1; i++ ) {
    // Linear interpolation
    if( Re >= dArray[i][0] && Re < dArray[i + 1][0]) {
      const frac = ( Re - dArray[i][0] ) / ( dArray[i + 1][0] - dArray[i][0] );
      const diff = ( dArray[i + 1][1] - dArray[i][1] );
      return dArray[i][1] + frac * diff;
    }
  }

  return dArray[dArray.length - 1][1];
};

module.exports = { dragCoeffs, dragCoeff };