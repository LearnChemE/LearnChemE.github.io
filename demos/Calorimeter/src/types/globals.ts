export interface SimProps {
    waterTemp: number;
    mat: number;
};

export interface MaterialProperties {
    specificHeat: number;
    color: Array<number>[3] | string;
    density: number;
};