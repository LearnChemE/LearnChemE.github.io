import { pressureDrop } from "./js/calculations";

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

function linspace(start: number, stop: number, num: number) {
    const result: number[] = [];
    const step = (stop - start) / (num - 1);

    for (let i=0;i<num;i++) {
        result.push(start + i * step);
    }

    return result;
}

// Generate data
const x = linspace(0,1,101);
const y: number[] = [];
x.forEach(lift => {
    y.push(pressureDrop(lift));
})

const data = {
    lift: x,
    deltaP: y
};

sendDataToPython(data);