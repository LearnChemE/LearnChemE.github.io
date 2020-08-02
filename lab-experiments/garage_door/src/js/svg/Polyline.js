const SVGObject = require("./SVGObject");

class Polyline extends SVGObject {
  /**
  * @param {object} options - Default options for the polyline
  * @property {element} parent - The SVGObject parent (default {element: document.body});
  * @property {string} id - id of the element
  * @property {[number, number][]} coords - Multi-dimensional array of coordinate arrays e.g. [[0, 20], [20, 10], ...]
  * @property {number[]} translationCoords - [x, y] Translation matrix of the polyline (default [0, 0])
  * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
  */
  constructor(options) {
    const classList = options.classList ?? ["svg-polyline"];
    super({ ...options, objectName: "polyline", classList: classList });
    this.coords = options.coords ?? [[0, 0], [10, 10]];
    this.draw();
  }

  draw() {
    const coords = this.coords;
    let points = "";
    for(let i = 0; i < coords.length; i++) {
      points += `${coords[i][0]}, ${coords[i][1]} `;
    }
    this.element.setAttribute("points", points);
  }

  setPoints(arr) {
    this.coords = arr;
    this.draw();
  }

  /**
   * Set x and y coordinates to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    for ( let i = 0; i < this.coords.length; i++ ) {
      this.coords[i][0] += this.translationCoords[0];
      this.coords[i][1] += this.translationCoords[1];
    }
    this.draw();
    this.translate( 0, 0 );
  }
}

module.exports = Polyline;