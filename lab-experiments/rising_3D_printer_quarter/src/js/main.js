import * as config from './config.js';
import { computeVolumeVsTime, volumeAtTime } from './calc.js';


let coin = null;
let terminalVelocity = 0.19;
let currentOrientation = 'face-down';
// Animation state variables
let animId = null;
let lastTs = null;
let isFalling = false;
let orientationLocked = false; // once motion starts, orientation stays locked until reset
let lineData = null;
const vesselX = 375;
  const vesselY = 125;
  const W = 200;
  const H = 475;
const margin = 75;
// Save the SVG.js context so other functions can reuse it
export function drawFigure(svg) {
  // Clear previous drawing (if any)
  svg.clear();
  drawVessel(svg, vesselX- margin, vesselY, W, H);
  drawScale(svg, 366 - margin, 160);
  lineData = svg.line(457.5 - margin, 587, 457.5 - margin, 510).stroke({ width: 1, color: '#000' });

  // Place a coin roughly at the center of the vessel body
  // must match drawVessel()
  const topY = 30;         // m + 10 from drawVessel()
  const coinCX = vesselX + W / 2 - 2.426 * 7;
  const coinTopY = vesselY + (350 + 30 + 2 * 0.175 * 14); // adjust vertical placement as needed
  coin = drawCoin(svg, coinCX - margin, coinTopY, 2.426 * 14, { thickness: 0.175 * 14 });
  initOrientationControl(coin, svg);
  initReleaseButton(svg, coin);
}


function drawVessel(svg, x, y, W, H) {
  // Canvas sizing
  const m = 11; // margin

  // Cylinder (vessel) geometry
  const cx = W / 2;
  const topY = m + 10;
  const rx = Math.min(W * 0.42, W / 2 - m);
  const ry = rx * 0.18; // ellipse vertical radius
  const height = H - topY - m - 10;
  const bottomY = topY + height;

  // Style helpers
  const wallStroke = { color: '#082a33', width: 2, linejoin: 'round' };
  const faceFill = 'white'; // inside fill
  const topFill = '#f9e1d8';

  // Vessel side-wall shape (back arc at top, full side walls, back arc at top again)
  const sidePath = [
    'M', cx - rx, topY,
    'L', cx - rx, bottomY,
    'A', rx, ry, 0, 0, 0, cx + rx, bottomY,
    'L', cx + rx, topY,
    'A', rx, ry, 0, 0, 0, cx - rx, topY
  ].join(' ');
  svg.path(sidePath).move(x, y).fill('#f9e1d8').stroke(wallStroke);

  // const sidePath1 = [
  //   'M', cx - rx, topY + 30,
  //   'L', cx - rx, bottomY,
  //   'A', rx, ry, 0, 0, 0, cx + rx, bottomY,
  //   'L', cx + rx, topY + 30,
  //   'L', cx - rx, topY + 30
  // ].join(' ');

  // svg.path(sidePath1).move(x, y + 27 + 30).fill('#f9e1d8').opacity(0.6);

  // Top ellipse (rim)
  svg.ellipse(rx * 2, ry * 2).center(x + rx, y + topY - 6.75).fill(topFill).stroke(wallStroke);
}

function drawScale(svg, x, y, color = '#1e88e5') {
  // Configuration
  const heightPx = 350;   // total height of the scale in pixels
  const totalCm = 25;   // covers 0..200 cm
  const pxPerCm = heightPx / totalCm; // 2 px per cm

  const axisColor = color;
  const tickColor = '#000';
  const textFamily = 'Helvetica, Arial, sans-serif';
  const majorLen = 16;    // every 10 cm
  const medLen = 10;    // every 5 cm
  const minorLen = 6;     // every 1 cm
  const labelPad = 6;
  const fontSize = 12;

  // Group to keep scale elements together
  const g = svg.group();

  // Background panel (blue)
  const bgLeftPad = majorLen + labelPad + 30; // room for labels (e.g., "200") + tick
  const bgRightPad = 8;                       // a little room to the right of the axis
  g.rect(bgLeftPad + bgRightPad, heightPx + 30)
    .move(x - bgLeftPad, y - 15)
    .fill('#deb887')
    .radius(2);

  // Main vertical line
  g.line(x + 7, y, x + 7, y + heightPx).stroke({ width: 1, color: 'black' });

  // Ticks and labels
  for (let cm = 0; cm <= totalCm; cm++) {
    const yy = y + cm * pxPerCm;
    let len = minorLen;
    if (cm % 5 === 0) len = majorLen; else if (cm % 5 === 0) len = medLen;

    // Tick to the left of the axis
    g.line(x + 7, yy, x - len, yy).stroke({ width: 1, color: tickColor });

    // Labels every 10 cm
    if (cm % 2.5 === 0) {
      const t = g.text(String(cm));
      t.font({ family: textFamily, size: fontSize });
      t.attr({ 'text-anchor': 'end', 'dominant-baseline': 'end' });
      t.move(x - len - 15 - labelPad, yy - 7);
    }
  }

  // Unit label at the top
  const unit = g.text('cm');
  unit.font({ family: textFamily, size: fontSize });
  unit.attr({ 'text-anchor': 'start' });
  unit.move(x - majorLen - labelPad, y - fontSize - 2);

  return g;
}

function drawCoin(svg, cx, topY, diameter = 2.426 * 14, opts = {}) {
  const holder = svg.group();
  const rot = holder.group();

  const {
    thickness = 14,
    edge = '#082a33',
    side = '#1f6173',      // teal side
    top = '#2f788a',       // teal top face
    highlight = '#a8c9d1', // inner highlight on top
  } = opts;

  const rx = diameter / 2;
  const ry = Math.max(2, diameter * 0.12); // very flat ellipse look

  // Side wall (body of the coin)
  rot.rect(diameter, thickness)
    .center(cx, topY + thickness / 2)
    .fill(side)
    .stroke({ color: 'none' });

  rot.path(`M ${cx - rx} ${topY + thickness} A ${rx} ${ry} 0 0 0 ${cx + rx} ${topY + thickness}`)
    .fill(side)
    .stroke({ color: edge, width: .5, linecap: 'round' });

  rot.ellipse(diameter, ry * 2)
    .center(cx, topY)
    .fill(top)
    .stroke({ color: edge, width: 0.5, linejoin: 'round' });
  // Inner highlight ellipse for specular effect
  rot.ellipse(diameter * 0.82, ry * 1.1)
    .center(cx, topY + ry * 0.05)
    .fill(highlight)
    .opacity(0.65)
    .stroke({ color: 'none' });

  // Front bottom rim (thick arc to suggest 3D)

  // Slight dark stroke around the side edges
  // g.rect(diameter, thickness)
  //   .center(cx, topY + thickness / 2)
  //   .fill('none')
  //   .stroke({ color: edge, width: .5, linejoin: 'round' });

  const homeBBox = holder.bbox();
  holder.remember('homeX', homeBBox.x);
  holder.remember('homeY', homeBBox.y);

  holder.remember('rot', rot);
  return holder;
}


function initOrientationControl(targetCoin, svg) {
  const sel = document.getElementById('volume-select');
  if (!sel || !targetCoin) return; // guard if DOM not ready or coin missing

  const rot = targetCoin.remember('rot');
  sel.value = currentOrientation;

  // Use assignment to avoid stacking multiple listeners on redraws
  sel.onchange = (e) => {
    const requested = e.target.value;
    if (isFalling || orientationLocked) {
      sel.value = currentOrientation;
      return;
    }

    const bbox = rot.bbox();
    const cx = bbox.cx;
    const cy = bbox.cy;

    if (requested === 'face-down') {
      rot.rotate(-90, cx, cy);
      rot.move(bbox.x, bbox.y - 2.426 * 7);
      terminalVelocity = 0.19;
      lineData.remove();
      lineData = svg.line(457.5 - margin, 587, 457.5 - margin, 510).stroke({ width: 1, color: '#000' });
    } else if (requested === 'edge-on') {
      rot.rotate(90, cx, cy);
      rot.move(bbox.x + 2.426 * 7, bbox.y);
      lineData.remove();
      lineData = svg.line(457.5 - margin, 587, 457.5 - margin, 543).stroke({ width: 1, color: '#000' });
      terminalVelocity = 0.28;
    }

    currentOrientation = requested; // persist selection
  };
}

export function initReleaseButton(svg, coin) {
  const btn = document.getElementById('release-button');
  if (!btn || !coin) return;

  btn.onclick = () => {
    const sel = document.getElementById('volume-select');
    if (btn.textContent === "Release") {
      btn.textContent = "Stop";
      btn.classList.remove("btn-success");
      btn.classList.add("btn-danger");
      orientationLocked = true; // lock until reset
      if (sel) sel.disabled = true;
      startAnimation(svg, coin);
    } else {
      btn.textContent = "Release";
      btn.classList.remove("btn-danger");
      btn.classList.add("btn-success");
      // keep selector disabled if locked; only reset() will unlock
      if (sel && !orientationLocked) sel.disabled = false;
      stopAnimation();
    }
  };
}

function startAnimation(svg, coin) {
  if (isFalling) return; // prevent multiple RAF loops
  isFalling = true;
  lastTs = null;

  const pxPerCm = 350 / 25; // must match drawScale()
  const startY = coin.bbox().cy;

  const step = (ts) => {
    if (!isFalling) return; // bail if stopped
    if (lastTs == null) {
      lastTs = ts;
    }
    const dt = (ts - lastTs) / 1000; // seconds
    lastTs = ts;

    // Convert terminalVelocity (in cm/s) to px/s (assumed); move down by dy
    const speedPxPerSec = terminalVelocity * pxPerCm;
    const dy = speedPxPerSec * dt;
    coin.dmove(0, -dy);

    // Check distance traveled in pixels
    const distPx = - coin.bbox().cy + startY;
    if (distPx >= 25 * pxPerCm) {
      stopAnimation();
      const btn = document.getElementById('release-button');
      if (btn) {
        btn.textContent = "Release";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-success");
      }
      const sel = document.getElementById('volume-select');
      if (sel) sel.disabled = true; // remain locked until reset
      return;
    }

    // Optional: stop at bottom bounds of the vessel drawing
    // try {
    //   const bbox = coin.bbox();
    //   const svgHeight = typeof svg.height === 'function' ? svg.height() : svg.node.clientHeight;
    //   if (bbox.y2 >= svgHeight - 10) {
    //     stopAnimation();
    //     const btn = document.getElementById('release-button');
    //     if (btn) {
    //       btn.textContent = "release";
    //       btn.classList.remove("btn-danger");
    //       btn.classList.add("btn-success");
    //     }
    //     return;
    //   }
    // } catch (_) {}

    animId = requestAnimationFrame(step);
  };

  animId = requestAnimationFrame(step);
}

function stopAnimation() {
  isFalling = false;
  if (animId != null) cancelAnimationFrame(animId);
  animId = null;
  lastTs = null;
}

export function reset(draw) {
  stopAnimation();
  const btn = document.getElementById('release-button');
  const sel = document.getElementById('volume-select');
  if (btn) {
    btn.textContent = "Release";
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-success");
  }
  if (coin) {
    // Move holder back to its home position
    const homeX = coin.remember('homeX');
    const homeY = coin.remember('homeY');
    if (typeof homeX === 'number' && typeof homeY === 'number') {
      coin.move(homeX, homeY);
    }
    // Reset rotation/orientation to face-down
    const rot = coin.remember('rot');
    if (rot) {
      const bbox = rot.bbox();
      rot.rotate(-90, bbox.cx, bbox.cy);
      rot.move(bbox.x, bbox.y + 14);
    }
  }
  currentOrientation = 'face-down';
  terminalVelocity = 0.39;
  orientationLocked = false;
  if (sel) {
    sel.disabled = false;
    sel.value = currentOrientation;
  }
}