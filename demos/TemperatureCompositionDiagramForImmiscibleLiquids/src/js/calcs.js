gvs.Psat1 = function(T) {
  return 10**(4.72583 - 1660.652/(T + 271.5))
}

gvs.Psat2 = function(T) {
  return 10**(5.0768 - 1659.793/(T + 227.1))
}

gvs.Ty1 = function(z) {
  let delta = 1e6;
  let T_sol = 100;
  for(let T = 100; T <= 220; T += 0.1) {
    const T_error = Math.abs(gvs.Psat1(T) / gvs.P - z);
    if(T_error < delta) {
      T_sol = T;
      delta = T_error;
    }
  }
  return T_sol
}

gvs.Ty2 = function(z) {
  let delta = 1e6;
  let T_sol = 100;
  for(let T = 100; T <= 220; T += 0.1) {
    const T_error = Math.abs(1 - gvs.Psat2(T) / gvs.P - z);
    if(T_error < delta) {
      T_sol = T;
      delta = T_error;
    }
  }
  return T_sol
}

function intersectionPoint() {
  let delta = 1e6;
  let x_guess = 0.5;
  for(let x = 0.54; x < 0.60; x += 0.01) {
    const d = Math.abs(gvs.Ty2(x) - gvs.Ty1(x));
    if(d < delta) {
      delta = d;
      x_guess = x;
    }
  }
  gvs.intersection_point = x_guess;
  gvs.bubble_point = Math.round(10 * gvs.Ty1(x_guess)) / 10;
}

function calculateTemperature() {
  // all units are J/mol
  const Cp_benzene_liquid = 135.69;
  const Cp_benzene_vapor = 82.4;
  const Hvap_benzene = 30720;
  const Cp_water_liquid = 75.38;
  const Cp_water_vapor = 36.57;
  const Hvap_water = 40700;

  const Cp_liquid = gvs.x * Cp_benzene_liquid + (1 - gvs.x) * Cp_water_liquid;
  const Cp_vapor = gvs.x * Cp_benzene_vapor + (1 - gvs.x) * Cp_water_vapor;
  const Q_subcooled = (gvs.bubble_point - gvs.T_initial) * Cp_liquid;
  const Q = gvs.Q * 1000;
  let Q_bubble;
  let Q_dew;
  let moles_of_other_liquid_evaporated;
  let moles_of_liquid_remaining;
  let Hvap;
  if(gvs.x < gvs.intersection_point) {
    const moles_of_benzene = gvs.x;
    Hvap = Hvap_benzene * moles_of_benzene;
    Q_bubble = Q_subcooled + Hvap * 2;
    moles_of_other_liquid_evaporated = Hvap / Hvap_water;
    moles_of_liquid_remaining = (1 - gvs.x) - moles_of_other_liquid_evaporated;
    Q_dew = Q_bubble + moles_of_liquid_remaining * Hvap_water;
  } else {
    const moles_of_water = (1 - gvs.x);
    Hvap = Hvap_water * moles_of_water;
    Q_bubble = Q_subcooled + Hvap * 2;
    moles_of_other_liquid_evaporated = Hvap / Hvap_benzene;
    moles_of_liquid_remaining = gvs.x - moles_of_other_liquid_evaporated;
    Q_dew = Q_bubble + moles_of_liquid_remaining * Hvap_benzene;
  }
  if(Q < Q_subcooled) {
    gvs.T = gvs.T_initial + Q / Cp_liquid;
    gvs.moles_liquid_water = 1 - gvs.x;
    gvs.moles_liquid_benzene = gvs.x;
    gvs.moles_vapor = 0;
    gvs.vapor_composition = gvs.intersection_point;
  } else if(Q < Q_bubble) {
    gvs.T = gvs.bubble_point;
    if(gvs.x < gvs.intersection_point) {
      gvs.moles_liquid_water = 1 - gvs.x - ((Q - Q_subcooled) / (Q_bubble - Q_subcooled)) * (1 - gvs.x);
      gvs.moles_liquid_benzene = gvs.x - (Q - Q_subcooled) / Hvap_benzene / 2;
    } else {
      gvs.moles_liquid_water = (1 - gvs.x) - (Q - Q_subcooled) / Hvap_water / 2;
      gvs.moles_liquid_benzene = gvs.x - ((Q - Q_subcooled) / (Q_bubble - Q_subcooled)) * gvs.x;
    }
    gvs.moles_vapor = gvs.x - gvs.moles_liquid_benzene + (1 - gvs.x) - gvs.moles_liquid_water;
    gvs.vapor_composition = gvs.intersection_point;
  } else if(Q < Q_dew) {
    if(gvs.x < gvs.intersection_point) {
      gvs.T = gvs.bubble_point + ((Q - Q_bubble) / (Q_dew - Q_bubble)) * (gvs.Ty2(gvs.x) - gvs.bubble_point);
    } else {
      gvs.T = gvs.bubble_point + ((Q - Q_bubble) / (Q_dew - Q_bubble)) * (gvs.Ty1(gvs.x) - gvs.bubble_point);
    }
  } else {
    if(gvs.x < gvs.intersection_point) {
      gvs.T = gvs.Ty2(gvs.x) + (Q - Q_dew) / Cp_vapor;
    } else {
      gvs.T = gvs.Ty1(gvs.x) + (Q - Q_dew) / Cp_vapor;
    }
  }
  gvs.T = Math.min(220, gvs.T);
}

function calcAll() {
  intersectionPoint();
  calculateTemperature();
}

module.exports = calcAll;