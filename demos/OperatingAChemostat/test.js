const muMax = 0.2;
const ks = 0.5;
const cs0 = 1.0;
const kd = 0.06;

const denom = cs0 + ks;
const dMax = (cs0 * muMax - kd * denom) / denom;

const computeCs = (d) => {
  const denom2 = d + kd - muMax;
  return -(ks * (d + kd) / denom2);
};

console.log("dMax:", dMax);
console.log("Cs at dMax:", computeCs(dMax));
console.log("Cs at 0.1:", computeCs(0.1));
