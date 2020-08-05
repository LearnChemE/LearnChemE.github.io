const sharedInsertInputs = require("../../../single_stage_manualonly/src/js/shared_insertInputs");

const defaultParams = sharedInsertInputs.defaultParams;

const pressureButtons = defaultParams.pressureButtons;
const tempButtons = defaultParams.tempButtons;
const levelButtons = defaultParams.levelButtons;

window.generateCSV = () => {
  let rows = [[
    "Time (s)",
    "Inlet Molar Flow Rate (mol/s)",
    "Inlet Mole Fraction",
    "Inlet Temperature (K)",
    "Column Pressure (kPa)",
    "Distillate Valve Lift",
    "Pressure Controller Stpt",
    "Column Temperature (K)",
    "Column Heat Duty (kW)",
    "Temperature Controller Stpt",
    "Column Liquid Level (%)",
    "Bottoms Flow Rate (L/s)",
    "Level Controller Stpt",
    "Controller Equation"
  ]];
  const csvLength = separator.pressures.length;
  for(let i = 0; i < csvLength; i++) {
    let newRow = [
      `-${csvLength - 1 - i}`,
      `${separator.Fs[i]}`,
      `${separator.xins[i]}`,
      `${separator.Tins[i]}`,
      `${separator.pressures[i]}`,
      `${separator.lifts[i]}`,
      `${separator.Pstpts[i]}`,
      `${separator.temperatures[i]}`,
      `${separator.powers[i]}`,
      `${separator.Tstpts[i]}`,
      `${separator.levels[i]}`,
      `${separator.flowRatesOut[i]}`,
      `${separator.levelstpts[i]}`,
      `${separator.equations[i]}`
    ];
    rows.push(newRow);
  }

  sharedInsertInputs.download(rows);

}

sharedInsertInputs.insertInputs([pressureButtons, levelButtons, tempButtons], true);
