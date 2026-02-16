import { createContext } from "solid-js";

// Context for column calculations
export type ColumnContextType = {

};
export const ColumnContext = createContext<ColumnContextType>({});
export const ColumnContextProvider = (props: { children: any }) => {
    const store: ColumnContextType = {};

    return (
    <ColumnContext.Provider value={store}>
        {props.children}
    </ColumnContext.Provider>
    );
}

export type Composition = [chloroform: number, aceticAcid: number];

// [chloroform, aceticAcid]
export const envelope: Array<Composition> = [
[0, 0],
[0.006723494384826844,   0.044967475764421366],
[0.013662149462809775,   0.08672298897424133],
[0.018091976199633646,   0.11402467068835438],
[0.028027433139061933,   0.15256822134357292],
[0.03657206949434563,    0.19111177199879126],
[0.04458652803810925,    0.21680747243560344],
[0.0506223360522339,     0.24089719159511497],
[0.061633596457442735,   0.2633809294773257],
[0.07242969616949568,    0.28907662991413796],
[0.08563476779749957,    0.309954386519048],
[0.09825200948000934,    0.3292261618466572],
[0.11541438216729108,    0.3533158810061688],
[0.13578871740917448,    0.37098167505647706],
[0.15300874223043037,    0.38382952527488323],
[0.1738133988586259,     0.3950713942159887],
[0.19542104612547187,    0.40470728187979327],
[0.225803938283498,      0.4079192444343948],
[0.25698982108017443,    0.40952522571169553],
[0.2864122140403682,     0.406313263157094],
[0.32878231364417576,    0.3966773754932895],
[0.37634302633222394,    0.38222354399758257],
[0.4312881633273076,     0.36134578739267253],
[0.4751067356492341,     0.3404680307877625],
[0.5147528462187269,     0.3195902741828525],
[0.5590804942065565,     0.29630354566199135],
[0.6016446523579032,     0.268198873309228],
[0.6472843666502867,     0.24089719159511494],
[0.6857548173287906,     0.21680747243560342],
[0.7384062866758714,     0.17826392178038514],
[0.7746829261315804,     0.15578018389817438],
[0.8111747262804454,     0.1300844834613621],
[0.8468635357906604,     0.10599476430185048],
[0.8855491471623204,     0.07869308258773748],
[0.9330100034251607,     0.044967475764421394],
[0.9645263511829413,     0.020877756604909984],
[0.9964153681930602,     0.0016059812773008206],
[1, 0]
];

const tiePts: Composition[][] = [
    [[0, 0], [1, 0]],
    [[0.021030279370202187, 0.11050532198081608],
    [0.9083300821531416, 0.06406105622076279]],
    [[0.05325583858745653, 0.24022896082786083],
    [0.8116985134474901, 0.12972363884704488]],
    [[0.09995262766565477, 0.329914439536929],
    [0.7049290791707452, 0.20179232709540307]],
    [[0.16522404204955807, 0.39077244294665375],
    [0.6027496602570491, 0.2674549097216851]],
]

function generateTieLines() {
    const lines: Array<{ slope: number, intercept: number }> = [];
    tiePts.forEach(ptSet => {
        const [pt1, pt2] = ptSet;
        const slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
        const intercept = pt1[1] - slope * pt1[0];
        lines.push({ slope, intercept });
    });
    return lines;
}

const tieLines = generateTieLines();

function findTieline(x: number, y: number) {
    // Find what lines surround x and y
    let nearestUnder = tieLines[0];
    let nearestOver = undefined;
    for (const { slope, intercept } of tieLines) {
        const yofx = slope * x + intercept;
        if (yofx < y) {
            nearestUnder = { slope, intercept };
        } else {
            nearestOver = { slope, intercept };
            break;
        }
    }

    let slope;
    // If nearest over wasn't set, we are above the top line
    if (!nearestOver) {
        slope = nearestUnder.slope;
    }
    else {
        // Use lever rule to determine slope (linear interpolation)
        const yofxUnder = nearestUnder.slope * x + nearestUnder.intercept;
        const yofxOver = nearestOver.slope * x + nearestOver.intercept;
        const dif = yofxOver - yofxUnder;
        slope = nearestUnder.slope * (y - yofxUnder) / dif + nearestOver.slope * (yofxOver - y) / dif;
    }

    const intercept = y - slope * x;
    return { slope, intercept };
}

function 

export class Stage {
    private mixedComp = [0, 0];
    private organicFraction = 0;

    constructor() {

    }

    public phases() {

    }
}