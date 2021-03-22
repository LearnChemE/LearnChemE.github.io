function calcAll() {
  gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
  gvs.currentH = gvs.H(gvs.T, gvs.X);
}

module.exports = { calcAll }