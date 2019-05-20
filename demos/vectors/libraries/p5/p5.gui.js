/* jshint esversion: 6 */

(function() {

  // list of guis
  var guis = [];

  // default slider params
  var sliderMin = 0;
  var sliderMax = 100;
  var sliderStep = 1;
  var sliderUnit = "";

  // Create a GUI using QuickSettings (or DAT.GUI or ...)
  p5.prototype.createGui = function(label, x, y, id) {

    label = label || 'GUI';
    x = x || 20;
    y = y || 20;

    var gui = new QSGui(label, x, y, id);

    // add it to the list of guis
    guis.push(gui);

    // return it
    return gui;

  };

  // update defaults used for creation of sliders
  p5.prototype.sliderRange = function(vmin, vmax, vstep, vunit) {
    sliderMin = vmin;
    sliderMax = vmax;
    sliderStep = vstep;
    sliderUnit = vunit;
  };

  // extend default behaviour of noLoop()
  p5.prototype.noLoop = function() {
    this._loop = false;
    for(var i = 0; i < guis.length; i++) {
      guis[i].noLoop();
    }
  };

  // extend default behaviour of loop()
  p5.prototype.loop = function() {
    for(var i = 0; i < guis.length; i++) {
      guis[i].loop();
    }
    this._loop = true;
    this._draw();
  };


  // interface for quicksettings
  function QSGui(label, x, y, id) {
    QuickSettings.useExtStyleSheet();
    var qs = QuickSettings.create(x, y, label, document.body, id);
    this.prototype = qs;

    // addGlobals(global1, global2, ...) to add the selected globals
    this.addGlobals = function() {
      qs.bindGlobals(arguments);
    };
    /**
     * Adds a range slider control.
     * @param variable {String} Name of global variable.
     * @param min {Number} Minimum value of control.
     * @param max {Number} Maximum value of control.
     * @param val {Number} Initial value of control. Only works if variable is undefined.
     * @param step {Number} Size of value increments.
     * @param title {String} [optional] Label for control.
     * @param units {String} [optional] Units for control.
     */
    this.newSlider = function(variable, min, max, val, step, title, units) {
      let a; let b;let c; let d; let e; let f; let g;
      a = variable;
        if (window[variable] === undefined) {
          b = min;
          c = max;
        } else {
          b = Math.min(min, window[variable]);
          c = Math.max(max, window[variable]);
        }
        if (window[variable] === undefined) {d = val; window[variable] = val;} else {d = window[variable];}
        e = step;
        if (title === undefined) {f = variable;} else {f = title;}
        if (units === undefined) {g = "";} else {g = units;}
        return qs.bindRange(a, b, c, d, e, window, f, g);
    };

    this.hide = function() {
      qs.hide();
    };

    this.show = function() {
      qs.show();
    };

    this.addButton = function(title, callback) {
      qs.addButton(title, callback);
    };
    
    // addObject(object) to add all params of the object
    // addObject(object, param1, param2, ...) to add selected params
    this.addObject = function() {
      // get object
      object = arguments[0];
      // convert arguments object to array
      var params = [];
      if(arguments.length > 1) {
        params = Array.prototype.slice.call(arguments);
        params = params.slice(1);
      }
      // if no arguments are provided take all keys of the object
      if(params.length === 0) {
        params = object.keys();
      }
      qs.bindParams(object, params);
    };

    // noLoop() to call draw every time the gui changes when we are not looping
    this.noLoop = function() {
      qs.setGlobalChangeHandler(draw);
    };

    this.loop = function() {
      qs.setGlobalChangeHandler(null);
    };

    this.show = function() { qs.show(); };
    this.hide = function() { qs.hide(); };
    this.toggleVisibility = function() { qs.toggleVisibility(); };

  }

  // Extend Quicksettings
  // so it can magically create a GUI for parameters passed by name
  QuickSettings.bindParams = function(object, params) {

    // iterate over all the arguments
    for(var i = 0; i < params.length; i++) {

      var arg = params[i];
      var val = object[arg];
      var typ = typeof val;

      // console.log(typ, arg, val);

      switch(typ) {

        case 'object':

          // color triple ?
          if(val instanceof Array && val.length === 3 && typeof val[0] === 'number') {
            // create color according to the current color mode
            var c = color(val[0], val[1], val[2]);
            // get decimal RGB values
            var c2 = c.levels.slice(0,3);
            // create HTML color code
            var vcolor = '#' + c2.map(function(value) {
              return ('0' + value.toString(16)).slice(-2);
            }).join('');
            this.bindColor(arg, vcolor, object);
          } else {
            // multiple choice drop down list
            this.bindDropDown(arg, val, object);
            object[arg] = val[0];
          }
          break;

        case 'number':

          // values as defined by magic variables or gui.sliderRange()
          var vmin = object[arg + 'Min'] || object[arg + 'min'] || sliderMin;
          var vmax = object[arg + 'Max'] || object[arg + 'max'] || sliderMax;
          var vstep = object[arg + 'Step'] || object[arg + 'step'] || sliderStep;

          // the actual values can still overrule the limits set by magic
          vmin = min(val, vmin);
          vmax = max(val, vmax);
          var vunits = object[arg + 'Unit'] || object[arg + 'unit'] || object[arg + 'Units'] || object[arg + 'units'] || sliderUnit;

          // set the range
          this.bindRange(arg, vmin, vmax, val, vstep, object, vunits);

          break;

        case 'string':

          var HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;
          if(HEX6.test(val)) {
            // HTML color value (such as #ff0000)
            this.bindColor(arg, val, object);
          } else {
            // String value
            this.bindText(arg, val, object);
          }
          break;

        case 'boolean':

          this.bindBoolean(arg, object[arg], object);
          break;

      }
    }
  };

  // bind params that are defined globally
  QuickSettings.bindGlobals = function(params) {
    this.bindParams(window, params);
  };

})();
