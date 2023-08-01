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

gvs.feed = function(x) {
  if(gvs.q !== 1) {
    return (gvs.q / (gvs.q - 1)) * x - (gvs.z / (gvs.q - 1));
  } else {
    const q = gvs.q + 0.001;
    return (q / (q - 1)) * x - (gvs.z / (q - 1));
  }
}

gvs.x_eq = function() {
  let error = 1e6;
  let guess = 0;
  for(let x = 0; x <= 1; x += 0.001) {
    x = Math.round(x * 1000) / 1000;
    const eq_x = gvs.equilb(x);
    const feed_x = gvs.feed(x);
    const difference = Math.abs(eq_x - feed_x);
    if(difference < error) {
      error = difference;
      guess = x;
    }
  }
  return guess
}

gvs.rect = function(x) {
  return (x * gvs.R) / (gvs.R + 1) + gvs.xD / (gvs.R + 1)
}

gvs.xi = function() {
  let error = 1e6;
  let guess = 0;
  for(let x = 0; x <= 1; x += 0.001) {
    x = Math.round(x * 1000) / 1000;
    const rect_x = gvs.rect(x);
    const feed_x = gvs.feed(x);
    const difference = Math.abs(rect_x - feed_x);
    if(difference < error) {
      error = difference;
      guess = x;
    }
  }
  return guess
}

gvs.yi = function() {
  return gvs.rect(gvs.xi())
}

gvs.Vb = function() {
  const xi = gvs.xi();
  return (gvs.xB - xi) / (xi - gvs.yi())
}

gvs.strip = function(x) {
  const Vb = gvs.Vb();
  return x * (Vb + 1) / Vb - gvs.xB / Vb
}

function calcAll() {

}

module.exports = calcAll;