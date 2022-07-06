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
}
