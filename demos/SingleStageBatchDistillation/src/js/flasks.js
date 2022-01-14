const top_of_liquid_color = gvs.p.color(170, 170, 255);
const coolant_color = gvs.p.color(240, 240, 255);
const liquid_color = gvs.p.color(200, 200, 255);

function Flask(args) {
  this.n = 0;
  this.x = 0; // mole fraction of more volatile component
  this.x_loc = 0 || args.x_loc; // x location (pixels)
  this.y_loc = 0 || args.y_loc; // y location (pixels)

  // Add a number of moles (amt) of a liquid of composition x (comp) to the flask
  this.add = function(amt, comp) {
    let vol_component = this.n * this.x; // original amount of more volatile component
    vol_component += amt * comp; // add some more of the volatile component
    this.n += amt; // total amount is increased
    this.x = vol_component / this.n; // composition in flask is updated
  }

  this.draw = function() {
    const p = gvs.p;
    const x = this.x_loc;
    const y = this.y_loc;
    const lvl = this.n * 4;
    if(lvl >= 0.15) {
      // Draw the liquid inside the flask first, so outline is drawn over top
      p.push();
      p.fill(liquid_color);
      p.noStroke();
      p.beginShape();
      p.curveVertex(-28 + x + ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.curveVertex(-28 + x + ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.curveVertex(-28 + x + ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.curveVertex(-28 + x, y - 5);
      p.curveVertex(-30 + x, y);
      p.curveVertex(-27 + x, y + 5);
      p.curveVertex(x, y + 8);
      p.curveVertex(x + 27, y + 5);
      p.curveVertex(x + 30, y);
      p.curveVertex(28 + x, y - 5);
      p.curveVertex(28 + x - ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.curveVertex(28 + x - ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.curveVertex(28 + x - ((1.4 * lvl - 0.4) * 18), y - 5 - ((1.4 * lvl - 0.4) * 43));
      p.endShape();
      p.stroke(0);
      p.fill(top_of_liquid_color);
      p.ellipse(x, y - 5 - (1.4 * lvl - 0.4) * 43, Math.min(59, 58 - 42 * (1.4 * lvl - 0.4)), 1 + 2 * (1 - lvl));
      p.pop();
    } else {
      // When liquid level gets low, an ellipse is used to represent the liquid in the flask
      p.push();
      p.fill(top_of_liquid_color);
      p.ellipse(x, y + 4, 60 - (0.15 - lvl) * (60 / 0.15), 5 - 5 * (0.15 - lvl) / 0.15);
      p.pop();
    }
  
    // Now to draw the flask itself
    p.push();
    p.noFill();
    p.beginShape();
    p.vertex(-8 + x, y - 50);
    p.curveVertex(-8 + x, y - 50);
    p.curveVertex(-28 + x, y - 5);
    p.curveVertex(-30 + x, y);
    p.curveVertex(-27 + x, y + 5);
    p.curveVertex(x, y + 8);
    p.curveVertex(x + 27, y + 5);
    p.curveVertex(x + 30, y);
    p.curveVertex(28 + x, y - 5);
    p.curveVertex(8 + x, y - 50);
    p.vertex(8 + x, y - 50);
    p.endShape();
    p.rectMode(p.CORNER);
    p.noStroke();
    p.rect(-7 + x, y - 50, 14, -20);
    p.strokeWeight(1);
    p.stroke(0);
    p.line(-8 + x, y - 50, -8 + x, y - 70);
    p.line(8 + x, y - 50, 8 + x, y - 70);
    p.rectMode(p.CENTER);
    p.rect(x, y - 73, 22, 5, 3);
  
    p.pop();

    p.push();
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text(`${this.n.toFixed(2)} mol`, this.x_loc, this.y_loc + 24);
    p.text(`x  = ${this.x.toFixed(2)}`, this.x_loc, this.y_loc + 39);
    p.textSize(8);
    p.text("B", this.x_loc - 17, this.y_loc + 42);
    p.pop();
  }
}

module.exports = Flask;