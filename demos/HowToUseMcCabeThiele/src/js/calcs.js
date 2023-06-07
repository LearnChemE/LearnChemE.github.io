gvs.equilb = function(x) {
  const list = gvs.equilb_list;
  for(let i = 0; i < list.length - 1; i++) {
    const x_0 = list[i][0];
    const x_1 = list[i + 1][0];
    const y_0 = list[i][1];
    const y_1 = list[i + 1][1];
    const frac = (x - x_0) / (x_1 - x_0);
    if(x >= x_0 && x < x_1) {
      return y_0 + frac * (y_1 - y_0)
    }
  }
  return 1
}

gvs.inverse_equilb = function(y) {
  let error = 1e6;
  let x_guess = 0;
  for(let x = 0; x <= 1; x += 0.001) {
    x = Math.round(1000 * x) / 1000;
    const y_guess = gvs.equilb(x);
    const guess_error = Math.abs(y - y_guess);
    if(guess_error < error) {
      error = guess_error;
      x_guess = x;
    }
  }
  return x_guess
}

function calcAll() {

}

module.exports = calcAll;