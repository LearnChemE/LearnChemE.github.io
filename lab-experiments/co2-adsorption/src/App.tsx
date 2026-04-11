import { createMemo, createSignal, Match, Switch } from 'solid-js'
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
import { MASS_FLOW_STEP, MAX_MASS_FLOWRATE, MIN_MASS_FLOWRATE } from './globals'

function App() {
  const [cylValvePres, setCylValvePres] = createSignal(0);
  const [pressureSP, setPressureSP] = createSignal(0);
  const [massSP, setMassSP] = createSignal(0);
  const linePressure = createMemo(() => Math.min(cylValvePres(), pressureSP()));

  const reset = () => {};

  return (
    <>
      <div class="canvas-container">
        <SVGCanvas width={700} height={560} defs={Defs}>
          <Background />
          <Pipes />
          <Regulator inPres={cylValvePres} outPres={linePressure} gasSP={pressureSP} setGasSP={setPressureSP} />
          <CylinderValve pressure={cylValvePres} setPressure={setCylValvePres} />
          <Controller sp={massSP} setSP={setMassSP} range={[MIN_MASS_FLOWRATE, MAX_MASS_FLOWRATE]} step={MASS_FLOW_STEP} />
          
          {/* <Valve x={134.5} y={() => 195 + paddedHeight()} onLiftChange={setFeedLift} initialLift={INIT_FEED_LIFT} /> */}

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
