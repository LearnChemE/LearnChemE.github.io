//fxs for drawgraphLines()

export function Psat1(temp) {
  return (1 / 750) * 10 ** (6.84 - 1196.76 / (temp + 219.161)); // (bar)
}

export function Psat2(temp) {
  return (1 / 750) * 10 ** (6.95087 - 1342.31 / (temp + 219.187)); // (bar)
}

export function gamma1(x, A12, A21) {
  return Math.exp((1 - x) ** 2 * (A12 + 2 * (A21 - A12) * x));
}

export function gamma2(x, A12, A21) {
  return Math.exp(x ** 2 * (A21 + 2 * (A12 - A21) * (1 - x)));
}

export function Px(x, temp, A12, A21) {
  return gamma1(x, A12, A21) * x * Psat1(temp) + gamma2(x, A12, A21) * (1 - x) * Psat2(temp);
}

export function Py(x, temp, A12, A21) {
  return 1 / (x / (gamma1(x, A12, A21) * Psat1(temp)) + (1 - x) / (gamma2(x, A12, A21) * Psat2(temp)));
}

export function Tx(x, pressure, A12, A21) {
  return 1;
}

export function Ty(x, pressure, A12, A21) {
  return 1;
}
