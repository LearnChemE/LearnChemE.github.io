class Separator {
  constructor() {
    this.disturbances = [];
    this.time = [];
    this.saveSnap = [];
    this.liq = [];
    this.gas = [];
    this.disturbanceController = [];
    this.pspan = [];
    for (let i = 0; i <= 120; i++) {
      this.pspan.push(i);
    }
    this.k = [];
    this.unitFigure = [];
    this.unitImage = [];
    
  }
}

module.exports = Separator;