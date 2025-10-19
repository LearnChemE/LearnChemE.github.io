type AntoineCoefficients = {
    A: number;
    B: number;
    C: number;
};

function antoineEquation(T: number, coeffs: AntoineCoefficients): number {
    // T in °C, returns P in mmHg
    const mmHg = 10 ** (coeffs.A - (coeffs.B / (T + coeffs.C)));
    // Convert to bar
    return mmHg / 750.0616827;
}

export const TankVolume = 2; // L
const R = .08314; // bar L / (mol K)

export function calcPressure(substance: Substance, v: number, T: number) {
    // Calculate moles in system
    const n = v * substance.concentration;
    // Calculate pressure if all is ideal gas
    const P_ig = n * R * (T + 273.15) / TankVolume;
    const Psat = antoineEquation(T, substance.coeffs);
    return Math.min(Psat, P_ig);
}

export type Substance = {
    name: string;
    label: string;
    coeffs: AntoineCoefficients;
    tempRange: [number, number]; // in °C
    concentration: number;
};

export const substances: Substance[] = [
    {
        name: "benzene",
        label: "Species A",
        coeffs: { A: 6.88, B: 1197, C: 219.2 },
        tempRange: [8, 80],
        concentration: .01121
    },
    {
        name: "ethanol",
        label: "Species B",
        coeffs: { A: 8.1122, B: 1529.864, C: 226.184 },
        tempRange: [20, 70],
        concentration: .01713
    },
    {
        name: "n-heptane",
        label: "Species C",
        coeffs: { A: 6.89677, B: 1264.9, C: 216.544 },
        tempRange: [-2, 104],
        concentration: .006723
    },
    {
        name: "water",
        label: "Species D",
        coeffs: { A: 8.07131, B: 1730.63, C: 233.426 },
        tempRange: [1, 100],
        concentration: .05549
    },
    {
        name: "cyclohexane",
        label: "Species E",
        coeffs: { A: 7.264753, B: 1434.148, C: 246.7207 },
        tempRange: [6.7, 80.7],
        concentration: .009256
    }
];