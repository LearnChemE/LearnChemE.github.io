// script.js

// DOM refs
const sliderPA       = document.getElementById('sliderPA'),
      sliderPB       = document.getElementById('sliderPB'),
      sliderRatio    = document.getElementById('sliderRatio'),
      mixBtn         = document.getElementById('mixBtn'),
      resetBtn       = document.getElementById('resetBtn'),

      valPA          = document.getElementById('valPA'),
      valPB          = document.getElementById('valPB'),
      valRatio       = document.getElementById('valRatio'),

      sTotalE        = document.getElementById('sTotal'),

      entropyTotalDiv = document.getElementById('entropyTotal');
let labelsVisible = false;
let blendRect = null;  // holds the background rect drawn during "remove"

// Add this line near the top with other variables
let animationRunning = false;

// physical constants
const R    = 8.314,   // J/(mol·K)
      T    = 298.0,   // K
      Vtot = 2.0;     // m³

// subtle colour mapping
function colourFor(val, hue) {
  const lightness = 100 - 27 * val;
  return `hsl(${hue},100%,${lightness}%)`;
}

// HSL→RGB helper (for blending)
function hslToRgb(h, s, l) {
  h /= 360; let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q-p)*6*t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q-p)*(2/3-t)*6;
      return p;
    };
    const q = l < 0.5 ? l*(1+s) : l + s - l*s;
    const p = 2*l - q;
    r = hue2rgb(p, q, h+1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h-1/3);
  }
  return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
}

// ── svg.js setup ───────────────────────────────────────────────────
const svgContainer = document.getElementById('svgCard');
const svgWidth     = svgContainer.clientWidth;  // matches your CSS max-width
const svgHeight    = 440;                       // same as your .simulation-card height

// init the drawing surface
const draw = SVG().addTo('#svgCard').size(svgWidth, svgHeight);


// create left & right rectangles + barrier line
let rectL   = draw.rect(svgWidth/2, svgHeight)
                   .fill(colourFor(+sliderPA.value,   0))
                   .stroke({ width: 3, color: '#000' });
let rectR   = draw.rect(svgWidth/2, svgHeight)
                   .fill(colourFor(+sliderPB.value, 240))
                   .stroke({ width: 3, color: '#000' })
                   .move(rectL.width(), 0);
let barrier = draw.line(rectL.width(), 0, rectL.width(), svgHeight)
                   .stroke({ width: 2, color: '#000' });

// right after you create `draw`:
const labelsLayer = draw.group();

function makeCardGroup() {
  const g = labelsLayer.group();
  const bg = g.rect(1,1)
              .fill('#fff')
              .stroke({ width:1, color:'#ccc' })
              .radius(6)
              .addClass('card-bg');
  const txt = g.text('')
              .font({ size:25, anchor:'middle', fill:'#000' })
              .leading(1.5)
              .attr({ 'xml:space':'preserve' })
              .addClass('card-text');

  return { group: g, bg, txt };
}

// create left & right label‐cards
const leftCard  = makeCardGroup();
const rightCard = makeCardGroup();

function updateLabels(curPA, curPB, dispSA, dispSB,
                      leftChamberX = null, leftChamberWidth = null,
                      rightChamberX = null, rightChamberWidth = null) {
  const padX = 12, padY = 8;

  // resolve chamber geometry (override args or live rects)
  const leftX  = leftChamberX  !== null ? leftChamberX  : rectL.x();
  const leftW  = leftChamberWidth  !== null ? leftChamberWidth  : rectL.width();
  const rightX = rightChamberX !== null ? rightChamberX : rectR.x();
  const rightW = rightChamberWidth !== null ? rightChamberWidth : rectR.width();

  // clear old labels
  labelsLayer.clear();
  // figure out if we're in compress-right mode
  const mode      = document.querySelector('input[name="mode"]:checked').value;
  const ratio     = +sliderRatio.value;
  const initialWL = svgWidth * (ratio / (1 + ratio));
  const overlapW  = initialWL - leftW;   // how much purple has crept over red
  // final region is [leftX … leftX+leftW+overlapW]
  const rawCenterX = mode === 'compress'
  ? leftX + (leftW + overlapW)/2
  : leftX + leftW/2;

  // Clamp the centerX to prevent label overflow into right chamber
  const maxLabelX = svgWidth * 0.8;  // cap at 70% of width
  const centerX = Math.min(rawCenterX, maxLabelX);

  // ───────────────────────────────────────
  // SPECIAL CASE: compress-right final state
  // when left chamber is fully collapsed
  if (labelsVisible && leftW < 1) {
    labelsLayer.clear();

    // compute center of the purple region
    const visibleStart = rightX;
    const visibleWidth = svgWidth - visibleStart;
    const centerX      = visibleStart + visibleWidth/2;
    const centerY      = svgHeight/2;
    const vSpacing     = 60;  // vertical gap between cards

    // helper to draw one card with tspans
    function drawCard(posY, buildText) {
      const g   = labelsLayer.group();
      const txt = g.text('').font({ size: 25, anchor: 'start', fill: '#000' });
      // buildText gets passed the text builder 't'
      txt.text(t => buildText(t));
      const bb = txt.bbox();
      txt.move(padX, padY);
      // background
      g.rect(bb.width + padX*2, bb.height + padY*2)
       .fill('#fff')
       .stroke({ width: 1, color: '#ccc' })
       .radius(6)
       .opacity(0.95)
       .move(0,0)
       .back();
      // center the group
      const gbb = g.bbox();
      g.move(centerX - gbb.width/2, posY - gbb.height/2);
    }

    // 1) P_B
    drawCard(centerY - 1.5*vSpacing, t => {
      t.tspan('P').font({ size: 25 });
      t.tspan('B').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${curPB.toFixed(2)} bar`).font({ size: 25 });
    });

    // 2) ΔS_B
    drawCard(centerY - 0.5*vSpacing, t => {
      t.tspan('ΔS').font({ size: 25 });
      t.tspan('B').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${dispSB} J/K`).font({ size: 25 });
    });

    // 3) P_A
    drawCard(centerY + 0.5*vSpacing, t => {
      t.tspan('P').font({ size: 25 });
      t.tspan('A').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${curPA.toFixed(2)} bar`).font({ size: 25 });
    });

    // 4) ΔS_A
    drawCard(centerY + 1.5*vSpacing, t => {
      t.tspan('ΔS').font({ size: 25 });
      t.tspan('A').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${dispSA} J/K`).font({ size: 25 });
    });

    labelsLayer.front();
    return;
  }

  // ───────────────────────────────────────
  // Otherwise fall back to two-chamber labels

  // LEFT chamber
  if (leftW > 0) {
    // P_A
    const gPA = labelsLayer.group();
    const tPA = gPA.text('').font({ size: 25, anchor: 'start', fill: '#000' });
    tPA.text(t => {
      t.tspan('P').font({ size: 25 });
      t.tspan('A').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${curPA.toFixed(2)} bar`).font({ size: 25 });
    });
    let bb = tPA.bbox();
    const bgPA = gPA.rect(bb.width + padX*2, bb.height + padY*2)
                   .fill('#fff').stroke({ width:1, color:'#ccc' }).radius(6).opacity(0.95);
    tPA.move(padX, padY);
    gPA.move(centerX - (bb.width + padX*2)/2, svgHeight/2 + 50);
    bgPA.back();

    // ΔS_A
    if (labelsVisible) {
      const gSA = labelsLayer.group();
      const tSA = gSA.text('').font({ size: 25, anchor: 'start', fill: '#000' });
      tSA.text(t => {
        t.tspan('ΔS').font({ size: 25 });
        t.tspan('A').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
        t.tspan(` = ${dispSA} J/K`).font({ size: 25 });
      });
      bb = tSA.bbox();
      const bgSA = gSA.rect(bb.width + padX*2, bb.height + padY*2)
                     .fill('#fff').stroke({ width:1, color:'#ccc' }).radius(6).opacity(0.95);
      tSA.move(padX, padY);
      gSA.move(centerX  - (bb.width + padX*2)/2, svgHeight/2 + 120);
      bgSA.back();
    }
  }

  // RIGHT chamber - keep static position during compress-right animation
  if (rightW > 0) {
    // For compress-right mode, use the initial right chamber position
    // const mode = document.querySelector('input[name="mode"]:checked').value;
    // const ratio = +sliderRatio.value;
    // const initialWL = svgWidth * (ratio/(1+ratio));
    
    // Use static positions for right chamber labels during compress-right
    const staticRightX = mode === 'compress' ? initialWL : rightX;
    const staticRightW = mode === 'compress' ? svgWidth - initialWL : rightW;
    
    // P_B
    const gPB = labelsLayer.group();
    const tPB = gPB.text('').font({ size: 25, anchor: 'start', fill: '#000' });
    tPB.text(t => {
      t.tspan('P').font({ size: 25 });
      t.tspan('B').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
      t.tspan(` = ${curPB.toFixed(2)} bar`).font({ size: 25 });
    });
    let bb = tPB.bbox();
    const bgPB = gPB.rect(bb.width + padX*2, bb.height + padY*2)
                   .fill('#fff').stroke({ width:1, color:'#ccc' }).radius(6).opacity(0.95);
    tPB.move(padX, padY);
    gPB.move(staticRightX + staticRightW/2 - (bb.width + padX*2)/2, svgHeight/2 - 130);
    bgPB.back();

    // ΔS_B
    if (labelsVisible) {
      const gSB = labelsLayer.group();
      const tSB = gSB.text('').font({ size: 25, anchor: 'start', fill: '#000' });
      tSB.text(t => {
        t.tspan('ΔS').font({ size: 25 });
        t.tspan('B').font({ size: 15 }).attr({ 'baseline-shift': 'sub' });
        t.tspan(` = ${dispSB} J/K`).font({ size: 25 });
      });
      bb = tSB.bbox();
      const bgSB = gSB.rect(bb.width + padX*2, bb.height + padY*2)
                     .fill('#fff').stroke({ width:1, color:'#ccc' }).radius(6).opacity(0.95);
      tSB.move(padX, padY);
      gSB.move(staticRightX + staticRightW/2 - (bb.width + padX*2)/2, svgHeight/2 - 60);
      bgSB.back();
    }
  }

  labelsLayer.front();
}
// redraw everything to match sliders (pre-mix)
function updateUI() {
  const pA    = +sliderPA.value,
        pB    = +sliderPB.value,
        ratio = +sliderRatio.value;


  // sync your DOM texts (unchanged)
  valPA.textContent    = pA.toFixed(2);
  valPB.textContent    = pB.toFixed(2);
  valRatio.textContent = ratio.toFixed(1);

  // compute new pixel widths
  const wL = svgWidth * (ratio/(1+ratio)),
        wR = svgWidth - wL;

  // instantly reposition & recolor
  rectL.width(wL).fill(colourFor(pA,   0));
  rectR
    .move(wL, 0)
    .width(wR)
    .fill(colourFor(pB, 240));
  // barrier.plot([ [ wL, 0 ], [ wL, svgHeight ] ]);
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'remove') {
    barrier.hide();
  } else {
    barrier.plot([ [ wL, 0 ], [ wL, svgHeight ] ]).show();
  }
  updateLabels(pA, pB, 0, 0);
}

mixBtn.addEventListener('click', () => {
  labelsVisible = true;
  entropyTotalDiv.style.display = 'block';
  animationRunning = true; // Set animation flag
  // updateLabels(+sliderPA.value, +sliderPB.value, 0, 0); // Initialize labels
  // updateUI();
  mixBtn.disabled      = true;
  sliderPA.disabled    =
  sliderPB.disabled    =
  sliderRatio.disabled = true;

  const pAbar = +sliderPA.value,
        pBbar = +sliderPB.value,
        ratio = +sliderRatio.value,
        mode  = document.querySelector('input[name="mode"]:checked').value;

     // CLEANUP: on first frame of compress-right, clear old blend and hide left
   if (mode === 'remove') {
    barrier.hide();
    // 2) remove any internal strokes so there’s no middle border
    rectL.stroke({ width: 0 });
    rectR.stroke({ width: 0 });
    blendRect?.remove();
    blendRect = null;
  }else if (mode === 'compress') {
    // your existing compress clean-up
    rectL.fill('transparent');
    blendRect?.remove();
    blendRect = null;
    rectL.stroke({ width: 3, color: '#000' });
    rectR.stroke({ width: 3, color: '#000' });
  }

    // initial pixel widths
    const initialWL = svgWidth * (ratio/(1+ratio));
    const initialWR = svgWidth - initialWL;
    // final “compressed” widths
    const finalWL   = initialWR;      
    const finalWR   = svgWidth - finalWL;

  // volumes
  const vA0 = Vtot * (ratio / (1+ratio)),
        vB0 = Vtot - vA0;

  // pressures in Pa
  const pA_Pa = pAbar * 1e5,
        pB_Pa = pBbar * 1e5;

  // moles
  const nA = pA_Pa * vA0 / (R*T),
        nB = pB_Pa * vB0 / (R*T);

  // entropy changes
  let dSA, dSB;
  if (mode === 'remove') {
    dSA = nA * R * Math.log(Vtot/vA0);
    dSB = nB * R * Math.log(Vtot/vB0);
  } else {
    const PFA = nA * R * T / vB0;
    dSA = -nA * R * Math.log(PFA/pA_Pa);
    dSB = 0;
  }

  const iSA = Math.round(dSA),
        iSB = Math.round(dSB),
        iST = iSA + iSB;

  // final partial pressures (bar)
  let finalPAbar, finalPBbar;
  if (mode === 'remove') {
    finalPAbar = (nA*R*T / Vtot) / 1e5;
    finalPBbar = (nB*R*T / Vtot) / 1e5;
  } else {
    const PFA = (nA*R*T)/vB0;
    finalPAbar = PFA/1e5;
    finalPBbar = pBbar;
  }

  // Pre-calculate the final mixed color for compress-right mode
  let finalMixedColor;
  if (mode === 'compress') {
    const sum = finalPAbar + finalPBbar;
    if (!sum) {
      finalMixedColor = 'transparent';
    } else {
      const rFrac = finalPAbar/sum;
      const bFrac = finalPBbar/sum;
      const alpha = Math.min(sum/2, 1);
      finalMixedColor = `rgba(${Math.round(255*rFrac)},0,${Math.round(255*bFrac)},${alpha.toFixed(2)})`;
    }
  }

  // for “remove” colour blend
  const lA   = (100-27*pAbar)/100,
        lB   = (100-27*pBbar)/100,
        rgbA = hslToRgb(0,   1, lA),
        rgbB = hslToRgb(240, 1, lB),
        wA   = ratio/(1+ratio),
        wB   = 1/(1+ratio),
        r    = Math.round(rgbA[0]*wA + rgbB[0]*wB),
        g    = Math.round(rgbA[1]*wA + rgbB[1]*wB),
        b    = Math.round(rgbA[2]*wA + rgbB[2]*wB),
        blendRGB = `rgb(${r},${g},${b})`;

  // after you compute blendRGB
  // use the already-computed opaque blendRGB
  let comp;

  let go = 0;
  const increment = 0.0005;  // controls animation speed
  function step() {
    if (!animationRunning) {
      return;
    }

    go = Math.min(go + increment, 1);

    // interpolate pressures
    const rawPA = pAbar + go*(finalPAbar - pAbar),
          rawPB = pBbar + go*(finalPBbar - pBbar);

    const curPA = isNaN(rawPA) ? 0 : rawPA,
          curPB = isNaN(rawPB) ? 0 : rawPB;


    // don't round early
    const rawSA = dSA * go,
          rawSB = dSB * go,
          rawST = rawSA + rawSB;


    const dispSA = isNaN(rawSA) ? '0.0' : Math.round(rawSA);
    const dispSB = isNaN(rawSB) ? '0.0' : Math.round(rawSB);
    const dispST = isNaN(rawST) ? '0.0' : dispSA+dispSB;


    // 3. update total ΔS display
    sTotalE.textContent = dispST;

    // svg.js updates in step()
    if (mode === 'remove') {
       // compute new pixel widths
    const targetWL = svgWidth * (ratio / (1 + ratio));
    const targetWR = svgWidth - targetWL;

    rectL.width(targetWL).move(0, 0).fill(colourFor(curPA, 0));
    rectR.width(targetWR).move(targetWL, 0).fill(colourFor(curPB, 240));
    
    if (go >= 0.5) {
      rectL.fill('transparent').stroke({ width: 0 }); // Remove stroke only when transparent
      rectR.fill('transparent').stroke({ width: 0 }); // Remove stroke only when transparent
      blendRect?.remove();
      blendRect = draw.rect(svgWidth, svgHeight)
        .fill(blendRGB)
        .stroke({ width: 3, color: '#000' }) // Add outer border to blend rect
        .move(0, 0)
        .back();
    }

    updateLabels(curPA, curPB, dispSA, dispSB);
    
    } else {  // compress-right
      // compress-right mix colour (pressure‐fraction RGBA)
      comp = finalMixedColor;
        // 1) compute current left-width and position
  const currWL = initialWL * (1 - go); // Shrink from full width to 0
  const currX = initialWL - currWL;    // Move right as it shrinks

  // 2) update the red chamber (left)
  rectL
    .width(currWL)
    .move(currX, 0)
    .fill(colourFor(curPA, 0));

  // 3) update the blue chamber (right)
  rectR
    .move(initialWL, 0)  // Fixed at original right position
    .width(initialWR + (initialWL - currWL))  // Expand rightward
    .fill(colourFor(curPB, 240));

  // 4) update barrier position
  barrier.plot([[initialWL, 0], [initialWL, svgHeight]]);

  // 5) Handle the overlapping region
  draw.findOne('rect.overlap')?.remove(); // Remove previous overlap if exists
  
  if (go < 1) {
  const overlapW = initialWL - currWL;
  const overlapX = currX + currWL;

  // Trim right chamber width to exclude overlap
  const trimmedRightW = initialWR + (initialWL - currWL) - overlapW;

  // Update the visible right part
  rectR
    .move(initialWL + overlapW, 0)  // start after overlap
    .width(trimmedRightW)           // avoid overlapping part
    .fill(colourFor(curPB, 240));

  // Explicitly draw overlap as separate layer
  draw
    .rect(overlapW, svgHeight)
    .attr({ class: 'overlap' })
    .move(overlapX, 0)
    .fill(finalMixedColor);
}


  // 6) On completion, show final state
  if (go >= 1) {
    draw.findOne('rect.overlap')?.remove();
    rectL.hide();
    rectR.show().fill(finalMixedColor);
  }

  // 7) Update labels with current positions
  updateLabels(curPA, curPB, dispSA, dispSB, currX, currWL);
  labelsLayer.front();
    }
    // ← HERE: update all four labels each frame
     // Ensure labels stay visible
    
      if (go < 1 && animationRunning) {
        requestAnimationFrame(step);
      } else {
        mixBtn.disabled      = false;
        sliderPA.disabled    =
        sliderPB.disabled    =
        sliderRatio.disabled = false;
      }
  }
  requestAnimationFrame(step);
});

// Reset handler
resetBtn.addEventListener('click', () => {
   // STOP any running animation first
  animationRunning = false;

  labelsVisible = false;
  sliderPA.value = 0.5;
  sliderPB.value = 0.5;
  sliderRatio.value = 1;

  // re-enable UI…
  entropyTotalDiv.style.display = 'none';
  sTotalE.textContent = '0.0';
  mixBtn.disabled = false;
  sliderPA.disabled =
  sliderPB.disabled =
  sliderRatio.disabled = false;

  // bring left chamber back into view
  rectL.show();

  // redraw both halves to the 50/50 starting state
  const half = svgWidth/2;
  rectL
    .fill(colourFor(0.5, 0))
    .width(half)
    .move(0, 0);

  rectR
    .fill(colourFor(0.5, 240))
    .width(half)
    .move(half, 0);

  blendRect?.remove();
  blendRect = null;

  // Remove overlap rectangle from compress-right animation
  draw.findOne('rect.overlap')?.remove();
  
  rectL.stroke({ width: 3, color: '#000' });
  rectR.stroke({ width: 3, color: '#000' });
  barrier.show();
  updateUI();
});


// live-update on slider moves
[sliderPA, sliderPB, sliderRatio].forEach(el =>
  el.addEventListener('input', updateUI)
);

// initial draw
updateUI();

// ─── MENU & MODAL BEHAVIOR ────────────────────────────────────────
const menuBtn     = document.querySelector('.menu-btn');
const dropdown    = document.getElementById('dropdownMenu');
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modalTitle');
const modalBody   = document.getElementById('modalBody');
const modalClose  = document.querySelector('.modal-close');

// 1. Toggle dropdown on hamburger click
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  dropdown.classList.toggle('hidden');
});

// 2. Hide dropdown when clicking anywhere else
document.addEventListener('click', () => {
  dropdown.classList.add('hidden');
});

// 3. Open modal with content when a menu item is clicked
dropdown.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', e => {
    const opt = e.target.dataset.option;
    let title = '', body = '';

    if (opt === 'directions') {
      title = 'Directions';
      body  = `
      <p>In this simulation, ideal gases A and B are mixed isothermally by
      keeping total volume constant (remove barrier option) or
      by adding gas A to gas B so final volume is the same as initial volume of gas B (select "compress right").
      Click the “mix gases” to initiate mixing. For "remove barrier", the entropy change of each gas is the same as that of a gas expanding into a vacuum. When the partial pressure decreases, entropy increases. For "compress right", if the partial pressure of a gas does not change, its entropy does not change, even when mixed with another gas. The total entropy change is the sum of the entropy changes of each gas.
      Gas A is colored red and gas B is colored blue, and when the gases mix, different shades of purple result, depending on the ratio of moles of each species. As the pressures increase, the color becomes more intense. When the initial pressures of A and B are equal and the "remove barrier" is selected, which corresponds to mixing at constant pressure, the entropy of mixing is:
      <br>\\(\\Delta S_{\\text{mix}} = -n_A R \\ln x_A - n_B R \\ln x_B\\),
      where x<sub>A</sub> and x<sub>B</sub> are the mole fractions of A and B in the final mixture. Note that the calculations only apply when A and B are different gases.
      </p>
    `;
    }
    else if (opt === 'details') {
      title = 'Details';
      body  = `
       <p>The total volume of the container is 2 m<sup>3</sup>.</p>
    \\[\\Delta S_{\\text{Total}} = \\Delta S_A + \\Delta S_B\\]
    \\[\\Delta S_A = -n_A R \\ln\\left(\\frac{P_{F,A}}{P_{I,A}}\\right)\\]
    \\[\\Delta S_B = -n_B R \\ln\\left(\\frac{P_{F,B}}{P_{I,B}}\\right)\\]
    <p><em>or</em></p>
    \\[\\Delta S_A = n_A R \\ln\\left(\\frac{V_{F,A}}{V_{I,A}}\\right)\\]
    \\[\\Delta S_B = n_B R \\ln\\left(\\frac{V_{F,B}}{V_{I,B}}\\right)\\]
    <p>
      where <em>n</em> represents the number of moles, <em>R</em> is the gas constant (J / [K·mol]), 
      ΔS is the entropy change (J / K), <em>P</em> is the pressure (bar), 
      <em>V</em> is volume (m<sup>3</sup>), the subscripts A and B represent the gases used, 
      and the subscripts F and I represent the final and initial pressures.
    </p>
  `;
    }
    else if (opt === 'about') {
      title = 'About';
      body  = `
    <p>
      This simulation was created in the <a href="https://www.colorado.edu/chbe" target="_blank" rel="noopener">Department of Chemical and Biological Engineering</a> at University of Colorado Boulder
      for <a href="https://learncheme.com/" target="_blank" rel="noopener">LearnChemE.com</a> by <em>Venkateswarlu Mopidevi</em>
      under the direction of Professor John L. Falconer and Michelle Medlin. It is a JavaScript/HTML5 implementation of a
      <a href="https://demonstrations.wolfram.com/EntropyChangesInMixingIdealGases/" target="_blank" rel="noopener">Mathematica simulation</a>
      originally developed by Derek M. Machalek. It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) in collaboration with Washington State University. Address any questions or comments to <a href="mailto:LearnChemE@gmail.com">LearnChemE@gmail.com</a>.
      If this simulation is too big or too small for your screen, zoom out or in using command - or command +  on Mac or ctrl - or ctrl +  on Windows.  
    </p>
  `;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML    = body;
    modal.classList.remove('hidden');
    dropdown.classList.add('hidden');
    // re-render MathJax formulas
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

// 4. Close modal when clicking the “×”
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// 5. Close modal when clicking outside the content box
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});