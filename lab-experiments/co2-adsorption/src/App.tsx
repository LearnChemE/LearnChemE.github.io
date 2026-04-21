import { createMemo, createSignal, For, Match, Show, Switch } from 'solid-js'
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
import { BETA_MAX, BETA_MIN, BETA_STEP, createCylinders, expMemo, MASS_FLOW_STEP, MAX_MASS_FLOWRATE, MIN_MASS_FLOWRATE, SIM_MODE, TEMP_ROOM, V1_N2_ANGLE, V2_BYPASS_ANGLE, VALVE_1_ANGLES, VALVE_2_ANGLES } from './globals'
import { MultiValve } from './components/MultiValve/MultiValve'
import { Manometer } from './components/Manometer/Manometer'
import { BetaCtrl } from './components/BetaCtrl/BetaCtrl'
import { DigitalGauge } from './components/DigitalGauge/DigitalGauge'
import { BedContextProvider, type ContextDescriptor } from './components/Context'
import { PlotlyChart } from './components/PlotlyChart'
import { AniLines } from './components/AniLines/AniLines'

function App() {
  const cylinders = createCylinders();

  const [valve1Angle, setValve1Angle] = createSignal(V1_N2_ANGLE);
  const [valve2Angle, setValve2Angle] = createSignal(V2_BYPASS_ANGLE);
  const [showLines, setShowLines] = createSignal(false);

  const [massSP, setMassSP] = createSignal(0);
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
      const flowing = massSP() > 0 && bedPressure() > 0;
      return `${flowing ? (y * 100).toFixed(2) : "--"} %`;
    }
    else {
      const { y, u } = out();
      console.log("velocity:", u)
      return `${u > 0.1 ? (y * 100).toFixed(2) : "--"} %`;
    }
  });

  const reset = () => {};

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
              cyl => <>
                <CylinderValve x={cyl.x} y={324} pressure={cyl.cylPres.get} setPressure={cyl.cylPres.set} />
                <Regulator x={59 + cyl.x} y={310} inPres={cyl.cylPres.get} outPres={cyl.linePres} gasSP={cyl.regSP.get} setGasSP={cyl.regSP.set} />
              </>
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
          
          <AniLines isShowing={showLines} />
        </SVGCanvas>


        {/* Menu for selecting stages */}
        {/* <Show when={showMenu()}>
          <StagesMenu onClose={() => setShowMenu(!showMenu())} />
        </Show> */}

        {/* Hamburger */}
        <HamburgerMenu path={worksheet} downloadName="co2AdsorptionWorksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <Switch>
          {/* <Match when={!lockStages()}>
            <ControlButton icon="fa-solid fa-diagram-next" label="edit internals" top={100} onClick={() => setShowMenu(!showMenu())} active={showMenu} disabled={lockStages} />
          </Match> */}
          <Match when={true}>
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" top={100} onClick={reset} active={() => true} activeColor='#FF3B3B' />
          </Match>
        </Switch>
      </div>

      <PlotlyChart />

    </BedContextProvider>
  )
}

export default App
