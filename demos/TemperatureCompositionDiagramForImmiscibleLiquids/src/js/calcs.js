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
  for(let x = 0.5; x < 0.65; x += 0.001) {
    const d = Math.abs(gvs.Ty2(x) - gvs.Ty1(x));
    if(d < delta) {
      delta = d;
      x_guess = x;
    }
  }
  gvs.intersection_point = x_guess;
  gvs.bubble_point = Math.round(10 * gvs.Ty1(x_guess)) / 10;
}

function calcAll() {
  intersectionPoint();
}

module.exports = calcAll;