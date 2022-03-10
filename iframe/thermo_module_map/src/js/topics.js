gvs.topics = {
    "thermal effects in chemical reactions": {
        topics_to_learn_beforehand: ["gas-phase chemical equilibrium", "first law - closed systems"],
        topics_to_learn_afterwards: [],
    },
    "heterogeneous chemical equilibrium": {
        topics_to_learn_beforehand: ["material balances"],
        topics_to_learn_afterwards: [],
    },
    "Clapeyron, Clausius-Clapeyron, and Antoine equations": {
        topics_to_learn_beforehand: ["single-component phase diagrams"],
        topics_to_learn_afterwards: ["Raoult's law and VLE"],
    },
    "gas-phase chemical equilibrium": {
        topics_to_learn_beforehand: ["fugacities of mixtures"],
        topics_to_learn_afterwards: ["heterogeneous chemical equilibrium"],
    },
    "partial molar quantities": {
        topics_to_learn_beforehand: ["vapor-liquid equilibrium for non-ideal solutions"],
        topics_to_learn_afterwards: ["chemical potential"],
    },
    "partially-miscible liquids phase diagrams": {
        topics_to_learn_beforehand: ["vapor-liquid equilibrium for non-ideal solutions"],
        topics_to_learn_afterwards: ["ternary liquids phase diagrams", "immiscible liquids phase diagrams"],
    },
    "immiscible liquids phase diagrams": {
        topics_to_learn_beforehand: ["partially-miscible liquids phase diagrams", "single-component phase diagrams"],
        topics_to_learn_afterwards: ["solid-solid liquid phase diagrams"],
    },
    "solid-solid liquid phase diagrams": {
        topics_to_learn_beforehand: ["immiscible liquids phase diagrams", "lever rule"],
        topics_to_learn_afterwards: [],
    },
    "multi-component phase equilibrium": {
        topics_to_learn_beforehand: ["material balances", "single-component phase properties", "lever rule"],
        topics_to_learn_afterwards: ["fugacities of mixtures"],
    },
    "fugacities of mixtures": {
        topics_to_learn_beforehand: ["multi-component phase equilibrium", "fugacity of a single component"],
        topics_to_learn_afterwards: ["gas-phase chemical equilibrium", "Raoult's law and VLE"],
    },
    "Raoult's law and VLE": {
        topics_to_learn_beforehand: ["fugacities of mixtures", "Clapeyron, Clausius-Clapeyron, and Antoine equations"],
        topics_to_learn_afterwards: ["flash separations", "vapor-liquid equilibrium for non-ideal solutions"],
    },
    "vapor-liquid equilibrium for non-ideal solutions": {
        topics_to_learn_beforehand: ["Raoult's law and VLE"],
        topics_to_learn_afterwards: ["partial molar quantities", "using a cubic equation of state to determine VLE"],
    },
    "ternary liquids phase diagrams": {
        topics_to_learn_beforehand: ["partially-miscible liquids phase diagrams"],
        topics_to_learn_afterwards: ["Hunter-Nash method for liquid-liquid extraction"],
    },
    "Hunter-Nash method for liquid-liquid extraction": {
        topics_to_learn_beforehand: ["ternary liquids phase diagrams"],
        topics_to_learn_afterwards: [],
    },
    "material balances": {
        topics_to_learn_beforehand: [],
        topics_to_learn_afterwards: ["humidity and water-air VLE", "heterogeneous chemical equilibrium", "multi-component phase equilibrium", "lever rule"],
    },
    "lever rule": {
        topics_to_learn_beforehand: ["material balances", "single-component phase diagrams"],
        topics_to_learn_afterwards: ["multi-component phase equilibrium", "solid-solid liquid phase diagrams"],
    },
    "flash separations": {
        topics_to_learn_beforehand: ["Raoult's law and VLE"],
        topics_to_learn_afterwards: ["using a cubic equation of state to determine VLE"],
    },
    "using a cubic equation of state to determine VLE": {
        topics_to_learn_beforehand: ["flash separations", "vapor-liquid equilibrium for non-ideal solutions", "equations of state"],
        topics_to_learn_afterwards: [],
    },
    "chemical potential": {
        topics_to_learn_beforehand: ["partial molar quantities"],
        topics_to_learn_afterwards: [],
    },
    "single-component phase properties": {
        topics_to_learn_beforehand: ["ideal gas law"],
        topics_to_learn_afterwards: ["steam tables", "single-component phase diagrams", "equations of state", "multi-component phase equilibrium"],
    },
    "steam tables": {
        topics_to_learn_beforehand: ["single-component phase properties", "single-component phase diagrams"],
        topics_to_learn_afterwards: ["turbines and compressors", "throttling and Joule-Thompson expansion", "first law - open systems"],
    },
    "single-component phase diagrams": {
        topics_to_learn_beforehand: ["single-component phase properties"],
        topics_to_learn_afterwards: ["equations of state", "steam tables", "Raoult's law and VLE", "fugacity of a single component", "thermodynamic properties phase diagrams"],
    },
    "thermodynamic properties phase diagrams": {
        topics_to_learn_beforehand: ["single-component phase diagrams"],
        topics_to_learn_afterwards: [],
    },
    "fugacity of a single component": {
        topics_to_learn_beforehand: ["single-component phase diagrams"],
        topics_to_learn_afterwards: [],
    },
    "humidity and water-air VLE": {
        topics_to_learn_beforehand: ["material balances", "first law - open systems"],
        topics_to_learn_afterwards: [],
    },
    "ideal gas law": {
        topics_to_learn_beforehand: [],
        topics_to_learn_afterwards: ["single-component phase properties", "Raoult's law and VLE", "departure function", "equations of state", "entropy"],
    },
    "equations of state": {
        topics_to_learn_beforehand: ["ideal gas law", "single-component phase properties", "single-component phase diagrams"],
        topics_to_learn_afterwards: [],
    },
    "departure function": {
        topics_to_learn_beforehand: ["ideal gas law", "equations of state", "entropy", "state functions"],
        topics_to_learn_afterwards: [],
    },
    "first law - closed systems": {
        topics_to_learn_beforehand: ["state functions"],
        topics_to_learn_afterwards: ["first law - open systems", "reversible/irreversible expansion/compression processes", "entropy"],
    },
    "first law - open systems": {
        topics_to_learn_beforehand: ["steam tables", "first law - closed systems", "entropy"],
        topics_to_learn_afterwards: ["humidity and water-air VLE", "thermal effects in chemical reactions", "throttling and Joule-Thompson expansion", "turbines and compressors", "Carnot cycle"],
    },
    "throttling and Joule-Thompson expansion": {
        topics_to_learn_beforehand: ["first law - open systems", "steam tables"],
        topics_to_learn_afterwards: ["refrigeration cycle"],
    },
    "refrigeration cycle": {
        topics_to_learn_beforehand: ["throttling and Joule-Thompson expansion", "turbines and compressors", "Carnot cycle"],
        topics_to_learn_afterwards: [],
    },
    "entropy": {
        topics_to_learn_beforehand: ["first law - closed systems", "ideal gas law"],
        topics_to_learn_afterwards: ["departure function", "first law - open systems", "reversible/irreversible expansion/compression processes", "Carnot cycle"],
    },
    "reversible/irreversible expansion/compression processes": {
        topics_to_learn_beforehand: ["entropy", "first law - closed systems"],
        topics_to_learn_afterwards: ["fundamental property relations", "turbines and compressors", "Rankine cycle"],
    },
    "turbines and compressors": {
        topics_to_learn_beforehand: ["steam tables", "first law - open systems", "reversible/irreversible expansion/compression processes"],
        topics_to_learn_afterwards: ["refrigeration cycle", "Rankine cycle"],
    },
    "Rankine cycle": {
        topics_to_learn_beforehand: ["turbines and compressors", "reversible/irreversible expansion/compression processes", "Carnot cycle"],
        topics_to_learn_afterwards: [],
    },
    "state functions": {
        topics_to_learn_beforehand: [],
        topics_to_learn_afterwards: ["first law - closed systems", "departure function"],
    },
    "Carnot cycle": {
        topics_to_learn_beforehand: ["entropy", "first law - open systems"],
        topics_to_learn_afterwards: ["Rankine cycle", "refrigeration cycle"],
    },
    "fundamental property relations": {
        topics_to_learn_beforehand: ["reversible/irreversible expansion/compression processes"],
        topics_to_learn_afterwards: [],
    },
}