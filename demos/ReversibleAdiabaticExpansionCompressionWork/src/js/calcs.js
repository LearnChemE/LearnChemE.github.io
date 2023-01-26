gvs.calculateFinalConditions = function() {
  const R = 8.314;
  const T1 = 300;
  const P1 = gvs.work_type === "compression" ? 1e5 : 1e6;
  gvs.P_initial = P1;
  const V1 = R * T1 / P1;
  gvs.V_initial_1 = V1;
  gvs.V_initial_2 = V1;
  const P2 = gvs.P_final;
  const gamma = 7 / 5;
  const Cv = 5 * R / 2;

  switch(gvs.condition_1) {
    case "reversible adiabatic":
      gvs.V_final_1 = V1 * (P1 / P2)**(1 / gamma);
      gvs.T_final_1 = T1 * (V1 / gvs.V_final_1)**(gamma - 1);
      gvs.W_1 = Cv * (gvs.T_final_1 - T1);
    break;

    case "reversible isothermal":
      gvs.V_final_1 = R * T1 / P2;
      gvs.T_final_1 = 300;
      gvs.W_1 = -1 * R * T1 * Math.log(gvs.V_final_1 / V1);
    break;

    case "irreversible adiabatic":
      gvs.V_final_1 = R * (Cv * T1 + P2 * V1) / (P2 * (Cv + R));
      gvs.T_final_1 = T1 - P2 * (gvs.V_final_1 - V1) / Cv;
      gvs.W_1 = Cv * (gvs.T_final_1 - T1);
    break;

    case "irreversible isothermal":
      gvs.V_final_1 = R * T1 / P2;
      gvs.T_final_1 = 300;
      gvs.W_1 = -1 * P2 * (gvs.V_final_1 - V1);
    break;
  }

  switch(gvs.condition_2) {
    case "reversible adiabatic":
      gvs.V_final_2 = V1 * (P1 / P2)**(1 / gamma);
      gvs.T_final_2 = T1 * (V1 / gvs.V_final_2)**(gamma - 1);
      gvs.W_2 = Cv * (gvs.T_final_2 - T1);
    break;

    case "reversible isothermal":
      gvs.V_final_2 = R * T1 / P2;
      gvs.T_final_2 = 300;
      gvs.W_2 = -1 * R * T1 * Math.log(gvs.V_final_2 / V1);
    break;

    case "irreversible adiabatic":
      gvs.V_final_2 = R * (Cv * T1 + P2 * V1) / (P2 * (Cv + R));
      gvs.T_final_2 = T1 - P2 * (gvs.V_final_2 - V1) / Cv;
      gvs.W_2 = Cv * (gvs.T_final_2 - T1);
    break;

    case "irreversible isothermal":
      gvs.V_final_2 = R * T1 / P2;
      gvs.T_final_2 = 300;
      gvs.W_2 = -1 * P2 * (gvs.V_final_2 - V1);
    break;
  }
}