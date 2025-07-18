export function setDefaults() {
  // Initialize default flow values and column parameters
  state = {
    ...state,
    
    // Feed stage properties (Phase 2 baseline values)
    feedFlow: 100,        // F - Feed flow rate (mol/h)
    feedComposition: 0.5, // zF - Feed composition (mole fraction light key)
    
    // Flow rates above feed stage (Phase 2 baseline values)
    liquidFlow: 150,      // L - Liquid flow above feed (mol/h)
    vaporFlow: 200,       // V - Vapor flow above feed (mol/h)
    
    // Flow rates below feed stage (calculated based on q)
    liquidFlowBelow: 0,   // L̅ - Liquid flow below feed (mol/h)
    vaporFlowBelow: 0,    // V̅ - Vapor flow below feed (mol/h)
    
    // Feed stream components (calculated based on q)
    feedLiquid: 0,        // LF - Liquid portion of feed (mol/h)
    feedVapor: 0,         // VF - Vapor portion of feed (mol/h)
    
    // Column operating parameters
    refluxRatio: 1.5,     // R - Reflux ratio (L/D)
    distillateFlow: 100,  // D - Distillate flow rate (mol/h)
    bottomsFlow: 100,     // B - Bottoms flow rate (mol/h)
    
    // q-line parameters (for McCabe-Thiele method)
    qLineSlope: 0,        // q/(q-1)
    qLineIntercept: 0,    // -zF/(q-1)
    
    // Feed condition properties
    feedCondition: "dew point vapor", // Text description
    vaporRelation: "",    // Flow relationship string for vapor
    liquidRelation: "",   // Flow relationship string for liquid
    thermalEffect: "",    // Description of thermal effect
    
    // Flow direction indicators (for arrow sizing in Phase 3)
    vaporDirection: 1,    // +1 up, -1 down, 0 none
    liquidDirection: 1,   // +1 down, -1 up, 0 none
    
    // Animation properties (for future phases)
    animationSpeed: 1.0,
    showFlowArrows: true,
    showEquations: true
  };
  
  console.log("Phase 2 default values initialized:", {
    qValue: state.qValue,
    feedFlow: state.feedFlow,
    liquidFlow: state.liquidFlow,
    vaporFlow: state.vaporFlow
  });
}

export function calcAll() {
  // Phase 2: Complete mathematical calculations
  
  // Update q-line parameters
  updateQLineParameters();
  
  // Update feed condition description
  updateFeedCondition();
  
  // Calculate detailed flow relationships (Phase 2 implementation)
  calculateDetailedFlows();
  
  // Update flow relationship strings
  updateFlowRelationships();
  
  // Log current state for debugging
  console.log("Phase 2 calculations updated:", {
    q: state.qValue,
    condition: state.feedCondition,
    qLineSlope: state.qLineSlope.toFixed(3),
    L_bar: state.liquidFlowBelow.toFixed(1),
    V_bar: state.vaporFlowBelow.toFixed(1),
    vaporRelation: state.vaporRelation,
    liquidRelation: state.liquidRelation
  });
}

function updateQLineParameters() {
  // Calculate q-line slope and intercept for McCabe-Thiele method
  const q = state.qValue;
  const zF = state.feedComposition;
  
  if (q !== 1) {
    state.qLineSlope = q / (q - 1);
    state.qLineIntercept = -zF / (q - 1);
  } else {
    // Vertical line for saturated liquid (q = 1)
    state.qLineSlope = Infinity;
    state.qLineIntercept = zF;
  }
}

function updateFeedCondition() {
  // Update feed condition description based on q-value
  const q = state.qValue;
  
  if (q < 0) {
    state.feedCondition = "superheated vapor";
    state.thermalEffect = "Heat input to column (vaporizes reflux)";
  } else if (q === 0) {
    state.feedCondition = "dew point vapor";
    state.thermalEffect = "No thermal effect";
  } else if (q > 0 && q < 1) {
    state.feedCondition = "partially vaporized";
    state.thermalEffect = "Partial thermal effect";
  } else if (q === 1) {
    state.feedCondition = "bubble point liquid";
    state.thermalEffect = "No thermal effect";
  } else if (q > 1) {
    state.feedCondition = "subcooled liquid";
    state.thermalEffect = "Heat removal from column (condenses vapor)";
  }
}

function calculateDetailedFlows() {
  // Phase 2: Detailed material balance calculations based on Section 7.2.3
  
  const F = state.feedFlow;     // 100 mol/h
  const L = state.liquidFlow;   // 150 mol/h
  const V = state.vaporFlow;    // 200 mol/h
  const q = state.qValue;
  
  // General equations from Section 7.2.3:
  // L̅ = L + qF (Eq. 7-18 rearranged)
  // V̅ = V + F(q-1) (Eq. 7-19 rearranged)
  
  state.liquidFlowBelow = L + q * F;
  state.vaporFlowBelow = V + F * (q - 1);
  
  // Calculate feed phase splits based on q-value
  if (q <= 0) {
    // Superheated or saturated vapor: all feed is vapor
    state.feedVapor = F;
    state.feedLiquid = 0;
  } else if (q >= 1) {
    // Subcooled or saturated liquid: all feed is liquid  
    state.feedVapor = 0;
    state.feedLiquid = F;
  } else {
    // Partially vaporized: split based on q
    state.feedLiquid = q * F;      // LF = qF
    state.feedVapor = (1 - q) * F; // VF = (1-q)F
  }
  
  // Ensure flows are non-negative (physical constraint)
  state.liquidFlowBelow = Math.max(0, state.liquidFlowBelow);
  state.vaporFlowBelow = Math.max(0, state.vaporFlowBelow);
  state.feedLiquid = Math.max(0, state.feedLiquid);
  state.feedVapor = Math.max(0, state.feedVapor);
  
  // Set flow directions (for future arrow animations)
  state.vaporDirection = 1;    // Always up
  state.liquidDirection = 1;   // Always down
}

function updateFlowRelationships() {
  // Phase 2: Generate flow relationship strings for display
  const q = state.qValue;
  
  if (q < 0) {
    state.vaporRelation = "V > V̅ + F";
    state.liquidRelation = "L̅ < L";
  } else if (q === 0) {
    state.vaporRelation = "V = V̅ + F";
    state.liquidRelation = "L̅ = L";
  } else if (q > 0 && q < 1) {
    state.vaporRelation = "V = V̅ + VF";
    state.liquidRelation = "L̅ = L + LF";
  } else if (q === 1) {
    state.vaporRelation = "V = V̅";
    state.liquidRelation = "L̅ = L + F";
  } else if (q > 1) {
    state.vaporRelation = "V < V̅";
    state.liquidRelation = "L̅ > L + F";
  }
}

// Phase 2: Complete implementation of calculateFlows function
export function calculateFlows(q) {
  // Phase 2: Detailed flow calculations based on q-value
  // Returns complete data structure as specified in Phase 2 requirements
  
  const F = state.feedFlow;     // 100 mol/h
  const L = state.liquidFlow;   // 150 mol/h  
  const V = state.vaporFlow;    // 200 mol/h
  const zF = state.feedComposition; // 0.5
  
  let L_bar, V_bar, VF, LF;
  
  // Material balance calculations for each feed condition
  if (q < 0) {
    // Superheated Vapor
    VF = F;
    LF = 0;
    L_bar = L + q * F;            // L̅ = L + qF (q negative, so L̅ < L)
    V_bar = V + F * (1 - q);      // V̅ = V + F(1-q)
  } else if (q === 0) {
    // Dew Point Vapor  
    VF = F;
    LF = 0;
    L_bar = L;
    V_bar = V - F;
  } else if (q > 0 && q < 1) {
    // Partially Vaporized
    LF = q * F;
    VF = (1 - q) * F;
    L_bar = L + LF;
    V_bar = V;
  } else if (q === 1) {
    // Bubble Point Liquid
    VF = 0;
    LF = F;
    L_bar = L + F;
    V_bar = V;
  } else if (q > 1) {
    // Subcooled Liquid
    VF = 0;
    LF = F;
    L_bar = L + F + (q - 1) * F;  // L̅ = L + qF
    V_bar = V - (q - 1) * F;      // V̅ = V - (q-1)F
  }
  
  // Generate relationship strings
  let vaporRelation, liquidRelation;
  if (q < 0) {
    vaporRelation = "V > V̅ + F";
    liquidRelation = "L̅ < L";
  } else if (q === 0) {
    vaporRelation = "V = V̅ + F";
    liquidRelation = "L̅ = L";
  } else if (q > 0 && q < 1) {
    vaporRelation = "V = V̅ + VF";
    liquidRelation = "L̅ = L + LF";
  } else if (q === 1) {
    vaporRelation = "V = V̅";
    liquidRelation = "L̅ = L + F";
  } else if (q > 1) {
    vaporRelation = "V < V̅";
    liquidRelation = "L̅ > L + F";
  }
  
  // Calculate q-line properties
  let qLineSlope, qLineIntercept;
  if (q !== 1) {
    qLineSlope = q / (q - 1);
    qLineIntercept = -zF / (q - 1);
  } else {
    qLineSlope = Infinity;
    qLineIntercept = zF;
  }
  
  console.log(`calculateFlows() executed for q = ${q}:`, {
    L_bar: L_bar.toFixed(1),
    V_bar: V_bar.toFixed(1),
    VF: VF.toFixed(1),
    LF: LF.toFixed(1)
  });
  
  // Return complete data structure as specified in Phase 2
  return {
    // Input
    q: q,
    
    // Flow rates
    L: L,           // Liquid above feed
    L_bar: L_bar,   // Liquid below feed  
    V: V_bar,       // Vapor above feed (Note: this is actually V̅)
    V_bar: V,       // Vapor below feed (Note: this is actually V)
    F: F,           // Feed rate
    VF: VF,         // Vapor portion of feed
    LF: LF,         // Liquid portion of feed
    
    // Condition
    condition: getFeedConditionText(q),
    
    // Display relationships
    vaporRelation: vaporRelation,
    liquidRelation: liquidRelation,
    
    // q-line properties
    qLineSlope: qLineSlope,
    qLineIntercept: qLineIntercept,
    
    // Flow direction indicators (for arrow sizing)
    vaporDirection: 1,    // +1 up, -1 down, 0 none
    liquidDirection: 1    // +1 down, -1 up, 0 none
  };
}

// Phase 2: Complete implementation of getFeedCondition function
export function getFeedCondition(q) {
  // Phase 2: Detailed feed condition analysis
  // Returns comprehensive feed condition data
  
  const zF = state.feedComposition;
  
  let condition, thermalEffect;
  let liquidPhase, vaporPhase;
  
  if (q < 0) {
    condition = "superheated vapor";
    thermalEffect = "Heat input to column (vaporizes reflux)";
    liquidPhase = 0;
    vaporPhase = 1;
  } else if (q === 0) {
    condition = "dew point vapor";
    thermalEffect = "No thermal effect";
    liquidPhase = 0;
    vaporPhase = 1;
  } else if (q > 0 && q < 1) {
    condition = "partially vaporized";
    thermalEffect = "Partial thermal effect";
    liquidPhase = q;
    vaporPhase = 1 - q;
  } else if (q === 1) {
    condition = "bubble point liquid";
    thermalEffect = "No thermal effect";
    liquidPhase = 1;
    vaporPhase = 0;
  } else if (q > 1) {
    condition = "subcooled liquid";
    thermalEffect = "Heat removal from column (condenses vapor)";
    liquidPhase = 1;
    vaporPhase = 0;
  }
  
  // Calculate q-line properties
  let qLineSlope, qLineIntercept;
  if (q !== 1) {
    qLineSlope = q / (q - 1);
    qLineIntercept = -zF / (q - 1);
  } else {
    qLineSlope = Infinity;
    qLineIntercept = zF;
  }
  
  console.log(`getFeedCondition() executed for q = ${q}: ${condition}`);
  
  return {
    qValue: q,
    condition: condition,
    phases: {
      liquid: liquidPhase,
      vapor: vaporPhase
    },
    qLineSlope: qLineSlope,
    qLineIntercept: qLineIntercept,
    thermalEffect: thermalEffect
  };
}

// Utility functions for McCabe-Thiele method (Phase 3)
export function getQLineProperties(q, zF) {
  // Phase 2: q-line properties for McCabe-Thiele graphical method
  
  if (q === 1) {
    return {
      type: "vertical",
      x: zF,
      slope: Infinity,
      intercept: zF
    };
  } else {
    const slope = q / (q - 1);
    const intercept = -zF / (q - 1);
    return {
      type: "linear",
      slope: slope,
      intercept: intercept,
      equation: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`
    };
  }
}

// Helper functions
function getFeedConditionText(q) {
  if (q < 0) return "superheated vapor";
  if (q === 0) return "dew point vapor";
  if (q > 0 && q < 1) return "partially vaporized";
  if (q === 1) return "bubble point liquid";
  if (q > 1) return "subcooled liquid";
  return "unknown";
}

function getMaterialBalanceEffect(q) {
  if (q < 0) return "Vaporizes reflux liquid";
  if (q === 0) return "Adds vapor only";
  if (q > 0 && q < 1) return "Adds vapor and liquid";
  if (q === 1) return "Adds liquid only";
  if (q > 1) return "Condenses vapor";
  return "";
}

// Debug function for development
export function logCurrentState() {
  console.table({
    "Q Value": state.qValue,
    "Feed Condition": state.feedCondition,
    "Liquid Above (L)": state.liquidFlow,
    "Vapor Above (V)": state.vaporFlow,
    "Liquid Below (L̅)": state.liquidFlowBelow.toFixed(1),
    "Vapor Below (V̅)": state.vaporFlowBelow.toFixed(1),
    "Feed Liquid (LF)": state.feedLiquid.toFixed(1),
    "Feed Vapor (VF)": state.feedVapor.toFixed(1),
    "Q-Line Slope": state.qLineSlope.toFixed(3),
    "Vapor Relation": state.vaporRelation,
    "Liquid Relation": state.liquidRelation
  });
}

// Phase 2: Testing function to validate all conditions
export function testAllConditions() {
  console.log("=== Phase 2 Testing All Feed Conditions ===");
  
  const testValues = [-0.5, 0.0, 0.5, 1.0, 1.5];
  
  testValues.forEach(q => {
    console.log(`\n--- Testing q = ${q} ---`);
    const flowData = calculateFlows(q);
    const conditionData = getFeedCondition(q);
    
    console.log(`Condition: ${conditionData.condition}`);
    console.log(`Vapor Relation: ${flowData.vaporRelation}`);
    console.log(`Liquid Relation: ${flowData.liquidRelation}`);
    console.log(`L̅ = ${flowData.L_bar.toFixed(1)}, V̅ = ${flowData.V_bar.toFixed(1)}`);
    console.log(`LF = ${flowData.LF.toFixed(1)}, VF = ${flowData.VF.toFixed(1)}`);
  });
}