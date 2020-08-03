const Line = require("./svg/Line");
const Polyline = require("./svg/Polyline");
const Coil = require("./svg/Coil");
const Contact = require("./svg/Contact");

class RungNode {
   /**
  * Creates a new rung node
  * @param {object} options - default options
  * @property {string} name -
  * names of connectors: start terminal, end terminal, wire, start branch, end branch;
  * names of variables: coil, negated coil, set latch, reset latch, normally open contact, normally closed contact
  * name of filler: filler
  * @property {boolean} isOnLeftSide -
  * @property {string} operation -
  * for type variables: "input" or "output", depending on whether a variable is read or assigned, respectively
  * for type connector: "and", "begin or", or "end or", depending on whether the name is wire, start branch, or end branch, respectively
  * for type filler: "input" with state true. Acts like an on switch
  * @property {string} type - connector, variable, or filler: this determines the size of the rectangle to which it is assigned
  * @property {boolean} state - true or false
  */
  constructor(options) {
    this.name = options.name ?? null;
    this.parentRung = options.parentRung ?? null;
    // this.xIndex = options.xIndex ?? null;
    // this.yIndex = options.yIndex ?? null;
    this.isOnLeftSide = options.isOnLeftSide ?? null;

    if(this.isOnLeftSide === null) {throw new Error("node must be assigned to left or right side of rung")}
    if(this.parentRung === null) {throw new Error("a parent rung must be assigned to this RungNode")}

    switch(this.name) {

      case "start terminal" :
        this.type = "variable";
        this.state = true;
        this.operation = "input";
        this.graphic = new Line({
          coord1 : [0, -3],
          coord2 : [0, 3],
        });
      break;
      
      case "end terminal" :
        this.type = "variable";
        this.state = true;
        this.operation = "input";
        this.graphic = new Line({
          coord1 : [90, -3],
          coord2 : [90, 3],
        });
      break;

      case "wire" :
        // wires have a length of 2pts
        this.type = "connector";
        this.state = null;
        this.operation = "and";
        this.graphic = new Line({
          coord1 : [0, 0],
          coord2 : [4, 0],
        });
      break;

      case "start branch" : 
        this.type = "connector";
        this.state = null;
        this.operation = "or";
        this.graphic = new Polyline({
          coords : [
            [0, 0],
            [4, 0],
            [2, 0],
            [2, 10],
            [4, 10]
          ]
        });
      break;

      case "end branch" :
        this.type = "connector";
        this.state = null;
        this.operation = "end or";
        this.graphic = new Polyline({
          coords : [
            [0, 0],
            [4, 0],
            [2, 0],
            [2, 10],
            [0, 10]
          ]
        });
      break;

      case "filler" :
        this.type = "filler";
        this.state = true;
        this.operation = "input";
        this.graphic = new Line({
          coord1 : [0, 0],
          coord2 : [16, 0],
        });
    }

    this.graphic.addClass("node");
  }

}

module.exports = RungNode;