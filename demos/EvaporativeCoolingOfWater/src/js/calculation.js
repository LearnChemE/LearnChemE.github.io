var T1 = 40;
var deltaHv1 = -2450;
var deltaHv2 = -2500;
var deltaHf = -334;
var Cp = 4.18;

export function calculate(vapor) {
  const V = vapor * 1;
  let T2 = (T1 <= (deltaHv1 / Cp) * Math.log(1 - V / 10))
    ? 0
    : T1 - (deltaHv1 / Cp) * Math.log(1 - V / 10);

  const Vs = 10 * (1 - Math.exp(T1 * (Cp / deltaHv1)));
  const S = (T2 === 0)
    ? (V - Vs) * (deltaHv2 / deltaHf)
    : 0;
  const L = 10 - S - V;

  return {
    V: V,
    T2: T2,
    Vs: Vs,
    S: S,
    L: L
  };
}