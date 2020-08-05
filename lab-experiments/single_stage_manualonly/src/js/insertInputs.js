const sharedInsertInputs = require("./shared_insertInputs");

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
    "Column Temperature (K)",
    "Column Heat Duty (kW)",
    "Column Liquid Level (%)",
    "Bottoms Flow Rate (L/s)"
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
      `${separator.temperatures[i]}`,
      `${separator.powers[i]}`,
      `${separator.levels[i]}`,
      `${separator.flowRatesOut[i]}`
    ];
    rows.push(newRow);
  }

  sharedInsertInputs.download(rows);

}

sharedInsertInputs.insertInputs([pressureButtons, levelButtons, tempButtons], false);
