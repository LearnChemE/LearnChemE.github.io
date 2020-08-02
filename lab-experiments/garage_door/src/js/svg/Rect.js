const SVGObject = require("./SVGObject");

/**
 * Creates a rectangle from [x, y] to [x + width, y + height] in default mode, or draws a rectangle centered at [x, y] in "center" mode. Coordinates are with respect to SVG viewbox.
 */
class Rect extends SVGObject {
  /**
   * @param {object} options - Default options for the line
   * @property {element} parent - The SVGObject parent (default {element: document.body});
   * @property {string} id - id of the element
   * @property {number} x - x-coordinate
   * @property {number} y - y-coordinate
   * @property {number} width - width
   * @property {number} height - height
   * @property {string} mode - "default" or "center"
   * @property {number[]} translationCoords - [x, y] Translation matrix of the rect (default [0, 0])
   * @property {string[]} classList - ["string", "string2", ...] List of classes for rect. (default [])} options 
   */
  constructor(options) {
    const classList = options.classList ?? ["svg-line"];
    super({ ...options, objectName: "rect", classList: classList });
    this.x = options.x ?? 10;
    this.y = options.y ?? 10;
    this.width = options.width ?? 10;
    this.height = options.height ?? 10;
    this.mode = options.mode ?? "default";

    if(this.mode === "center") {
      this.element.setAttribute("x", `${this.x - this.width / 2}`);
      this.element.setAttribute("y", `${this.y - this.height / 2}`);
    } else {
      this.element.setAttribute("x", `${this.x}`);
      this.element.setAttribute("y", `${this.y}`);
    }

    this.element.setAttribute("width", `${this.width}`);
    this.element.setAttribute("height", `${this.height}`);
  }

  /**
   * Set x and y coordinates to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    this.x += this.translationCoords[0];
    this.y += this.translationCoords[1];
    if(this.mode === "center") {
      this.element.setAttribute("x", `${this.x - this.width / 2}`);
      this.element.setAttribute("y", `${this.y - this.height / 2}`);
    } else {
      this.element.setAttribute("x", `${this.x}`);
      this.element.setAttribute("y", `${this.y}`);
    }
    this.translate( 0, 0 );
  }
}

module.exports = Rect;