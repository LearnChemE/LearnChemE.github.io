import { createMemo, createSignal, For, Show } from 'solid-js'
import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Defs from './components/Defs'
import Background from './components/Background/Background'
import Pipes from './components/Pipes/Pipes'
import { Regulator } from './components/Regulator/Regulator'
import { CylinderValve } from './components/CylinderValve/CylinderValve'
import { Controller } from './components/Controller/Controller'
import { HamburgerMenu } from './components/Hamburger/Hamburger'

import worksheet from './assets/worksheet.pdf?url';
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ControlButton } from './components/ControlButton/ControlButton'
import { BETA_MAX, BETA_MIN, BETA_STEP, createCylinders, expMemo, MASS_FLOW_INIT, MASS_FLOW_STEP, MAX_MASS_FLOWRATE, MIN_MASS_FLOWRATE, SIM_MODE, TEMP_ROOM, V1_ANGLE_INIT, V2_ANGLE_INIT, V2_BED_ANGLE, V2_BYPASS_ANGLE, VALVE_1_ANGLES, VALVE_2_ANGLES } from './globals'
import { MultiValve } from './components/MultiValve/MultiValve'
import { Manometer } from './components/Manometer/Manometer'
import { BetaCtrl } from './components/BetaCtrl/BetaCtrl'
import { DigitalGauge } from './components/DigitalGauge/DigitalGauge'
import { BedContextProvider, type ContextDescriptor } from './components/Context'
import { AniLines } from './components/AniLines/AniLines'
import { SVGTooltip } from './components/Tooltip/TooltipSelector'

import { PlotlyChart } from './components/PlotlyChart'

function App() {
  const cylinders = createCylinders();

  const [valve1Angle, setValve1Angle] = createSignal(V1_ANGLE_INIT);
  const [valve2Angle, setValve2Angle] = createSignal(V2_ANGLE_INIT);
  const [showLines, setShowLines] = createSignal(false);

  const [massSP, setMassSP] = createSignal(MASS_FLOW_INIT);
  const currentCylinder = createMemo(() => {
    const cyl = cylinders.find(cyl => cyl.angle === valve1Angle());
    if (cyl === undefined) throw new Error(`Cylinder undefined for angle ${valve1Angle()}`);
    return cyl;
  });
  const bedPressure = expMemo(() => {
    const cyl = currentCylinder();
    return (valve2Angle() === V2_BYPASS_ANGLE) ? 0 : cyl.linePres();
  });

  const [temperature, setTemperature] = createSignal(TEMP_ROOM);
  const [out, setOut] = createSignal({ y: 0, u: 0 });

  const compLabel = createMemo(() => {
    if (valve2Angle() === V2_BYPASS_ANGLE) {
      const y = currentCylinder().yCO2;
      const flowing = massSP() > 0 && currentCylinder().linePres() > 0;
      return `${flowing ? (y * 100).toFixed(2) : "--"} %`;
    }
    else {
      const { y, u } = out();
      return `${u > 0.1 ? (y * 100).toFixed(2) : "--"} %`;
    }
  });

  const reset = () => window.location.reload();

  const ctxDescriptor: ContextDescriptor = {
    tempK: temperature,
    cylinder: currentCylinder,
    v2Angle: valve2Angle,
    massSP,
    onOut: setOut
  };

  return (
    <BedContextProvider descriptor={ctxDescriptor}>
      <div class="canvas-container">
        <SVGCanvas width={809} height={684} defs={Defs}>
          <Background />
          <Pipes />
          <For each={cylinders}>
            {
              cyl => { 
                let ref!: SVGGElement;
              return <>
                <CylinderValve x={cyl.x} y={324} pressure={cyl.cylPres.get} setPressure={cyl.cylPres.set} />
                <g ref={ref}>
                  <Regulator x={59 + cyl.x} y={310} inPres={cyl.cylPres.get} outPres={cyl.linePres} gasSP={cyl.regSP.get} setGasSP={cyl.regSP.set} />
                  <SVGTooltip x={59 + cyl.x} y={370} anchor={ref} label={() => `${(cyl.linePres()).toFixed(2)} bar`} width={70} height={26} />
                </g>
              </>}
            }
          </For>
          <Controller sp={massSP} setSP={setMassSP} range={[MIN_MASS_FLOWRATE, MAX_MASS_FLOWRATE]} step={MASS_FLOW_STEP} />
          <MultiValve x={303} y={240} key="valve1-ani" angle={valve1Angle} setAngle={setValve1Angle} directions={VALVE_1_ANGLES} setShowLines={setShowLines} />
          <MultiValve x={487} y={184} key="valve2-ani" angle={valve2Angle} setAngle={setValve2Angle} directions={VALVE_2_ANGLES} setShowLines={setShowLines} />

          <Manometer pressure={bedPressure} maxPressure={12} />
          <Show when={SIM_MODE === "desorption"}>
            <BetaCtrl temperature={temperature} setTemperature={setTemperature} range={[BETA_MIN, BETA_MAX]} step={BETA_STEP} />
          </Show>

          <DigitalGauge x={556} y={310} label={() => `${temperature().toFixed(0)} K`} />
          <DigitalGauge x={597} y={110} label={compLabel} />
          
          <AniLines 
            isShowing={showLines} 
            cyls={cylinders}
            cyl={currentCylinder} 
            passMfc={() => massSP() > 0}
            showLoop={() => valve2Angle() === V2_BED_ANGLE}
          />
        </SVGCanvas>

        {/* Hamburger */}
        <HamburgerMenu path={worksheet} downloadName="co2AdsorptionWorksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
      </div>

      <PlotlyChart />

    </BedContextProvider>
  )
}

export default App
