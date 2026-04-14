import { createSignal, For, Match, Switch } from 'solid-js'
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
import { createCylinders, expMemo, MASS_FLOW_STEP, MAX_MASS_FLOWRATE, MIN_MASS_FLOWRATE, VALVE_1_ANGLES, VALVE_2_ANGLES } from './globals'
import { MultiValve } from './components/MultiValve/MultiValve'
import { Manometer } from './components/Manometer/Manometer'

function App() {
  const cylinders = createCylinders();

  const [valve1Angle, setValve1Angle] = createSignal(180);
  const [valve2Angle, setValve2Angle] = createSignal(180);

  const [massSP, setMassSP] = createSignal(0);
  const bedPressure = expMemo(() => {
    const cyl = cylinders.find(cyl => cyl.angle === valve1Angle());
    if (cyl === undefined) throw new Error(`Cylinder undefined for angle ${valve1Angle()}`);

    return cyl.linePres();
  });

  const reset = () => {};

  return (
    <>
      <div class="canvas-container">
        <SVGCanvas width={809} height={684} defs={Defs}>
          <Background />
          <Pipes />
          <For each={cylinders}>
            {
              (cyl, idx) => <>
                <CylinderValve x={40 + idx() * 154} y={324} pressure={cyl.cylPres.get} setPressure={cyl.cylPres.set} />
                <Regulator x={99 + idx() * 154} y={310} inPres={cyl.cylPres.get} outPres={cyl.linePres} gasSP={cyl.regSP.get} setGasSP={cyl.regSP.set} />
              </>
            }
          </For>
          <Controller sp={massSP} setSP={setMassSP} range={[MIN_MASS_FLOWRATE, MAX_MASS_FLOWRATE]} step={MASS_FLOW_STEP} />
          <MultiValve x={303} y={240} angle={valve1Angle} setAngle={setValve1Angle} directions={VALVE_1_ANGLES} />
          <MultiValve x={487} y={184} angle={valve2Angle} setAngle={setValve2Angle} directions={VALVE_2_ANGLES} />

          <Manometer pressure={bedPressure} maxPressure={12} />
          
          {/* <ColumnData feedIsOn={feedIsOn} gasIsOn={() => gasRate() > 0} /> */}
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

    </>
  )
}

export default App
