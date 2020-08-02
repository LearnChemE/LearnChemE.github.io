const SVGObject = require("./SVGObject");

/**
 * Adds text centered at coord = [x, y]
 */
class Text extends SVGObject {
  /**
  * @param {object} options - Default options for the text
  * @property {element} parent - The SVGObject to add the text to (default {element: document.body})
  * @property {string} id - Id of the element
  * @property {string} innerText - Text content
  * @property {number[]} coord - [x, y] viewbox coordinates of the center of the text
  * @property {number} fontSize - 
  * @property {number[]} translationCoords - [x, y] Translation matrix of the g (default [0, 0])
  * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
  */
  constructor(options) {

    super({ ...options, objectName :  "text" });

    this.coord = options.coord ?? [0, 0];
    this.innerText = options.innerText ?? "";
    this.fontSize = options.fontSize ?? 8;

    this.element.setAttribute("x", this.coord[0]);
    this.element.setAttribute("y", this.coord[1]);
    this.element.innerHTML = this.innerText;
    this.element.style.fontSize = typeof(options.fontSize) == "number" ? options.fontSize + "pt" : "8pt";
    this.element.style.textAnchor = "middle";
    
    this.selectable = options.selectable ?? true;
    if(!this.selectable) { this.addClass('no-select') }

    this.element.setAttribute("alignment-baseline", "middle");
    this.element.setAttribute("dominant-baseline", "middle");
  }

  editText(str) {
    this.innerText = str;
    this.element.innerHTML = this.innerText;
  }

  flatten() {
    this.coord[0] += this.translationCoords[0];
    this.coord[1] += this.translationCoords[1];
    this.element.setAttribute("x", this.coord[0]);
    this.element.setAttribute("y", this.coord[1]);
    this.translate(0, 0);
  }
}

module.exports = Text;