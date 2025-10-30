import * as config from './config.js';

const DEFAULT_LABEL = 'inject N<sub>2</sub>O<sub>4</sub>';

let elements = null;
let listenersAttached = false;
let handlers = {
  onDecrease: null,
  onIncrease: null,
  onInject: null
};
let anchorPoint = null; // coordinates in the canonical SVG space
let trackViewbox = false;

function getElements() {
  if (elements) return elements;
  const container = document.getElementById('weight-control');
  if (!container) return null;

  elements = {
    container,
    minus: document.getElementById('weight-control-minus'),
    plus: document.getElementById('weight-control-plus'),
    value: document.getElementById('weight-control-value'),
    inject: document.getElementById('weight-control-inject')
  };
  return elements;
}

function applyPosition() {
  if (!anchorPoint) return;
  const els = getElements();
  if (!els || !els.container) return;
  const svgInstance = window.svgDraw;
  if (!svgInstance || !svgInstance.node) return;
  const containerEl = document.getElementById('svg-container');
  if (!containerEl) return;

  const svgRect = svgInstance.node.getBoundingClientRect();
  const containerRect = containerEl.getBoundingClientRect();
  const vb = svgInstance.viewbox();

  const scaleX = svgRect.width / vb.width;
  const scaleY = svgRect.height / vb.height;

  const offsetX = svgRect.left - containerRect.left;
  const offsetY = svgRect.top - containerRect.top;

  const left = offsetX + (anchorPoint.x - vb.x) * scaleX;
  const top = offsetY + (anchorPoint.y - vb.y) * scaleY;

  els.container.style.left = `${left}px`;
  els.container.style.top = `${top}px`;
}

function ensureListeners() {
  const els = getElements();
  if (!els || listenersAttached) return;

  if (els.minus) {
    els.minus.addEventListener('click', (evt) => {
      evt.preventDefault();
      handlers.onDecrease && handlers.onDecrease();
    });
  }
  if (els.plus) {
    els.plus.addEventListener('click', (evt) => {
      evt.preventDefault();
      handlers.onIncrease && handlers.onIncrease();
    });
  }
  if (els.inject) {
    els.inject.addEventListener('click', (evt) => {
      evt.preventDefault();
      handlers.onInject && handlers.onInject();
    });
  }

  window.addEventListener('resize', () => requestAnimationFrame(applyPosition));
  window.addEventListener('orientationchange', () => requestAnimationFrame(applyPosition));

  listenersAttached = true;
}

export function configureWeightControl(newHandlers = {}) {
  ensureListeners();
  handlers = {
    onDecrease: newHandlers.onDecrease || null,
    onIncrease: newHandlers.onIncrease || null,
    onInject: newHandlers.onInject || null
  };
}

export function setWeightControlState({ weight, canInject, label } = {}) {
  const els = getElements();
  if (!els) return;
  if (typeof weight === 'number' && els.value) {
    els.value.textContent = `${weight.toFixed(2)} g`;
  }
  if (els.inject) {
    const text = label != null ? label : DEFAULT_LABEL;
    els.inject.innerHTML = text;
    if (canInject) {
      els.inject.classList.remove('weight-control__inject--disabled');
    } else {
      els.inject.classList.add('weight-control__inject--disabled');
    }
  }
}

export function setWeightControlVisibility(visible) {
  const els = getElements();
  if (!els || !els.container) return;
  const method = visible ? 'remove' : 'add';
  els.container.classList[method]('weight-control--hidden');
}

export function setWeightControlPosition(point, options = {}) {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return;
  anchorPoint = { x: point.x, y: point.y };
  trackViewbox = !!options.trackViewbox;
  requestAnimationFrame(applyPosition);
}

export function refreshWeightControlPosition() {
  if (trackViewbox) {
    requestAnimationFrame(applyPosition);
  }
}
