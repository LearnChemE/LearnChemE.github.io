/* jshint esversion: 6 */

let table;

// -------------------- Data Arrays --------------------
let absX = [];        // absorbance (material)
let absY = [];
let lightX = [];      // illumination (light source)
let lightY = [];
let gaussY = [];
let productY = [];
let attenY = [];
let attenProductY = [];
let integral = 0;
let integralPercent = 0;

// -------------------- Global Params --------------------
let GausMean = 405;
let GausFWHM = 35;
let Depth = 50;
let Concentration = 335;
const GAUS_AMP = 1;
const EXPONENTIAL_SCALE = 4000; // or 5000
let GraphFS = 16;
let legendAdjust = 250;


let sliderMean, sliderFWHM;
let currentLightSpectrum = "LED"; // 'LED' or 'ArcLamp'


let currentFile = "tpoAbs.csv";
let currentAbsSpectrum = "TPO"; // default
let customTable = null;

let spectrumCache = {
  "Exponential": null,
  "TPO": null,
  "Custom": null
};

let advancedGui;
let advSelect;
let currentAdvSelect = "Photons (Photodiode)";
let tarWave = 405;
let mInt = 10;
const advLabel = document.createElement("div");
let tInt = 0;


// -------------------- Preload CSV --------------------
function preload() {
  table = loadTable(currentFile, "csv", "header");
}

// -------------------- Switch CSV --------------------
function loadNewCSV(fileName) {
  loadTable(fileName, "csv", "header", tbl => {
    table = tbl;
    parseCSV();
    updateCurve();
  }, err => {
    console.error("Failed to load " + fileName, err);
  });
}

// -------------------- Setup --------------------
function setup() {
  const wrapper = document.getElementById('plot-wrapper');
  const cnv = createCanvas(wrapper.clientWidth, wrapper.clientHeight);
  cnv.parent(wrapper);

  // --- Adjust font size for mobile ---
  if (window.innerWidth < 600) {
    GraphFS = 10; // smaller fonts for phones
    legendAdjust = 170;
  } else if (window.innerWidth < 900) {
    GraphFS = 13; // medium for tablets
    legendAdjust = 200;
  } else {
    GraphFS = 16; // default for desktop
    legendAdjust = 250;
  }

  initPlot();
  parseCSV();
  initSliders();
  initAdvancedGUI();

  setTimeout(windowResized, 50);
}


// -------------------- CSV Parsing --------------------
function parseCSV() {
  if (!table) {
    console.error("CSV failed to load");
    return;
  }

  dataX = [];
  dataY = [];

  const scale = currentAbsSpectrum === "Exponential" ? EXPONENTIAL_SCALE : 1;

  for (let r = 0; r < table.getRowCount(); r++) {
    dataX.push(float(table.getString(r, 0)));
    dataY.push(float(table.getString(r, 1)) * scale);
  }

  // Cache the data
  spectrumCache[currentAbsSpectrum] = { dataX: [...dataX], dataY: [...dataY] };
}

// -------------------- GUI / Sliders --------------------
function initSliders() {
  gui = createGui('Plot controls', 100, 100);
  const parent = gui.prototype._panel;

  // -------------------- LIGHT SOURCE SECTION --------------------
  const lightDiv = document.createElement("div");
  lightDiv.className = "qs_container";
  lightDiv.innerHTML = `<b>Light Source:</b> `;

  const lightSelect = document.createElement("select");
  lightDiv.appendChild(lightSelect);

  const lightOpts = [
    { label: "LED", value: "LED", desc: "Gaussian" },
    { label: "Hg Lamp", value: "ArcLamp", desc: "400-500 nm filter" },
    { label: "Custom Spectrum", value: "CustomLight" }
  ];

  lightOpts.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    lightSelect.appendChild(option);
  });

  const lightDesc = document.createElement("div");
  lightDesc.style.fontSize = "12px";
  lightDesc.style.marginTop = "2px";
  lightDesc.style.whiteSpace = "pre-line";
  const initOpt = lightOpts.find(o => o.value === currentLightSpectrum);
  lightDesc.textContent = initOpt?.desc || "";
  lightDiv.appendChild(lightDesc);

  const lightFileInput = document.createElement("input");
  lightFileInput.type = "file";
  lightFileInput.accept = ".csv";
  lightFileInput.style.display =
    currentLightSpectrum === "CustomLight" ? "inline-block" : "none";
  lightDiv.appendChild(lightFileInput);

  parent.appendChild(lightDiv);

  // --- Handle light source change
  lightSelect.addEventListener("change", e => {
    const newVal = e.target.value;
    const selected = lightOpts.find(o => o.value === newVal);

    lightDesc.textContent = selected?.desc || "";

    if (newVal === "ArcLamp") {
      currentLightSpectrum = "ArcLamp";
      lightFileInput.style.display = "none";
      loadDefaultLightSpectrum("ArcLamp");
    } else if (newVal === "CustomLight") {
      currentLightSpectrum = "CustomLight";
      lightFileInput.style.display = "inline-block";
    } else {
      currentLightSpectrum = "LED";
      lightFileInput.style.display = "none";
    }
    toggleGaussianControls();
    updateCurve();
  });

  // --- Handle custom light CSV upload
  lightFileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = Papa.parse(evt.target.result, {
          header: true,
          dynamicTyping: true
        }).data;

        const newX = [], newY = [];
        parsed.forEach(row => {
          const keys = Object.keys(row);
          if (keys.length >= 2) {
            const x = parseFloat(row[keys[0]]);
            const y = parseFloat(row[keys[1]]);
            if (!isNaN(x) && !isNaN(y)) {
              newX.push(x);
              newY.push(y);
            }
          }
        });

        if (newX.length && newY.length) {
          lightX = newX;
          lightY = newY;
          currentLightSpectrum = "CustomLight";
          updateCurve();
          console.log(`Custom light CSV loaded (${lightX.length} points).`);
        }
      } catch (err) {
        console.error("Error parsing custom light CSV:", err);
      }
    };
    reader.readAsText(file);
  });

  // -------------------- LED PARAMETERS --------------------
  const sliders = [];

  sliderMean = new ProductSlider('mean', 300, 800, GausMean, 1, 'LED Center', 'nm');
  sliderFWHM = new ProductSlider('fwhm', 1, 200, GausFWHM, 1, 'LED FWHM', 'nm');
  sliders.push(sliderMean, sliderFWHM);

  sliderMean.setCallback(val => { GausMean = val; updateCurve(); });
  sliderFWHM.setCallback(val => { GausFWHM = val; updateCurve(); });

  sliders.forEach(slider => {
    slider.attachParent(parent);
  });

  toggleGaussianControls(); // hide if not LED

  // -------------------- INITIATOR / ABSORBANCE --------------------
  const spectrumDiv = document.createElement("div");
  spectrumDiv.className = "qs_container";
  spectrumDiv.innerHTML = `<b>Absorbance Spectrum:</b> `;

  const absOptions = ["Exponential", "TPO", "Irgacure 907", "Custom"];
  const absSelect = document.createElement("select");
  absOptions.forEach(opt => absSelect.add(new Option(opt, opt)));
  absSelect.value = currentAbsSpectrum;
  spectrumDiv.appendChild(absSelect);

  const absFileInput = document.createElement("input");
  absFileInput.type = "file";
  absFileInput.accept = ".csv";
  absFileInput.style.display = currentAbsSpectrum === "Custom" ? "inline-block" : "none";
  spectrumDiv.appendChild(absFileInput);

  parent.appendChild(spectrumDiv);

  // --- Absorbance selection
  absSelect.addEventListener("change", e => {
    const newSpec = e.target.value;
    spectrumCache[currentAbsSpectrum] = { dataX: [...dataX], dataY: [...dataY] };
    currentAbsSpectrum = newSpec;
    absFileInput.style.display = newSpec === "Custom" ? "inline-block" : "none";

    if (spectrumCache[newSpec]) {
      dataX = [...spectrumCache[newSpec].dataX];
      dataY = [...spectrumCache[newSpec].dataY];
      updateCurve();
    } else if (newSpec !== "Custom") {
      loadDefaultSpectrum(newSpec);
    }
  });

  // --- Absorbance CSV upload
  absFileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = Papa.parse(evt.target.result, {
          header: true,
          dynamicTyping: true
        }).data;

        const newX = [], newY = [];
        parsed.forEach(row => {
          const keys = Object.keys(row);
          if (keys.length >= 2) {
            const x = parseFloat(row[keys[0]]);
            const y = parseFloat(row[keys[1]]);
            if (!isNaN(x) && !isNaN(y)) {
              newX.push(x);
              newY.push(y);
            }
          }
        });

        if (newX.length && newY.length) {
          dataX = newX;
          dataY = newY;
          spectrumCache["Custom"] = { dataX: [...dataX], dataY: [...dataY] };
          updateCurve();
          console.log(`Custom absorbance CSV loaded (${dataX.length} points).`);
        }
      } catch (err) {
        console.error("Error parsing absorbance CSV:", err);
      }
    };
    reader.readAsText(file);
  });

  // -------------------- INITIATOR CONCENTRATION & DEPTH --------------------
  const concSlider = new ProductSlider('conc', 0, 1000, Concentration, 1, 'Concentration', 'mM');
  const depthSlider = new ProductSlider('depth', 0, 500, Depth, 1, 'Depth', 'µm');

  concSlider.setCallback(val => { Concentration = val; updateCurve(); });
  depthSlider.setCallback(val => { Depth = val; updateCurve(); });

  concSlider.attachParent(parent);
  depthSlider.attachParent(parent);

  // -------------------- PANEL & INITIAL UPDATE --------------------
  setPanelPosition(gui, "right", attPlot.GPLOT.mar[2], 10);
  updateCurve();
}

// -------------------- Load default spectra --------------------
function loadDefaultSpectrum(name) {
  let path = "";
  if (name === "Exponential") path = "exponentialAbs.csv";
  if (name === "TPO") path = "tpoAbs.csv";
  if (name === "Irgacure 907") path = "I907Abs.csv";

  loadTable(path, "csv", "header", tbl => {
    table = tbl;
    parseCSV();
    updateCurve();
  }, err => {
    console.error("Failed to load " + path, err);
  });
}

// -------------------- Parse custom CSV --------------------
function parseCustomCSV(customData) {
  const newX = [];
  const newY = [];

  customData.forEach(row => {
    const keys = Object.keys(row);
    if (keys.length >= 2) {
      const x = parseFloat(row[keys[0]]);
      const y = parseFloat(row[keys[1]]);
      if (!isNaN(x) && !isNaN(y)) {
        newX.push(x);
        newY.push(y);
      }
    }
  });

  if (newX.length && newY.length) {
    dataX = newX;
    dataY = newY;

    // Make sure the current table reference matches custom CSV if needed
    table = null; // mark that we’re now using custom data

    updateCurve();
    console.log("Custom CSV loaded. Curve updated.");
  } else {
    console.warn("Custom CSV is empty or malformed. Keeping previous spectrum.");
  }
  if (newX.length && newY.length) {
  dataX = newX;
  dataY = newY;

  // Cache custom data
  spectrumCache["Custom"] = { dataX: [...dataX], dataY: [...dataY] };

  updateCurve();
  console.log("Custom CSV loaded. Curve updated.");
}

}

// -------------------- Curve Computation --------------------
function updateCurve() {
  if (!dataX.length) return;

  const npts = 400;
  const minX = 0;
  const maxX = Math.max(...dataX);
  const dataMax = Math.max(...dataY);

  let fullGaussY = [];
  let fullProductY = [];
  let fullAttenY = [];
  let fullAttenProductY = [];

  const GausSig = GausFWHM / 2.35482;
  const useArcLamp = (currentLightSpectrum === "ArcLamp");
  const useCustomLight = (currentLightSpectrum === "CustomLight");

  // Normalize light spectrum arrays if using ArcLamp or CustomLight
  if ((useArcLamp || useCustomLight) && lightY && lightY.length > 0) {
    const maxLight = Math.max(...lightY);
    if (maxLight > 0) {
      lightY = lightY.map(y => y / maxLight);
    }
  }

  for (let i = 0; i < npts; i++) {
    const x = lerp(minX, maxX, i / (npts - 1));
    const yAbs = interp1(dataX, dataY, x, dataMax);

    // --- Light source intensity (LED Gaussian / ArcLamp / CustomLight)
    // --- Light source intensity (LED Gaussian / ArcLamp / CustomLight)
let lightYval;
if (useArcLamp || useCustomLight) {
  lightYval = interp1(lightX, lightY, x, 0); // normalized earlier
} else {
  // Clamp GausMean to 300 minimum
  const safeMean = Math.max(GausMean, 300);
  lightYval = GAUS_AMP * Math.exp(-Math.pow(x - safeMean, 2) / (2 * GausSig * GausSig));
}


    // --- Compute combined effects ---
    const atten = Math.exp(-yAbs * Concentration/1000 * Depth/10000);
    const absorbed = lightYval * yAbs * x;
    const attenuatedLight = lightYval * atten;
    const attenuatedAbsorbed = attenuatedLight * yAbs * x;

    fullGaussY.push({ x, y: lightYval });
    fullProductY.push({ x, y: absorbed });
    fullAttenY.push({ x, y: attenuatedLight });
    fullAttenProductY.push({ x, y: attenuatedAbsorbed });
  }

  // Normalize to the peak absorbed value
  const productMax = Math.max(...fullProductY.map(p => p.y));
  fullProductY = fullProductY.map(p => ({ x: p.x, y: p.y / productMax }));
  fullAttenProductY = fullAttenProductY.map(p => ({ x: p.x, y: p.y / productMax }));

  // Integrate over full range
  const integralProduct = trapz(fullProductY.map(p => p.x), fullProductY.map(p => p.y));
  const integralAtten = trapz(fullAttenProductY.map(p => p.x), fullAttenProductY.map(p => p.y));

  const percentAtten = 100 * integralAtten / integralProduct;
  integral = integralProduct;
  integralPercent = percentAtten;

  // Crop to plot range
  const plotMinX = Math.min(...dataX);
  const plotMaxX = Math.max(...dataX);

  gaussY = fullGaussY.filter(p => p.x >= plotMinX && p.x <= plotMaxX);
  productY = fullProductY.filter(p => p.x >= plotMinX && p.x <= plotMaxX);
  attenY = fullAttenY.filter(p => p.x >= plotMinX && p.x <= plotMaxX);
  attenProductY = fullAttenProductY.filter(p => p.x >= plotMinX && p.x <= plotMaxX);

  redraw();
}


// -------------------- Draw Plot Title --------------------
function drawPlot() {
  const PAD = 60;

  // Map functions for dual axes
  const minX = Math.min(...dataX);
  const maxX = Math.max(...dataX);

  const minYLeft = 0;
  const maxYLeft = Math.max(
    ...gaussY.map(p => p.y),
    ...productY.map(p => p.y),
    ...attenY.map(p => p.y),
    ...attenProductY.map(p => p.y)
  );

  const minYRight = 0;
  const maxYRight = Math.max(...dataY);

  const mapXFunc = x => map(x, minX, maxX, PAD, width - PAD);
  const mapYLeftFunc = y => map(y, minYLeft, maxYLeft, height - PAD, PAD);
  const mapYRightFunc = y => map(y, minYRight, maxYRight, height - PAD, PAD);

  drawAxes(PAD);

  // LEFT-axis curves
  drawLine(gaussY.map(p => p.x), gaussY.map(p => p.y), mapXFunc, mapYLeftFunc, color(0, 220, 0));
  drawLine(productY.map(p => p.x), productY.map(p => p.y), mapXFunc, mapYLeftFunc, color(220, 0, 0));
  drawLine(attenY.map(p => p.x), attenY.map(p => p.y), mapXFunc, mapYLeftFunc, color(0, 180, 80));
  drawLine(attenProductY.map(p => p.x), attenProductY.map(p => p.y), mapXFunc, mapYLeftFunc, color(180, 0, 80));

  // RIGHT-axis curve
  drawLine(dataX, dataY, mapXFunc, mapYRightFunc, color(0, 0, 255));

  // Title
  noStroke(); fill(0);
  textSize(GraphFS); textAlign(CENTER);
  text(`Absorbed photons at max depth relative to surface = ${nf(integralPercent, 1, 1)}%`,
       width / 2, PAD / 2);

  // Legend
  const legendX = width - PAD - legendAdjust;
  let legendY = PAD;
  const legendSpacing = 20;
  const legendBoxSize = 12;

  const legendItems = [
    { col: color(0, 0, 255), label: "Absorbance" },
    { col: color(0, 220, 0), label: "Incident light" },
    { col: color(220, 0, 0), label: "Incident absorbed photons" },
    { col: color(0, 180, 80), label: "Attenuated light" },
    { col: color(180, 0, 80), label: "Attenuated absorbed photons" }
  ];

  textAlign(LEFT, CENTER);
  textSize(GraphFS);
  legendItems.forEach(item => {
    fill(item.col);
    rect(legendX, legendY - legendBoxSize / 2, legendBoxSize, legendBoxSize);
    fill(0);
    text(item.label, legendX + legendBoxSize + 5, legendY);
    legendY += legendSpacing;
  });
}

// -------------------- Drawing --------------------
function draw() {
  clear();
  drawPlot();
  updateText()
}

// -------------------- Plotting --------------------
function initPlot() {
  attPlot = new PlotCanvas(this);
  attPlot.plotSetup();

  attPlot.GPLOT.getXAxis().getAxisLabel().setText("Depth (\u03BCm)");
  attPlot.GPLOT.getYAxis().getAxisLabel().setText("Intensity (mW/cm²)");
  attPlot.GPLOT.getTitle().setText("");

  attPlot.GPLOT.getXAxis().getAxisLabel().setFontSize(GraphFS);
  attPlot.GPLOT.getYAxis().getAxisLabel().setFontSize(GraphFS);
  attPlot.GPLOT.getXAxis().setFontSize(GraphFS);
  attPlot.GPLOT.getYAxis().setFontSize(GraphFS);
  attPlot.GPLOT.getTitle().setFontSize(GraphFS);
  attPlot.GPLOT.setFontSize(GraphFS);
}

// -------------------- Axes & Utilities --------------------
function drawAxes(PAD) {
  stroke(0); strokeWeight(1);

  // Primary Y-axis (left)
  line(PAD, PAD, PAD, height - PAD);
  // Secondary Y-axis (right)
  line(width - PAD, PAD, width - PAD, height - PAD);
  // X-axis
  line(PAD, height - PAD, width - PAD, height - PAD);

  noStroke(); fill(0); textSize(GraphFS);

  // --- X-axis label ---
  textAlign(CENTER);
  text("Wavelength (nm)", width / 2, height - 20);

  // --- Left Y-axis (primary) label ---
  push();
  translate(20, height / 2);
  rotate(-PI / 2);
  textAlign(CENTER, CENTER);
  text("Light spectrum and absorbed photons (relative)", 0, 0);
  pop();

  // --- Right Y-axis (secondary) label ---
  push();
  translate(width-10, height / 2);
  rotate(-PI / 2);
  textAlign(CENTER, CENTER);
  text("Napierian Absorptivity (L/mol-cm)", 0, 0);
  pop();

  // --- Tick marks ---
  const nXTicks = 8;   // desired # of ticks, not fixed positions
  const nYTicks = 6;

  const minX = Math.min(...dataX);
  const maxX = Math.max(...dataX);
  const minYLeft = 0;
  const maxYLeft = Math.max(
    ...gaussY.map(p => p.y),
    ...productY.map(p => p.y),
    ...attenY.map(p => p.y),
    ...attenProductY.map(p => p.y)
  );
  const minYRight = 0;
  const maxYRight = Math.max(...dataY);

  // --- X ticks (dynamic spacing) ---
  const xTicks = getTicks(minX, maxX, nXTicks);
  textAlign(CENTER, TOP);
  xTicks.forEach(xVal => {
    const px = map(xVal, minX, maxX, PAD, width - PAD);
    stroke(0);
    line(px, height - PAD, px, height - PAD + 5);
    noStroke();
    fill(0);
    text(formatTick(xVal, 1), px, height - PAD + 7);
  });

  // --- Left Y ticks (dynamic scaling) ---
  const yLeftTicks = getTicks(minYLeft, maxYLeft, nYTicks);
  textAlign(RIGHT, CENTER);
  yLeftTicks.forEach(yVal => {
    const py = map(yVal, minYLeft, maxYLeft, height - PAD, PAD);
    stroke(0);
    line(PAD - 5, py, PAD, py);
    noStroke();
    fill(0);
    text(formatTick(yVal, 2), PAD - 7, py);
  });

  // --- Right Y ticks (dynamic scaling) ---
  const yRightTicks = getTicks(minYRight, maxYRight, nYTicks);
  textAlign(LEFT, CENTER);
  yRightTicks.forEach(yVal => {
    const py = map(yVal, minYRight, maxYRight, height - PAD, PAD);
    stroke(0);
    line(width - PAD, py, width - PAD + 5, py);
    noStroke();
    fill(0);
    text(formatTick(yVal, 2), width - PAD + 7, py);
  });


}

function mapYSecondary(y) {
  const PAD = 60;
  const minY = 0;
  const maxY = Math.max(...dataY);  // max of absorbance only
  return map(y, minY, maxY, height - PAD, PAD);
}

function interp1(xs, ys, x) {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  for (let i = 0; i < xs.length - 1; i++) {
    if (x >= xs[i] && x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
      return lerp(ys[i], ys[i + 1], t);
    }
  }
}

function trapz(xs, ys) {
  let area = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    area += 0.5 * (ys[i] + ys[i + 1]) * (xs[i + 1] - xs[i]);
  }
  return area;
}

function drawLine(xs, ys, mapX, mapY, col) {
  stroke(col); strokeWeight(2); noFill();
  beginShape();
  xs.forEach((x, i) => vertex(mapX(x), mapY(ys[i])));
  endShape();
}

// -------------------- ProductSlider --------------------
class ProductSlider {
  constructor(key, min, max, init, step, label, units) {
    this.val = init;

    this.div = document.createElement("div");
    this.div.className = "qs_container";

    this.labelDiv = document.createElement("div");
    this.labelDiv.className = "qs_label";
    this.labelDiv.innerHTML = `<b>${label}:</b> `;

    this.valBox = document.createElement("input");
    this.valBox.type = "text"; this.valBox.style.width = "60px";
    this.valBox.value = formatSigFig(init, 3);

    this.labelDiv.appendChild(this.valBox);
    this.labelDiv.append(` ${units}`);
    this.div.appendChild(this.labelDiv);

    this.sliderDiv = document.createElement("input");
    this.sliderDiv.type = "range";
    this.sliderDiv.min = min;
    this.sliderDiv.max = max;
    this.sliderDiv.step = step;
    this.sliderDiv.value = init;
    this.sliderDiv.style.width = "160px";
    this.div.appendChild(this.sliderDiv);

    this.callback = null;

    this.sliderDiv.addEventListener("input", e => {
      this.val = Number(e.target.value);
      this.valBox.value = formatSigFig(this.val, 3);
      if (this.callback) this.callback(this.val);
    });

    this.valBox.addEventListener("input", e => {
      const v = Number(e.target.value);
      if (!isNaN(v)) {
        this.val = v;
        if (this.callback) this.callback(this.val);
      }
    });
  }

  attachParent(parent) { parent.appendChild(this.div); }
  setCallback(cb) { this.callback = cb; }
}

// -------------------- Formatting --------------------
function formatSigFig(num, sigfigs) {
  return Number.parseFloat(num).toPrecision(sigfigs);
}

// -------------------- Panel / Canvas Helpers --------------------
function setPanelPosition(guiObject, side = "left", offsetTop = 20, pad = 20) {
  if (!guiObject || !guiObject.prototype || !guiObject.prototype._panel) return;

  const panel = guiObject.prototype._panel;
  panel.style.position = "fixed";
  panel.style.top = offsetTop + "px";

  if (side === "left") {
    panel.style.left = pad + "px";
    panel.style.right = "auto";
  } else {
    panel.style.right = pad + "px";
    panel.style.left = "auto";
  }
}

function getPanelWidth(guiObject) {
  const panel = guiObject?.prototype?._panel;
  if (!panel) return 0;

  let wasHidden = false;
  if (panel.style.display === "none") {
    wasHidden = true;
    panel.style.display = "block";
  }

  const width = panel.getBoundingClientRect().width;
  if (wasHidden) panel.style.display = "none";
  return width;
}

function computeCanvasSize() {
  const PAD_SIDE = 20;
  const aspect = 4 / 3;

  let availableWidth, maxHeight;

  if (window.innerWidth < 800) {
    availableWidth = window.innerWidth - PAD_SIDE * 2;
    maxHeight = window.innerHeight * 0.5;
  } else {
    const leftWidth = 0;
    const rightWidth = getPanelWidth(gui) + PAD_SIDE;
    availableWidth = Math.max(300, window.innerWidth - leftWidth - rightWidth - PAD_SIDE);
    maxHeight = window.innerHeight * 0.9;
  }

  let w = availableWidth;
  let h = w / aspect;

  if (h > maxHeight) {
    h = maxHeight;
    w = h * aspect;
  }

  return { width: w, height: h };
}

function initPanelPositions() {
  if (window.innerWidth < 800) return;
  const PAD_SIDE = 20;
  const topY = PAD_SIDE;
  if (gui) setPanelPosition(gui, "right", topY, PAD_SIDE);
}

function windowResized() {
  const size = computeCanvasSize();
  if (typeof resizeCanvas === 'function') resizeCanvas(size.width, size.height);

  if (attPlot && attPlot.GPLOT) {
    attPlot.GPLOT.setOuterDim(size.width, size.height);
    attPlot.GPLOT.setPos(0, 0);
  }

  initPanelPositions();
  loop();
}

// -------------------- Misc Helpers --------------------
function getTicks(minVal, maxVal, targetTicks = 5, spacingFraction = 0.02) {
  // spacingFraction = fraction of total range that counts as "too close"
  if (minVal === maxVal) return [minVal];

  if (maxVal < minVal) [minVal, maxVal] = [maxVal, minVal];

  const range = maxVal - minVal;
  const minSpacing = range * spacingFraction;

  const tickSpacing = niceNumber(range / (targetTicks - 1), true);

  const ticks = [];
  let val = Math.ceil(minVal / tickSpacing) * tickSpacing;

  while (val <= maxVal + 1e-9) {
    if (ticks.length === 0 || Math.abs(val - ticks[ticks.length - 1]) > minSpacing) {
      ticks.push(parseFloat(val.toPrecision(10)));
    }
    val += tickSpacing;
  }

  if (ticks.length && minVal < ticks[0] - minSpacing) ticks.unshift(minVal);
  if (ticks.length && maxVal > ticks[ticks.length - 1] + minSpacing) ticks.push(maxVal);

  return ticks;
}

function niceNumber(range, round = true) {
  if (range === 0) return 0;
  const exponent = Math.floor(Math.log10(Math.abs(range)));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

function formatTick(val, maxDecimals = 6) {
  // Handle degenerate cases
  if (!isFinite(val)) return "";
  if (Math.abs(val) < 1e-12) return "0";

  // Determine required decimal places based on magnitude and step size
  // (keeps small values precise without overkill)
  let decimals = 0;
  const absVal = Math.abs(val);

  if (absVal >= 1000) decimals = 0;
  else if (absVal >= 100) decimals = 1;
  else if (absVal >= 10) decimals = 2;
  else if (absVal >= 1) decimals = 3;
  else if (absVal >= 0.1) decimals = 4;
  else if (absVal >= 0.01) decimals = 5;
  else decimals = 6;

  // Cap decimals to avoid excessive precision
  decimals = Math.min(decimals, maxDecimals);

  // Round then remove trailing zeros safely
  let str = val.toFixed(decimals);
  str = str.replace(/(\.\d*?[1-9])0+$/, "$1"); // trim trailing zeros
  str = str.replace(/\.0+$/, ""); // remove ".0"

  return str;
}

function loadLightCSV(fileName) {
  loadTable(fileName, "csv", "header", tbl => {
    lightX = [];
    lightY = [];
    for (let r = 0; r < tbl.getRowCount(); r++) {
      const x = float(tbl.getString(r, 0));
      const y = float(tbl.getString(r, 1));
      if (!isNaN(x) && !isNaN(y)) {
        lightX.push(x);
        lightY.push(y);
      }
    }
    console.log(`Loaded light source: ${fileName}`);
    updateCurve();
  }, err => {
    console.error("Failed to load light CSV:", err);
  });
}

function toggleGaussianControls() {
  const isLED = currentLightSpectrum === "LED";
  sliderMean.div.style.display = isLED ? "block" : "none";
  sliderFWHM.div.style.display = isLED ? "block" : "none";
}

function loadDefaultLightSpectrum(type) {
  if (type === "ArcLamp") {
    fetch("arcLamp.csv")
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data;
        lightX = [];
        lightY = [];
        parsed.forEach(row => {
          const keys = Object.keys(row);
          if (keys.length >= 2) {
            const x = parseFloat(row[keys[0]]);
            const y = parseFloat(row[keys[1]]);
            if (!isNaN(x) && !isNaN(y)) {
              lightX.push(x);
              lightY.push(y);
            }
          }
        });
        console.log(`Arc Lamp CSV loaded (${lightX.length} points).`);
        updateCurve();
      })
      .catch(err => console.error("Failed to load arcLamp.csv:", err));
  }
}

// -------------- Toggle hamburger menu------------------
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Click outside to close
document.addEventListener('click', e => {
  const menu = document.getElementById('menu');
  const btn = document.querySelector('.menu-button');
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           Advanced Gui
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function initAdvancedGUI() {
  // Create the advanced GUI panel
  advGui = createGui('Spectral weighted intensity', 100, 100);
  const parent = advGui.prototype._panel;

  // -------------------- Sliders --------------------
  const sliders = [
    new ProductSlider('tarWave', 300, 600, tarWave, 1, 'Target Wavelength', 'nm'),
    new ProductSlider('mInt', 0.1, 100, mInt, 0.1, 'Measured Intensity', 'mW/cm\u00B2')
  ];

  sliders.forEach(slider => slider.attachParent(parent));
  advGui.sliders = sliders; // save reference for later updates

  // Initialize slider values
  sliders.forEach(slider => {
    slider.valBox.value = formatSigFig(slider.val, 3);
    slider.sliderDiv.value = slider.val;
  });

  // -------------------- Intensity Assessment --------------------
  const advDiv = document.createElement("div");
  advDiv.className = "qs_container";
  advDiv.innerHTML = `<b>Intensity assessment:</b> `;

  const advOptions = ["Photons (Photodiode)", "Energy (Thermal)"];
  const advSelect = document.createElement("select");
  advOptions.forEach(opt => advSelect.add(new Option(opt, opt)));
  advSelect.value = currentAdvSelect;
  advDiv.appendChild(advSelect);
  parent.appendChild(advDiv);

  advSelect.addEventListener("change", e => {
    currentAdvSelect = e.target.value;
    console.log("Intensity assessment type changed to:", currentAdvSelect);
    updateCurve(); // recalc curves using new type
  });

  // -------------------- Embedded Display --------------------
  const advContainer = document.createElement("div");
  advContainer.id = `adv-container`;
  advContainer.className = "qs_container";
  advContainer.style.marginTop = "10px"; // spacing from sliders
  parent.appendChild(advContainer);

  // Use global advLabel (do NOT redeclare with const)
  advLabel.id = `adv-label`;
  advLabel.className = "qs_label";
  advContainer.appendChild(advLabel);

  // Function to update embedded text
  function updateTextEmbedded() {
    advLabel.innerHTML = `
      <p>
        Observed equivalent incident intensity: ${tInt} mW/cm²
      </p>
    `;
  }

  // Store reference globally so draw() or other functions can update
  textGui = { updateText: updateTextEmbedded };

  // Initial update so text appears immediately
  updateTextEmbedded();

  // -------------------- Panel positioning --------------------
  const topY = 430;
  setPanelPosition(advGui, "right", topY, 20);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *          Correction Math
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
  // ---------------- Part 1: Intensity correction ----------------
  // 1) Normalize light spectrum for use
  // 2) Divide by wavelength
  // 3) Integrate
  // 4) Multiply by target wavelength
  // 5) This should be intensity correction factor

  // ---------------- Part 2: Absorbance correction ----------------
  // 1) Multiply normalized light spectrum by Absorance/absorbtivity spectrum
  // 2) Integrate to get real absorbance
  // 3) Prepare normalized thin gaussian with 
  // 4) Multiply by absorbance/absorbtivity
  // 5) Integrate to get standard
  // 6) Absorbance factor = real/standard

function updateText() {
  if (!dataX.length || (!gaussY.length && !lightX.length)) return;

  // Use GUI slider values
  const tarWaveVal = advGui.sliders.find(s => s.labelDiv.innerText.includes("Target Wavelength"))?.val || tarWave;
  const mIntVal = advGui.sliders.find(s => s.labelDiv.innerText.includes("Measured Intensity"))?.val || mInt;

  // ---------------- Part 0: Define light spectrum ----------------
  let xVals = currentLightSpectrum === "LED" ? gaussY.map(p => p.x) : lightX;
  let yLight = currentLightSpectrum === "LED" ? gaussY.map(p => p.y) : lightY;

  // ---------------- Part 1: Intensity correction ----------------
  let intensityCorrection = 1; // default (no correction)
  if (currentAdvSelect === "Photons (Photodiode)") {
    // Normalize light spectrum so that integral = 1
    const integralY = trapz(xVals, yLight);
    const normLight = yLight.map(y => y / (integralY || 1));

    // Divide by wavelength
    const normDivLambda = normLight.map((y, i) => y / xVals[i]);

    // Integrate normalized/divided spectrum
    const integralNorm = trapz(xVals, normDivLambda);

    // Multiply by target wavelength
    intensityCorrection = integralNorm * tarWaveVal;
  }

  // ---------------- Part 2: Absorbance correction ----------------
  const absorbY = xVals.map(x => interp1(dataX, dataY, x));
  const yLightNorm = yLight?.map(y => y / (trapz(xVals, yLight) || 1)) || Array(xVals.length).fill(1);
  const weightedAbs = absorbY.map((y, i) => y * yLightNorm[i]);
  const integralReal = trapz(xVals, weightedAbs);

  // Thin Gaussian reference
  const GausSig = GausFWHM / 2.35482;
  let thinGauss = xVals.map(x => Math.exp(-Math.pow(x - GausMean, 2) / (2 * GausSig * GausSig)));
  const integralThin = trapz(xVals, thinGauss);
  thinGauss = thinGauss.map(y => y / (integralThin || 1));
  const thinWeightedAbs = thinGauss.map((y, i) => y * absorbY[i]);
  const integralStandard = trapz(xVals, thinWeightedAbs);

  const absorbanceFactor = integralReal / integralStandard;

  // ---------------- Part 3: Equivalent intensity ----------------
  tInt = mIntVal * intensityCorrection * absorbanceFactor;

  // ---------------- Part 4: Update display ----------------
  advLabel.innerHTML = `
    <p>
      <b> Observed equivalent incident intensity: <br>
       Work in progress
    </p>
  `;
}






