function ndsolve(f, x0, dt, tmax) {
  const n = f.size()[0] // Number of variables
  const x = x0.clone() // Current values of variables
  const dxdt = [] // Temporary variable to hold time-derivatives
  const result = [] // Contains entire solution

  const nsteps = math.divide(tmax, dt) // Number of time steps
  for (let i = 0; i < nsteps; i++) {
    // Compute derivatives
    for (let j = 0; j < n; j++) {
      dxdt[j] = f.get([j]).apply(null, x.toArray())
    }
    // Euler method to compute next time step
    for (let j = 0; j < n; j++) {
      x.set([j], math.add(x.get([j]), math.multiply(dxdt[j], dt)))
    }
    result.push(x.clone())
  }

  return math.matrix(result)
}

function rangeSolve(f, yi, dt, tmax, tinitial) {
  const n = f.length; // Number of variables
  let y = [yi]; // Current values of variables
  const nsteps = Math.ceil(tmax / dt); // Number of time steps
  let t0 = tinitial || 0;

  for (let i = 0; i < nsteps; i++) {
    let k1 = [];
    let k2 = [];
    let k3 = [];
    let k4 = [];
    let y0 = y[y.length - 1];
    let y1 = [];
    let y2 = [];
    let y3 = [];
    let yf = [];
    for (let j = 0; j < n; j++) {
      const f1 = f[j].apply(null, y0);
      k1.push(f1);
      y1.push(y0[j] + k1[j] * dt / 2);
    }
    for (let j = 0; j < n; j++) {
      const f2 = f[j].apply(null, y1);
      k2.push(f2);
      y2.push(y0[j] + k2[j] * dt / 2);
    }
    for (let j = 0; j < n; j++) {
      const f3 = f[j].apply(null, y2);
      k3.push(f3);
      y3.push(y0[j] + k3[j] * dt);
    }
    for (let j = 0; j < n; j++) {
      const f4 = f[j].apply(null, y3);
      k4.push(f4);
      yf.push(y0[j] + dt * (1 / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    }
    y.push(yf);
  }
  let result = [];

  for (let i = 0; i < n; i++) {
    result.push([]);
    for (let j = 0; j < nsteps; j++) {
      result[i].push([t0 + tmax * j / nsteps, y[j][i]]);
    }
  }
  return result;
}

// this was specifically made for a stiff equation in the "Selectivity in a Semi-Batch Reactor" demonstration.
// The 'stiffness parameter' is a variable called "unstable".  When the absolute value of the derivative is greater than 10,
// it halves the step size of the integration.  I chose 10 because in that demonstration, 10 mol/min are being added and therefore
// the number of moles changing per minute can never exceed 10.
class RangeSolve2 {
  constructor(args) {
    this.f = args["f"];
    this.yi = args["yi"];
    this.y = this.yi;
    this.dt = args["dt"];
    this.tmax = args["tfinal"];
    this.tinitial = args["tinitial"];
    this.t = this.tinitial;
    this.n = this.f.length;
  }

  findDerivative(f, yi, dt) {
    let d = []; // Current values of variables
    const n = f.length;
    let k1 = [];
    let k2 = [];
    let k3 = [];
    let k4 = [];
    let y0 = yi;
    let y1 = [];
    let y2 = [];
    let y3 = [];
    for (let j = 0; j < n; j++) {
      const f1 = f[j].apply(null, y0);
      k1.push(f1);
      y1.push(y0[j] + k1[j] * dt / 2);
    }
    for (let j = 0; j < n; j++) {
      const f2 = f[j].apply(null, y1);
      k2.push(f2);
      y2.push(y0[j] + k2[j] * dt / 2);
    }
    for (let j = 0; j < n; j++) {
      const f3 = f[j].apply(null, y2);
      k3.push(f3);
      y3.push(y0[j] + k3[j] * dt);
    }
    for (let j = 0; j < n; j++) {
      const f4 = f[j].apply(null, y3);
      k4.push(f4);
      d.push((1 / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    }
    return d;
  }

  calcAll() {
    this.t = this.tinitial;
    this.y = this.yi;
    let y = [];

    //initialize array with [[t0, yA0], [t0, yB0], ...]
    for(let j = 0; j < this.n; j++) {
      y.push([[this.tinitial, this.y[j]]]);
    }

    //if the derivative is larger than possible, it is unstable
    const unstable = (elt) => Math.abs(elt) > 10;
    
    while(this.t < this.tmax) {
      //find current derivatives with default step size
      let d = this.findDerivative(this.f, this.y, this.dt);
      //if it is unstable, halve the step size until stable
      let dt = this.dt;
      while(d.some(unstable)) {
        dt /= 2;
        d = this.findDerivative(this.f, this.y, dt);
      }
      //finally, increment to current time
      this.t += dt;
      for(let j = 0; j < this.n; j++) {
        //add the derivative times the step size to the current value of y (this.y)
        this.y[j] += d[j] * dt;
        //push the current time and new y value to the array called "y"
        y[j].push([this.t, this.y[j]]);
      }
    }
    return y;
  }
}