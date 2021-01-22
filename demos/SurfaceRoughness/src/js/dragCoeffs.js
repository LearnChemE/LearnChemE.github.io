require("./dragCoeffLists");

function dragCoeff(roughness, Re) {
  
  const dArray = window.dragCoeffs[roughness];
  
  // set minimum and maximum values that fit within our data
  if( Number(Re) <= dArray[0][0] ) {
    return dArray[0][1];
  }

  if( Number(Re) >= dArray[ dArray.length - 1 ][0] ) {
    return dArray[ dArray.length - 1 ][1]
  }

  // Look through each item in the array, compare the Reynolds number to each value until it finds two values to interpolate between. Returns a drag coefficient for that Reynold's number. 
  for ( let i = 0; i < dArray.length - 1; i++ ) {
    if( Re >= dArray[i][0] && Re < dArray[i + 1][0]) {
      const frac = ( Re - dArray[i][0] ) / ( dArray[i + 1][0] - dArray[i][0] );
      const diff = ( dArray[i + 1][1] - dArray[i][1] );
      return dArray[i][1] + frac * diff;
    }
  }

  return dArray[dArray.length - 1][1];
};

module.exports = { dragCoeff };