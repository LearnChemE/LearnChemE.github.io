
/**
 * @typedef {Object} ViscosityModelBase
 * @property {"Newtonian" | "Power Law" | "Herschel-Bulkley"} name - The name of the viscosity model.
 */

/**
 * @typedef {ViscosityModelBase & { value: number }} NewtonianModel
 */

/**
 * @typedef {ViscosityModelBase & { consistencyIndex: number, flowBehaviorIndex: number }} PowerLawModel
 */

/**
 * @typedef {ViscosityModelBase & { yieldStress: number, consistencyIndex: number, flowBehaviorIndex: number }} HerschelBulkleyModel
 */

/**
 * @typedef {NewtonianModel | PowerLawModel | HerschelBulkleyModel} ViscosityModel
 */

/**
 * @typedef {Object} Fluid
 * @property {string} name - The name of the fluid.
 * @property {number} density - The density of the fluid in kg/m^3.
 * @property {ViscosityModel} viscosity - The viscosity model of the fluid.
 */

const fluids = [
  {
    name: "water",
    color: "#00a7de88",
    density: 0.997, // g/mL
    viscosity: {
      name: "Newtonian",
      value: 0.0089 // Pa·s
    },
  },
  {
    name: "ketchup",
    color: "#b10000",
    density: 1.11, // g/mL
    viscosity: {
      name: "Power Law",
      consistencyIndex: 19.34,
      flowBehaviorIndex: 0.228
    },
  },
  {
    name: "cornstarch",
    color: "#7dbae0c4",
    density: 1.2, // g/mL
    viscosity: {
      name: "Power Law",
      consistencyIndex: 0.399,
      flowBehaviorIndex: 1.15
    },
  },
  {
    name: "mayo",
    color: "#d5d558",
    density: 0.91, // g/mL
    viscosity: {
      name: "Herschel-Bulkley",
      yieldStress: 78.8, // Pa
      consistencyIndex: 71.3, // Pa·s^n
      flowBehaviorIndex: 0.3
    },
  },
  {
    name: "toothepaste",
    color: "#00ff77",
    density: 1.3, // g/mL
    viscosity: {
      name: "Herschel-Bulkley",
      yieldStress: 92, // Pa
      consistencyIndex: 0.55, // Pa·s^n
      flowBehaviorIndex: 0.78
    },
  }
];

export function getFluidProperties(fluidName) {
  const fluid = fluids.find((f) => f.name === fluidName);
  if (!fluid) {
    throw new Error(`Fluid with name "${fluidName}" not found.`);
  }
  return fluid;
}

export function calculateViscosity(fluid, shearRate) {
  const { viscosity } = fluid;

  switch (viscosity.name) {
    case "Newtonian":
      return viscosity.value; // Pa·s

    case "Power Law":
      return viscosity.consistencyIndex * Math.pow(shearRate, viscosity.flowBehaviorIndex); // Pa·s

    case "Herschel-Bulkley":
      if (shearRate === 0) {
        return Infinity; // No flow below yield stress
      }
      return (viscosity.yieldStress / shearRate) + viscosity.consistencyIndex * Math.pow(shearRate, viscosity.flowBehaviorIndex); // Pa·s

    default:
      throw new Error(`Unknown viscosity model: ${viscosity.name}`);
  }
}

export default fluids;