import { dyeLookup, RXN_IDX_GLUC, RXN_IDX_H2O2, RXN_IDX_NONE, RXN_IDX_RGNT, type FluidComposition } from "./calcs";

export type MenuFluidType = { key: string, label: string, showSlider: boolean, contains: FluidComposition }

export const totInjTime = 2;

export const Fluids = [
    {
        key: "y-dye",
        label: "yellow dye",
        showSlider: false,
        contains: { 
            rxnIdx: RXN_IDX_NONE, 
            color: dyeLookup("yellow"), 
            conc: 1
        },
    },
    {
        key: "b-dye",
        label: "blue dye",
        showSlider: false,
        contains: { 
            rxnIdx: RXN_IDX_NONE,
            color: dyeLookup("blue"), 
            conc: 1 
        }
    },
    {
        key: "water",
        label: "water",
        showSlider: false,
        contains: { 
            rxnIdx: RXN_IDX_NONE,
            color: dyeLookup("clear"), 
            conc: 1 
        }
    },
    {
        key: "reagent",
        label: "reagent solution",
        showSlider: false,
        contains: {
            rxnIdx: RXN_IDX_RGNT,
            color: dyeLookup("clear"),
            conc: 1
        }
    },
    {
        key: "peroxides",
        label: "H₂O₂ solution",
        showSlider: true,
        contains: {
            rxnIdx: RXN_IDX_H2O2,
            color: dyeLookup("clear"),
            conc: 1
        }
    },
    {
        key: "glucose",
        label: "D-glucose solution",
        showSlider: true,
        contains: {
            rxnIdx: RXN_IDX_GLUC,
            color: dyeLookup("clear"),
            conc: 1
        }
    }
];

