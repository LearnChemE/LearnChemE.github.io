import { createMemo, createSignal, For, Match, Switch, type Setter } from 'solid-js'
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
import { GasCylinder, MASS_FLOW_STEP, MAX_MASS_FLOWRATE, MIN_MASS_FLOWRATE, VALVE_1_ANGLES } from './globals'
import { MultiValve } from './components/MultiValve/MultiValve'

function App() {
  const cylinders = ["C90", "C10", "N"].map((key, idx) => new GasCylinder(key, 40 + idx * 154));

  const [cylValvePres, setCylValvePres] = createSignal(0);
  const [pressureSP, setPressureSP] = createSignal(0);
  const linePressure = createMemo(() => Math.min(cylValvePres(), pressureSP()));

  const [valve1Angle, setValve1Angle] = createSignal(0);

  const [massSP, setMassSP] = createSignal(0);
  const bedPressure = createMemo(() => {
    const idx = VALVE_1_ANGLES.findIndex(val => val === valve1Angle());
    const curCyl = cylinders[idx];
    return curCyl.linePres();
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
                <CylinderValve x={40 + idx() * 154} y={324} pressure={cyl.getCylPres} setPressure={cyl.setCylPres} />
                <Regulator x={99 + idx() * 154} y={310} inPres={cyl.getCylPres} outPres={cyl.linePres} gasSP={cyl.getRegSP} setGasSP={cyl.setRegSP} />
              </>
            }
          </For>
          <Controller sp={massSP} setSP={setMassSP} range={[MIN_MASS_FLOWRATE, MAX_MASS_FLOWRATE]} step={MASS_FLOW_STEP} />
          <MultiValve x={303} y={240} angle={valve1Angle} setAngle={setValve1Angle} directions={VALVE_1_ANGLES} />
          
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
