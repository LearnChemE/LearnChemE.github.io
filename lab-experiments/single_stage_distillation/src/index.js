import './style/style.scss';
import 'bootstrap';
import * as p5 from 'p5';
window.p5 = p5;
import './grafica/grafica.js';
import './grafica/plotFunctions.js';
import * as setup from './js/setup.js';
import * as loop from './js/loop.js';
import * as Separator from './js/Separator.js';

window.separator = Separator();

/******** ADD HTML FOR BUTTONS ********/
require('./js/insertInputs.js')();

let animation = (sk) => {
  setup(sk, 120);
  loop(sk);
}


let P5 = new p5(animation);
