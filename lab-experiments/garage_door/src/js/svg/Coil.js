const Path = require("./Path");
const Ellipse = require("./Ellipse");
const Line = require("./Line");
const G = require("./G");
const Text = require("./Text");

class Coil extends G {
  /**
  * @param {object} options - Default options for the coil
  * @property {element} parent - The SVGObject parent (default {element: document.body});
  * @property {string} id - id of the element
  * @property {number[]} translationCoords - [x, y] Translation matrix of the coil (default [0, 0])
  * @property {number} radius - radius of the coil (viewBox units)
  */
  constructor(options) {
    
    super(options);

    this.radius = options.radius ?? 4;

    this.leftSideArc = new Path({
      commands: [["M", - this.radius / Math.sqrt(2), this.radius / Math.sqrt(2)], ["a", this.radius, this.radius, 0, 0, 1, 0, - 2 * this.radius / Math.sqrt(2)]],
    });

    this.rightSideArc = new Path({
      commands: [["M", this.radius / Math.sqrt(2), - this.radius / Math.sqrt(2)], ["a", this.radius, this.radius, 0, 0, 1, 0, 2 * this.radius / Math.sqrt(2)]],
    });

    this.coilBGCircle = new Ellipse({
      rx : this.radius,
      ry : this.radius,
      classList : ["coil-BG-circle"]
    });

    this.coilIndicatorCircle = new Ellipse({
      rx : this.radius - 0.5,
      ry : this.radius - 0.5,
      classList : ["coil-indicator-circle"]
    });

    this.type = options.type ?? "coil";

    this.on = false;

    this.addChildren([this.coilBGCircle, this.leftSideArc, this.rightSideArc, this.coilIndicatorCircle]);

    switch (this.type) {
      case "coil" :
        this.tooltip({
          content : "coil"
        });
        break;
      case "negated coil" :
        this.on = true
        this.coilIndicatorCircle.addClass("on");
        this.slash = new Line({
          coord1 : [- 0.6 * this.radius, this.radius ],
          coord2 : [ 0.6 * this.radius, - this.radius ]
        });
        this.addChildren([this.slash]);
        this.tooltip({
          content : "negated coil"
        });
        break;
      case "set latch" :
        this.SText = new Text({
          innerText : "S",
          coord : [0, 0.7],
          fontSize : 5.5,
          selectable : false,
        });
        this.addChildren([ this.SText ]);
        this.tooltip({
          content : "set latch"
        });
        break;
      case "reset latch" :
        this.RText = new Text({
          innerText : "R",
          coord : [0, 0.7],
          fontSize : 5.5,
          selectable : false,
        });
        this.addChildren([this.RText]);
        this.tooltip({
          content : "reset latch"
        });
        break;
    }
  }
}

module.exports = Coil;