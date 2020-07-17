const SVGObject = require("./SVGObject");

/**
 * Creates a line between coord1 and coord2. Coordinates are with respect to SVG viewbox.
 */
class Line extends SVGObject {
  /**
   * @param {object} options - Default options for the line
   * @property {element} parent - The SVGObject parent (default {element: document.body});
   * @property {string} id - id of the element
   * @property {number[]} coord1 - [x1, y1] Start coordinate of the line (default [0, 0])
   * @property {number[]} coord2 - [x2, y2] End coordinate of the line (default [10, 10])
   * @property {number[]} translationCoords - [x, y] Translation matrix of the line (default [0, 0])
   * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])} options 
   */
  constructor(options) {
    const classList = options.classList ?? ["svg-line"];
    super({ ...options, objectName: "line", classList: classList });
    this.coord1 = options.coord1 ?? [ 0, 0 ];
    this.coord2 = options.coord2 ?? [ 10, 10 ];
    this.translationCoords = options.translationCoords ?? [ 0, 0 ];
    this.element.setAttribute("id", `${this.id}`);
    this.element.setAttribute("x1", `${this.coord1[0]}`);
    this.element.setAttribute("y1", `${this.coord1[1]}`);
    this.element.setAttribute("x2", `${this.coord2[0]}`);
    this.element.setAttribute("y2", `${this.coord2[1]}`);
    this.element.setAttribute("transform", `translate(${this.translationCoords[0]} ${this.translationCoords[1]})`);
  }

  /**
   * Function to translate the line
   * @param {number} x - translate line along x-axis with respect to viewbox
   * @param {number} y - translate line along y-axis with respect to viewbox
   */
  translate(x, y) {
    this.translationCoords = [ x, y ];
    this.element.setAttribute("transform", `translate(${this.translationCoords[0]} ${this.translationCoords[1]})`);
  }

  /**
   * Set x and y coordinates to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    this.coord1 = [
      this.coord1[0] + this.translationCoords[0],
      this.coord1[1] + this.translationCoords[1]
    ];
    this.coord2 = [
      this.coord2[0] + this.translationCoords[0],
      this.coord2[1] + this.translationCoords[1]
    ];
    this.element.setAttribute("x1", `${this.coord1[0]}`);
    this.element.setAttribute("y1", `${this.coord1[1]}`);
    this.element.setAttribute("x2", `${this.coord2[0]}`);
    this.element.setAttribute("y2", `${this.coord2[1]}`);
    this.translate( 0, 0 );
  }
}

module.exports = Line;