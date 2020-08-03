const G = require("./G");
const Line = require("./Line");
const RungNode = require("../RungNode");

/**
 * Creates a new rung. Coordinates are with respect to SVG viewbox.
 */
class Rung extends G {

  constructor(options) {
    super({ ...options, objectName: "g" });

    // this.number = this.parent.rungs.indexOf(this) ?? 0;
    this.number = 0;

    // nodes is a x * y matrix of RungNodes
    this.nodes = [
      new RungNode({
        name : "start terminal",
        isOnLeftSide : true,
        parentRung : this
      }),
      new RungNode({
        name : "wire",
        isOnLeftSide : true,
        parentRung : this
      }),
      new RungNode({
        name : "filler",
        isOnLeftSide : true,
        parentRung : this,
      }),
      new RungNode({
        name : "wire",
        isOnLeftSide : true,
        parentRung : this
      }),
      new RungNode({
        name : "filler",
        isOnLeftSide : true,
        parentRung : this
      }),
      new RungNode({
        name : "start branch",
        isOnLeftSide : true,
        parentRung : this,
      })
    ]

    for ( let i = 0; i < this.nodes.length; i++ ) {
      const node = this.nodes[i];
      node.graphic.setParent(this);
      const index = this.nodes.findIndex(n => n === node);
      let moveRight;
      if ( index % 2 === 0) {
        if ( index === 0 ) { moveRight = 0 } else {
          moveRight = 10 * (index - 2) + 4;
        }
      } else {
        moveRight = 10 * (index - 1);
      }
      node.graphic.translate(moveRight, 0);
    }

    this.translate(5, 5 + this.number * 20);

    this.flatten();

  }

}

module.exports = Rung;