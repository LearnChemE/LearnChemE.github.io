import './style/style.scss';
import 'jquery';
import * as p5 from 'p5';

const Separator = require('./js/Separator.js');

let separator = new Separator();

let animation = (sk) => {
  sk.setup = () => {
    sk.noCanvas();
  }
  
  sk.draw = () => {

  }
}

const P5 = new p5(animation);
