const pressureButtons = {
  controller : "PC",
  obj: separator.PressureController,
  mv : {
    name: "lift",
    label: "Lift",
    objmvName: "lift",
    min: 0,
    max: 1,
    step: 1e-12,
    default: 0.50,
    multiplier: 1
  },
  cv : {
    name: "pressure",
    stptlabel: "<i>P</i>&nbsp;(kPa)",
    objcvName: "P",
    stptDefault: 75,
    stptMin: Number.MIN_VALUE,
    stptMax: 1000,
    stptStep: 1e-12,
    multiplier: 1000
  },
  KcUnits : "(kPa<sup>-1</sup>)"
};

const tempButtons = {
  controller : "TC",
  obj: separator.TemperatureController,
  mv : {
    name: "power",
    label: "<i>Q</i>&nbsp;(kW)",
    objmvName: "Q",
    min: 0,
    max: 1000,
    step: 1e-12,
    default: 500,
    multiplier: 1000
  },
  cv : {
    name: "temperature",
    stptlabel: "<i>T</i>&nbsp;(K)",
    objcvName: "T",
    stptDefault: 450,
    stptMin: Number.MIN_VALUE,
    stptMax: 1000,
    stptStep: 1e-12,
    multiplier: 1
  },
  KcUnits : "(kW/K)"
};

const levelButtons = {
  controller : "LC",
  obj: separator.LevelController,
  mv : {
    name: "flowRateOut",
    label: "v<sub>out</sub>&nbsp;(L/s)",
    objmvName: "L",
    min: 0,
    max: 10,
    step: 1e-12,
    default: 0.660,
    multiplier: 1
  },
  cv : {
    name: "level",
    stptlabel: "<i>Lvl.</i>&nbsp;(%)",
    objcvName: "level",
    stptDefault: 25,
    stptMin: Number.MIN_VALUE,
    stptMax: 100 - Number.MIN_VALUE,
    stptStep: 1e-12,
    multiplier: 1
  },
  KcUnits : "[L/(s %)]"
};

const inletParams = {
  F0 : {
    name: "flowRateIn",
    label: "F<sub>in</sub>&nbsp;(mol/s)",
    objName: "F",
    min: 0,
    max: 100,
    step: 1e-12,
    default: 15
  },
  xA0 : {
    name: "moleFracIn",
    label: "x<sub>A,in</sub>",
    objName: "xin",
    min: 0,
    max: 1,
    step: 1e-12,
    default: 0.5
  },
  Tin : {
    name: "temperatureIn",
    label: "<i>T</i><sub>in</sub>&nbsp;(K)",
    objName: "Tin",
    min: Number.MIN_VALUE,
    max: 1000,
    step: 1e-12,
    default: 400
  }
}

const autoParams = {
  tauDefault: 36000,
  tauMin: Number.MIN_VALUE,
  tauMax: 3600000,
  tauStep: 1e-12,
  KcDefault: 0,
  KcMin: -1000000,
  KcMax: 1000000,
  KcStep: 1e-12
}

const speedParams = {
  name: "animation speed",
  default: 1,
  min: 1,
  max: 20,
  step: 1,
  label: `simulation speed:&nbsp;1`
}

function controllerHTML(opts) {

  const text = `
  <div class="button-group">
    <h5>${opts.cv.name} controller</h5>
    <div class="btn-toolbar mb-1" role="toolbar" aria-label="PI Controller Mode Toggles for ${opts.mv.label}">
      <div class="btn-group" role="group" aria-label="Auto and manual buttons">
        <button type="button" class="btn btn-sm btn-secondary auto mode-toggle ${opts.controller}">Auto</button>
        <button type="button" class="btn btn-sm btn-secondary manual mode-toggle ${opts.controller} on">Manual</button>
      </div>
      <button id="update-${opts.controller}" class="btn btn-sm btn-primary ml-1" aria-label="Update controller settings button">Update</button>
    </div>

    <div class="input-wrapper">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.mv.name}-label">${opts.mv.label}</span>
        </div>
        <input type="number" id="input-${opts.mv.name}" class="form-control" min="${opts.mv.min}" max="${opts.mv.max}" step="${opts.mv.step}" value="${opts.mv.default}" aria-label="${opts.mv.name} input" aria-describedby="input-${opts.mv.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.cv.name}-label">${opts.cv.stptlabel}</span>
        </div>
        <input type="number" id="input-${opts.cv.name}" class="form-control" min="${opts.cv.stptMin}" max="${opts.cv.stptMax}" step="${opts.cv.stptStep}" value="${opts.cv.stptDefault}" aria-label="${opts.cv.name} input" aria-describedby="input-${opts.cv.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.cv.name}-Kc-label">K<sub>c</sub>&nbsp;${opts.KcUnits}</span>
        </div>
        <input type="number" id="input-${opts.cv.name}-Kc" class="form-control" min="${autoParams.KcMin}" max="${autoParams.KcMax}" step="${autoParams.KcStep}" value="${autoParams.KcDefault}" aria-label="${opts.cv.name} gain input" aria-describedby="input-${opts.cv.name}-Kc-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.cv.name}-tau-label">Tau</span>
        </div>
        <input type="number" id="input-${opts.cv.name}-tau" class="form-control" min="${autoParams.tauMin}" max="${autoParams.tauMax}" step="${autoParams.tauStep}" value="${autoParams.tauDefault}" aria-label="${opts.cv.name} tau input" aria-describedby="input-${opts.cv.name}-tau-label">
      </div>
    </div>
  </div>
  `;

  return text;
}

function disturbanceHTML(opts) {

  const text = `
  <div class="button-group">
    <h5>inlet conditions</h5>
    <button id="update-inlet" class="btn btn-sm btn-primary" aria-label="Update inlet conditions button">Update</button>
    <div class="input-wrapper">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.F0.name}-label">${opts.F0.label}</span>
        </div>
        <input type="number" id="input-${opts.F0.name}" class="form-control" min="${opts.F0.min}" max="${opts.F0.max}" step="${opts.F0.step}" value="${opts.F0.default}" aria-label="${opts.F0.name} input" aria-describedby="input-${opts.F0.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.xA0.name}-label">${opts.xA0.label}</span>
        </div>
        <input type="number" id="input-${opts.xA0.name}" class="form-control" min="${opts.xA0.min}" max="${opts.xA0.max}" step="${opts.xA0.step}" value="${opts.xA0.default}" aria-label="${opts.xA0.name} input" aria-describedby="input-${opts.xA0.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.Tin.name}-label">${opts.Tin.label}</span>
        </div>
        <input type="number" id="input-${opts.Tin.name}" class="form-control" min="${opts.Tin.min}" max="${opts.Tin.max}" step="${opts.Tin.step}" value="${opts.Tin.default}" aria-label="${opts.Tin.name} input" aria-describedby="input-${opts.Tin.name}-label">
      </div>
    </div>
  </div>
  `;

  return text;
}

function sliderHTML(opts) {
  const text = `
  <h5 id="animation-speed-label">${opts.label}</h5>
  <input type="range" id="input-speed" class="" value="${opts.default}" min="${opts.min}" max="${opts.max}" step="${opts.step}" aria-label="${opts.name} input" aria-describedby="animation-speed-label">
  `;
  return text;
}

const csvHTML = `
  <button id="download-as-csv-button" class="btn btn-sm btn-success" onclick="generateCSV();" style="font-size:110%">Snapshot .CSV</button>
`;

const codeInputHTML = `
  <textarea id="code-input" placeholder="enter your code here" spellcheck="false"></textarea>
`;

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
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  let encodedUri = encodeURI(csvContent);
  
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  
  var date = new Date();
  const month = Number(date.getMonth() + 1).toFixed(0);
  const year = date.getFullYear();
  const dayNumber = date.getDate();
  let hour = date.getHours();
  const AMPM = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if(hour == 0) {hour = 12}
  const minutes = date.getMinutes();
  var title = "MyData_" + month + "-" + dayNumber + "-" + year + "@" + hour + "-" + minutes + AMPM + ".csv" ;
  
  link.setAttribute("download", title);
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
}

function insertInputs() {
  const doc = document.createElement('div');
  doc.id = "main-application-wrapper";
  document.body.appendChild(doc);

  [pressureButtons, levelButtons, tempButtons].forEach(opts => {
    const wrapper = document.createElement('div');
    wrapper.id = `${opts.controller}-control`;
    wrapper.style.display = "block";
    
    const text = controllerHTML(opts);
    wrapper.innerHTML = text;
    doc.appendChild(wrapper);

    const autobtn = wrapper.getElementsByClassName(`auto mode-toggle ${opts.controller}`)[0];
    const manualbtn = wrapper.getElementsByClassName(`manual mode-toggle ${opts.controller}`)[0];
    const manualInput = document.getElementById(`input-${opts.mv.name}`);
    const stptInput = document.getElementById(`input-${opts.cv.name}`);
    const KcInput = document.getElementById(`input-${opts.cv.name}-Kc`);
    const tauInput = document.getElementById(`input-${opts.cv.name}-tau`);
    const updateInput = document.getElementById(`update-${opts.controller}`);

    const toggleAuto = () => {
      manualbtn.classList.remove("on");
      manualInput.setAttribute("disabled", true);
      autobtn.classList.add("on");
      stptInput.value = Number(separator[`${opts.cv.objcvName}`] / opts.cv.multiplier).toPrecision(3);
      opts.obj["bias"] = Number(separator[`${opts.mv.objmvName}`]);
      opts.obj["stpt"] = Number(stptInput.value) * opts.cv.multiplier;
      opts.obj["Tau"] = tauInput.value;
      opts.obj["Kc"] = KcInput.value * opts.mv.multiplier / opts.cv.multiplier;
      if(!opts.obj["auto"]) { // if it is going from manual to auto, clear the set point arrays
        separator[`${opts.cv.objcvName}stpts`] = [];
        separator[`${opts.cv.objcvName}stptCoords`] = [];
      }
      opts.obj["auto"] = true;
    }

    const toggleManual = () => {
      autobtn.classList.remove("on");
      manualInput.removeAttribute("disabled");
      manualbtn.classList.add("on");
      manualInput.value = Number(Number(separator[`${opts.mv.objmvName}`] / opts.mv.multiplier).toPrecision(3));
      opts.obj["tempmv"] = Number(manualInput.value);
      opts.obj["auto"] = false;
      separator[`${opts.cv.objcvName}stpts`] = [];
      separator[`${opts.cv.objcvName}stptCoords`] = [];
    }

    autobtn.addEventListener('click', toggleAuto);
    manualbtn.addEventListener('click', toggleManual);

    // Updates a temporary variable when user puts input; temporary variable is capped at min/max and assigned to controller when user presses "update"
    [
      [manualInput, "tempmv", opts.mv.multiplier],
      [stptInput, "tempStpt", opts.cv.multiplier],
      [KcInput, "tempKc", opts.mv.multiplier / opts.cv.multiplier],
      [tauInput, "tempTau", 1]
    ].forEach(item => {
      item[0].addEventListener('input', () => {
        const inputValue = item[0].value;
        const min = Number(item[0].getAttribute("min"));
        const max = Number(item[0].getAttribute("max"));
        const parsed = parseNumericInput(inputValue, min, max);
        opts.obj[item[1]] = parsed * item[2];
      });
    });

    // When "update" is pressed, the controller is updated to the temporary variables
    updateInput.addEventListener('click', () => {
      if(opts.obj["auto"] === true) {
        opts.obj["Kc"] = opts.obj["tempKc"]
        opts.obj["Tau"] = opts.obj["tempTau"];
        opts.obj["stpt"] = opts.obj["tempStpt"];
        opts.obj["error"] = 0;
      } else {
        separator[`${opts.mv.objmvName}`] = opts.obj["tempmv"];
      }
    });
  });

  const inletWrapper = document.createElement("div");
  inletWrapper.id = "inlet-control";
  inletWrapper.style.display = "block";
  const text = disturbanceHTML(inletParams);
  inletWrapper.innerHTML = text;
  doc.appendChild(inletWrapper);

  const updateInletButton = document.getElementById("update-inlet");
  const FInput = document.getElementById(`input-${inletParams.F0.name}`);
  const xInput = document.getElementById(`input-${inletParams.xA0.name}`);
  const TInput = document.getElementById(`input-${inletParams.Tin.name}`);

  updateInletButton.addEventListener("click", () => {
    const parseF = parseNumericInput(FInput.value, Number(FInput.getAttribute("min")), Number(FInput.getAttribute("max")));
    const parseX = parseNumericInput(xInput.value, Number(xInput.getAttribute("min")), Number(xInput.getAttribute("max")));
    const parseT = parseNumericInput(TInput.value, Number(TInput.getAttribute("min")), Number(TInput.getAttribute("max")));
    FInput.value = parseF;
    xInput.value = parseX;
    TInput.value = parseT;
    separator.F = parseF;
    separator.xin = parseX;
    separator.Tin = parseT;
  });

  
  const sliderWrapper = document.createElement("div");
  const sliderText = sliderHTML(speedParams);
  sliderWrapper.id = "slider-wrapper";
  sliderWrapper.innerHTML = sliderText;
  doc.appendChild(sliderWrapper);
  const slider = document.getElementById("input-speed");
  const SpeedDisplay = document.getElementById("animation-speed-label");

  slider.addEventListener("input", () => {
    separator.speed = Number(Number(slider.value).toFixed(0));
    window.adjustSpeed(separator.speed);
    SpeedDisplay.innerHTML = `simulation speed:&nbsp;${separator.speed}`;
  });

  const csvWrapper = document.createElement("div");
  csvWrapper.id = "csv-wrapper";
  csvWrapper.innerHTML = csvHTML;
  doc.appendChild(csvWrapper);

  const codeInputWrapper = document.createElement("div");
  codeInputWrapper.id = "code-input-wrapper";
  codeInputWrapper.innerHTML = codeInputHTML;
  doc.appendChild(codeInputWrapper);

  const codeInput = document.getElementById("code-input");
  codeInput.addEventListener('input', () => {
    const value = parseTextInput(String(codeInput.value));
    separator.codeString = value;
  });

  const codeOutput = document.createElement("div");
  codeOutput.id = "code-output";
  doc.appendChild(codeOutput);
}

function parseNumericInput(value, min, max) {
  let input = Number(value);
  input = Math.max(min, Math.min(max, input));
  return input;
}

function parseTextInput(str) {
  let parsedString = str.replace(/[^a-zA-Z\d \*\-\+\/\.\(\)\^]/gmi, "");
  parsedString = parsedString.replace(/\^/, "**");
  const addTimes = (match) => {
    let str = match[0] + "*" + match[1];
    return str;
  }
  parsedString = parsedString.replace(/\d[a-zA-z\(]/, addTimes);
  parsedString = parsedString.replace(/[a-zA-z]\(/, addTimes);
  parsedString = parsedString.replace(/\)[0-9a-zA-z]/, addTimes);
  return parsedString;
}

module.exports = insertInputs;