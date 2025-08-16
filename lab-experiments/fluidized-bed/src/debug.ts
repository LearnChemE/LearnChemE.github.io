import { flowrate, pressureDrop } from "./js/calculations";
import { PUMP_FLOWRATE_GAIN, PUMP_VELOCITY_GAIN } from "./types";

async function sendDataToPython(data: any) {
    const response = await fetch('http://localhost:5000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Python responded with:', result);
}

async function resetPython() {
    const response = await fetch('http://localhost:5000/reset', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ""
    });

    const result = await response.json();
    console.log('Python responded with:', result);
}

async function saveFig(filename: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2, '0')
    const date_str = `${year}-${month}-${day}`;
    console.log(filename)
    const response = await fetch('http://localhost:5000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({filename: `${filename}_${date_str}.png`})
    });

    const result = await response.json();
    console.log('Python responded with:', result);
}

async function saveCSV(filename: string, x: number[], y: number[]) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2, '0')
    const date_str = `${year}-${month}-${day}`;
    console.log(filename)
    const response = await fetch('http://localhost:5000/csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: `${filename}_${date_str}.csv`, 'x': x, 'y': y })
    });

    const result = await response.json();
    console.log('Python responded with:', result);
}

function linspace(start: number, stop: number, num: number) {
    const result: number[] = [];
    const step = (stop - start) / (num - 1);

    for (let i=0;i<num;i++) {
        result.push(start + i * step);
    }

    return result;
}

async function debugPlots() {
    // Generate data
    const x = linspace(0,1,101);
    const y: number[] = [];
    const h: number[] = [];
    x.forEach(lift => {
        y.push(pressureDrop(lift));
        h.push(pressureDrop(lift, true));
    })

    const data = [{
        xlabel: "Valve Lift",
        ylabel: "Pressure drop (cm water)",
        title: "Pressure drop versus valve lift",
        lift: x,
        deltaP: y
    }, {
        xlabel: "Superficial velocity (cm/s)",
        ylabel: "Pressure drop (cm water)",
        title: "Pressure drop versus superficial velocity",
        lift: x.map(x => x*7),
        deltaP: y
    }, {
        xlabel: "Valve Lift",
        ylabel: "Bed Height (cm)",
        title: "Bed Height versus Valve Lift",
        lift: x,
        deltaP: h
    }, {
        xlabel: "Superficial velocity (cm/s)",
        ylabel: "Bed Height (cm)",
        title: "Bed Height versus superficial velocity",
        lift: x.map(x => x*7),
        deltaP: h
    }];
    const names = ["lift-pres", "vel-pres", "lift-h", "vel-h"];
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i=0;i<data.length;i++) {
        await resetPython();             await delay(500);
        await sendDataToPython(data[i]); await delay(500);
        await saveFig(names[i]);         await delay(1000);
    }
} 
// debugPlots();

async function debugSaveCSV() {
    // Generate data
    const q = linspace(0, 700, 15);
    const y: number[] = [];
    q.forEach((flowrate: number) => {
        const lift = flowrate / 60 / PUMP_FLOWRATE_GAIN;
        console.log(lift)
        y.push(pressureDrop(lift));
    })

    sendDataToPython({
        xlabel: "Flowrate (mL / min)",
        ylabel: "Pressure drop (cm water)",
        title: "Pressure drop versus flowrate",
        lift: q,
        deltaP: y
    });
    saveCSV('sim_pdrop', q, y);
}
debugSaveCSV();