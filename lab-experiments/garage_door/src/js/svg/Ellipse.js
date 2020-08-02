const SVGObject = require("./SVGObject");

/**
 * Creates an ellipse at. Coordinates and radius are with respect to SVG viewbox.
 */
class Ellipse extends SVGObject {
  /**
   * @param {object} options - Default options for the ellipse
   * @property {element} parent - The SVGObject parent (default {element: document.body});
   * @property {string} id - id of the element
   * @property {number} rx - radius along x-axis
   * @property {number} ry - radius along y-axis
   * @property {number} cx - x-coordinate of center
   * @property {number} cy - y-coordinate of center
   * @property {number[]} translationCoords - [x, y] Translation matrix of the ellipse (default [0, 0])
   * @property {string[]} classList - ["string", "string2", ...] List of classes for ellipse. (default [])} options 
   */
  constructor(options) {
    const classList = options.classList ?? ["svg-line"];
    super({ ...options, objectName: "ellipse", classList: classList });
    this.rx = options.rx ?? 10;
    this.ry = options.ry ?? 10;
    this.cx = options.cx ?? 0;
    this.cy = options.cy ?? 0;

    this.element.setAttribute("rx", `${this.rx}`);
    this.element.setAttribute("ry", `${this.ry}`);
    this.element.setAttribute("cx", `${this.cx}`);
    this.element.setAttribute("cy", `${this.cy}`);
    
  }

  /**
   * Set x and y coordinates to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    this.cx = this.cx + this.translationCoords[0];
    this.cy = this.cy + this.translationCoords[1];
    this.element.setAttribute("cx", `${this.cx}`);
    this.element.setAttribute("cy", `${this.cy}`);
    this.translate( 0, 0 );
  }
}

module.exports = Ellipse;