gvs.collection_progress = 0;

gvs.no_azeotrope = function(x) {
  const y = x + 0.25 * Math.sin(Math.PI * x**0.8)**0.9;
  return y
}

gvs.minimum_temperature_azeotrope = function(x) {
  const y = x**0.75 + 0.12 * Math.sin( 2 * Math.PI * x );
  return y
}

gvs.maximum_temperature_azeotrope = function(x) {
  const y = x**0.9 - 0.14 * Math.sin( 2 * Math.PI * x );
  return y
}

gvs.no_azeotrope_temperature = function(x) {
  const T = 379 - 29 * x - 5 * Math.sin( Math.PI * x );
  return T - 273.15
}

gvs.minimum_temperature_azeotrope_temperature = function(x) {
  const T = 380 - 20 * x - 15 * Math.sin( 1.022 * Math.PI * x );
  return T - 273.15
}

gvs.maximum_temperature_azeotrope_temperature = function(x) {
  const T = 343 + 41 * x + 20 * Math.sin( Math.PI * ( x + 0.26 ) );
  return T - 273.15
}

gvs.no_azeotrope_dew_point = function(x) {
  if(x == 0) {return gvs.no_azeotrope_temperature(0)}
  if(x == 1) {return gvs.no_azeotrope_temperature(1)}
  let y_vals = [];
  let temp_vals = [];
  for(let i = 0; i < 200; i++) {
    const x = i / 200;
    y_vals.push( gvs.no_azeotrope(x) );
    temp_vals.push( gvs.no_azeotrope_temperature( x ) );
  }
  let j = 0;
  while( y_vals[j] <= x ) {
    j++
  }
  j = Math.min(200, j);
  const upper = y_vals[j];
  const lower = y_vals[j - 1];
  const interp = (x - lower) / (upper - lower);
  const temp_lower = temp_vals[j - 1];
  const temp_upper = temp_vals[j];
  const temp = temp_lower + interp * (temp_upper - temp_lower);
  return temp
}

gvs.minimum_temperature_azeotrope_dew_point = function(x) {
  if(x == 0) {return gvs.minimum_temperature_azeotrope_temperature(0)}
  if(x == 1) {return gvs.minimum_temperature_azeotrope_temperature(1)}
  let y_vals = [];
  let temp_vals = [];
  for(let i = 0; i < 200; i++) {
    const x = i / 200;
    y_vals.push( gvs.minimum_temperature_azeotrope(x) );
    temp_vals.push( gvs.minimum_temperature_azeotrope_temperature( x ) );
  }
  let j = 0;
  while( y_vals[j] <= x ) {
    j++
  }
  j = Math.min(200, j);
  const upper = y_vals[j];
  const lower = y_vals[j - 1];
  const interp = (x - lower) / (upper - lower);
  const temp_lower = temp_vals[j - 1];
  const temp_upper = temp_vals[j];
  const temp = temp_lower + interp * (temp_upper - temp_lower);
  return temp
}

gvs.maximum_temperature_azeotrope_dew_point = function(x) {
  if(x == 0) {return gvs.maximum_temperature_azeotrope_temperature(0)}
  if(x == 1) {return gvs.maximum_temperature_azeotrope_temperature(1)}
  let y_vals = [];
  let temp_vals = [];
  for(let i = 0; i < 200; i++) {
    const x = i / 200;
    y_vals.push( gvs.maximum_temperature_azeotrope(x) );
    temp_vals.push( gvs.maximum_temperature_azeotrope_temperature( x ) );
  }
  let j = 0;
  while( y_vals[j] <= x ) {
    j++
  }
  j = Math.min(200, j);
  const upper = y_vals[j];
  const lower = y_vals[j - 1];
  const interp = (x - lower) / (upper - lower);
  const temp_lower = temp_vals[j - 1];
  const temp_upper = temp_vals[j];
  const temp = temp_lower + interp * (temp_upper - temp_lower);
  return temp
}

gvs.differential_collection = function() {
  if(gvs.collection_progress < 1 && gvs.B > 0.05) {
    const dP = 0.0005 / gvs.amount_to_collect;
    const collection_flask = gvs.flasks[gvs.flasks.length - 1];
    switch(gvs.eq_plot_shape) {
      case "no azeotrope":
        gvs.xD = gvs.no_azeotrope(gvs.xB);
        gvs.T = gvs.no_azeotrope_temperature(gvs.xB);
      break;

      case "minimum-temperature azeotrope":
        gvs.xD = gvs.minimum_temperature_azeotrope(gvs.xB);
        gvs.T = gvs.minimum_temperature_azeotrope_temperature(gvs.xB);
      break;

      case "maximum-temperature azeotrope":
        gvs.xD = gvs.maximum_temperature_azeotrope(gvs.xB);
        gvs.T = gvs.maximum_temperature_azeotrope_temperature(gvs.xB);
      break;
    }
    const amount_to_evaporate = gvs.amount_to_collect * dP;
    collection_flask.add(amount_to_evaporate, gvs.xD);
    const volatile_before_evaporation = gvs.xB * gvs.B;
    const volatile_evaporated = amount_to_evaporate * gvs.xD;
    gvs.B -= amount_to_evaporate;
    const volatile_after_evaporation = volatile_before_evaporation - volatile_evaporated;
    gvs.xB = Math.max(volatile_after_evaporation / gvs.B, 0.001);
    gvs.collection_progress += dP;
  } else {
    gvs.is_collecting = false;
    document.getElementById("reset-simulation").removeAttribute("disabled");
    if(gvs.B > 0.05) { document.getElementById("start-collection").removeAttribute("disabled") }
    document.getElementById("evap-slider").removeAttribute("disabled");
    // Coordinates of the collection flasks (pixels)
    const coords = [
      [316, 370],
      [500, 90],
      [650, 90],
      [500, 220],
      [650, 220],
      [500, 350],
      [650, 350],
      [500, 480],
      [650, 480],
      [500, 700],
      [650, 700],
    ];
    const f = gvs.flasks.length - 1;
    gvs.flasks[f].x_loc = coords[f + 1][0];
    gvs.flasks[f].y_loc = coords[f + 1][1];
    gvs.flasks.push(new gvs.Flask({ x_loc : 316, y_loc : 370 }));
    if( f >= 7 || gvs.B <= 0.05 ) {
      document.getElementById("start-collection").setAttribute("disabled", "yes");
      document.getElementById("evap-slider").setAttribute("disabled", "yes");
    }
  }
}

gvs.begin_collection = function() {
  gvs.collection_progress = 0;
  gvs.p.loop();
  gvs.differential_collection();
}