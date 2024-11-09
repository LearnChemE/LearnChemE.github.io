export interface SimProps {
    waterTemp: number;
    mat: string;
    mass: number;
    startTime: number;
};

export interface MaterialProperties {
    specificHeat: number;
    color: Array<number>[3] | string;
    density: number;
};

export const MaterialArray: Array<string> = ["Fe","Au","Cu","Hg","Pb"];