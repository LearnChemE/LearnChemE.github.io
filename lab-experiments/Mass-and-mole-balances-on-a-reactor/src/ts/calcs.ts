import { Signal } from "../classes/Signal";

const V = 1; // L
const P = 1; // atm
const RHO = 0.8; // g / mL
const R = 0.08206; // L atm / mol / K

const MW_Propanol = 60.1; // g/mol
const MW_Water = 18; // g/mol
const MW_Propanal = 58.08; // g/mol

export type ProductStream = {
    liquidFlowrate: number,
    gasFlowrate: number
};

export function Reactor(inFlow: Signal<number>, temp: Signal<number>) {
    var flowrate = inFlow.get();
    var temperature = temp.get();

    const output = new Signal<ProductStream>({ liquidFlowrate: 0, gasFlowrate: 0 });

    var requested = false;
    const update = () => {
        const results = calcAll(flowrate, temperature);
        output.set(results);
        requested = false;
    }

    inFlow.subscribe((flow: number) => {
        flowrate = flow;
        if (!requested) {
            requested = true;
            requestAnimationFrame(update);
        }
    });
    temp.subscribe((t: number) => {
        temperature = t;
        if (!requested) {
            requested = true;
            requestAnimationFrame(update);
        }
    });

    // TODO: Call CalcAll somewhere outside so it will not be called more than once per frame
    return output;
}

type ArrhenniusConstants = {
    k0: number,
    ea: number
}

const rxn1: ArrhenniusConstants = {
    k0: 50,
    ea: 2000
}
const rxn2: ArrhenniusConstants = {
    k0: 5000,
    ea: 3800
}

function arrhennius(cs: ArrhenniusConstants, T: number) {
    return cs.k0 * Math.exp(-cs.ea / T);
}

/**
 * Calculate the reactor and exiting compositions
 * @param flow Liquid flowrate of feed (mL/s)
 * @param temp Temperature of reactor (C)
 */
function calcAll(flow: number, temp: number): ProductStream {
    if (flow <= 0) return { liquidFlowrate: 0, gasFlowrate: 0 };
    const T = temp + 273; // K
    const mdot_feed = flow * RHO; // g / s
    const ndot_feed = mdot_feed / MW_Propanol; // mol / s
    const Qvap = ndot_feed * R * (T + 273) / P; // Volumetric flowrate of gas (L/s)

    // Reaction params
    const C0 = ndot_feed / Qvap; // Concentration of propanol entering reactor (M)
    const tau = Qvap / V; // Reaction spacetime

    // Reaction constants
    const k1 = arrhennius(rxn1, T);
    const k2 = arrhennius(rxn2, T);

    // Calculate the composition after the rxn
    const rxn = -C0 * (1 - Math.exp(-(k1 + k2) * tau));
    const conc_propanol = C0 + rxn;
    const conc_propene  = -rxn * k1 / (k1 + k2);
    const conc_propanal = -rxn - conc_propene;
    const c_tot = conc_propanol + 2 * conc_propene + 2 * conc_propanal; // M
    console.log(`Concentrations:\n  ${conc_propanol} M propanol\n  ${conc_propene} M propene\n  ${conc_propanal} M propanal`)

    // Put in terms of moles
    const n_out = c_tot * Qvap; // mol / s
    const m_liq = n_out / c_tot * (MW_Propanol * conc_propanol + MW_Water * conc_propene + MW_Propanal * conc_propanal); // g / s
    const n_vap = n_out / c_tot * (conc_propene + conc_propanal); // mol / s

    // Finally, convert to volumetric flowrates
    const liq = m_liq / RHO;
    const vap = n_vap * R * 298 / P;
    console.log(`Inlet flow: ${flow} mL/s @ ${temp} C\n  Liq: ${liq} mL/s\n  Vap: ${vap} mL/s`);
    console.log(`In: ${ndot_feed}\nOut: ${n_out}`)

    return { liquidFlowrate: liq, gasFlowrate: vap };
}