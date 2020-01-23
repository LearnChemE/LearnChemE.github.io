function ndsolve(f, x0, dt, tmax) {
    const n = f.size()[0]  // Number of variables
    const x = x0.clone()   // Current values of variables
    const dxdt = []        // Temporary variable to hold time-derivatives
    const result = []      // Contains entire solution

    const nsteps = math.divide(tmax, dt)   // Number of time steps
    for(let i=0; i<nsteps; i++) {
      // Compute derivatives
      for(let j=0; j<n; j++) {
        dxdt[j] = f.get([j]).apply(null, x.toArray())
      }
      // Euler method to compute next time step
      for(let j=0; j<n; j++) {
        x.set([j], math.add(x.get([j]), math.multiply(dxdt[j], dt)))
      }
      result.push(x.clone())
    }

    return math.matrix(result)
  }