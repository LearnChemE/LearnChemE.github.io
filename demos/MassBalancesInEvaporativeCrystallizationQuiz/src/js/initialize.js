gvs.T_evap = Math.round(60 + Math.random() * 90);
gvs.T_crys = Math.round(25 + Math.random() * 25);
gvs.mfeed = Math.round(80 + Math.random() * 19);
const s3 = 0.2881 * gvs.T_evap + 28.123;
const s5 = 0.2881 * gvs.T_crys + 28.123;
gvs.x3 = Math.round((s3 / (s3 + 100)) * 100) / 100;
gvs.x5 = Math.round((s5 / (s5 + 100)) * 100) / 100;
gvs.xw5 = Math.round((1 - gvs.x5) * 100) / 100;
gvs.xR = gvs.x5;
gvs.zfeed = Math.round(gvs.x3 * Math.round(35 + Math.random() * 15)) / 100;
gvs.zwater = Math.round((1 - gvs.zfeed) * 100) / 100;
gvs.m4 = Math.round(0.95 * gvs.mfeed * gvs.zfeed * 100) / 100;
gvs.m5 = (gvs.mfeed * gvs.zfeed - gvs.m4) / gvs.x5;
gvs.m2 = gvs.mfeed - gvs.m4 - gvs.m5;

let diff = 1e6;
let recycle_ratio = 0;
for(let rr_estimate = 0; rr_estimate <= 500; rr_estimate += 0.01) {
  const mR = gvs.m5 * rr_estimate;
  const m1 = gvs.mfeed + mR;
  const m3 = m1 - gvs.m2;
  const x1 = (gvs.mfeed * gvs.zfeed + gvs.xR * mR) / m1;
  const x3 = x1 * m1 / m3;
  const delta = Math.abs(gvs.x3 - x3);
  if(delta < diff) {
    diff = delta;
    recycle_ratio = rr_estimate;
  }
}

gvs.mR = gvs.m5 * recycle_ratio;
gvs.m1 = gvs.mfeed + gvs.mR;
gvs.m3 = gvs.m1 - gvs.m2;
gvs.x1 = (gvs.mfeed * gvs.zfeed + gvs.xR * gvs.mR) / gvs.m1;
gvs.x3 = gvs.x1 * gvs.m1 / gvs.m3;

const unknown_list_1 = ["mfeed", "m2", "m4", "m5", "zfeed", "zwater"];
const unknown_list_2 = ["mfeed", "m2", "m4", "m5", "x5", "xw5"];

while(gvs.unknown_1 === gvs.unknown_2) {
  const index_1 = Math.round(5 * Math.random());
  const index_2 = Math.round(5 * Math.random());
  gvs.unknown_1 = unknown_list_1[index_1];
  gvs.unknown_2 = unknown_list_2[index_2];
}

