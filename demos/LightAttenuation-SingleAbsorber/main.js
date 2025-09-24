/* jshint esversion: 6 */

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           GLOBAL VARIABLES
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const PAD = 20;
var panelsAreHidden = true;
var panelsAreHidden2 = true;
var panelsAreHidden3 = true;

const canvasHeight = 500;
const canvasHeightMax = 800;  // Max height in pixels (adjust as needed)
const canvasWidthMargin = 20; // Any extra width margin you want

let clientWidth = Math.max(400, window.innerWidth - canvasWidthMargin);
let clientHeight = canvasHeight;

// === Layout Position Variables ===
const mainGuiTop = -10;
const mainGuiLeft = 0;
const mainGuiWidth = clientWidth;  // dynamic width of main GUI panel

const secondaryGuiTopOffset = 323;  // vertical offset for secondary GUI (gui2)
const InertGuiOffset = 228+10;
const secondaryGuiLeft = 0;
const secondaryGuiWidth = clientWidth; // same width as main GUI by default

const resultsPanelWidth = 320;          // approx width of Results panel
const resultsPanelLeft = 10;            // margin from left edge
const resultsPanelTopOffset = canvasHeight + 10; // just below canvas

// PRODUCT PANEL layout variables
const productPanelLeftMargin = 10;      
const productPanelTopOffset = resultsPanelTopOffset + 105;  // below results panel with spacing
const productPanelWidth = 200;          
const productPanelHeight = 251;         

// Margins and spacing
const panelHorizontalSpacing = 10;      
const panelVerticalSpacing = 15;        

// GUI setup
let gui;
let gui2;
let textGui;
let productGui;
let wtGui;
let inertGui;

// Variables for Calculations
let Conc = 50;
let Absorb = 510;
let Intensity = 10;
let Depth = 500;
let Wavelength = 405;
let QY = 0.55;

// Inert Absorber
// Starting values for inert absorber (not applied until GUI shown)
const inertAbsorbStart = 51200;  // Napierian absorptivity
const inertConcStart = 5;   // Concentration (mM)
let inertAbsorb = inertAbsorbStart;   // default Napierian absorptivity
let inertConc = inertConcStart; // default concentration (mM)
// Temporary storage for inert values when hidden
let inertAbsorbSaved = inertAbsorbStart;
let inertConcSaved = inertConcStart;
let inertShown = false;

// Graphing Function Prep
let attPlot;
let equation;
let AttenuationFunction;  // Make sure this is global so mouseMoved and draw can access it

// Variables for numerical outputs
let A10 = 0;
let A20 = 0;
let ESh = 0;
let ESm = 0;
let ESs = 0;
let MDh = 0;
let MDm = 0;
let MDs = 0;

// Cursor tracking
let cursorXVal = null;
let cursorYVal = null;
// Snapped cursor
let snapX = null;
let snapY = null;

// === NEW VARIABLES for Product Calculation ===
let productAbsorbance = 0.5;         
let productConcentration = 2.26;     
let productThickness = 1;            
let productValue = 0;

const hlLabel = document.createElement("div");

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           Helpers for Calculators
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// Half-life Text Box Setup
function initHalfLifeText(parent) {
  const hlDiv = document.createElement("div");
  hlDiv.id = `hl-container`;
  hlDiv.className = "qs_container";
  parent.appendChild(hlDiv);

  hlLabel.id = `hl-label`;
  hlLabel.className = "qs_label";
  hlDiv.appendChild(hlLabel);
}

function updateHalfLifeText() {
  hlLabel.innerHTML = `
<p>
  @ exposed surface: ${ESh}<br>
  @ maximum depth: ${MDh} 
</p>
  `;
}

// Attenuation function
function attenuationAt(x) {
  // Combined absorptivity * concentration
  const totalAbsConc = Absorb * Conc + inertAbsorb * inertConc;
  return Intensity * Math.exp(-1 * totalAbsConc / 1e7 * x);
}

function updateEquations() {
  // use formatted numbers in the equation string so displayed equation also matches 3 sig figs
  equation = `${Intensity} * e^(-1 * ${Absorb} * ${Conc} / 10^7 * x)`
;
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           Slider Format(s)
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// ProductSlider without plus/minus buttons
class ProductSlider {
  constructor(key, min, max, init, step, label, units) {
    this.min = min;
    this.max = max;
    this.step = step;
    this.label = label;
    this.units = units;
    this.val = init;

    // Create container
    this.div = document.createElement("div");
    this.div.className = "qs_container";

    // Label and value box
    this.labelDiv = document.createElement("div");
    this.labelDiv.className = "qs_label";
    this.labelDiv.innerHTML = `<b>${label}:</b> `;
    this.valBox = document.createElement("input");
    this.valBox.type = "text";
    this.valBox.style.width = "60px";
    this.valBox.value = formatSigFig(init, 3);

    this.labelDiv.appendChild(this.valBox);
    this.labelDiv.append(` ${units}`);
    this.div.appendChild(this.labelDiv);

    // Slider element
    this.sliderDiv = document.createElement("input");
    this.sliderDiv.type = "range";
    this.sliderDiv.min = min;
    this.sliderDiv.max = max;
    this.sliderDiv.step = step;
    this.sliderDiv.value = init;
    this.sliderDiv.style.width = "160px";
    this.div.appendChild(this.sliderDiv);

    this.callback = null;
    this.addEventListeners();
  }

  addEventListeners = () => {
    // Slider moves
    this.sliderDiv.addEventListener("input", (event) => {
      this.val = Number(event.target.value);
      this.valBox.value = formatSigFig(this.val, 3);
      if (this.callback) this.callback(this.val);
      updateCurve();
    });

    // Textbox input
    this.valBox.addEventListener("input", (e) => {
      const str = e.target.value;
      if (str === '' || str === '-' || str === '.' || str === '-.') return;
      const num = Number(str);
      if (!isNaN(num)) {
        this.val = num;
        if (this.callback) this.callback(this.val);
        updateCurve();
      }
    });

    // Textbox blur validation
    this.valBox.addEventListener("blur", () => {
      const val = this.valBox.value.trim();
      const num = Number(val);
      const validDecimalRegex = /^[-+]?\d*\.?\d+$/;
      if (val === '' || isNaN(num) || !validDecimalRegex.test(val)) {
        alert('Please enter a valid decimal number.');
        this.valBox.value = formatSigFig(this.val, 3);
        this.valBox.focus();
      } else {
        this.val = num;
        this.valBox.value = formatSigFig(this.val, 3);
        if (this.callback) this.callback(this.val);
        updateCurve();
      }
    });
  }

  setCallback = (callback) => {
    this.callback = callback;
  }

  attachParent = (parent) => {
    parent.appendChild(this.div);
  }
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           General Positioning
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

function setPanelPosition(guiObject, side = "left", offsetTop = 20, pad = 20) {
  if (!guiObject || !guiObject.prototype || !guiObject.prototype._panel) return;

  const panel = guiObject.prototype._panel;
  panel.style.position = "fixed";
  panel.style.top = offsetTop + "px";

  if (side === "left") {
    panel.style.left = pad + "px";
    panel.style.right = "auto";
  } else if (side === "right") {
    panel.style.right = pad + "px";
    panel.style.left = "auto";
  }
}


// ----------------------------
// Compute panel width even if hidden
// ----------------------------
function getPanelWidth(guiObject) {
  const panel = guiObject?.prototype?._panel;
  if (!panel) return 0;

  let wasHidden = false;
  if (panel.style.display === "none") {
    wasHidden = true;
    panel.style.display = "block"; // temporarily show
  }

  const width = panel.getBoundingClientRect().width;

  if (wasHidden) panel.style.display = "none"; // restore
  return width;
}

// ----------------------------
// Dynamic Canvas Size Calculation
// ----------------------------
function computeCanvasSize() {
  const PAD_SIDE = 20;
  const aspect = 4/3;

  let availableWidth;
  let maxHeight;

  if (window.innerWidth < 800) {
    // Mobile: full width, half height
    availableWidth = window.innerWidth - PAD_SIDE * 2;
    maxHeight = window.innerHeight * 0.5;
  } else {
    // Desktop: account for side panels
    const leftWidth = getPanelWidth(productGui) + PAD_SIDE;
    const rightWidth = getPanelWidth(gui) + PAD_SIDE;
    availableWidth = Math.max(300, window.innerWidth - leftWidth - rightWidth - PAD_SIDE);
    maxHeight = window.innerHeight * 0.9;
  }

  let w = availableWidth;
  let h = w / aspect;

  // Limit by height if needed
  if (h > maxHeight) {
    h = maxHeight;
    w = h * aspect;
  }

  return { width: w, height: h };
}

// ----------------------------
// Panel positioning
// ----------------------------
function initPanelPositions() {
  if (window.innerWidth < 800) {
    // On mobile, panels flow naturally via CSS
    return;
  }

  const PAD_SIDE = 20;
  const topY = PAD_SIDE;

  if (gui) setPanelPosition(gui, "right", topY, PAD_SIDE);
  if (gui2) setPanelPosition(gui2, "right", topY + secondaryGuiTopOffset, PAD_SIDE);
  if (inertGui) setPanelPosition(inertGui, "right", topY + secondaryGuiTopOffset + InertGuiOffset, PAD_SIDE);
  if (productGui) setPanelPosition(productGui, "left", topY, PAD_SIDE);
  if (wtGui) setPanelPosition(wtGui, "left", topY + productPanelHeight + PAD_SIDE, PAD_SIDE);
  if (textGui && textGui.updateHalfLifeText) {
    const wrapper = document.getElementById('plot-wrapper');
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      setPanelPosition(textGui, "left", rect.bottom, PAD_SIDE);
    }
  }
}

// ----------------------------
// Window resize handler
// ----------------------------
function windowResized() {
  const size = computeCanvasSize();

  if (typeof resizeCanvas === 'function') {
    resizeCanvas(size.width, size.height);
  }

  clientWidth = size.width;
  clientHeight = size.height;

  // Update plot dimensions if already initialized
  if (attPlot && attPlot.GPLOT) {
    attPlot.GPLOT.setOuterDim(size.width, size.height);
    attPlot.GPLOT.setPos(0, 0);
  }


  initPanelPositions();
  loop(); // redraw everything
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           Graph + Set-up
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

function initPlot() {
  attPlot = new PlotCanvas(this);
  attPlot.plotSetup();

  attPlot.GPLOT.getXAxis().getAxisLabel().setText("Sample thickness (\u03BCm)");
  attPlot.GPLOT.getYAxis().getAxisLabel().setText("Intensity (mW/cm²)");
  attPlot.GPLOT.getTitle().setText("Attenuation due to one absorber (monochromatic source)");

  attPlot.GPLOT.getXAxis().getAxisLabel().setFontSize(16);
  attPlot.GPLOT.getYAxis().getAxisLabel().setFontSize(16);
  attPlot.GPLOT.getXAxis().setFontSize(16);
  attPlot.GPLOT.getYAxis().setFontSize(16);
  attPlot.GPLOT.getTitle().setFontSize(16);
  attPlot.GPLOT.setFontSize(16);
}

function setup() {
  const wrapper = document.getElementById('plot-wrapper');

  // Create canvas at wrapper size
  const cnv = createCanvas(wrapper.clientWidth, wrapper.clientHeight);
  cnv.parent(wrapper);

  // Initialize plot
  initPlot();

  // Initialize GUIs
  initMainGUI();
  initSecondaryGUI();
  initProductGUI();
  initWtToMMGUI();
  initInertGUI();

  // Prepare attenuation function
  updateEquations();
  AttenuationFunction = new Plot(equation, "x", 0, Depth);
  AttenuationFunction.lineThickness = 0;
  attPlot.addFuncs(AttenuationFunction);

  // Initial draw and pause loop
  draw();
  noLoop();

  // ----------------------------
  // Delay resizing to ensure GPLOT fully initialized
  // ----------------------------
  setTimeout(() => {
    windowResized();   // adjust canvas + GPLOT dimensions
    loop();            // redraw after resizing
    noLoop();          // stop continuous looping again
  }, 50); // 50ms delay works well on GitHub Pages

  // ----------------------------
  // Hide optional panels after positioning
  // ----------------------------
  toggleProductPanels(true);
  toggleSecondaryPanel(true);
  toggleInertPanel(true);

  // ----------------------------
  // Event listeners for buttons
  // ----------------------------
  document.getElementById("calc-btn").addEventListener("click", () => {
    panelsAreHidden = !panelsAreHidden;
    toggleProductPanels(panelsAreHidden);
  });

  document.getElementById("half-btn").addEventListener("click", () => {
    panelsAreHidden2 = !panelsAreHidden2;
    toggleSecondaryPanel(panelsAreHidden2);
  });

    document.getElementById("inert-btn").addEventListener("click", () => {
    panelsAreHidden3 = !panelsAreHidden3;
    toggleInertPanel(panelsAreHidden3);
  });
}

function draw() {
  clear();

  // Update equations and attenuation function
  updateEquations();
  AttenuationFunction.update(equation, Depth);

  // Set dynamic plot limits
  attPlot.GPLOT.setXLim(0, Depth);
  attPlot.GPLOT.setYLim(0, Intensity);

  // Ensure numeric tick labels are drawn
  attPlot.GPLOT.getXAxis().setDrawTickLabels(true);
  attPlot.GPLOT.getYAxis().setDrawTickLabels(true);

  // Draw the base plot (axes, grid)
  attPlot.plotDraw();

  const mar = attPlot.GPLOT.mar;
  const marginLeft = mar[0] + 10;
  const marginTop = mar[2];
  const marginRight = mar[1] - 40;
  const marginBottom = mar[3] + 30;

  const plotWidth = attPlot.GPLOT.outerDim[0] - marginLeft - marginRight;
  const plotHeight = attPlot.GPLOT.outerDim[1] - marginTop - marginBottom;

  // Draw attenuation curve
  stroke(0, 100, 255);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let px = 0; px <= plotWidth; px++) {
    let xVal = (px / plotWidth) * Depth;
    let yVal = attenuationAt(xVal); // uses current Conc & Absorb
    let py = marginTop + plotHeight - (yVal / Intensity) * plotHeight;
    vertex(marginLeft + px, py);
  }
  endShape();

  // Recalculate vertical reference lines dynamically
  const totalAbsConc2 = Absorb * Conc + inertAbsorb * inertConc;

  const A10 = -1e7 / totalAbsConc2 * Math.log(0.9);
  const A20 = -1e7 / totalAbsConc2 * Math.log(0.8);
  const Ae  = -1e7 / totalAbsConc2 * Math.log(0.367879);

  const depths = [
    { depth: A10, color: [255, 100, 100], label: "90%" },
    { depth: A20, color: [255, 180, 50], label: "80%" },
    { depth: Ae,  color: [128, 0, 128], label: "1/e (Dₚ)" }
  ];

  // Track previously drawn labels for horizontal proximity
  let usedLabels = [];

  depths.forEach(d => {
    const pxLine = marginLeft + (d.depth / Depth) * plotWidth;
    if (pxLine > marginLeft + plotWidth || pxLine < marginLeft) return;

    // Draw vertical line
    stroke(...d.color, 150);
    strokeWeight(1.5);
    line(pxLine, marginTop, pxLine, marginTop + plotHeight);

    // Base Y for label (bottom of plot)
    let labelY = marginTop + plotHeight - 2;

    // Only stagger if another label is close horizontally
    const minSpacingX = 40;  // horizontal distance threshold
    const minSpacingY = 20;  // vertical spacing if overlapping
    usedLabels.forEach(ul => {
      if (Math.abs(pxLine - ul.x) < minSpacingX) {
        labelY = ul.y - minSpacingY; // stagger upwards
      }
    });

    // Save this label's position for future comparisons
    usedLabels.push({ x: pxLine, y: labelY });

    // Draw label
    const labelX = pxLine + 4;
    textSize(16);
    textAlign(LEFT, BOTTOM);
    noStroke();
    fill(...d.color);
    text(d.label, labelX, labelY);
  });

  // Draw moving cursor line if mouse is over plot
  if (snapX !== null && snapY !== null) {
    const px = marginLeft + (snapX / Depth) * plotWidth;
    const py = marginTop + plotHeight - (snapY / Intensity) * plotHeight;

    stroke(100, 180, 255);
    fill(100, 180, 255, 180);
    ellipse(px, py, 12, 12);

    noStroke();
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(`Depth: ${snapX.toPrecision(3)} µm`, px + 10, py - 20);
    text(`Intensity: ${snapY.toPrecision(3)} mW/cm²`, px + 10, py);
  }

  // Combined absorptivity * concentration
  const totalAbsConc = Absorb * Conc + inertAbsorb * inertConc;
  // Update half-lives
  const es_sec = Math.log(2) / (1000 * QY * Absorb * (Intensity / (119624 / Wavelength) / 1e6));
  const md_sec = Math.log(2) / (1000 * QY * Absorb * (Intensity * Math.exp(-totalAbsConc * Depth / 1e7) / (119624 / Wavelength) / 1e6));

  ESh = formatTimeWithSigFig(es_sec, 3);
  MDh = formatTimeWithSigFig(md_sec, 3);
  updateHalfLifeText();
}

function mouseMoved() {
  if (!attPlot || !AttenuationFunction) return;

  const mar = attPlot.GPLOT.mar;
  const marginLeft = mar[0] + 10;
  const marginRight = mar[1] - 40;
  const marginTop = mar[2];
  const marginBottom = mar[3] + 30;

  if (mouseX < 0 || mouseX > clientWidth || mouseY < 0 || mouseY > clientHeight) {
    snapX = null;
    snapY = null;
    loop();
    return;
  }

  const plotWidth = clientWidth - marginLeft - marginRight;
  const mouseXVal = (mouseX - marginLeft) / plotWidth * Depth;
  snapX = Math.min(Math.max(mouseXVal, 0), Depth);
  snapY = attenuationAt(snapX);

  loop(); // only redraw cursor
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           GUIs
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */


function initMainGUI() {
  gui = createGui('Plot controls', 100, 100); // size will auto-adjust
  const parent = gui.prototype._panel;

  const sliders = [
    new ProductSlider('Conc', 0, 1000, Conc, 0.1, 'Absorber concentration', 'mM'),
    new ProductSlider('Absorb', 0, 5000, Absorb, 0.1, 'Napierian absorptivity', 'L/mol-cm'),
    new ProductSlider('Intensity', 0, 100, Intensity, 0.01, 'Incident intensity', 'mW/cm\u00B2'),
    new ProductSlider('Depth', 15, 2000, Depth, 1, 'Sample thickness', '\u03BCm')
  ];

  const callbacks = [
    val => Conc = val,
    val => Absorb = val,
    val => Intensity = val,
    val => Depth = val
  ];

  sliders.forEach((slider, i) => {
    slider.attachParent(parent);
    slider.setCallback(callbacks[i]);
  });

  // Initial position: right side
  const PAD_SIDE = 10;
  const rightX = window.innerWidth - gui.prototype._panel.offsetWidth - PAD_SIDE;
  setPanelPosition(gui, rightX, attPlot.GPLOT.mar[2]);
}

function initSecondaryGUI() {
  gui2 = createGui('Initiator half-life', 100, 100);
  const gui2parent = gui2.prototype._panel;

  // --- Sliders ---
  const sliders = [
    new ProductSlider('Wavelength', 200, 600, Wavelength, 0.1, 'Wavelength', 'nm'),
    new ProductSlider('QY', 0, 1, QY, 0.001, 'Quantum yield', '')
  ];

  sliders.forEach((slider, i) => {
    slider.attachParent(gui2parent);
    if (i === 0) slider.setCallback(val => Wavelength = val);
    else slider.setCallback(val => QY = val);
  });

  // --- Half-life display inside secondary GUI ---
  const hlDiv = document.createElement("div");
  hlDiv.id = `hl-container`;
  hlDiv.className = "qs_container";
  hlDiv.style.marginTop = "10px"; // spacing from sliders
  gui2parent.appendChild(hlDiv);

  // Use global hlLabel (do NOT redeclare with const)
  hlLabel.id = `hl-label`;
  hlLabel.className = "qs_label";
  hlDiv.appendChild(hlLabel);

  // Function to update half-life text
  function updateHalfLifeTextEmbedded() {
    hlLabel.innerHTML = `
      <p>
        @ exposed surface: ${ESh}<br>
        @ maximum depth: ${MDh}
      </p>
    `;
  }

  // Store reference globally so draw() can update
  textGui = { updateHalfLifeText: updateHalfLifeTextEmbedded };

  // Initial update so text appears immediately
  updateHalfLifeTextEmbedded();

  // --- Position GUI ---
  const PAD_SIDE = 10;
  const rightX = window.innerWidth - gui2.prototype._panel.offsetWidth - PAD_SIDE;
  const topY = secondaryGuiTopOffset + attPlot.GPLOT.mar[2];
  setPanelPosition(gui2, rightX, topY);
}

function initProductGUI() {
  productGui = createGui('Napierian absorptivity', 100, 100);
  const parent = productGui.prototype._panel;

  const sliders = [
    new ProductSlider('prodAbsorb', 0, 3, productAbsorbance, 0.001, 'Absorbance', ''),
    new ProductSlider('prodConc', 0, 500, productConcentration, 0.01, 'Concentration absorber', 'mM'),
    new ProductSlider('prodPathLength', 0, 5, productThickness, 0.001, 'Path length', 'cm')
  ];

  sliders.forEach(slider => slider.attachParent(parent));

  const resultDiv = document.createElement('div');
  Object.assign(resultDiv.style, {
    marginTop: '10px',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    flexBasis: '100%'
  });
  parent.appendChild(resultDiv);

  function updateProductValue() {
    if (productConcentration === 0) {
      resultDiv.textContent = 'Concentration cannot be zero';
      return;
    }
    const value = Math.log(10) * productAbsorbance / productThickness / productConcentration * 1e3;
    resultDiv.innerHTML = `
      <div style="font-weight:bold;">Napierian absorptivity:</div>
      <div>${formatSigFig(value, 3)} L/mol-cm</div>
    `;
    loop();
  }

  sliders[0].setCallback(val => { productAbsorbance = val; updateProductValue(); });
  sliders[1].setCallback(val => { productConcentration = val; updateProductValue(); });
  sliders[2].setCallback(val => { productThickness = val; updateProductValue(); });

  updateProductValue();

  // Position on left with padding
  const PAD_SIDE = 10;
  setPanelPosition(productGui, PAD_SIDE, PAD_SIDE);
}

function initWtToMMGUI() {
  wtGui = createGui('wt% to mM conversion', 100, 100);
  const parent = wtGui.prototype._panel;

  let concNew = 0.1, dNew = 0.786, MWNew = 348.37;

  const sliders = [
    new ProductSlider('conc_wt', 0, 10, concNew, 0.001, 'Concentration absorber', 'wt%'),
    new ProductSlider('density', 0, 2, dNew, 0.001, 'Overall density', 'g/mL'),
    new ProductSlider('mol_weight', 0, 1000, MWNew, 0.01, 'Absorber molecular weight', 'g/mol')
  ];
  sliders.forEach(slider => slider.attachParent(parent));

  const outputDiv = document.createElement('div');
  Object.assign(outputDiv.style, {
    marginTop: '10px',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    flexBasis: '100%'
  });
  parent.appendChild(outputDiv);

  function updateConcentration() {
    if (MWNew === 0) {
      outputDiv.textContent = 'Molecular weight cannot be zero';
      return;
    }
    const concentration_mM = (concNew * dNew / MWNew) * 1e4;
    outputDiv.innerHTML = `
      <div style="font-weight:bold;">Concentration:</div>
      <div>${formatSigFig(concentration_mM, 3)} mM</div>
    `;
    loop();
  }

  sliders[0].setCallback(val => { concNew = val; updateConcentration(); });
  sliders[1].setCallback(val => { dNew = val; updateConcentration(); });
  sliders[2].setCallback(val => { MWNew = val; updateConcentration(); });

  updateConcentration();

  // Position below productGui
  const PAD_SIDE = 10;
  const topY = PAD_SIDE + productPanelHeight + panelVerticalSpacing;
  setPanelPosition(wtGui, PAD_SIDE, topY);
}

function initInertGUI() {
  inertGui = createGui('Inert absorber', 100, 100);
  const parent = inertGui.prototype._panel;

  // Initialize sliders with starting values but do not apply yet
  const sliders = [
    new ProductSlider('inertAbsorb', 0, 5000, inertAbsorbStart, 0.1, 'Napierian absorptivity', 'L/mol-cm'),
    new ProductSlider('inertConc', 0, 1000, inertConcStart, 0.1, 'Concentration', 'mM')
  ];

  sliders.forEach((slider, i) => {
    slider.attachParent(parent);
    slider.setCallback(val => {
      if (inertShown) {
        if (i === 0) inertAbsorb = val;
        else inertConc = val;
        updateCurve();
      }
    });
  });

  inertGui.sliders = sliders; // save reference for later updates

// Position at bottom-right
const topY = PAD + secondaryGuiTopOffset + InertGuiOffset;
setPanelPosition(inertGui, "right", topY, PAD);

// Initialize sliders with starting values
if (inertGui.sliders) {
  inertGui.sliders[0].val = inertAbsorb;
  inertGui.sliders[0].sliderDiv.value = inertAbsorb;
  inertGui.sliders[0].valBox.value = formatSigFig(inertAbsorb, 3);

  inertGui.sliders[1].val = inertConc;
  inertGui.sliders[1].sliderDiv.value = inertConc;
  inertGui.sliders[1].valBox.value = formatSigFig(inertConc, 3);
}
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           Minor functions
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// Toggle hamburger menu
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

// Format number with up to 'sig' significant digits but never use scientific notation
function formatSigFig(num, sig = 3) {
  if (num === null || typeof num === 'undefined' || isNaN(Number(num))) return '';

  num = Number(num);

  // Handle zero separately
  if (num === 0) return '0';

  // Calculate order of magnitude (base 10 exponent)
  const order = Math.floor(Math.log10(Math.abs(num)));

  // If order >= sig - 1, show as integer with no decimals
  if (order >= sig - 1) {
    return num.toFixed(0);
  }

  // Else calculate decimals to keep 'sig' significant digits
  const decimals = sig - 1 - order;

  // Use toFixed with decimals, then trim trailing zeros
  let str = num.toFixed(decimals);

  // Remove trailing zeros and optional decimal point
  str = str.replace(/\.?0+$/, '');

  return str;
}

function formatTimeWithSigFig(seconds, sig = 3) {
  if (seconds <= 0 || isNaN(seconds)) return "0 s";

  const daySec = 86400;
  const hourSec = 3600;
  const minSec = 60;

  let value, unit;

  if (seconds >= daySec) {
    value = seconds / daySec;
    unit = "days";
  } else if (seconds >= hourSec) {
    value = seconds / hourSec;
    unit = "h";
  } else if (seconds >= minSec) {
    value = seconds / minSec;
    unit = "min";
  } else {
    value = seconds;
    unit = "s";
  }

  // Format value to sig figs without scientific notation
  let formatted = Number.parseFloat(value).toPrecision(sig);
  
  // Remove trailing zeros and possible decimal point if integer
  formatted = formatted.replace(/\.?0+$/, '');

  return `${formatted} ${unit}`;
}

// Toggle productGui and wtGui visibility
function toggleProductPanels(hidden) {
  const pPanel = productGui.prototype._panel;
  const wPanel = wtGui.prototype._panel;

  if (hidden) {
    pPanel.style.display = 'none';
    wPanel.style.display = 'none';
  } else {
    pPanel.style.display = '';
    wPanel.style.display = '';
  }
}
// Show/hide secondary GUI (half-life)
function toggleSecondaryPanel(hidden) {
  const sPanel = gui2.prototype._panel;

  if (hidden) {
    sPanel.style.display = 'none';
  } else {
    sPanel.style.display = '';
  }
}

function toggleInertPanel(hidden) {
  const iPanel = inertGui.prototype._panel;

  if (hidden) {
    iPanel.style.display = 'none';

    // Save current values
    inertAbsorbSaved = inertAbsorb;
    inertConcSaved = inertConc;

    // Reset for calculation while hidden
    inertAbsorb = 0;
    inertConc = 0;
    inertShown = false;
  } else {
    iPanel.style.display = '';

    // Restore values and enable them
    inertAbsorb = inertAbsorbSaved;
    inertConc = inertConcSaved;
    inertShown = true;

    // Update slider positions
    if (inertGui.sliders) {
      inertGui.sliders[0].val = inertAbsorb;
      inertGui.sliders[0].sliderDiv.value = inertAbsorb;
      inertGui.sliders[0].valBox.value = formatSigFig(inertAbsorb, 3);

      inertGui.sliders[1].val = inertConc;
      inertGui.sliders[1].sliderDiv.value = inertConc;
      inertGui.sliders[1].valBox.value = formatSigFig(inertConc, 3);
    }
  }

  // Update attenuation curve
  updateEquations();
  if (AttenuationFunction) AttenuationFunction.update(equation, Depth);
  loop();
}




