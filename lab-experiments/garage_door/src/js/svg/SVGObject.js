/**
 * Parent class SVG object.
 * @constructor
 * @param {object} options - Default options for the line
 * @property {string} objectName - name of the SVG element, e.g. "path", "rect", "svg", etc.
 * @property {element} parent - The SVGObject to add the line to (default document.body)
 * @property {string} id - Id of the element
 * @property {SVGobject[]} children - The child SVGObjects of the group
 * @property {string[]} classList - ["string", "string2", ...] List of classes for line. (default [])
 */
class SVGObject {
  constructor(options) {
    
    this.objectName = options.objectName ?? undefined;
    this.classList = options.classList ?? [];
    this.parent = options.parent ?? {element: document.body};
    this.children = options.children ?? [];

    if(typeof(options.id) == "string") {
      this.id = options.id
    } else {
      this.id = String(Math.random());
      while(document.getElementById(this.id) !== null) {
        this.id = String(Math.random());
      }
    }

    if(typeof(this.objectName) === "string") {
      this.element = document.createElementNS("http://www.w3.org/2000/svg", this.objectName);
      if(this.classList.length > 0) { this.element.classList.add(...this.classList) };
      if(this.parent.element !== document.body) {
        this.parent.addChildren([this]);
      } else {
        this.parent.element.appendChild(this.element);
      }
      if(this.children.length > 0) { 
        this.children.forEach(child => {
          child.parent = this;
          this.element.appendChild(child.element);
        });
      }
      this.element.setAttribute("id", `${this.id}`);
    }
  }

  /**
   * Adds SVGObjects to the group
   * @param {SVGObject[]} children - Array of SVGObjects to be added to G object
   */
  addChildren(children) {
    children.forEach(child => {
      child.parent = this;
      this.element.appendChild(child.element);
    })
  }

  /**
   * Sets parent SVGObject
   * @param {SVGObject} parent - An SVGObject to be the parent
   */
  setParent(parent) {
    this.parent = parent;
    this.parent.addChildren([this]);
  }
}

module.exports = SVGObject;