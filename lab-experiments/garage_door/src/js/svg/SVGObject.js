const tippy = require("tippy.js").default;
const SHA256 = require("crypto-js/sha256");
const hash = function(str) {return SHA256(str).toString()}

/**
 * Parent class SVG object.
 * @constructor
 * @param {object} options - Default options for the line
 * @property {string} objectName - name of the SVG element, e.g. "path", "rect", "svg", etc.
 * @property {SVGObject || element} parent - The SVGObject to add the line to (default document.body)
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
    this.translationCoords = options.translationCoords ?? [0, 0];

    if(typeof(options.id) == "string") {
      this.id = options.id
    } else {
      this.id = hash( String(Math.random()) ).substring(0, 8);
      this.id = "ID" + this.id;
      while(document.getElementById(this.id) !== null) {
        this.id = hash( String(Math.random()) ).substring(0, 8);
        this.id = "ID" + this.id;
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

    this.hasTooltip = false;
    this.dragProps = {
      isDragging : false,
      ptWidth : 1,
      ptHeight : 1,
      pxWidth : 1,
      pxHeight : 1,
      offsetX : 0,
      offsetY : 0,
      originalNodeListIndex : 0,
    };
    this.translate(this.translationCoords[0], this.translationCoords[1]);

  }

  /**
   * Adds SVGObjects to the group
   * @param {SVGObject[]} children - Array of SVGObjects to be added to G object
   */
  addChildren(children) {
    children.forEach(child => {
      child.parent = this;
      if( !this.children.includes(child) ) {
        this.children.push(child);
      }
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

  /**
   * Adds a class or list of classes to the SVG element
   * @param {string || string[]} classArg
   */
  addClass(classArg) {
    let classList;
    
    if(Array.isArray(classArg)) {
      classList = classArg;
    } else {
      classList = [classArg];
    }

    for(let i = 0; i < classList.length; i++) {
      if(!this.classList.includes(classList[i])) {
        this.classList.push(classList[i]);
      }
      this.element.classList.add(classList[i]);
    }
  }

  /**
   * Removes a class or list of classes from the SVG element
   * @param {string || string[]} classArg
   */
  removeClass(classArg) {
    let classList;

    if(Array.isArray(classArg)) {
      classList = classArg;
    } else {
      classList = [classArg];
    }

    for(let i = 0; i < classList.length; i++) {
      const index = this.classList.indexOf(classList[i]);
      if( index != -1 ) {
        this.classList.splice(index, 1);
      }
      this.element.classList.remove(classList[i]);
    }
  }

  /**
   * See atomiks.github.io/tippyjs/v6/all-props/ for a list of all tooltip properties
   * @param {object} options - default options
   * @property {string} content - content of the tooltip
   * @property {number[]} delay - [delayOnHover, delayOffHover]
   */
  tooltip(options) {
    if(!this.hasTooltip) {
      this.tippyOptions = options.tippyOptions ?? {};
      this.tippyOptions = {
        content : "",
        delay : [500, 100],
        ...options
      }
      this.tippy = tippy(`#${this.id}`, this.tippyOptions);
      this.hasTooltip = true;
    } else {
      this.tippy.setProps({
        ...options
      });
    }
  }

  /**
   * Function to translate the SVGObject
   * @param {number} x - translate along x-axis with respect to viewbox
   * @param {number} y - translate along y-axis with respect to viewbox
   */
  translate(x, y) {
    this.translationCoords = [ x, y ];
    this.element.setAttribute("transform", `translate(${this.translationCoords[0]} ${this.translationCoords[1]})`);
  }

  /**
   * Trigger the drag function when mouse is down
   * @param {object} e - event passed from event listener
   */
  beginDrag(e) {
    const svg = e.target.ownerSVGElement;
    this.dragProps.ptWidth = Number(svg.viewBox.baseVal.width); // Viewbox width (pt)
    this.dragProps.ptHeight = Number(svg.viewBox.baseVal.height); // Viewbox height (pt)
    const rect = svg.getBoundingClientRect();
    this.dragProps.pxWidth = Number(rect.width); // Width of SVG element (px)
    this.dragProps.pxHeight = Number(rect.height); // Height of SVG element (px)
    this.dragProps.offsetX = e.offsetX;
    this.dragProps.offsetY = e.offsetY;
    this.dragProps.isDragging = true;
    this.dragProps.originalNodeListIndex = Array.prototype.indexOf.call(this.parent.element.children, this.element);
    this.element.parentNode.appendChild(this.element);

    if(typeof(this.tippy) !== "undefined") {
      this.tippy[0].hide();
      this.tippy[0].disable();
    }

    this.flatten();
  }

  /**
   * Drag an SVGObject using the cursor
   * @param {object} e - event passed from the event listener
   */
  drag(e) {
    if(this.dragProps.isDragging) {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      const dx = mouseX - this.dragProps.offsetX;
      const dy = mouseY - this.dragProps.offsetY;
      const translateX = dx * (this.dragProps.ptWidth / this.dragProps.pxWidth);
      const translateY = dy * (this.dragProps.ptHeight / this.dragProps.pxHeight);
      this.translate(translateX, translateY);
    }
  }

  /**
   * Called when dragging is ceased
   * @param {object} e - event passed from the event listener
   */
  endDrag(e) {
    this.dragProps.isDragging = false;
    this.element.parentNode.insertBefore(this.element, this.element.parentNode.children[this.dragProps.originalNodeListIndex]);
    if(typeof(this.tippy) !== "undefined") {
      this.tippy[0].enable();
    }
    this.flatten();
  }
}

module.exports = SVGObject;