import 'bootstrap/scss/bootstrap.scss';
import './css/style.css';

import 'bootstrap';

import svg from "./media/crossExchanger.svg?raw";
import { initHamburgerMenu, insertSVG } from './ts/helpers';
import { enableWindowResize, initInteractables } from './ts/interactions';
import { Simulation } from './types';
import { initSvgDrag, initSvgZoom } from './ts/zoom';
import { initLabels } from './ts/labels';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu());
// Create hamburger menu
app.appendChild(insertSVG(svg));
// Create Labels
initLabels();

// Initialize State object
const State = new Simulation();

// Initialize interactions
initInteractables(State);
initSvgZoom();
initSvgDrag();
enableWindowResize();