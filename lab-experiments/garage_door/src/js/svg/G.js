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
  * @property {boolean} canBeDragged - determines whether the group can be dragged
  * @property {boolean} isDragging - determines if the group is being dragged on initialization
  */
  constructor(options) {
    super({ ...options, objectName: "g" });

    this.canBeDragged = options.canBeDragged ?? false;

    if(this.canBeDragged) {
      this.dragEventInit();
    }
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

  /**
   * Add event listeners for dragging
   */
  dragEventInit() {
    this.element.addEventListener("mousedown", e => { this.beginDrag(e); });
    document.body.addEventListener("mousemove", e => { this.drag(e) });
    this.element.addEventListener("mouseup", e => { this.endDrag(e) });
  }

  /**
   * Spawn a new SVGObject of the same type
   */
  spawn(e) {
    const ClassDef = this.constructor;

    const obj = new ClassDef({
      parent : this.parent,
      translationCoords : this.translationCoords,
      type : this.type,
      canBeDragged : true,      
    });

    obj.beginDrag(e);
  }
}

module.exports = G;