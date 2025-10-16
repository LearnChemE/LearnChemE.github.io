type AntoineCoefficients = {
    A: number;
    B: number;
    C: number;
};

export function antoineEquation(T: number, coeffs: AntoineCoefficients): number {
    // T in °C, returns P in mmHg
    return Math.exp(coeffs.A - (coeffs.B / (T + coeffs.C)));
}

type Substance = {
    name: string;
    label: string;
    coeffs: AntoineCoefficients;
    tempRange: [number, number]; // in °C
};


export const substances: Substance[] = [
    {
        name: "benzene",
        label: "Species A",
        coeffs: { A: 6.88, B: 1197, C: 219.2 },
        tempRange: [8, 80],
    },
    {
        name: "ethanol",
        label: "Species B",
        coeffs: { A: 8.1122, B: 1529.864, C: 226.184 },
        tempRange: [20, 93],
    },
    {
        name: "n-heptane",
        label: "Species C",
        coeffs: { A: 6.89677, B: 1264.9, C: 216.544 },
        tempRange: [-2, 123],
    },
    {
        name: "water",
        label: "Species D",
        coeffs: { A: 8.07131, B: 1730.63, C: 233.426 },
        tempRange: [1, 100],
    },
    {
        name: "cyclohexane",
        label: "Species E",
        coeffs: { A: 7.264753, B: 1434.148, C: 246.7207 },
        tempRange: [6.7, 80.7],
    }
];