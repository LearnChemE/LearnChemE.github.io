const muMax = 0.15;
const ks = 1.0;
const cs0 = 0.5;
const kd = 0.1;

const xMax = Math.max(muMax - kd, 0.0001);
const denom = cs0 + ks;
const dMax = (cs0 * muMax - kd * denom) / denom;
console.log("xMax:", xMax, "dMax:", dMax);

const computeCs = (d) => {
  const denom2 = d + kd - muMax;
  return -(ks * (d + kd) / denom2);
};

console.log("Cs at dMax:", computeCs(dMax));
for(let d=0; d<=xMax; d+=0.01) {
    const cs = (d <= dMax ? computeCs(d) : computeCs(dMax));
    console.log("d:", d, "cs:", cs);
}
