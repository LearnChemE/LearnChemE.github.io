export default function calcAll() {
  const Tb = state.beakerTemperature; // temperature of the beaker - C
  let Vl = state.valvePosition * 15 * 1e-6; // volumetric flow rate - m^3 / s

  const mu = 0.001; // water dynamic viscosity - Pa * s
  const rho = 1000; // water density - kg / m^3
  const w = 0.002; // width of the channel - m
  const g = 9.81; // gravity - m / s^2
  const vAir = state.fanOn ? 0.25 : 0; // velocity of air - m / s
  const Dwa = 0.242 * 1e-4; // diffusivity of water in air - m^2 / s
  const R = 8.314; // ideal gas constant - J / mol * K
  const Dz = 0.014; // height of a single mesh diamond - m
  const Dx = 0.008; // width of a single mesh diamond - m
  const Hvap = 2260000; // heat of vaporization of water - J / kg
  const Mw = 18 * 1e-3; // molecular weight of water - kg / mol
  const Cp = 4184; // specific heat of water - J / kg * K
  const Hp = 0.28; // height of the channel - m
  const Wmesh = 0.28; // width of the mesh - m
  const Nc = Wmesh / Dx; // number of channels - adjustable parameter
  const numRows = Hp / Dz; // number of rows

  const del = (3 * mu * Vl / (rho * g * w * Nc)) ** (1 / 3); // characteristic length - m

  // velocity profile
  const vz = (xHat) => {
    return (g * rho * del ** 2 / (2 * mu)) * (1 - xHat ** 2);
  }

  const vzMax = vz(0); // maximum velocity - m / s
  const Re = (rho * vzMax * del) / mu; // Reynolds number

  const Pr = (T) => {
    return 0.0017 * T ** 2 - 0.276 * T + 12.9; // Prandtl number (approximately)
  }

  const Nu = (T) => {
    return 0.683 * Re ** 0.466 * Pr(T) ** 0.333; // Nusselt number
  }

  const ka = 0.026; // thermal conductivity of air - W / m * K

  const h0 = (T) => {
    // W / (m * K * m) = W / m^2 * K
    return Nu(T) * ka / w; // heat transfer coefficient - W / m^2 * K
  }

  const Pvap = (T) => {
    const mmHg = 10 ** (8.07131 - 1730.63 / (233.426 + T)); // vapor pressure in mmHg
    return mmHg * 133.322; // vapor pressure in Pa
  }

  const phi = 0.3; // relative humidity

  const Pa = Pvap(state.airTemperature); // partial pressure of water in air - Pa

  const Sc = mu / (rho * Dwa); // Schmidt number

  const kg = (T) => {
    // mass transfer coefficient - (m / s) * (mol / J) = (m * mol / J * s)
    return 0.6 * vAir / (Re ** 0.487 * Sc ** (2 / 3) * R * T);
  }

  const kc = 0.6 * Re ** -0.487 * vAir / (Sc ** (2 / 3)); // mass transfer coefficient - m / s

  const Nl = (T) => {
    return kg(T) * (Pvap(T) - phi * Pa); // mass transfer rate - kg / m^2 * s
  }

  const Qs = (T) => {
    // (W / m^2 * K) * m * m * K = W
    return h0(T) * Nc * w * Hp * Dz * (T - state.airTemperature); // heat transfer rate - W
  }

  // (m * mol / J * s) * (kg / mol) * m * m * (kg * m / (s^2 * m^2)) * J / kg
  // = (m^5 * mol * kg^2 * J) / (J * s^3 * mol * m^2 * kg)
  // = m^3 * kg / s^3
  // = W

  const Ql = (T) => {
    return kg(T) * Mw * Nc * w * Hp * Dz * (Pvap(T) - phi * Pa) * Hvap; // latent heat transfer rate per row - W
  }

  if (frameCount % 60 === 0) {

    let T = Tb;
    let qTotal = 0;

    for (let i = 0; i < numRows; i++) {
      const qRow = Qs(T) + Ql(T); // total sensible heat transfer per row
      const M = Vl * rho; // mass flow rate - kg / s
      const dT = qRow / (M * Cp); // temperature change - C

      qTotal += qRow;

      T -= dT;

      if (!state.pumpOn || state.valvePosition === 0) {
        T = 25;
      }

      const topQuarter = round(numRows / 3);
      const bottomQuarter = round(3 * numRows / 4);

      if (i === topQuarter) {
        state.apparatusTargetTemperatureTop = T;
      }

      if (i === bottomQuarter) {
        state.apparatusTargetTemperatureBottom = T
      }
    }

    const adjustmentRate = 0.1;

    if (state.waterOnMesh || state.apparatusTemperatureBottom !== state.airTemperature || state.apparatusTemperatureTop !== state.airTemperature) {
      state.apparatusTemperatureTop += (state.apparatusTargetTemperatureTop - state.apparatusTemperatureTop) * adjustmentRate;
      state.apparatusTemperatureBottom += (state.apparatusTargetTemperatureBottom - state.apparatusTemperatureBottom) * adjustmentRate;
    }

    if (state.reservoirVolume > 0) {
      state.reservoirTemperature += (T - state.reservoirTemperature) * adjustmentRate;
    } else {
      state.reservoirTemperature += (state.airTemperature - state.reservoirTemperature) * adjustmentRate;
    }

    if (state.waterOnMesh) {
      const VBeaker = 4000 * 1e-6;
      const dT = qTotal / (VBeaker * rho * Cp);
      state.beakerTemperature -= dT;
    }
  }
}

// export default function calcAll() {
//   const Tb = state.beakerTemperature; // temperature of the beaker - C
//   const Vl = state.valvePosition * 5; // volumetric flow rate - m^3 / s
//   const rho = 1000; // water density - kg / m^3
//   const Ml = Vl * rho; // mass flow rate - kg / s
//   const vAir = state.fanOn ? 1 : 0; // velocity of air - m / s
//   const numRows = 10;

//   if (frameCount % 60 === 0) {

//     let T = Tb;
//     const Qtotal = 27.4 + 76.6 * Math.exp(0.06 * Vl) - 169 * vAir - 9.1 * Tb - 7.6 * Math.exp(0.11 * Vl) - 112 * vAir ** 2 + 0.2 * Tb ** 2 + 13.7 * vAir * Tb;
//     const QRow = Qtotal / numRows;

//     console.log(Qtotal);
//     for (let i = 0; i < numRows; i++) {

//     }
//   }
// }