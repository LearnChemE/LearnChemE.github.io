g.calcAll = function() {
  const L = 2.5;
  const b = 1;
  const theta = 35 * 2 * Math.PI / 360;
  const d = g.waterValue / Math.sin(theta) - L;
  const w1 = 1.5;
  const h1 = d * Math.sin(theta);
  const w2 = L * Math.cos(theta);
  const h2 = L * Math.sin(theta);
  const gamma = 9800;
  const yc = (g.waterValue - L * Math.sin(theta)) / Math.sin(theta) + L / 2;
  const hc = yc * Math.sin(theta);
  const A = L * b;
  g.FR = gamma * hc * A;
  const Ixc = b * L**3 / 12;
  const yR = Ixc / (yc * A) + yc;
  g.dF = yR - d; // distance to resultant force from water
  let dif = 1e6;
  let F;
  let F_Estimate = 10000;
  for(F = 10000; F < 32000; F++) {
    let RHS = -g.FR * (yR - d) + g.weightValue * 1000 * (yc - d) * Math.cos(theta) + F * L;
    RHS = Math.abs(RHS);
    if(RHS < dif) {
      dif = RHS;
      F_Estimate = F
    }
  }
  g.F_Applied = F_Estimate
}