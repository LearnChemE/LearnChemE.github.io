import { dyeLookup } from "./calcs";

export const Fluids = [
    {
        key: "y-dye",
        label: "yellow dye",
        contains: dyeLookup("yellow")
    },
    {
        key: "b-dye",
        label: "blue dye",
        contains: dyeLookup("yellow")
    },
    {
        key: "water",
        label: "water",
        contains: dyeLookup("clear")
    }
];