const defaultParams = {
  pressureButtons : {
    controller : "PC",
    obj: separator.PressureController,
    mv : {
      name: "lift",
      label: "Lift",
      objmvName: "lift",
      min: 0,
      max: 1,
      default: 0.50,
      multiplier: 1
    },
    cv : {
      name: "pressure",
      stptlabel: "<i>P</i>&nbsp;stpt&nbsp;(kPa)",
      objcvName: "P",
      stptDefault: 74.6,
      stptMin: Number.MIN_VALUE,
      stptMax: 1000,
      multiplier: 1000
    },
    KcUnits : "(kPa<sup>-1</sup>)"
  },
  
  tempButtons : {
    controller : "TC",
    obj: separator.TemperatureController,
    mv : {
      name: "power",
      label: "<i>Q</i>&nbsp;(kW)",
      objmvName: "Q",
      min: 0,
      max: 1000,
      default: 500,
      multiplier: 1000
    },
    cv : {
      name: "temperature",
      stptlabel: "<i>T</i>&nbsp;stpt&nbsp;(K)",
      objcvName: "T",
      stptDefault: 455,
      stptMin: Number.MIN_VALUE,
      stptMax: 1000,
      multiplier: 1
    },
    KcUnits : "(kW/K)"
  },
  
  levelButtons : {
    controller : "LC",
    obj: separator.LevelController,
    mv : {
      name: "flowRateOut",
      label: "v<sub>out</sub>&nbsp;(L/s)",
      objmvName: "L",
      min: 0,
      max: 10,
      default: 0.660,
      multiplier: 1
    },
    cv : {
      name: "level",
      stptlabel: "<i>Lvl</i>&nbsp;stpt&nbsp;(%)",
      objcvName: "level",
      stptDefault: 17.6,
      stptMin: Number.MIN_VALUE,
      stptMax: 100 - Number.MIN_VALUE,
      multiplier: 1
    },
    KcUnits : "[L/(s %)]"
  },
  
  inletParams : {
    F0 : {
      name: "flowRateIn",
      label: "F<sub>in</sub>&nbsp;(mol/s)",
      objName: "F",
      min: 0,
      max: 100,
      default: 15
    },
    xA0 : {
      name: "moleFracIn",
      label: `<span style="font-size:1.2em; transform:translateY(-10%);">x</span><sub>butanol</sub>`,
      objName: "xin",
      min: 0,
      max: 1,
      default: 0.5
    },
    Tin : {
      name: "temperatureIn",
      label: "<i>T</i><sub>in</sub>&nbsp;(K)",
      objName: "Tin",
      min: Number.MIN_VALUE,
      max: 1000,
      default: 400
    }
  },
  
  autoParams : {
    tauDefault: 36000,
    tauMin: Number.MIN_VALUE,
    tauMax: 3600000,
    KcDefault: 0,
    KcMin: -1000000,
    KcMax: 1000000,
  },
  
  speedParams : {
    name: "animation speed",
    default: 1,
    min: 0,
    max: 20,
    step: 1,
    label: `simulation speed:&nbsp;1`
  }
}

const inputStep = 0.00001;

exports.defaultParams = defaultParams;

const codeInputHTML = `
  <textarea id="code-input" placeholder="enter your code here" spellcheck="false"></textarea>
`;

const controllerHTML = function(opts) {

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
          <span class="input-group-text mv-color" id="input-${opts.mv.name}-label">${opts.mv.label}</span>
        </div>
        <input type="number" id="input-${opts.mv.name}" class="form-control mv-color" min="${opts.mv.min}" max="${opts.mv.max}" step="${inputStep}" value="${opts.mv.default}" aria-label="${opts.mv.name} input" aria-describedby="input-${opts.mv.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text stpt-color" id="input-${opts.cv.name}-label">${opts.cv.stptlabel}</span>
        </div>
        <input type="number" id="input-${opts.cv.name}" class="form-control stpt-color" min="${opts.cv.stptMin}" max="${opts.cv.stptMax}" step="${inputStep}" value="${opts.cv.stptDefault}" aria-label="${opts.cv.name} input" aria-describedby="input-${opts.cv.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.cv.name}-Kc-label">K<sub>c</sub>&nbsp;${opts.KcUnits}</span>
        </div>
        <input type="number" id="input-${opts.cv.name}-Kc" class="form-control" min="${defaultParams.autoParams.KcMin}" max="${defaultParams.autoParams.KcMax}" step="${inputStep}" value="${defaultParams.autoParams.KcDefault}" aria-label="${opts.cv.name} gain input" aria-describedby="input-${opts.cv.name}-Kc-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.cv.name}-tau-label">tauI (s<sup>-1</sup>)</span>
        </div>
        <input type="number" id="input-${opts.cv.name}-tau" class="form-control" min="${defaultParams.autoParams.tauMin}" max="${defaultParams.autoParams.tauMax}" step="${inputStep}" value="${defaultParams.autoParams.tauDefault}" aria-label="${opts.cv.name} tau input" aria-describedby="input-${opts.cv.name}-tau-label">
      </div>
    </div>
  </div>
  `;

  return text;
}

const disturbanceHTML = function(opts) {

  const text = `
  <div class="button-group">
    <h5>inlet conditions</h5>
    <button id="update-inlet" class="btn btn-sm btn-primary" aria-label="Update inlet conditions button">Update</button>
    <div class="input-wrapper">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.F0.name}-label">${opts.F0.label}</span>
        </div>
        <input type="number" id="input-${opts.F0.name}" class="form-control" min="${opts.F0.min}" max="${opts.F0.max}" step="${inputStep}" value="${opts.F0.default}" aria-label="${opts.F0.name} input" aria-describedby="input-${opts.F0.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.xA0.name}-label">${opts.xA0.label}</span>
        </div>
        <input type="number" id="input-${opts.xA0.name}" class="form-control" min="${opts.xA0.min}" max="${opts.xA0.max}" step="${inputStep}" value="${opts.xA0.default}" aria-label="${opts.xA0.name} input" aria-describedby="input-${opts.xA0.name}-label">
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text" id="input-${opts.Tin.name}-label">${opts.Tin.label}</span>
        </div>
        <input type="number" id="input-${opts.Tin.name}" class="form-control" min="${opts.Tin.min}" max="${opts.Tin.max}" step="${inputStep}" value="${opts.Tin.default}" aria-label="${opts.Tin.name} input" aria-describedby="input-${opts.Tin.name}-label">
      </div>
    </div>
  </div>
  `;

  return text;
}

const sliderHTML = function(opts) {
  const text = `
  <h5 id="animation-speed-label">${opts.label}</h5>
  <input type="range" id="input-speed" class="" value="${opts.default}" min="${opts.min}" max="${opts.max}" step="${opts.step}" aria-label="${opts.name} input" aria-describedby="animation-speed-label">
  `;
  return text;
}

const csvHTML =  `
<button id="download-as-csv-button" class="btn btn-sm btn-success" onclick="generateCSV();" style="font-size:110%">Snapshot .CSV</button>
`;

const directionsButtonHTML = `
<button id="directions-button" class="btn btn-sm btn-secondary" onclick="openDirections();" style="font-size:110%">Directions</button>
`;

window.modalIsOpen = false;

window.openDirections = () => {
  const modal = document.getElementById("modal-bg");
  setTimeout(() => {window.modalIsOpen = true;}, 1000);
  modal.style.display = "block";
}

window.closeDirections = () => {
  const modal = document.getElementById("modal-bg");
  window.modalIsOpen = false;
  modal.style.display = "none";
  try { directionsVideo.pauseVideo(); } catch (e) {}
}

exports.download = function(rows) {
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  let encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const date = new Date();
  const month = Number(date.getMonth() + 1).toFixed(0);
  const year = date.getFullYear();
  const dayNumber = date.getDate();
  let hour = date.getHours();
  const AMPM = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if(hour == 0) {hour = 12}
  const minutes = date.getMinutes();
  let title = "MyData_" + month + "-" + dayNumber + "-" + year + "@" + hour + "-" + minutes + AMPM + ".csv" ;
  link.setAttribute("download", title);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
}

function parseNumericInput(value, min, max) {
  let input = Number(value);
  input = Number(Math.max(min, Math.min(max, input)));
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


exports.insertInputs = function(buttons, codeEntry) {

  const doc = document.createElement('div');
  doc.id = "main-application-wrapper";
  document.body.appendChild(doc);

  if(codeEntry) {
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

  buttons.forEach(opts => {
    const wrapper = document.createElement('div');
    wrapper.id = `${opts.controller}-control`;
    wrapper.style.display = "block";
    
    const text = controllerHTML(opts);
    wrapper.innerHTML = text;
    doc.appendChild(wrapper);
  
    const autoToggle = wrapper.children[0].children[1].children[0];
    autoToggle.children[0].setAttribute("disabled", "true");
    autoToggle.children[1].setAttribute("disabled", "true");

    const autoInputs = wrapper.children[0].children[2].children;
    for ( let j = 1; j < autoInputs.length; j++ ) {
      autoInputs[j].children[1].setAttribute("disabled", "true");
      autoInputs[j].classList.add("disabled");
    }
  
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

      // "bumpless" controller needs the bias to be equal to the MV when switching from auto to manual
      // and the setpoint equal to the current PV
      stptInput.value = Number(separator[`${opts.cv.objcvName}`] / opts.cv.multiplier).toPrecision(3);
      opts.obj["bias"] = Number(separator[`${opts.mv.objmvName}`]);

      opts.obj["stpt"] = Number(stptInput.value) * opts.cv.multiplier;
      opts.obj["Tau"] = Number(tauInput.value);
      opts.obj["Kc"] = Number(KcInput.value) * opts.mv.multiplier / opts.cv.multiplier;
      opts.obj["auto"] = true;
      updateInput.click();
    }
  
    const toggleManual = () => {
      autobtn.classList.remove("on");
      manualInput.removeAttribute("disabled");
      manualbtn.classList.add("on");
      manualInput.value = Number(Number(separator[`${opts.mv.objmvName}`] / opts.mv.multiplier).toPrecision(3));
      opts.obj["auto"] = false;
      updateInput.click();
    }
  
    autobtn.addEventListener('click', toggleAuto);
    manualbtn.addEventListener('click', toggleManual);
  
    [
      [manualInput, opts.mv.multiplier],
      [stptInput, opts.cv.multiplier],
      [KcInput, opts.mv.multiplier / opts.cv.multiplier],
      [tauInput, 1]
    ].forEach(item => { 
      item[0].addEventListener('keydown', (e) => {
        if(e.keyCode == 13) {
          const updateButton = document.getElementById(`update-${opts.controller}`);
          updateButton.click();
          updateButton.focus();
        }
      });
    });
  
    updateInput.addEventListener('click', () => {

      // First, limit the value to the min/max value of the input
      [
        manualInput,
        stptInput,
        KcInput,
        tauInput,
      ].forEach(inp => {
        const min = inp.getAttribute("min");
        const max = inp.getAttribute("max");
        const value = inp.value;
        inp.value = parseNumericInput(value, min, max);
      })

      if(opts.obj["auto"] === true) {

        // If they press "update" while in auto mode, set the bias to the current MV
        // Then, set each value to the current value of the input box multiplied by 
        // the respective multipliers and set error to 0

        opts.obj["bias"] = Number(separator[`${opts.mv.objmvName}`]);
        opts.obj["stpt"] = Number(stptInput.value) * opts.cv.multiplier;
        opts.obj["error"] = 0;
      } else {
        separator[`${opts.mv.objmvName}`] = Number(manualInput.value) * opts.mv.multiplier;
      }

      opts.obj["Tau"] = Number(tauInput.value);
      opts.obj["Kc"] = Number(KcInput.value) * opts.mv.multiplier / opts.cv.multiplier;
    });
  });

  const inletWrapper = document.createElement("div");
  inletWrapper.id = "inlet-control";
  inletWrapper.style.display = "block";
  const text = disturbanceHTML(defaultParams.inletParams);
  inletWrapper.innerHTML = text;
  doc.appendChild(inletWrapper);

  const updateInletButton = document.getElementById("update-inlet");
  const FInput = document.getElementById(`input-${defaultParams.inletParams.F0.name}`);
  const xInput = document.getElementById(`input-${defaultParams.inletParams.xA0.name}`);
  const TInput = document.getElementById(`input-${defaultParams.inletParams.Tin.name}`);
  
  [FInput, xInput, TInput].forEach(inp => {
    inp.addEventListener('keydown', e => {
      if(e.keyCode == 13) {
        const updateButton = document.getElementById('update-inlet');
        updateButton.click();
        updateButton.focus();
      }
    })
  })

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
  const sliderText = sliderHTML(defaultParams.speedParams);
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

  const directionsButtonWrapper = document.createElement("div");
  directionsButtonWrapper.id = "directions-button-wrapper";
  directionsButtonWrapper.innerHTML = directionsButtonHTML;
  doc.appendChild(directionsButtonWrapper);
}