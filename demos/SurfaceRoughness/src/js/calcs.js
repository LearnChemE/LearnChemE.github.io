const { dragCoeff } = require("./dragCoeffs");

window.parameterLabels = {
  velocity : document.getElementById("velocity"),
  Cd : document.getElementById("drag-coefficient"),
  Fd : document.getElementById("drag-force"),
  Re : document.getElementById("reynolds-number"),
}

window.airObj = {
  rho : 1.195, // density of air at 72 F and 1 atm (kg/m^3)
  nu : 15.27e-6, // Air kinematic viscosity at 72 F and 1 atm (m^2 / s)
}

window.ballObj = {
  D : 0.042672, // diameter of a golf ball (m)
  mass : 0.04593, // mass of golf ball (kg)
  v : 70, // ball velocity (m/s) (initial value based on drive of average professional golfer)
  theta : 0.785398, // angle of drive (radians)
  x : 0, // ball x-position
  y : 0, // ball y-position
  vx : 0,
  vy : 0,
  Cd : 0,
  Fd : 0,
  Re : 0,
  colorArray : ["rgb(255, 160, 122)"],
  resetLaunch : function() {
    this.theta = Number(document.getElementById("launch-angle").value);
    this.v = Number(document.getElementById("launch-velocity").value);
    this.x = 0;
    this.y = 0;
    this.vx = this.v * Math.cos( this.theta );
    this.vy = this.v * Math.sin( this.theta );
    window.positionPlot.getData()[1].color = "rgb(0, 0, 0)";
    window.positionPlot.setupGrid(true);
  },
  roughnesses : Object.keys(window.dragCoeffs),
  roughness : "golf ball",
  updateRe : function() { // Reynolds number
    this.Re = ( this.v * this.D / window.airObj.nu );
    if ( this.Re < 50000 ) { this.Re = 50000 }
  },
  updateCd : function() { // Drag coefficient
    this.Cd = dragCoeff( this.roughness, this.Re );
  },
  updateFd : function() { // Drag force, newtons
    // 0.5 * rho * U^2 * A * Cd
    this.Fd = ( 0.5 * window.airObj.rho * Math.pow(this.v, 2) * (Math.PI / 4) * Math.pow(this.D, 2) * this.Cd );
  },
  update : function(dt) {
    const g = 9.81;
    this.updateRe();
    this.updateCd();
    this.updateFd();
    
    window.CdPlotCoord = [this.Re, this.Cd];

    this.theta = Math.atan2( this.vy, this.vx ); // recalculate angle

    this.v -= ( this.Fd / this.mass ) * dt; // apply drag force
    
    this.vx = this.v * Math.cos( this.theta ); // recalculate x velocity
    this.vy = this.v * Math.sin( this.theta ); // recalculate y velocity

    this.vy -= g * dt; // apply gravitational acceleration
    
    this.v = Math.sqrt( Math.pow(this.vx, 2) + Math.pow(this.vy, 2) ); // recalculate velocity

    this.x += this.vx * dt; // update x and y positions
    this.y += this.vy * dt;

    if ( this.x > window.positionPlot.getOptions().xaxes[0].max ) {
      window.positionPlot.getOptions().xaxes[0].max += 100;
    }

    if ( this.y > window.positionPlot.getOptions().yaxes[0].max ) {
      window.positionPlot.getOptions().yaxes[0].max += 50;
    }
  },
  updateDOM : function() {
    window.parameterLabels.velocity.innerHTML = `${Number.parseInt(this.v)}`;
    window.parameterLabels.Cd.innerHTML = `${Number(this.Cd).toFixed(2)}`;
    window.parameterLabels.Fd.innerHTML = `${Number(this.Fd).toFixed(2)}`;
    const exp = Number(this.Re).toExponential(1).replace("e", "&nbsp;x&nbsp10<sup>").concat("</sup>").replace("+", "");
    window.parameterLabels.Re.innerHTML = `${exp}`;
  }
}

window.ballObj.resetLaunch();