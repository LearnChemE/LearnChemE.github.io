const SVGObject = require("./SVGObject");

class Path extends SVGObject {
  /**
  * @param {object} options - Default options for the path
  * @property {element} parent - The SVGObject parent (default {element: document.body});
  * @property {string} id - id of the element
  * @property {*[][]} commands - Multi-dimensional array of path commands e.g. [["M", 20, 20], ["A", 20, 20, 0, 0]]. See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d for more information.
  * @property {number[]} translationCoords - [x, y] Translation matrix of the path (default [0, 0])
  * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
  */
  constructor(options) {
    const classList = options.classList ?? ["svg-line"];
    super({ ...options, objectName: "path", classList: classList });
    this.commands = options.commands ?? [["M", 0, 0], ["l", 10, 0]];
    this.drawPath();
  }

  drawPath() {
    let path = '';
    const commands = this.commands;
    for(let i = 0; i < commands.length; i++) {
      const type = commands[i][0];
      if(["M", "m", "L", "l"].includes(type)) {
        path += `${type} ${commands[i][1]},${commands[i][2]}`;
      } else if(["A", "a"].includes(type)) {
        path += `${type} ${commands[i][1]} ${commands[i][2]} ${commands[i][3]} ${commands[i][4]} ${commands[i][5]} ${commands[i][6]},${commands[i][7]}`;
      }
    }
    this.element.setAttribute("d", path);
  }

  /**
   * Set x and y coordinates to their translated location, set translationCoords to [0, 0]
   */
  flatten() {
    if(this.commands[0][0].toLowerCase() == "m") {
      this.commands[0][1] += this.translationCoords[0];
      this.commands[0][2] += this.translationCoords[1];
    }
    this.drawPath();
    this.translate( 0, 0 );
  }
}

module.exports = Path;