import 'bootstrap/scss/bootstrap.scss';
import './css/style.css';

import 'bootstrap';

import svg from "./media/crossExchanger.svg?raw";
import { initHamburgerMenu, insertSVG } from './ts/helpers';
import { initInteractables } from './ts/interactions';
import { GlobalState } from './types';
import { initSvgDrag, initSvgZoom } from './ts/zoom';

const app = document.querySelector<HTMLDivElement>('#app')!;


// Create div containing svg
app.appendChild(initHamburgerMenu());
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Initialize State object
const State = new GlobalState();

// Initialize interactions
initInteractables(State);
initSvgZoom();
initSvgDrag();