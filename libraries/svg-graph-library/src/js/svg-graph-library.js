/**
 * Creates a new Graph
 * @class
 * @param {object} [options] - object containing all the options for the SVG graph 
 */
function Graph(options) {
  this.options = {
    id: "svg-plot-0",
    classList: ["svg-plot"],
    title: "",
    padding: [[70, 20], [40, 50]],
    parent: document.body,
  };

  this.options = {
    ...this.options,
    ...options
  };

  const xOpts = typeof( options.axes ) === "undefined" ? {} : typeof( options.axes.x ) === "undefined" ? {} : options.axes.x;
  const yOpts = typeof( options.axes ) === "undefined" ? {} : typeof( options.axes.y ) === "undefined" ? {} : options.axes.y;

  this.options.axes = {
    x : {
      labels: ["", "bottom label"],
      display: [true, true],
      range: [0, 1],
      step: 0.25,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelPrecision: 2,
      ...xOpts
    },
    y : {
      labels: ["left label", ""],
      display: [true, true],
      range: [0, 1],
      step: 0.25,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelPrecision: 2,
      ...yOpts
    },
  };

  /***********************************************/
  /****** CREATE CONTAINER AND SVG ELEMENTS ******/
  /***********************************************/
  this.container = document.createElement("div");
  const width = this.options.parent === document.body ? "500px" : "100%";
  const height = this.options.parent === document.body ? "500px" : "100%";
  this.container.style.width = `${width}`;
  this.container.style.height = `${height}`;
  this.container.classList = this.options.classList;
  this.container.id = this.options.id;
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
  this.container.appendChild(this.tickLabels);

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

  this.createLine = function(options) {
    const o = {
      coord1: [0, 0],
      coord2: [10, 10],
      classList: [],
      usePlotCoordinates: false,
      id: null,
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

  // Add a major and minor tick group to each axis group
  [topGroup, bottomGroup, leftGroup, rightGroup].forEach(group => {
    this.createGroup({ classList: ["major", "ticks"], parent: group });
    this.createGroup({ classList: ["minor", "ticks"], parent: group });
    this.createGroup({ classList: ["tick-labels"], parent: group });
  })

  this.redrawAxes = function() {
    // Clear currently existing ticks
    const ticks = this.SVG.getElementsByClassName("ticks");
    for ( let i = 0; i < ticks.length; i++ ) { ticks[i].innerHTML = "" }

    const majorTicksX = ( this.options.axes.x.range[1] - this.options.axes.x.range[0] ) / this.options.axes.x.step;
    const majorTicksY = ( this.options.axes.y.range[1] - this.options.axes.y.range[0] ) / this.options.axes.y.step;

    // Draw left-side y axis
    if ( this.options.axes.y.display[0] ) {
      leftGroup.style.opacity = "1";
      const majorGroup = leftGroup.getElementsByClassName("major")[0]; 
      const minorGroup = leftGroup.getElementsByClassName("minor")[0];
      const labelGroup = leftGroup.getElementsByClassName("tick-labels")[0];
      for ( let i = 0; i <= majorTicksY; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
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
         
          const tickRect = majorTick.getBoundingClientRect();
          const labelText = Number(this.options.axes.y.range[0] + i * this.options.axes.y.step).toFixed(this.options.axes.y.tickLabelPrecision);
          const label = document.createElement("div");
          label.classList.add("tick-label", "y");
          label.innerHTML = labelText;
          label.style.top = `${tickRect.bottom}px`;
          label.style.left = `${tickRect.left}px`;
          this.tickLabels.appendChild(label);
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.y.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0], this.options.axes.y.range[0] + (i + j / (this.options.axes.y.minorTicks + 1)) * this.options.axes.y.step);
          if ( minorTickPix[1] >= 0 ) {
            this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0] + this.options.axes.y.minorTickSize,
                minorTickPix[1]
              ],
              parent: minorGroup
            });
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
      for ( let i = 0; i <= majorTicksY; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[1], this.options.axes.y.range[0] + i * this.options.axes.y.step);
          this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0] - this.options.axes.y.majorTickSize,
              majorTickPix[1]
            ],
            parent: majorGroup
          });
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.y.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[1], this.options.axes.y.range[0] + (i + j / (this.options.axes.y.minorTicks + 1)) * this.options.axes.y.step);
          if ( minorTickPix[1] >= 0 ) {
            this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0] - this.options.axes.y.minorTickSize,
                minorTickPix[1]
              ],
              parent: minorGroup
            });
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
      for ( let i = 0; i <= majorTicksX; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
          const majorTickPix = this.coordToPix(this.options.axes.x.range[0] + i * this.options.axes.x.step, this.options.axes.y.range[1]);
          this.createLine({
            classList: ["major-tick"],
            coord1: majorTickPix,
            coord2: [
              majorTickPix[0],
              majorTickPix[1] + this.options.axes.x.majorTickSize
            ],
            parent: majorGroup
          });
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.x.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0] + (i + j / (this.options.axes.x.minorTicks + 1)) * this.options.axes.x.step, this.options.axes.y.range[1]);
          if ( minorTickPix[0] <= 100 ) {
            this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0],
                minorTickPix[1] + this.options.axes.x.minorTickSize
              ],
              parent: minorGroup
            });
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

      for ( let i = 0; i <= majorTicksX; i++ ) {
        // For each major tick, create a line
        if ( i > 0 ) {
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
          const tickRect = majorTick.getBoundingClientRect();
          const labelText = Number(this.options.axes.x.range[0] + i * this.options.axes.x.step).toFixed(this.options.axes.x.tickLabelPrecision);
          const label = document.createElement("div");
          label.classList.add("tick-label", "x");
          label.innerHTML = labelText;
          label.style.top = `${tickRect.bottom}px`;
          label.style.left = `${tickRect.left}px`;
          this.tickLabels.appendChild(label);
        };
        // For each major tick, create the number of minor ticks specified between each major tick
        for ( let j = 1; j <= this.options.axes.x.minorTicks; j++ ) {
          const minorTickPix = this.coordToPix(this.options.axes.x.range[0] + (i + j / (this.options.axes.x.minorTicks + 1)) * this.options.axes.x.step, this.options.axes.y.range[0]);
          if ( minorTickPix[0] <= 100 ) {
            this.createLine({
              classList: ["minor-tick"],
              coord1: minorTickPix,
              coord2: [
                minorTickPix[0],
                minorTickPix[1] - this.options.axes.x.minorTickSize
              ],
              parent: minorGroup
            });
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
    yAxisLabel.style.transform = "rotate(-90deg) translateX(50%) translateY(-100%)";
    yAxisLabel.classList.add("axis-label");
    yAxisLabel.innerHTML = `${this.options.axes.y.labels[0]}`
    this.axesLabels.appendChild(yAxisLabel);

    const xAxisLabel = document.createElement("div");
    xAxisLabel.style.position = "absolute";
    xAxisLabel.style.left = `calc(50% + ${this.options.padding[0][0] / 2.5}px)`;
    xAxisLabel.style.bottom = `0px`;
    xAxisLabel.style.transform = "translateX(-50%)";
    xAxisLabel.classList.add("axis-label");
    xAxisLabel.innerHTML = `${this.options.axes.x.labels[1]}`
    this.axesLabels.appendChild(xAxisLabel);

    if( this.options.title !== "" ) {
      const plotTitle = document.createElement("div");
      plotTitle.style.position = "absolute";
      plotTitle.style.left = `calc(50% + ${this.options.padding[0][0] / 4}px)`;
      plotTitle.style.top = `0px`;
      plotTitle.style.transform = "translateX(-50%)";
      plotTitle.classList.add("plot-title");
      plotTitle.innerHTML = `${this.options.title}`
      this.axesLabels.appendChild(plotTitle);
    }

    console.log("k");

  };

  window.onresize = () => { this.redrawAxes() };

  this.redrawAxes();

  console.log(this);
};

module.exports = { Graph }