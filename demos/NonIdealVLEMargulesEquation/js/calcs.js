//fxs for drawgraphLines()

let A1 = 6.84;
let B1 = 1196.76;
let C1 = 219.161;
let A2 = 6.95087;
let B2 = 1342.31;
let C2 = 219.187;

export function Psat1(temp) {
  return (1 / 750) * 10 ** (A1 - B1 / (temp + C1)); // (bar)
}

export function Psat2(temp) {
  return (1 / 750) * 10 ** (A2 - B2 / (temp + C2)); // (bar)
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

export function TxBisection(x, pressure, A12, A21) {
  let low = 80;
  let high = 150;
  let mid = (low + high) / 2;
  while (high - low > 0.01) {
    if (Px(x, mid, A12, A21) > pressure) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) / 2;
  }
  return mid;
}

export function TyBisection(x, pressure, A12, A21) {
  let low = 80;
  let high = 150;
  let mid = (low + high) / 2;
  while (high - low > 0.01) {
    if (Py(x, mid, A12, A21) > pressure) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) / 2;
  }
  return mid;
}

export function Px_xVal(y, temp, A12, A21) {
  let low = 0.5;
  let high = 2.6;
  let mid = (low + high) / 2;
  while (high - low > 0.01) {
    if (Px(mid, temp, A12, A21) > y) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) / 2;
  }
  return mid;
}

export function Py_xVal(y, temp, A12, A21) {
  let low = 0.5;
  let high = 2.75;
  let mid = (low + high) / 2;
  while (high - low > 0.01) {
    if (Py(mid, temp, A12, A21) > y) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) / 2;
  }
  return mid;
}
