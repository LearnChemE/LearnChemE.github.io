const SVGObject = require("./SVGObject");

/** Creates an SVG object for the <svg> element. */
class SVG extends SVGObject {
  /**
  * @constructor
  * @param {object} options - Default options
  * @property {element} parent - The SVGObject parent (default {element: document.body})
  * @property {string} id - Id of the element
  * @property {SVGobject[]} children - The child SVG objects of the group
  * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
  * @property {number[]} viewBox - [0, 0, number, number2] Size of the viewbox (default [0, 0, 100, 100])
  */
  constructor(options) {
    super({ ...options, objectName: "svg" });
    this.viewBox = options.viewBox ?? [0, 0, 100, 20];
    this.element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.element.setAttribute("viewBox", `${this.viewBox[0]} ${this.viewBox[1]} ${this.viewBox[2]} ${this.viewBox[3]}`);

  }

  /**
   * Function to resize the viewbox
   * @param {number} width - third value of viewbox
   * @param {number} height - fourth value of viewbox
   */
  resizeViewbox(width, height) {
    this.viewBox = [ 0, 0, width, height ];
    this.element.setAttribute("viewBox", `${this.viewBox[0]} ${this.viewBox[1]} ${this.viewBox[2]} ${this.viewBox[3]}`);
  }

}

module.exports = SVG;