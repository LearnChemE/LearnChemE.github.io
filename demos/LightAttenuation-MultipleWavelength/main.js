/* jshint esversion: 6 */

// ─────────────────────────────────────────────
//           GLOBAL VARIABLES
// ─────────────────────────────────────────────
const PAD = 20;
let PANEL_WIDTH = 200;

let clientWidth = Math.max(400, window.innerWidth - PAD * 2);
let clientHeight = 500;

// GUI setup
let guiPlot, guiAbs1, guiAbs2, guiAbs3;

// Variables for calculations
let Conc = 50;
let Depth = 500;

let Absorb1 = 2498;
let Wavelength1 = 365;
let Intensity1 = 10;

let Absorb2 = 1432;
let Wavelength2 = 405;
let Intensity2 = 10;

let Absorb3 = 91.8;
let Wavelength3 = 436;
let Intensity3 = 10;

// Graphing
let attPlot;
let equation1, equation2, equation3;
let AttenuationFunction1, AttenuationFunction2, AttenuationFunction3;

// ─────────────────────────────────────────────
//           Slider Class
// ─────────────────────────────────────────────
class ProductSlider {
  constructor(key, min, max, init, step, label, units, callback = null) {
    this.val = init;

    this.div = document.createElement("div");
    this.div.className = "qs_container";

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

    this.sliderDiv = document.createElement("input");
    this.sliderDiv.type = "range";
    this.sliderDiv.min = min;
    this.sliderDiv.max = max;
    this.sliderDiv.step = step;
    this.sliderDiv.value = init;
    this.div.appendChild(this.sliderDiv);

    // Event listeners
    this.sliderDiv.addEventListener("input", e => {
      this.val = Number(e.target.value);
      this.valBox.value = formatSigFig(this.val, 3);
      if (callback) callback(this.val);
      updateCurve();
    });

    this.valBox.addEventListener("input", e => {
      const num = Number(e.target.value);
      if (!isNaN(num)) {
        this.val = num;
        if (callback) callback(this.val);
        updateCurve();
      }
    });
  }

  attachParent(parent) { parent.appendChild(this.div); }
}

// ─────────────────────────────────────────────
//           GUI Initialization
// ─────────────────────────────────────────────
function initMainGUI() {
  // Remove any existing GUI container
  let existing = document.querySelector('.gui-right-container');
  if (existing) existing.remove();

  // Create new container for right-side GUIs
  let guiContainer = document.createElement("div");
  guiContainer.className = "gui-right-container";
  document.body.appendChild(guiContainer);

  // --- Plot Controls GUI ---
  guiPlot = createGui("Plot controls", 100, 100);
  const plotPanel = guiPlot.prototype._panel;
  plotPanel.style.position = 'relative';
  plotPanel.style.width = '100%';
  guiContainer.appendChild(plotPanel);

  const plotSliders = [
    new ProductSlider('Conc', 0, 1000, Conc, 0.1, 'Absorber concentration', 'mM', val => { Conc = val; }),
    new ProductSlider('Depth', 15, 2000, Depth, 1, 'Depth', 'µm', val => { Depth = val; })
  ];
  plotSliders.forEach(slider => slider.attachParent(plotPanel));

  // --- Add "Need absorber info?" link below Plot Controls ---
  const infoDiv = document.createElement("div");
  infoDiv.style.marginTop = "10px";
  infoDiv.style.fontSize = "0.9rem";
  infoDiv.style.color = "#111";
  infoDiv.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://learncheme.github.io/demos/LightAttenuation-SingleAbsorber/" target="_blank" style="color: blue; text-decoration: underline;">Need absorber info? </a>`;
  plotPanel.appendChild(infoDiv);

  // --- Absorber 1 GUI ---
  guiAbs1 = createGui("Wavelength 1", 100, 100);
  const panel1 = guiAbs1.prototype._panel;
  panel1.style.position = 'relative';
  panel1.style.width = '100%';
  guiContainer.appendChild(panel1);

  const sliders1 = [
    new ProductSlider('Absorb1', 0, 5000, Absorb1, 0.1, 'Absorptivity', 'L/mol-cm', val => { Absorb1 = val; }),
    new ProductSlider('Wavelength1', 300, 800, Wavelength1, 1, 'Wavelength', 'nm', val => { Wavelength1 = val; }),
    new ProductSlider('Intensity1', 0, 100, Intensity1, 0.1, 'Intensity', 'mW/cm²', val => { Intensity1 = val; })
  ];
  sliders1.forEach(slider => slider.attachParent(panel1));

  // --- Absorber 2 GUI ---
  guiAbs2 = createGui("Wavelength 2", 100, 100);
  const panel2 = guiAbs2.prototype._panel;
  panel2.style.position = 'relative';
  panel2.style.width = '100%';
  guiContainer.appendChild(panel2);

  const sliders2 = [
    new ProductSlider('Absorb2', 0, 5000, Absorb2, 0.1, 'Absorptivity', 'L/mol-cm', val => { Absorb2 = val; }),
    new ProductSlider('Wavelength2', 300, 800, Wavelength2, 1, 'Wavelength', 'nm', val => { Wavelength2 = val; }),
    new ProductSlider('Intensity2', 0, 100, Intensity2, 0.1, 'Intensity', 'mW/cm²', val => { Intensity2 = val; })
  ];
  sliders2.forEach(slider => slider.attachParent(panel2));

  // --- Absorber 3 GUI ---
  guiAbs3 = createGui("Wavelength 3", 100, 100);
  const panel3 = guiAbs3.prototype._panel;
  panel3.style.position = 'relative';
  panel3.style.width = '100%';
  guiContainer.appendChild(panel3);

  const sliders3 = [
    new ProductSlider('Absorb3', 0, 5000, Absorb3, 0.1, 'Absorptivity', 'L/mol-cm', val => { Absorb3 = val; }),
    new ProductSlider('Wavelength3', 300, 800, Wavelength3, 1, 'Wavelength', 'nm', val => { Wavelength3 = val; }),
    new ProductSlider('Intensity3', 0, 100, Intensity3, 0.1, 'Intensity', 'mW/cm²', val => { Intensity3 = val; })
  ];
  sliders3.forEach(slider => slider.attachParent(panel3));
}

// ─────────────────────────────────────────────
//           Plot Setup
// ─────────────────────────────────────────────
function initPlot() {
  attPlot = new PlotCanvas(this);
  attPlot.plotSetup();

  attPlot.GPLOT.getXAxis().getAxisLabel().setText("Depth (\u03BCm)");
  attPlot.GPLOT.getYAxis().getAxisLabel().setText("Intensity (mW/cm²)");
  attPlot.GPLOT.getTitle().setText("Attenuation with multiple wavelengths");
  attPlot.GPLOT.getXAxis().getAxisLabel().setFontSize(16);
  attPlot.GPLOT.getYAxis().getAxisLabel().setFontSize(16);
  attPlot.GPLOT.getXAxis().setFontSize(16);
  attPlot.GPLOT.getYAxis().setFontSize(16);
  attPlot.GPLOT.getTitle().setFontSize(16);
  attPlot.GPLOT.setFontSize(16);
}

// ─────────────────────────────────────────────
//           Equations
// ─────────────────────────────────────────────
function updateEquations() {
  equation1 = `${Intensity1}*e^(-${Absorb1}*${Conc}/1e7*x)`;
  equation2 = `${Intensity2}*e^(-${Absorb2}*${Conc}/1e7*x)`;
  equation3 = `${Intensity3}*e^(-${Absorb3}*${Conc}/1e7*x)`;
  
  // New combined, wavelength-weighted equation
equation4 = `((${Intensity1}*e(-${Absorb1}*${Conc}/1e7*x)*${Absorb1}/${Wavelength1}) + 
              (${Intensity2}*e(-${Absorb2}*${Conc}/1e7*x)*${Absorb2}/${Wavelength2}) + 
              (${Intensity3}*e(-${Absorb3}*${Conc}/1e7*x)*${Absorb3}/${Wavelength3})) /
             ((${Intensity1}*${Absorb1}/${Wavelength1}) + 
              (${Intensity2}*${Absorb2}/${Wavelength2}) + 
              (${Intensity3}*${Absorb3}/${Wavelength3}))`;

}

// ─────────────────────────────────────────────
//           Setup & Draw
// ─────────────────────────────────────────────

function setup() {
  const wrapper = document.getElementById('plot-wrapper');
  const cnv = createCanvas(wrapper.clientWidth, wrapper.clientHeight);
  cnv.parent(wrapper);

  // Redraw on mouse move
  cnv.mouseMoved(() => redraw());

  initPlot();
  initMainGUI();
  updateEquations();

  // --- Create attenuation functions ---
  AttenuationFunction1 = new Plot(equation1, "x", 0, Depth);
  AttenuationFunction1.lineThickness = 2;
  AttenuationFunction1.lineColor = 'red';
  attPlot.addFuncs?.(AttenuationFunction1);

  AttenuationFunction2 = new Plot(equation2, "x", 0, Depth);
  AttenuationFunction2.lineThickness = 2;
  AttenuationFunction2.lineColor = 'green';
  attPlot.addFuncs?.(AttenuationFunction2);

  AttenuationFunction3 = new Plot(equation3, "x", 0, Depth);
  AttenuationFunction3.lineThickness = 2;
  AttenuationFunction3.lineColor = 'blue';
  attPlot.addFuncs?.(AttenuationFunction3);

  windowResized();
  noLoop();
}

// ─────────────────────────────────────────────
//           Draw
// ─────────────────────────────────────────────
function draw() {
  clear();
  updateEquations(); // Updates equation1–4

  const canvasW = width;
  const canvasH = height;
  const topH = canvasH / 2;
  const bottomH = canvasH / 2;
  const margin = 50;

  // --- Top plot: original attenuation curves ---
  {
    const mar = attPlot.GPLOT.mar;
    const marginLeft = mar[0] + 10;
    const marginTop = mar[2];
    const marginRight = mar[1] - 40;
    const marginBottom = mar[3] + 30;

    const plotWidth = canvasW - marginLeft - marginRight;
    const plotHeight = topH - marginTop - marginBottom;

    // Update line colors
    AttenuationFunction1.lineColor = wavelengthToRGBClamped(Wavelength1).color;
    AttenuationFunction2.lineColor = wavelengthToRGBClamped(Wavelength2).color;
    AttenuationFunction3.lineColor = wavelengthToRGBClamped(Wavelength3).color;

    // Update curves
    AttenuationFunction1.update(equation1, Depth);
    AttenuationFunction2.update(equation2, Depth);
    AttenuationFunction3.update(equation3, Depth);

    attPlot.GPLOT.setOuterDim(canvasW, topH);
    attPlot.GPLOT.setXLim(0, Depth);
    const maxIntensity = Math.max(Intensity1, Intensity2, Intensity3);
    attPlot.GPLOT.setYLim(0, maxIntensity);
    attPlot.GPLOT.setPos(0, 0);

    attPlot.plotDraw();

    // --- Draw λ labels on top plot ---
    const labelX1 = Depth * 0.15;
    const labelX2 = Depth * 0.30;
    const labelX3 = Depth * 0.45;

    const xOffset = 10;
    const yOffset = -10;

    const y1Val = e(-Absorb1 * Conc / 1e7 * labelX1) * Intensity1;
    const y2Val = e(-Absorb2 * Conc / 1e7 * labelX2) * Intensity2;
    const y3Val = e(-Absorb3 * Conc / 1e7 * labelX3) * Intensity3;

    const cx1 = marginLeft + (labelX1 / Depth) * plotWidth + xOffset;
    const cx2 = marginLeft + (labelX2 / Depth) * plotWidth + xOffset;
    const cx3 = marginLeft + (labelX3 / Depth) * plotWidth + xOffset;
    const cy1 = marginTop + plotHeight - (y1Val / maxIntensity) * plotHeight + yOffset;
    const cy2 = marginTop + plotHeight - (y2Val / maxIntensity) * plotHeight + yOffset;
    const cy3 = marginTop + plotHeight - (y3Val / maxIntensity) * plotHeight + yOffset;

    function drawGlowLabel(x, y, label, glowColor) {
      drawingContext.save();
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = glowColor.color;
      fill(0);
      noStroke();
      text(label, x, y);
      drawingContext.restore();
    }

    textSize(16);
    textAlign(LEFT, CENTER);
    drawGlowLabel(cx1, cy1, `${Wavelength1} nm`, wavelengthToRGBClamped(Wavelength1));
    drawGlowLabel(cx2, cy2, `${Wavelength2} nm`, wavelengthToRGBClamped(Wavelength2));
    drawGlowLabel(cx3, cy3, `${Wavelength3} nm`, wavelengthToRGBClamped(Wavelength3));
  }

  // --- Bottom plot: weighted wavelength-averaged attenuation ---
  {
    const left = margin + 20;
    const top = topH;
    const w = canvasW - 2 * margin;
    const h = bottomH - 2 * margin;

    const maxWeighted = 1; // normalized

    // Draw axes
    stroke(0);
    strokeWeight(1);
    line(left, top + h, left + w, top + h); // x-axis
    line(left, top, left, top + h);         // y-axis

    // Draw tick marks and labels
    const numXTicks = 5;
    const numYTicks = 5;
    textSize(16);
    fill(0);
    textAlign(CENTER, TOP);
    for (let i = 0; i <= numXTicks; i++) {
      const xVal = i * Depth / numXTicks;
      const xPos = left + (xVal / Depth) * w;
      stroke(0);
      line(xPos, top + h, xPos, top + h + 5);
      noStroke();
      text(Math.round(xVal), xPos, top + h + 8);
    }
    textAlign(RIGHT, CENTER);
    for (let i = 0; i <= numYTicks; i++) {
      const yVal = i * maxWeighted / numYTicks;
      const yPos = top + h - (yVal / maxWeighted) * h;
      stroke(0);
      line(left - 5, yPos, left, yPos);
      noStroke();
      text(yVal.toFixed(1), left - 8, yPos);
    }

    // Draw weighted curve
    stroke('black');
    strokeWeight(2);
    noFill();
    beginShape();
    for (let z = 0; z <= Depth; z += 1) {
      const val = eval(equation4.replace(/x/g, z));
      const px = left + (z / Depth) * w;
      const py = top + h - (val / maxWeighted) * h;
      vertex(px, py);
    }
    endShape();

    // Axis labels
    noStroke();
    fill(0);
    textSize(16);
    textAlign(CENTER, TOP);
    text("Depth (µm)", left + w / 2, top + h + 30);
    push();
    translate(left - 50, top + h / 2);
    rotate(-HALF_PI);
    text("Photons Absorbed (normalized)", 0, 0);
    pop();
    textAlign(LEFT, BASELINE);

    // --- Draw vertical reference lines ---
    const targets = [
      { fraction: 0.9, color: [255, 100, 100], label: "90%" },
      { fraction: 0.8, color: [255, 180, 50], label: "80%" },
      { fraction: 0.367879, color: [128, 0, 128], label: "1/e (Dₚ)" }
    ];

const usedLabels = []; // keep track of previous label positions

targets.forEach(t => {
  const zStep = 1;
  let depth = Depth;
  for (let z = 0; z <= Depth; z += zStep) {
    if (eval(equation4.replace(/x/g, z)) <= t.fraction) {
      depth = z;
      break;
    }
  }

  // ✅ Only draw if the found depth is inside the x-range
  if (depth < Depth) {
    const pxLine = left + (depth / Depth) * w;
    stroke(...t.color, 150);
    strokeWeight(1.5);
    line(pxLine, top, pxLine, top + h);

    // --- Stagger labels if overlapping ---
    let labelY = top + h - 2;
    const minSpacingX = 40;  // horizontal threshold
    const minSpacingY = 20;  // vertical shift if overlapping
    usedLabels.forEach(ul => {
      if (Math.abs(pxLine - ul.x) < minSpacingX) {
        labelY = ul.y - minSpacingY; // stagger upwards
      }
    });
    usedLabels.push({ x: pxLine, y: labelY });

    // Draw label
    const labelX = pxLine + 4;
    textSize(16);
    textAlign(LEFT, BOTTOM);
    noStroke();
    fill(...t.color);
    text(t.label, labelX, labelY);
  }
});


   // --- Draw moving cursor for lower plot ---
if (mouseX >= left && mouseX <= left + w && mouseY >= top && mouseY <= top + h) {
  // Map mouseX to Depth
  const cursorDepth = ((mouseX - left) / w) * Depth;
  const cursorVal = eval(equation4.replace(/x/g, cursorDepth)); // weighted value (0..1)

  // Screen positions
  const px = left + (cursorDepth / Depth) * w;
  const py = top + h - (cursorVal / maxWeighted) * h;

  // Tooltip text
  const depthText = `Depth: ${cursorDepth.toPrecision(3)} µm`;
  const photonText = `Photons absorbed: ${(cursorVal*100).toFixed(0)}%`;

  textSize(14);
  textAlign(LEFT, BOTTOM);

  // Dynamic offset to stay inside graph
  const offsetX = 10;
  const offsetY = 16; // above the point
  let tooltipX = px + offsetX;
  if (tooltipX + Math.max(textWidth(depthText), textWidth(photonText)) > left + w) {
    tooltipX = px - Math.max(textWidth(depthText), textWidth(photonText)) - offsetX;
  }

  let tooltipY = py - offsetY;
  if (tooltipY < top) tooltipY = top + 2;

  // Draw tooltip text directly
  noStroke();
  fill(0);
  text(depthText, tooltipX, tooltipY);
  text(photonText, tooltipX, tooltipY - 16); // stacked above
  

  // Draw cursor circle
  stroke(100, 180, 255);
  fill(100, 180, 255, 180);
  ellipse(px, py, 12, 12);
}


  }
}



// ─────────────────────────────────────────────
//           Helpers
// ─────────────────────────────────────────────
function formatSigFig(num, sig = 3) {
  if (num === null || typeof num === 'undefined' || isNaN(Number(num))) return '';
  num = Number(num);
  if (num === 0) return '0';
  const order = Math.floor(Math.log10(Math.abs(num)));
  if (order >= sig - 1) return num.toFixed(0);
  const decimals = sig - 1 - order;
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

function e(x) { return Math.exp(x); }


function updateCurve() { redraw(); }

// Toggle hamburger menu
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Recompute canvas on resize
window.addEventListener('resize', windowResized);

function computeCanvasSize() {
  const PAD_SIDE = PAD;
  const aspect = 16 / 9 / 2; //Accounts for both graphs

  const totalPanelWidth = PANEL_WIDTH * 2 + PAD;
  let availableWidth = window.innerWidth - PAD_SIDE * 2 - totalPanelWidth;
  let maxHeight = window.innerHeight*0.9;

  let w = Math.max(300, availableWidth);
  let h = w / aspect;

  if (h > maxHeight) {
    h = maxHeight;
    w = h * aspect;
  }

  return { width: w, height: h };
}

function windowResized() {
  const size = computeCanvasSize();
  if (typeof resizeCanvas === 'function') resizeCanvas(size.width, size.height);

  clientWidth = size.width;
  clientHeight = size.height;

  if (attPlot && attPlot.GPLOT) {
    attPlot.GPLOT.setOuterDim(size.width, size.height);
    attPlot.GPLOT.setPos(0, 0);
  }

  loop();
}

function wavelengthToRGBClamped(wavelength) {
  let visible = true;

  // Clamp wavelength to visible range
  let wl = wavelength;
  if (wavelength < 380) { wl = 380; visible = false; }
  if (wavelength > 780) { wl = 780; visible = false; }

  // Convert to RGB
  let R = 0, G = 0, B = 0;
  if (wl >= 380 && wl < 440) { R = -(wl-440)/(440-380); G=0; B=1; }
  else if (wl >= 440 && wl < 490) { R=0; G=(wl-440)/(490-440); B=1; }
  else if (wl >= 490 && wl < 510) { R=0; G=1; B=-(wl-510)/(510-490); }
  else if (wl >= 510 && wl < 580) { R=(wl-510)/(580-510); G=1; B=0; }
  else if (wl >= 580 && wl < 645) { R=1; G=-(wl-645)/(645-580); B=0; }
  else if (wl >= 645 && wl <= 780) { R=1; G=0; B=0; }

  // Gamma correction
  const gamma = 0.8;
  R = Math.pow(R, gamma); G = Math.pow(G, gamma); B = Math.pow(B, gamma);

  const toHex = x => Math.round(x*255).toString(16).padStart(2,'0');
  return { color: `#${toHex(R)}${toHex(G)}${toHex(B)}`, visible };
}

function computeWeightedDepth(targetFraction) {
  // Simple numeric search to find z where equation4 = targetFraction
  let zStep = 1; // step in µm
  for (let z = 0; z <= Depth; z += zStep) {
    const val = eval(equation4.replace(/x/g, z)); // y value at depth z
    if (val <= targetFraction) return z;
  }
  return Depth; // fallback
}
