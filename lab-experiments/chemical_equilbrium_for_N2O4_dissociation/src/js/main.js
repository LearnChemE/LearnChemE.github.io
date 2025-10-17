import * as config from './config.js';
import {drawConstantVolumeSetup, resetConstantVolumeExperiment} from './constantVolume.js';
import {drawConstantPressureSetup, resetConstantPressureExperiment} from './constantPressure.js';

// translate select value to mode
function __modeFromSelectValue(v) {
  // 'edge-on' => constant volume, 'face-down' => constant pressure
  return v === 'face-down' ? 'constant-pressure' : 'constant-volume';
}

// create a change handler bound to this svg
function __makeModeChangeHandler(svg) {
  return function () {
    const select = document.getElementById('volume-select');
    if (!select) return;
    const mode = __modeFromSelectValue(select.value);

    if (mode === 'constant-volume') {
      svg.clear();
      // use existing constant-volume functions (already imported in this file)
      if (typeof resetConstantVolumeExperiment === 'function') {
        resetConstantVolumeExperiment(svg);
      }
      if (typeof drawConstantVolumeSetup === 'function') {
        drawConstantVolumeSetup(svg);
      }
      console.log('[constantVolume.js] drawConstantVolumeSetup(svg) not found.');
      return;
    }

    // constant-pressure branch; use imported functions
    if (mode === 'constant-pressure') {
      svg.clear();
      if (typeof resetConstantPressureExperiment === 'function') {
        resetConstantPressureExperiment(svg);
      }
      if (typeof drawConstantPressureSetup === 'function') {
        drawConstantPressureSetup(svg);
      } else {
        console.warn('[constantPressure.js] drawConstantPressureSetup(svg) not found.');
      }
      console.log('[constantPressure.js] drawConstantPressureSetup(svg) executed.');
    }
  };
}

export function drawFigure(svg) {
  // store and clear the canvas

  const select = document.getElementById('volume-select');
  if (select) {
    // prevent duplicate listeners during hot reloads
    if (select._modeChangeHandler) {
      select.removeEventListener('change', select._modeChangeHandler);
    }
    select._modeChangeHandler = __makeModeChangeHandler(svg);
    select.addEventListener('change', select._modeChangeHandler);

    // Optional: render to match current selection immediately
    select._modeChangeHandler();
  }
}

export function reset(svg) {
  const select = document.getElementById('volume-select');
  const mode = select ? __modeFromSelectValue(select.value) : 'constant-volume';
  if (mode === 'constant-volume') {
    if (typeof resetConstantVolumeExperiment === 'function') {
      resetConstantVolumeExperiment(svg);
    }
    if (typeof drawConstantVolumeSetup === 'function') {
      drawConstantVolumeSetup(svg);
    }
  } else {
    if (typeof resetConstantPressureExperiment === 'function') {
      resetConstantPressureExperiment(svg);
    }
    if (typeof drawConstantPressureSetup === 'function') {
      drawConstantPressureSetup(svg);
    }
  }
}