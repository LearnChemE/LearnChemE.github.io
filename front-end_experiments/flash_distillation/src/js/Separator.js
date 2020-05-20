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
    this.unitImage  = [];
    this.height = [];
    this.width  = [];
    this.states = [];
    this.inputs = [];
    this.n      = [];
    this.dt     = [];
    this.times  = [];
    this.PandID = [];
    this.pauto  = [];
    this.pstpt  = [];
    this.punits = [];
    this.pErrors = [];
    this.pPV = [];
    this.pressureAxes = [];
    this.pressurePlot = [];
    this.pressureLeft = [];
    this.pressureRight = [];
    this.pressureLeftTimes = [];        
    this.pressureRightTimes = [];
    this.pressureLeftLine = [];        
    this.pressureRightLine = [];
    this.pressureController = [];
    this.pressureAuto = [];
    this.lunits = [];
    this.lauto  = [];
    this.lstpt  = [];
    this.lErrors = [];
    this.lPV = [];
    this.levelAxes = [];
    this.levelPlot = [];
    this.levelLeft = [];
    this.levelRight = [];
    this.levelLeftTimes = [];
    this.levelRightTimes = [];
    this.levelLeftLine = [];
    this.levelRightLine = [];
    this.levelController = [];
    this.levelAuto = [];
    this.tunits = [];
    this.tauto  = [];
    this.tstpt  = [];
    this.tErrors = [];
    this.tPV = [];
    this.temperatureAxes = [];
    this.temperaturePlot = [];
    this.temperatureLeft = [];
    this.temperatureRight = [];
    this.temperatureLeftTimes = [];
    this.temperatureRightTimes = [];   
    this.temperatureLeftLine = [];
    this.temperatureRightLine = []; 
    this.temperatureController = [];
    this.temperatureAuto = [];
  }
}

function separator(speed) {
  let obj = new Separator(speed);
  obj.n = 900;
  obj.dt = 1;
  obj.times = [];
  for (let i = 900; i >= 0; i--) {
    obj.times.push(i)
  }
  obj.pErrors = 0;
  obj.tErrors = 0;
  obj.lErrors = 0;
  obj.disturbances = [[], [], []];
  for (let i = 0; i < obj.times.length; i++) {
    obj.disturbances[0].push(NaN);
    obj.disturbances[1].push(NaN);
    obj.disturbances[2].push(NaN);
  }
  obj.pressureLeftTimes = [obj.times, obj.times];
  obj.pressureRightTimes = obj.times;
  obj.pressureLeft = new Array(obj.times.length);
  obj.pressureRight = new Array(obj.times.length);

}

module.exports = separator;