gvs.generate_random_conditions = function() {
  gvs.hA = 50 + Math.round(Math.random() * 10);
  gvs.hB = gvs.hA >= 55 ? 50 + Math.round(Math.random() * 3) : 57 + Math.round(Math.random() * 3);
  gvs.sA = 50 + Math.round(Math.random() * 10);
  gvs.sB = gvs.sA >= 55 ? 50 + Math.round(Math.random() * 3) : 57 + Math.round(Math.random() * 3);
  gvs.cp = Math.round(5 + Math.random() * 5) / 100;
  gvs.HS = Math.random() > 0.5 ? "enthalpy" : "entropy";
  gvs.randx = Math.round(35 + Math.random() * 30) / 100;
  gvs.choice = Math.random() > 0.5 ? 1 : 2;
  gvs.alpha = Math.round(45 + 15 * Math.random());
  gvs.alpha = Math.random() > 0.5 ? -1 * gvs.alpha : gvs.alpha;
  let randChoice = Math.random(); randChoice = randChoice < 0.33 ? 0.2 : randChoice < 0.67 ? 0.3 : 0.35;
  gvs.molarS = function(x) {return -8.314 * (x * Math.log(x) + (1 - x) * Math.log(1 - x)) + x * gvs.sA + (1 - x) * gvs.sB}
  gvs.molarS2 = function(x) {
    if(gvs.choice === 1) {
      return (1 - randChoice) * (x * gvs.sA + (1 - x) * gvs.sB) + gvs.molarS(x) * randChoice;
    } else {
      return -0.3 * (x * gvs.sA + (1 - x) * gvs.sB) + 1.3 * gvs.molarS(x);
    }
  }
  gvs.Scurve = function(x) {return gvs.molarS2(x)}
  gvs.dS = -1 * gvs.molarS(gvs.randx) + gvs.molarS2(gvs.randx);
  gvs.molarH = function(x) {return x * gvs.hA + (1 - x) * gvs.hB + gvs.alpha * x * (1 - x)}
  gvs.dMolarH = function(x) {
    const x1 = x - 0.0001;
    const x2 = x + 0.0001;
    const y1 = gvs.molarH(x1);
    const y2 = gvs.molarH(x2);
    return (y2 - y1) / (x2 - x1)
  }
  gvs.dMolarS = function(x) {
    const x1 = x - 0.0001;
    const x2 = x + 0.0001;
    const y1 = gvs.molarS2(x1);
    const y2 = gvs.molarS2(x2);
    return ((y2 - y1) / (x2 - x1))
  }
  gvs.partMolarH = function(x) {
    return gvs.dMolarH(gvs.randx) * (x - gvs.randx) + gvs.molarH(gvs.randx);
  }
  gvs.partMolarS = function(x) {
    return gvs.dMolarS(gvs.randx) * (x - gvs.randx) + gvs.molarS(gvs.randx);
  }
  if(gvs.HS === "enthalpy") {
    gvs.plot.labels[0][0] = "molar enthalpy (kJ/mol)";
    gvs.plot.range = [30, 90, 10, 2];
  } else {
    gvs.plot.labels[0][0] = "molar entropy [J/(mol K)]";
    gvs.plot.range = [45, 75, 5, 1];
  }
  gvs.loc_H_1 = [0.5, 80];
  gvs.loc_H_2 = [0.5, 80];
  gvs.loc_H_3 = [0.5, 80];
  gvs.loc_H_4_1 = [0.4, 80];
  gvs.loc_H_4_2 = [0.6, 80];
  gvs.loc_H_5 = [0.5, 80];
  gvs.loc_H_7_B = [0, 80];
  gvs.loc_H_7_A = [1, 80];
  gvs.loc_S_1 = [0.5, 50];
  gvs.loc_S_2 = [0.5, 50];
  gvs.loc_S_3 = [0.5, 50];
  gvs.loc_S_4 = [0.5, 50];
  gvs.loc_S_5_B = [0, 50];
  gvs.loc_S_5_A = [1, 50];
  gvs.input_S_4_value = "";
  gvs.input_H_5_value = "";
  gvs.input_H_6_value = "";

  gvs.answer_H_1 = [1, gvs.hA];
  gvs.answer_H_2 = [0, gvs.hB];
  gvs.answer_H_3 = [gvs.randx, gvs.molarH(gvs.randx)];
  gvs.answer_H_4_B = [0, gvs.molarH(0)];
  gvs.answer_H_4_A = [1, gvs.molarH(1)];
  gvs.answer_H_5 = [0, 0];
  gvs.answer_H_5_input = "";
  gvs.answer_H_6_input = "";
  gvs.answer_H_7_B = [0, 0];
  gvs.answer_H_7_A = [0, 0];
  gvs.answer_S_1 = [1, gvs.sA];
  gvs.answer_S_2 = [0, gvs.sB];
  gvs.answer_S_3 = [gvs.randx, gvs.molarS2(gvs.randx)];
  gvs.answer_S_4 = [gvs.randx, gvs.molarS(gvs.randx)];
  gvs.answer_S_4_input = "";
  const step_5_answer_sB = gvs.molarS2(gvs.randx) - gvs.randx * gvs.dMolarS(gvs.randx);
  const step_5_answer_sA = gvs.molarS2(gvs.randx) + (1 - gvs.randx) * gvs.dMolarS(gvs.randx);
  gvs.answer_S_5_B = [0, step_5_answer_sB];
  gvs.answer_S_5_A = [1, step_5_answer_sA];
}

gvs.generate_random_conditions();