const Polyline = require("./Polyline");
const Rect = require("./Rect");
const Line = require("./Line");
const G = require("./G");

class Contact extends G {
  /**
  * @param {object} options - Default options for the contact
  * @property {element} parent - The SVGObject parent (default {element: document.body});
  * @property {string} id - id of the element
  * @property {number[]} translationCoords - [x, y] Translation matrix of the contact (default [0, 0])
  * @property {number} width - width of the contact (viewBox units)
  */
  constructor(options) {
    
    super(options);

    this.width = options.width ?? 7;
    this.height = this.width;

    this.leftSidePoly = new Polyline({
      coords : [
        [- 0.3 * this.width, - 0.45 * this.height ],
        [- 0.5 * this.width, - 0.45 * this.height ],
        [- 0.5 * this.width, 0.45 * this.height ],
        [- 0.3 * this.width, 0.45 * this.height ],
      ]
    });

    this.rightSidePoly = new Polyline({
      coords : [
        [ 0.3 * this.width, - 0.45 * this.height ],
        [ 0.5 * this.width, - 0.45 * this.height ],
        [ 0.5 * this.width, 0.45 * this.height ],
        [ 0.3 * this.width, 0.45 * this.height ],
      ]
    });

    this.contactBGRect = new Rect({
      x : 0,
      y : 0,
      width : this.width,
      height : 0.9 * this.height,
      mode : "center",
      classList : ["contact-BG-rect"]
    });

    this.contactIndicatorRect = new Rect({
      x : 0,
      y : 0,
      width : this.width,
      height : 0.9 * this.height,
      mode : "center",
      classList : ["contact-indicator-rect"]
    });

    this.type = options.type ?? "NO";

    this.on = false;

    this.addChildren([this.contactBGRect, this.leftSidePoly, this.rightSidePoly, this.contactIndicatorRect]);

    switch (this.type) {
      case "NO" :
        this.tooltip({
          content : "normally open contact"
        });
        break;
      case "NC" :
        this.tooltip({
          content : "normally closed contact"
        });
        this.on = true
        this.contactIndicatorRect.addClass("on");
        this.slash = new Line({ coord1 : [- 0.3 * this.width, 0.65 * this.height ], coord2 : [ 0.3 * this.width, - 0.65 * this.height ] })
        this.addChildren([this.slash]);
        break;
    }
  }
}

module.exports = Contact;