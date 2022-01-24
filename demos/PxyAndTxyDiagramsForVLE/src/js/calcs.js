gvs.arrayInterpolation = function(arr, x) {
  let n = 0;
  let dif = 100000000;
  for(let i = 0; i < arr.length; i++) {
    const arr_x = arr[i][0];
    const new_dif = Math.abs(x - arr_x);
    if( new_dif < dif ) {
      dif = new_dif;
      n = i;
    }
  }

  let y = arr[n][1];

  if(x > arr[n][0]) {
    if(n < arr.length - 1 && n > 0) {
      if(arr[n + 1][0] > arr[n][0]) {
        const frac = ( x - arr[n][0] ) / ( arr[n + 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n + 1][1] - arr[n][1] );
      } else if( arr[n - 1][0] > arr[n][0] ) {
        const frac = ( x - arr[n][0] ) / ( arr[n - 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n - 1][1] - arr[n][1] );
      }
    }
  } else if( x < arr[n][0] ) {
    if(n < arr.length - 1 && n > 0) {
      if(arr[n + 1][0] < arr[n][0]) {
        const frac = ( x - arr[n][0] ) / ( arr[n + 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n + 1][1] - arr[n][1] );
      } else if( arr[n - 1][0] < arr[n][0] ) {
        const frac = ( x - arr[n][0] ) / ( arr[n - 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n - 1][1] - arr[n][1] );
      }
    }
  }

  return y
}

gvs.saturation_pressure_A = function(T) {
  // Saturation pressure of component A (bar). "T" argument is in degrees Celsius
  return 10**( 4.00266 - 1171.53 / (T + 224.216) )
}

gvs.saturation_pressure_B = function(T) {
  return 10**( 4.04867 - 1355.126 / (T + 209.367) )
}

gvs.Px = function(x) {
  // Bubble-point pressure of the mixture, where x is the mole fraction of component A. Returns pressure in bar
  const result = x * gvs.saturation_pressure_A( gvs.T ) + ( 1 - x ) * gvs.saturation_pressure_B( gvs.T );
  return result
}

gvs.Py = function(x) {
  // Dew-point pressure of the mixture
  const numerator = x / gvs.saturation_pressure_A( gvs.T ) + ( 1 - x ) / gvs.saturation_pressure_B( gvs.T );
  const result = 1 / numerator;
  return result
}

gvs.pxy_x_bubble_point = function() {
  for(let x = 0.000; x <= 1.00; x += 0.0001) {
    if( gvs.Px(x) >= gvs.P ) {
      return x
    }
  }
  return 1
}

gvs.pxy_x_dew_point = function() {
  for(let x = 0.000; x <= 1.00; x += 0.001) {
    if( gvs.Py(x) >= gvs.P ) {
      return x
    }
  }
  return 1
}

gvs.txy_x_bubble_point = function() {
  for(let x = 0.000; x <= 1.000; x += 0.001) {
    if( gvs.Tx(x) <= gvs.T ) {
      return x
    }
  }
  return 1
}

gvs.txy_x_dew_point = function() {
  for(let x = 0.000; x <= 1.000; x += 0.001) {
    if( gvs.Ty(x) <= gvs.T ) {
      return x
    }
  }
  return 1
}

gvs.calc_Tsat = function() {
  const resolution = 100;
  const min_temperature = 40; // degrees C
  const max_temperature = 190;
  const initial_temp = gvs.T;
  gvs.bubble_point_temperature_array = [];
  gvs.dew_point_temperature_array = [];
  for( let x = 0; x <= 1.01; x += 0.01 ) {
    const bubble_points = [];
    const dew_points = [];
    for( let i = 0; i <= resolution; i++ ) {
      const dt = (max_temperature - min_temperature) / resolution;
      const T = 40 + i * dt; // Saturation temperature (degrees Celsius)
      gvs.T = T;
      const Px = gvs.Px(x); // Bubble point pressure (bar)
      const Py = gvs.Py(x); // Dew point pressure (bar)
      bubble_points.push([Px, T]);
      dew_points.push([Py, T]);
    }
    const x_2 = Math.round( x * 100 ) / 100; // round the x value to the nearest 100ths-place decimal
    gvs.bubble_point_temperature_array.push([x_2, gvs.arrayInterpolation(bubble_points, gvs.P)]);
    gvs.dew_point_temperature_array.push([x_2, gvs.arrayInterpolation(dew_points, gvs.P)]);
  }
  gvs.T = initial_temp;
  // gvs.T = Number(document.getElementById("T-slider").value); // Reset gvs.T so that the slider is still correct if they switch back to P-x-y
}

gvs.Tx = function(x) {
  const bubble_point_temperature = gvs.arrayInterpolation(gvs.bubble_point_temperature_array, x)
  return bubble_point_temperature
}

gvs.Ty = function(x) {
  const dew_point_temperature = gvs.arrayInterpolation(gvs.dew_point_temperature_array, x)
  return dew_point_temperature
}

gvs.calc_tie_lines = function() {
  if(gvs.plot === "P-x-y") {
    let vapor = (gvs.z - gvs.pxy_x_bubble_point()) / (gvs.pxy_x_dew_point() - gvs.pxy_x_bubble_point());
    const liquid = 1 - vapor;
    gvs.q = Math.min(1, Math.max(0, liquid));
  } else {
    const vapor = (gvs.z - gvs.txy_x_bubble_point()) / (gvs.txy_x_dew_point() - gvs.txy_x_bubble_point());
    const liquid = 1 - vapor;
    gvs.q = Math.min(1, Math.max(0, liquid));
  }
}

gvs.calc_tie_lines();