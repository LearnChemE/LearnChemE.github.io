const { dragCoeff, dragCoeffs } = require("./dragCoeffs");

window.airObj = {
  rho : 1.195, // density of air at 72 F and 1 atm (kg/m^3)
  nu : 15.27e-6, // Air kinematic viscosity at 72 F and 1 atm (m^2 / s)
}

window.ballObj = {
  D : 0.042672, // diameter of a golf ball (m)
  mass : 0.04593, // mass of golf ball (kg)
  v : 70, // ball velocity (m/s) (initial value based on drive of average professional golfer)
  theta : 0.4, // angle of drive (radians)
  x : 0, // ball x-position
  y : 0, // ball y-position
  vx : 0,
  vy : 0,
  setToDefaults : function() {
    this.v = 70;
    this.theta = 0.4;
    this.x = 0;
    this.y = 0;
    this.vx = this.v * Math.cos( this.theta );
    this.vy = this.v * Math.sin( this.theta );
  },
  roughnesses : Object.keys(dragCoeffs),
  roughness : "golf ball",
  getRe : function() { // Reynolds number
    return ( this.v * this.D / window.airObj.nu )
  },
  getC : function() { // Drag coefficient
    return dragCoeff( this.roughness, this.getRe() )
  },
  getDrag : function() { // Drag force, newtons
    // 0.5 * rho * U^2 * A * Cd
    return ( 0.5 * window.airObj.rho * Math.pow(this.v, 2) * (Math.PI / 4) * Math.pow(this.D, 2) * this.getC() )
  },
  update : function(dt) {
    const g = 9.81;
    
    this.theta = Math.atan2( this.vy, this.vx ); // recalculate angle

    this.v -= ( this.getDrag() / this.mass ) * dt; // apply drag force
    
    this.vx = this.v * Math.cos( this.theta ); // recalculate x velocity
    this.vy = this.v * Math.sin( this.theta ); // recalculate y velocity

    this.vy -= g * dt; // apply gravitational acceleration
    
    this.v = Math.sqrt( Math.pow(this.vx, 2) + Math.pow(this.vy, 2) ); // recalculate velocity

    this.x += this.vx * dt; // update x and y positions
    this.y += this.vy * dt;
  },
}

window.ballObj.setToDefaults();