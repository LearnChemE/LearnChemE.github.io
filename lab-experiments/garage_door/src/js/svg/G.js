const SVGObject = require("./SVGObject");

/**
 * Creates a group SVG object. Coordinates are with respect to SVG viewbox.
 */
class G extends SVGObject {
  /**
  * @param {object} options - Default options for the line
  * @property {element} parent - The SVGObject to add the g to (default {element: document.body})
  * @property {string} id - Id of the element
  * @property {SVGobject[]} children - The child SVGObjects of the group
  * @property {number[]} translationCoords - [x, y] Translation matrix of the g (default [0, 0])
  * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
  */
  constructor(options) {
    super({ ...options, objectName: "g" });
    this.translationCoords = options.translationCoords ?? [ 0, 0 ];
    this.element.setAttribute("transform", `translate(${this.translationCoords[0]} ${this.translationCoords[1]})`);
  }

  /**
   * Function to translate the group
   * @param {number} x - translate line along x-axis with respect to viewbox
   * @param {number} y - translate line along y-axis with respect to viewbox
   */
  translate(x, y) {
    this.translationCoords = [ x, y ];
    this.element.setAttribute("transform", `translate(${this.translationCoords[0]} ${this.translationCoords[1]})`);
  }

  /**
   * Set x and y coordinates of all children to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    if(this.children.length > 0) {
      this.children.forEach(child => {
        child.flatten();
        child.translate(this.translationCoords[0], this.translationCoords[1]);
        child.flatten();
      })
    }
    this.translate( 0, 0 );
  }
}

module.exports = G;