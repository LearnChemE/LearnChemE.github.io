import 'bootstrap';

import 'bootstrap/scss/bootstrap.scss';
import './style.css'
import { initHamburgerMenu, insertSVG } from './ts/helpers';
import svg from './media/Evaporator.svg?raw';
import worksheet from './media/Single-effect evaporator worksheet.docx';
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/zoom';
import { initInteractions } from './ts/interactions';
import { createLabels } from './ts/labels';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.docx"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Initialize labels
const labels = createLabels();

// Initialize State
// const State = new Simulation();

// Initialize interactions
initInteractions(/* state, */ labels);

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();