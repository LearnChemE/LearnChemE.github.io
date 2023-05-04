function calcAll() {
  const list = gvs.outlet_p4_pressure === 0.01 ? 0 : gvs.outlet_p4_pressure === 0.1 ? 1 : gvs.outlet_p4_pressure === 0.2 ? 2 : 3;
  gvs.T3 = 500;
  gvs.H3rev = gvs.H(gvs.inlet_p3_pressure, 2);
  gvs.S3rev = gvs.S(gvs.inlet_p3_pressure, 2);
  gvs.H3 = gvs.Hsuper(gvs.inlet_p3_pressure);
  gvs.S3 = gvs.Ssuper(gvs.inlet_p3_pressure);
  gvs.S4rev = gvs.S3;
  gvs.qr = gvs.S4rev > gvs.S(gvs.outlet_p4_pressure, 2) ? 1 : (gvs.S4rev - gvs.S(gvs.outlet_p4_pressure, 1)) / (gvs.S(gvs.outlet_p4_pressure, 2) - gvs.S(gvs.outlet_p4_pressure, 1));
  gvs.H4rev = null;
  if(gvs.qr === 1) {
    gvs.H4rev = gvs.SHsuper(gvs.S4rev, list);
  } else {
    gvs.H4rev = gvs.qr * gvs.H(gvs.outlet_p4_pressure, 2) + (1 - gvs.qr) * gvs.H(gvs.outlet_p4_pressure, 1);
  }
  gvs.H4 = gvs.H3 + gvs.turbine_efficiency * (gvs.H4rev - gvs.H3);
  gvs.T4 = null;
  if(gvs.H4 > gvs.H(gvs.outlet_p4_pressure, 2)) {
    gvs.T4 = gvs.HTsuper(gvs.H4, list);
  } else {
    gvs.T4 = gvs.Tsat(gvs.outlet_p4_pressure);
  }
  gvs.W = gvs.H3 - gvs.H4;
  gvs.H2 = gvs.H(gvs.inlet_p3_pressure, 1);
  gvs.H5 = gvs.H(gvs.outlet_p4_pressure, 1);
  gvs.H1 = gvs.H5 + 1000 * gvs.vol(gvs.outlet_p4_pressure) * (gvs.inlet_p3_pressure - gvs.outlet_p4_pressure);
  gvs.eff = (Math.abs(gvs.H4 - gvs.H3) - Math.abs(gvs.H1 - gvs.H5)) / (gvs.H3 - gvs.H1);
  gvs.part = null;
  let error = 1e6;
  for(let H = 2115; H < 2804; H++) {
    const partSat = gvs.partsat(H);
    const partSat1 = partSat[0];
    const partSat2 = partSat[1];
    const diff1 = Math.abs(gvs.outlet_p4_pressure - partSat1);
    const diff2 = Math.abs(gvs.outlet_p4_pressure - partSat2);
    if(diff1 < error) {
      error = diff1;
      gvs.part = partSat1;
    }
    if(diff2 < error) {
      error = diff2;
      gvs.part = partSat2;
    }
  }
}

module.exports = calcAll;