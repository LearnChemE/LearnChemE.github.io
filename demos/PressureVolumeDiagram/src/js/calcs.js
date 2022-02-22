const { hemholtz, internal_energy, pressure, enthalpy, entropy, Tc, rho_c, R, TPHSV, PTSH } = require("./water_properties.js");

const constant_temperature_lines = [];
const temperatures = [0];

module.exports = { constant_temperature_lines };