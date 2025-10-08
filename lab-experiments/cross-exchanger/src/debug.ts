import { FLOWRATE_GAIN, type GlobalState } from "./types";
import { CP, CP_AIR, MDOT_AIR } from "./types/calcs";

const SendRate = 20; // Pts per second

export const debug = (state: GlobalState) => {
    const balance = state.systemBalance;
    // Connect via websocket
    const socket = new WebSocket("ws://localhost:8765");
    // 
    socket.addEventListener("open", () => {
        console.log("Connected to Python debug server");
        const start = Date.now();

        setInterval(() => {
            // Fetch latest values
            const t2 = balance.getAirTemp();
            const T1 = balance.getTankTemp();
            const T2 = balance.getTubeTemp();
            const timestamp = Date.now() - start;
            // Calculate Ca and Cl same as in simulation
            const Ca = state.fanIsOn ? MDOT_AIR * CP_AIR : 0.2 * CP_AIR;
            const flow = state.outIsFlowing ? state.lift * FLOWRATE_GAIN : 0;
            const Cl = flow * CP;
            // Create the json object
            const payload = { 
                Tci: 25, 
                Tco: t2, 
                Thi: T1, 
                Tho: T2, 
                timestamp, 
                noplot: { Ca, Cl } 
            };

            socket.send(JSON.stringify(payload));
        }, 1000 / SendRate);
    })
}