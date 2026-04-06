const muMax = 0.2;
const ks = 0.5;
const cs0 = 1.0;
const kd = 0.06;

const denom = cs0 + ks;
const dMax = denom === 0 ? 0 : (cs0 * muMax - kd * denom) / denom;
const xMax = Math.max(muMax - kd, 0.0001);

const computeCs = (d) => {
  const denom2 = d + kd - muMax;
  if (Math.abs(denom2) < 1e-9) return 0;
  return -(ks * (d + kd) / denom2);
};

const csAtDmax = computeCs(dMax);
const csAt = (d) => (d <= dMax ? computeCs(d) : csAtDmax);
const muAt = (d) => {
  const cs = csAt(d);
  const denomMu = ks + cs;
  if (denomMu === 0) return 0;
  return muMax * (cs / denomMu);
};
const ccAt = (d) => {
  if (d > dMax) return 0;
  const mu = muAt(d);
  if (mu === 0) return 0;
  return 0.5 * d * ((cs0 - csAt(d)) / mu);
};

console.log("xMax:", xMax, "dMax:", dMax);
let maxDc = 0;
for (let i = 0; i <= 600; i += 1) {
  const d = (xMax * i) / 600;
  const cc = ccAt(d);
  const dc = d * cc;
  if (dc > maxDc) maxDc = dc;
}
console.log("maxDc:", maxDc);
