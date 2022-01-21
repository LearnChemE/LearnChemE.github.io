/*

"svg-graph-library"
Author: Neil Hendren
University of Colorado, Boulder
Version: 0.0.1
Date: 4/8/2021
Most recent version available at: https://github.com/LearnChemE/LearnChemE.github.io/tree/master/libraries/svg-graph-library
(or maybe on https://github.com/neiltheseal if I am no longer working for the University of Colorado)

*/

// JSDoc:
/**
 * Creates a new SVG Graph. See svg-graph-library.js for documentation
 * @class
 * @param {object} [options]
 */

/*

Example graph below, with default options. All options are optional.

const graph = new SVG_Graph({
 id: "svg-plot-0",                  // id of the container element
 classList: ["svg-plot"],           // classes to add to the plot container element
 title: "",                         // text above the plot
 titleFontSize: 20,                 // font size of title, pixels
 padding: [[70, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
 parent: document.body,             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
 axes: {
   axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
   x : {
     labels: ["", "bottom label"],  // labels to add above the top x-axis and below the bottom x-axis
     labelFontSize: 17,             // font size of the label(s) (px)
     display: [true, true],         // choose whether to display the [top, bottom] x axes
     range: [0, 1],                 // the minimum and maximum values on the x-axis
     step: 0.25,                    // the numerical distance between major ticks on the x-axis
     minorTicks: 3,                 // number of minor ticks to put between each major tick
     majorTickSize: 2,              // the length (px) of the major ticks on the x-axis
     minorTickSize: 1,              // the length (px) of the minor ticks on the x-axis
     tickLabelFontSize: 14,         // font size of the tick labels (the numbers below the major ticks)
     tickWidth: 0.5,                // stroke width of the ticks (px)
     tickLabelPrecision: 2,         // digits of precision for the x-axis tick labels
     showZeroLabel: false,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
   },
   y : {
     labels: ["left label", ""],
     labelFontSize: 17,
     display: [true, true],
     range: [0, 1],
     step: 0.25,
     minorTicks: 3,
     majorTickSize: 2,
     minorTickSize: 1,
     tickLabelFontSize: 14,
     tickWidth: 0.5,
     tickLabelPrecision: 2,
     showZeroLabel: false,
   }
 }
});

******************************************************************************************************

********* METHODS: ***********************************************************************************

******************************************************************************************************

graph.addCurve(func, options)           // add a curve ( i.e. a function, such as y = x^2 ) to the plot. The curve object is appended to the graph.curves array.

example:

  function xSquared(x) { return x**2 }
  const curveOptions = {
    stroke: "rgba(0, 0, 0, 1)",         // color of the curve
    strokeWidth: 2,                     // stroke width of the curve (px)
    resolution: 100,                    // number of points to plot
    fill: "none",                       // whether to add fill. This option is incomplete. Example: "rgb(255, 0, 0)"
    id: `curve-(number)`,               // HTML id of the curve
    classList: ["curve"],               // classes to add to the curve
  }
  const curve = graph.addCurve(xSquared, curveOptions);

  // you can then update the curve with a new function, for example.

  function xCubed(x) { return x**3 }
  curve.func = xCubed;
  curve.updateCoords();
  curve.drawCurve();

  // and the graph will update to show x^3 rather than x^2.
  // Alternatively, access the curve via the graph object:

  const thisCurve = graph.curves[0];

******************************************************************************************************

graph.createGroup(options)              // create an SVG "g" element with specified classlist, id, and parent

example: 

  const options = {
    classList: [],
    id: "example-id",
    parent: graph.SVG,
  };
  const group = graph.createGroup(options);

  // you can then add SVG-namedspaced elements to that group, e.g.:

  graph.createLine({ parent: group });

******************************************************************************************************

graph.createLine(options)               // create an SVG line

example, draw a line from (0, 5) to (1, 2)

  const lineOptions = {
    coord1: [0, 5],
    coord2: [1, 2],
    classList: ["line-class"],
    usePlotCoordinates: true,           // this is "false" by default. If this option is "false", then coord1 and coord2 will refer to the SVG's "viewBox" coordinates, with (0, 0) being the top-left corner and (100, 100) being the bottom-right corner of the plot.
    id: "my-line",
    parent: document.getElementById("an-svg-g-element"),
  };

  const myLine = graph.createLine(options);
  myLine.style.stroke = "rgb(0, 0, 0)";
  myLine.style.strokeWidth = "1px";

******************************************************************************************************

graph.createPath(options)               // create an SVG "path" element. In this version of svg-graph-library.js, it is just a glorified polyline.

example:

  const pathOptions = {
    coords: [[0, 0], [1, 1], [1, 2], [2, 5], [2, 2]],
    classList: ["path-class"],
    usePlotCoordinates: true,
    id: "my-path",
    parent: graph.SVG,
    stroke: "rgb(200, 0, 0)",
    strokeWidth: 1,                     // (pixels)
    fill: "none",
  };

  const myPath = graph.createPath(pathOptions);
  const d = myPath.getAttribute("d");
  console.log(d) ===================> "M 0,0 L 1,1 1,2 2,5 2,2"

******************************************************************************************************

END OF DOCUMENTATION

******************************************************************************************************
*/

function SVG_Graph(options) {
  const graphNumber = document.getElementsByClassName("svg-plot").length;
  this.options = {
    id: `svg-plot-${graphNumber}`,
    classList: ["svg-plot"],
    title: "",
    titleFontSize: 20,
    padding: [[70, 20], [40, 50]],
    parent: document.body,
  };

  this.options = {
    ...this.options,
    ...options
  };

  const xOpts = typeof( options ) === "undefined" ? {} : typeof( options.axes ) === "undefined" ? {} : typeof( options.axes.x ) === "undefined" ? {} : options.axes.x;
  const yOpts = typeof( options ) === "undefined" ? {} : typeof( options.axes ) === "undefined" ? {} : typeof( options.axes.y ) === "undefined" ? {} : options.axes.y;

  this.options.axes = {
    axesStrokeWidth: 0.5,
    x : {
      labels: ["", "bottom label"],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 1],
      step: 0.25,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 2,
      showZeroLabel: false,
      ...xOpts
    },
    y : {
      labels: ["left label", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 1],
      step: 0.25,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 2,
      showZeroLabel: false,
      ...yOpts
    },
  };

  this.curves = [];
  this.shapes = [];
  this.text = [];

  /***********************************************/
  /****** ADD STYLE ELEMENT TO DOCUMENT HEAD *****/
  /***********************************************/
  if ( document.getElementById("svg-plot-style") === null ) {
    const style = document.createElement("style");
    style.id = "svg-plot-style";
    let styleText = ".svg-plot * {vector-effect: non-scaling-stroke;}";
    style.innerHTML = styleText;
    document.head.appendChild(style);
  }

  /***********************************************/
  /****** CREATE CONTAINER AND SVG ELEMENTS ******/
  /***********************************************/
  this.container = document.createElement("div");
  this.container.classList.add( ...this.options.classList );
  this.container.id = this.options.id;
  this.container.style.position = "absolute";
  this.container.style.top = "0px";
  this.container.style.left = "0px";
  this.options.parent.appendChild(this.container);

  this.SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.SVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  this.SVG.style.width = `calc(100% - ${this.options.padding[0][0] + this.options.padding[0][1]}px)`;
  this.SVG.style.height = `calc(100% - ${this.options.padding[1][0] + this.options.padding[1][1]}px)`;
  this.SVG.style.marginLeft = `${this.options.padding[0][0]}px`;
  this.SVG.style.marginRight = `${this.options.padding[0][1]}px`;
  this.SVG.style.marginTop = `${this.options.padding[1][0]}px`;
  this.SVG.style.marginBottom = `${this.options.padding[1][1]}px`;
  this.SVG.setAttribute("version", "2.0");
  this.SVG.setAttribute("viewBox", `0 0 100 100`);
  this.SVG.setAttribute("preserveAspectRatio", "none");
  this.container.appendChild(this.SVG);

  this.tickLabels = document.createElement("div");
  this.tickLabels.classList.add("tick-labels");
  this.tickLabels.id = `${this.options.id}-tick-labels`;
  this.tickLabels.style.position = "absolute";
  this.tickLabels.style.width = "100vw";
  this.tickLabels.style.height = "100vh";
  this.tickLabels.style.top = "0px";
  this.tickLabels.style.left = "0px";
  this.tickLabels.style.pointerEvents = "none";
  document.body.appendChild(this.tickLabels);

  this.axesLabels = document.createElement("div");
  this.axesLabels.classList.add("axes-labels");
  this.axesLabels.style.position = "relative";
  this.axesLabels.style.bottom = "100%";
  this.axesLabels.style.height = "100%";
  this.container.appendChild(this.axesLabels);

  /***********************************************/
  /************* DEFINE SOME METHODS *************/
  /***********************************************/
  this.coordToPix = function(x, y) {
    const xPix = 100 * (x - this.options.axes.x.range[0]) / (this.options.axes.x.range[1] - this.options.axes.x.range[0]);
    const yPix = 100 - 100 * (y - this.options.axes.y.range[0]) / (this.options.axes.y.range[1] - this.options.axes.y.range[0]);
    return [xPix, yPix]
  };

  this.pixToCoord = function(x, y) {
    const xCoord = this.options.axes.x.range[0] + ( x / 100 ) * ( this.options.axes.x.range[1] - this.options.axes.x.range[0] );
    const yCoord = this.options.axes.y.range[0] + ( ( 100 - y ) / 100 ) * ( this.options.axes.y.range[1] - this.options.axes.y.range[0] );
    return [xCoord, yCoord]
  }

  this.createLine = function(options) {
    const o = {
      coord1: [0, 0],
      coord2: [10, 10],
      classList: [],
      usePlotCoordinates: false,
      id: null,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      parent: this.SVG,
      ...options,
    };
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    let coords = [];
    if ( o.usePlotCoordinates ) {
      coords.push(this.coordToPix(...o.coord1));
      coords.push(this.coordToPix(...o.coord2));
    } else {
      coords.push( o.coord1 );
      coords.push( o.coord2 );
    }
    line.setAttribute("x1", `${coords[0][0]}`);
    line.setAttribute("y1", `${coords[0][1]}`);
    line.setAttribute("x2", `${coords[1][0]}`);
    line.setAttribute("y2", `${coords[1][1]}`);
    if( o.classList.length >= 1 ) { line.classList.add( ...o.classList ) }
    if( o.id !== null ) { line.id = `${o.id}` }
    line.style.stroke = o.stroke;
    line.style.strokeWidth = `${o.strokeWidth}px`;
    o.parent.appendChild(line);
    return line;
  };

  this.createGroup = function(options) {
    const o = {
      classList: [],
      id: null,
      parent: this.SVG,
      ...options,
    };
    const group = document.createElementNS('http://www.w3.org/2000/svg','g');
    if( o.classList.length >= 1 ) { group.classList.add( ...o.classList ) }
    if( o.id !== null ) { group.id = `${o.id}` }
    o.parent.appendChild(group)
    return group;
  };

  this.createPath = function(options) {
    const o = {
      coords: [],
      classList: [],
      usePlotCoordinates: true,
      id: null,
      parent: this.SVG,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      fill: "none",
      ...options,
    };
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');

    let coords = [];
    if ( o.usePlotCoordinates ) {
      o.coords.forEach(coord => {
        coords.push(this.coordToPix(...coord));
      });
    } else {
      o.coords.forEach(coord => {
        coords.push(coord);
      });
    };
    if( o.classList.length >= 1 ) { path.classList.add( ...o.classList ) }
    if( o.id !== null ) { path.id = `${o.id}` }

    path.style.stroke = o.stroke;
    path.style.strokeWidth = `${o.strokeWidth}px`;
    path.style.fill = o.fill;
    
    let d = `M ${coords[0][0]},${coords[0][1]} L`;
    for ( let i = 1; i < coords.length; i++ ) {
      d += ` ${coords[i][0].toFixed(2)},${coords[i][1].toFixed(2)}`;
    };
    
    path.setAttribute("d", d);
    o.parent.appendChild(path);
    return path;
  };

  this.createPoint = function(options) {
    const o = {
      coord: [0.5, 0.5],
      radius: 2,
      classList: [],
      usePlotCoordinates: true,
      id: null,
      parent: this.SVG,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      fill: "rgb(255, 255, 255)",
      ...options,
    };
    const point = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    const rect = this.SVG.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    let coord;
    if ( o.usePlotCoordinates ) {
      coord = this.coordToPix(...o.coord);
    } else {
      coord = o.coord;
    };

    if( o.classList.length >= 1 ) { point.classList.add( ...o.classList ) }
    if( o.id !== null ) { point.id = `${o.id}` }

    point.style.stroke = o.stroke;
    point.style.strokeWidth = `${o.strokeWidth}px`;
    point.style.fill = o.fill;
        
    point.setAttribute("cx", coord[0]);
    point.setAttribute("cy", coord[1]);
    point.setAttribute("rx", o.radius);
    point.setAttribute("ry", `${o.radius * aspectRatio}`);
    o.parent.appendChild(point);
    return point;
  };

  this.createText = function(options) {
    const o = {
      coord: [],
      content: "",
      classList: ["svg-text"],
      usePlotCoordinates: true,
      id: null,
      parent: this.SVG,
      color: "rgb(0, 0, 0)",
      fontSize: 5,
      alignment: ["left", "top"],
      ...options
    };
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    let coord;
    if ( o.usePlotCoordinates ) {
      coord = this.coordToPix(...o.coord);
    } else {
      coord = o.coord;
    };

    if( o.classList.length >= 1 ) { text.classList.add( ...o.classList ) }
    if( o.id !== null ) { text.id = `${o.id}` }
    text.style.stroke = "none";
    text.style.fill = o.color;
    text.style.fontSize = `${o.fontSize}px`;
    text.setAttribute("x", `${coord[0]}`);
    text.setAttribute("y", `${coord[1]}`);
    text.textContent = o.content;
    if ( o.alignment[0] === "center" ) { text.style.textAnchor = "middle" }
    else if ( o.alignment[0] === "right" ) { text.style.textAnchor = "end" }
    if ( o.alignment[1] === "center" ) { text.style.transform = `translateY(${o.fontSize / 3}px)` }
    else if ( o.alignment[1] === "top" ) { text.style.transform = `translateY(${5 * o.fontSize / 6}px)` }
    o.parent.appendChild(text);

    const rect = this.SVG.getBoundingClientRect();
    const aspectRatio = rect.height / rect.width;
    text.setAttribute("lengthAdjust", "spacingAndGlyphs");
    let length = text.getComputedTextLength();
    length *= aspectRatio;
    text.setAttribute("textLength", `${length}`);
    return text;
  }

  /***********************/
  /****** DRAW AXES ******/
  /***********************/

  // Create axes group
  const axesGroup = this.createGroup({ classList: ["svg-axes"], parent: this.SVG });
  
  // Create group for each individual axis
  const topGroup = this.createGroup({ classList: ["svg-axis", "top"], parent: axesGroup });
  const bottomGroup = this.createGroup({ classList: ["svg-axis", "bottom"], parent: axesGroup });
  const leftGroup = this.createGroup({ classList: ["svg-axis", "left"], parent: axesGroup });
  const rightGroup = this.createGroup({ classList: ["svg-axis", "right"], parent: axesGroup });
  
  // Add a horizontal/vertical line to each of the groups
  const topAxisLine = this.createLine({
    classList: ["svg-axis-line", "top", "x"],
    coord1: [ 0, 0 ],
    coord2: [ 100, 0 ],
    parent: topGroup,
  });
  const bottomAxisLine = this.createLine({
    classList: ["svg-axis-line", "bottom", "x"],
    coord1: [ 0, 100 ],
    coord2: [ 100, 100 ],
    parent: bottomGroup,
  });
  const leftAxisLine = this.createLine({
    classList: ["svg-axis-line", "left", "y"],
    coord1: [ 0, 0 ],
    coord2: [ 0, 100 ],
    parent: leftGroup,
  });
  const rightAxisLine = this.createLine({
    classList: ["svg-axis-line", "right", "y"],
    coord1: [ 100, 0 ],
    coord2: [ 100, 100 ],
    parent: rightGroup,
  });

  [topAxisLine, bottomAxisLine, leftAxisLine, rightAxisLine].forEach(line => {
    line.style.stroke = "rgb(0, 0, 0)";
    line.style.strokeWidth = `${this.options.axes.axesStrokeWidth}px`;
  });

  // Add a major and minor tick group to each axis group
  [topGroup, bottomGroup, leftGroup, rightGroup].forEach(group => {
    this.createGroup({ classList: ["major", "ticks"], parent: group });
    this.createGroup({ classList: ["minor", "ticks"], parent: group });
  })

  this.redrawAxes = function() {
    // Clear currently existing ticks
    this.tickLabels.innerHTML = "";

    const majorTicksX = ( this.options.axes.x.range[1] - this.options.axes.x.range[0] ) / this.options.axes.x.step;
    const majorTicksY = ( this.options.axes.y.range[1] - this.options.axes.y.range[0] ) / this.options.axes.y.step;

    // Draw left-side y axis
    if ( this.options.axes.y.display[0] ) {
      leftGroup.style.opacity = "1";
      const majorGroup = leftGroup.getElementsByClassName("major")[0]; 
      const minorGroup = leftGroup.getElementsByClassName("minor")[0];
      // Erase the previous ticks
      for(let i = majorGroup.children.length - 1; i >= 0; i--) {
        const elt = majorGroup.children[i];
        elt.remove();
      };
      for(let i = minorGroup.children.length - 1; i >= 0; i--) {
        const elt = minorGroup.children[i];
        elt.remove();
      };
      for ( let i = 0; i <= majorTicksY; i++ ) {
        // For each major tick, create a line
        if ( i > 0 || this.options.axes.y.showZeroLabel ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[0], this.options.axes.y.range[0] + i * this.options.axes.y.step);
          const majorTick = this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0] + this.options.axes.y.majorTickSize,
              majorTickPix[1]
            ],
            parent: majorGroup
          });
          majorTick.style.strokeWidth = `${this.options.axes.y.tickWidth}px`;
          majorTick.style.stroke = "rgb(0, 0, 0)";
          const tickRect = majorTick.getBoundingClientRect();
          const labelText = Number(this.options.axes.y.range[0] + i * this.options.axes.y.step).toFixed(this.options.axes.y.tickLabelPrecision);
          const label = document.createElement("div");
          label.classList.add("tick-label", "y");
          label.innerHTML = labelText;
          label.style.position = "absolute";
          label.style.top = `${tickRect.bottom}px`;
          label.style.left = `${tickRect.left}px`;
          // label.style.fontSize = `${this.options.axes.y.tickLabelFontSize}px`;
          label.style.transform = "translate(calc( -100% - 5px), -50%)";
          this.tickLabels.appendChild(label);
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.y.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0], this.options.axes.y.range[0] + (i + j / (this.options.axes.y.minorTicks + 1)) * this.options.axes.y.step);
          if ( minorTickPix[1] >= 0 ) {
            const minorTick = this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0] + this.options.axes.y.minorTickSize,
                minorTickPix[1]
              ],
              parent: minorGroup
            });
            minorTick.style.strokeWidth = `${this.options.axes.y.tickWidth}px`;
            minorTick.style.stroke = "rgb(0, 0, 0)";
          }
        };
      }
    } else {
      leftGroup.style.opacity = "0";
    };

    // Draw right-side y-axis
    if ( this.options.axes.y.display[1] ) {
      rightGroup.style.opacity = "1";
      const majorGroup = rightGroup.getElementsByClassName("major")[0]; 
      const minorGroup = rightGroup.getElementsByClassName("minor")[0];
      // Erase the previous ticks
      for(let i = majorGroup.children.length - 1; i >= 0; i--) {
        const elt = majorGroup.children[i];
        elt.remove();
      };
      for(let i = minorGroup.children.length - 1; i >= 0; i--) {
        const elt = minorGroup.children[i];
        elt.remove();
      };
      for ( let i = 0; i <= majorTicksY; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[1], this.options.axes.y.range[0] + i * this.options.axes.y.step);
          const majorTick = this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0] - this.options.axes.y.majorTickSize,
              majorTickPix[1]
            ],
            parent: majorGroup
          });
          majorTick.style.strokeWidth = `${this.options.axes.y.tickWidth}px`;
          majorTick.style.stroke = "rgb(0, 0, 0)";
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.y.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[1], this.options.axes.y.range[0] + (i + j / (this.options.axes.y.minorTicks + 1)) * this.options.axes.y.step);
          if ( minorTickPix[1] >= 0 ) {
            const minorTick = this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0] - this.options.axes.y.minorTickSize,
                minorTickPix[1]
              ],
              parent: minorGroup
            });
            minorTick.style.strokeWidth = `${this.options.axes.y.tickWidth}px`;
            minorTick.style.stroke = "rgb(0, 0, 0)";
          }
        };
      }
    } else {
      rightGroup.style.opacity = "0";
    };

    // Draw top-side x-axis
    if ( this.options.axes.x.display[0] ) {
      topGroup.style.opacity = "1";
      const majorGroup = topGroup.getElementsByClassName("major")[0]; 
      const minorGroup = topGroup.getElementsByClassName("minor")[0];
      // Erase the previous ticks
      for(let i = majorGroup.children.length - 1; i >= 0; i--) {
        const elt = majorGroup.children[i];
        elt.remove();
      };
      for(let i = minorGroup.children.length - 1; i >= 0; i--) {
        const elt = minorGroup.children[i];
        elt.remove();
      };
      for ( let i = 0; i <= majorTicksX; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[0] + i * this.options.axes.x.step, this.options.axes.y.range[1]);
          const majorTick = this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0],
              majorTickPix[1] + this.options.axes.x.majorTickSize
            ],
            parent: majorGroup
          });
          majorTick.style.strokeWidth = `${this.options.axes.x.tickWidth}px`;
          majorTick.style.stroke = "rgb(0, 0, 0)";
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.x.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0] + (i + j / (this.options.axes.x.minorTicks + 1)) * this.options.axes.x.step, this.options.axes.y.range[1]);
          if ( minorTickPix[0] <= 100 ) {
            const minorTick = this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0],
                minorTickPix[1] + this.options.axes.x.minorTickSize
              ],
              parent: minorGroup
            });
            minorTick.style.strokeWidth = `${this.options.axes.x.tickWidth}px`;
            minorTick.style.stroke = "rgb(0, 0, 0)";
          }
        };
      }
    } else {
      topGroup.style.opacity = "0";
    };

    // Draw bottom-side x-axis
    if ( this.options.axes.x.display[1] ) {
      bottomGroup.style.opacity = "1";
      const majorGroup = bottomGroup.getElementsByClassName("major")[0]; 
      const minorGroup = bottomGroup.getElementsByClassName("minor")[0];
      // Erase the previous ticks
      for(let i = majorGroup.children.length - 1; i >= 0; i--) {
        const elt = majorGroup.children[i];
        elt.remove();
      };
      for(let i = minorGroup.children.length - 1; i >= 0; i--) {
        const elt = minorGroup.children[i];
        elt.remove();
      };
      for ( let i = 0; i <= majorTicksX; i++ ) {
        // For each major tick, create a line
        if ( i > 0 || this.options.axes.x.showZeroLabel ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[0] + i * this.options.axes.x.step, this.options.axes.y.range[0]);
          const majorTick = this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0],
              majorTickPix[1] - this.options.axes.x.majorTickSize
            ],
            parent: majorGroup
          });
          majorTick.style.strokeWidth = `${this.options.axes.x.tickWidth}px`;
          majorTick.style.stroke = "rgb(0, 0, 0)";
          const tickRect = majorTick.getBoundingClientRect();
          const labelText = Number(this.options.axes.x.range[0] + i * this.options.axes.x.step).toFixed(this.options.axes.x.tickLabelPrecision);
          const label = document.createElement("div");
          label.classList.add("tick-label", "x");
          label.innerHTML = labelText;
          label.style.position = "absolute";
          label.style.top = `${tickRect.bottom}px`;
          label.style.left = `${tickRect.left}px`;
          // label.style.fontSize = `${this.options.axes.x.tickLabelFontSize}px`;
          label.style.transform = "translate(-50%, 5px)";
          this.tickLabels.appendChild(label);
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.x.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0] + (i + j / (this.options.axes.x.minorTicks + 1)) * this.options.axes.x.step, this.options.axes.y.range[0]);
          if ( minorTickPix[0] <= 100 ) {
            const minorTick = this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0],
                minorTickPix[1] - this.options.axes.x.minorTickSize
              ],
              parent: minorGroup
            });
            minorTick.style.strokeWidth = `${this.options.axes.x.tickWidth}px`;
            minorTick.style.stroke = "rgb(0, 0, 0)";
          }
        };
      }
    } else {
      bottomGroup.style.opacity = "0";
    };

    // Draw axes labels
    this.axesLabels.innerHTML = "";

    const yAxisLabel = document.createElement("div");
    yAxisLabel.style.position = "absolute";
    yAxisLabel.style.left = "0px";
    yAxisLabel.style.top = `50%`;
    yAxisLabel.style.transform = "translateX(-50%) rotate(-90deg) translateY(10px) translateX(20px)";
    // yAxisLabel.style.fontSize = `${this.options.axes.y.labelFontSize}px`;
    yAxisLabel.style.whiteSpace = "nowrap";
    yAxisLabel.classList.add("axis-label");
    yAxisLabel.innerHTML = `${this.options.axes.y.labels[0]}`
    this.axesLabels.appendChild(yAxisLabel);

    const xAxisLabel = document.createElement("div");
    xAxisLabel.style.position = "absolute";
    xAxisLabel.style.left = `calc(50% + ${this.options.padding[0][0] / 2.5}px)`;
    xAxisLabel.style.bottom = `0px`;
    xAxisLabel.style.transform = "translateX(-50%)";
    // xAxisLabel.style.fontSize = `${this.options.axes.x.labelFontSize}px`;
    xAxisLabel.style.whiteSpace = "nowrap";
    xAxisLabel.classList.add("axis-label");
    xAxisLabel.innerHTML = `${this.options.axes.x.labels[1]}`
    this.axesLabels.appendChild(xAxisLabel);

    if( this.options.title !== "" ) {
      const plotTitle = document.createElement("div");
      plotTitle.style.position = "absolute";
      plotTitle.style.left = `calc(50% + ${this.options.padding[0][0] / 4}px)`;
      plotTitle.style.top = `0px`;
      plotTitle.style.transform = "translateX(-50%)";
      plotTitle.style.fontSize = `${this.options.titleFontSize}px`;
      plotTitle.style.whiteSpace = "nowrap";
      plotTitle.classList.add("plot-title");
      plotTitle.innerHTML = `${this.options.title}`
      this.axesLabels.appendChild(plotTitle);
    }

  };

  /************************/
  /**** WINDOW RESIZING ***/
  /************************/

  this.resize = () => {
    const width = this.options.parent === document.body ? "500px" : `${this.options.parent.getBoundingClientRect().width}px`;
    const height = this.options.parent === document.body ? "500px" : `${this.options.parent.getBoundingClientRect().height}px`;
    this.container.style.width = `${width}`;
    this.container.style.height = `${height}`;
    this.text.forEach(text => {
      const rect = this.SVG.getBoundingClientRect();
      const aspectRatio = rect.height / rect.width;
      let length = text.getComputedTextLength();
      length *= aspectRatio;
      text.setAttribute("textLength", `${length}`);
    });
    this.redrawAxes();
  };

  window.onresize = this.resize;

  /************************/
  /***** CURVE METHODS ****/
  /************************/

  this.curveGroup = this.createGroup({ classList: ["curves"] });

  this.addCurve = function(func, options) {
    const graph = this;
    
    const opts = {
      stroke: "rgba(0, 0, 0, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: `curve-${graph.curves.length}`,
      classList: ["curve"],
      range: [graph.options.axes.x.range[0], graph.options.axes.x.range[1]],
      ...options
    };

    const curve = {
      ...opts,
      coords: [],
      func: func,
      updateCoords: function() {
        this.coords = [];
        const x0 = this.range[0];
        const x1 = this.range[1];
        const dx = (x1 - x0) / this.resolution;
        for ( let x = x0; x <= x1; x += dx ) {
          const y = this.func(x);
          this.coords.push([x, y]);
        };
        const finalCoord = [x1, func(x1)];
        this.coords.push(finalCoord);
      },
      drawCurve: function() {
        const path = document.getElementById(this.id);
        let coords = [];
        this.coords.forEach(coord => {
          coords.push(graph.coordToPix(...coord));
        });

        path.style.stroke = this.stroke;
        path.style.strokeWidth = `${this.strokeWidth}px`;
        path.style.fill = this.fill;
        
        let d = `M ${coords[0][0]},${coords[0][1]} L`;
        for ( let i = 1; i < coords.length; i++ ) {
          d += ` ${coords[i][0].toFixed(2)},${coords[i][1].toFixed(2)}`;
        };
        path.setAttribute("d", d);
      },
    };

    curve.updateCoords();
    
    const elt = this.createPath({
      coords: curve.coords,
      classList: curve.classList,
      id: curve.id,
      parent: this.curveGroup,
      stroke: curve.stroke,
      strokeWidth: curve.strokeWidth,
      fill: curve.fill,
    });

    curve.elt = elt;

    this.curves.push(curve);
    return curve;
  };


  /********************************/
  /***** FINISH INITIALIZATION ****/
  /********************************/

  this.resize();

};

// This file can be added in the document head, making SVG_Graph() a global variable, or imported as a module, e.g.
// const { Graph } = require("svg-graph-library.js");

if( typeof(window.SVG_Graph) === "undefined" ) {
  module.exports = { SVG_Graph }
}
