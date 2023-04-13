function calcAll() {
  const nonzero_coefficients = [];
  const coefficients_list = Object.keys(gvs.coefficients);
  gvs.individual_p_states_arrays = [];
  gvs.real_component_array = [];
  gvs.imaginary_component_array = [];
  gvs.product_array = [];
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient = gvs.coefficients[coefficients_list[i]];
    const k = coefficient.k;
    const ck = coefficient.ck;
    if(ck !== 0) {
      nonzero_coefficients.push({
        k : k,
        ck : ck,
      });
    }
  }
  // Normalize c_k coefficients
  let ck_total = 0;
  for(let i = 0; i < nonzero_coefficients.length; i++) {
    const coefficient = nonzero_coefficients[i];
    const ck = coefficient.ck;
    ck_total += ck;
  }
  for(let i = 0; i < nonzero_coefficients.length; i++) {
    const coefficient = nonzero_coefficients[i];
    const ck = coefficient.ck / ck_total;
    coefficient.ck = ck;
  }
  const psis = [];
  // Write an array of [x, y] coordinates for each non-zero coefficient
  for(let i = 0; i < nonzero_coefficients.length; i++) {
    const coefficient = nonzero_coefficients[i];
    const k = coefficient.k;
    const psi_i = function(x, t) {
      const exp = k * x * 2 * Math.PI - k**2 * t / gvs.mass;
      let y = math.exp(math.complex(0, exp));
      return y
    }
    psis.push(psi_i);
    const individual_p_states_array = [];
    for(let x = -0.5; x <= 0.5; x += 0.001) {
      const y = psi_i(x, gvs.t);
      individual_p_states_array.push([x, y.re + k])
    }
    gvs.individual_p_states_arrays.push(individual_p_states_array)
  }
  const re = function(x, t) {
    let y = 0;
    for(let i = 0; i < nonzero_coefficients.length; i++) {
      const coefficient = nonzero_coefficients[i];
      const ck = coefficient.ck;
      y += ck * psis[i](x, t).re;
    }
    return y
  }
  const im = function(x, t) {
    let y = 0;
    for(let i = 0; i < nonzero_coefficients.length; i++) {
      const coefficient = nonzero_coefficients[i];
      const ck = coefficient.ck;
      y += ck * psis[i](x, t).im;
    }
    return y
  }
  

  for(let x = -0.5; x <= 0.5; x += 0.001) {
    const y = re(x, gvs.t);
    gvs.real_component_array.push([x, y]);
  }
  for(let x = -0.5; x <= 0.5; x += 0.001) {
    const y = im(x, gvs.t);
    gvs.imaginary_component_array.push([x, y]);
  }

  for(let i = 0; i < gvs.real_component_array.length; i++) {
    const re = gvs.real_component_array[i][1];
    const im = gvs.imaginary_component_array[i][1];
    if(( re > 1 || re < -1 ) && Math.abs(re) > gvs.re_im_max_value) {
      gvs.re_im_max_value = Math.abs(re);
    }
    if(( im > 1 || im < -1 ) && Math.abs(im) > gvs.re_im_max_value) {
      gvs.re_im_max_value = Math.abs(im);
    }
  }
  if(gvs.re_im_max_value > 1) {
    for(let i = 0; i < gvs.real_component_array.length; i++) {
      const re = gvs.real_component_array[i][1] / gvs.re_im_max_value;
      const im = gvs.imaginary_component_array[i][1] / gvs.re_im_max_value;
      gvs.real_component_array[i][1] = re;
      gvs.imaginary_component_array[i][1] = im;
    }
  }

  const temp_product_array = [];
  for(let i = 0; i < gvs.real_component_array.length; i++) {
    const real_component = gvs.real_component_array[i][1];
    const imaginary_component = gvs.imaginary_component_array[i][1];
    const complex_number = math.complex(real_component, imaginary_component);
    const complex_conjugate = math.conj(complex_number);
    const y = Math.abs(math.multiply(complex_number, complex_conjugate).re);
    if(!Number.isNaN(y)) {
      temp_product_array.push(y);
    }
  }

  for(let i = 0; i < temp_product_array.length; i++) {
    if(Math.abs(temp_product_array[i]) > gvs.Psi_max_value) {
      gvs.Psi_max_value = Math.abs(temp_product_array[i])
    }
  }
  
  for(let i = 0; i < temp_product_array.length; i++) {
    const x = gvs.real_component_array[i][0];
    const y = temp_product_array[i];
    if(gvs.Psi_max_value > 1) {
      const corrected = y / gvs.Psi_max_value;
      gvs.product_array.push([x, corrected]);
    } else {
      gvs.product_array.push([x, y]);
    }
  }
}

module.exports = calcAll;