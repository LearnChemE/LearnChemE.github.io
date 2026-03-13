import { batch, createMemo, createSignal, Match, Show, Switch } from 'solid-js'
import './App.css'
// import { PlotlyChart } from './components/PlotlyChart'
import { ControlButton } from './components/ControlButton/ControlButton'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Background from './components/Background/Background'
import Bucket from './components/Bucket/Bucket'
import Pipes from './components/Pipes/Pipes'
import { PowerSwitch } from './components/PowerSwitch/Switch'
import { Column } from './components/Column/Column'
import Rotameter from './components/Rotameter/Rotameter'
import Tank from './components/Tank/Tank'
import Valve from './components/Valve/Valve'
import { ColumnData } from './components/Column/ColumnData'
import { StagesMenu } from './components/StagesMenu/StagesMenu'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import worksheet from "./assets/worksheet.pdf?url";
import { AboutText, DirectionsText } from './components/Modal/modals'
import Defs from './components/Defs'
import { paddedHeight } from './globals/signals'
import { FEED_MAX_RATE, INIT_FEED_LIFT, INIT_GAS_SP } from './globals/config'
import TopPipes from './components/TopPipes/TopPipes'

function App() {
  // Liquid feed
  const [feedLift, setFeedLift] = createSignal(INIT_FEED_LIFT);
  const [feedIsOn, setFeedIsOn] = createSignal(false);
  const feedRate = createMemo(() => feedIsOn() ? feedLift() * FEED_MAX_RATE : 0);

  // Gas Pressure
  const [gasLinePressurized, setGasLinePressurized] = createSignal(false);
  const [pressureSP, setPressureSP] = createSignal(false);
  const gasPressure = createMemo(() => gasLinePressurized() ? pressureSP() : 0);

  // Gas flowrate
  const [gasSP, setGasSP] = createSignal(INIT_GAS_SP);
  const gasRate = createMemo(() => gasLinePressurized() ? gasSP() : 0);
  
  const [showMenu, setShowMenu] = createSignal(true);
  const [lockStages, setLockStages] = createSignal(false);

  const reset = () => {
    batch(() => {
      setGasLinePressurized(false);
      setFeedIsOn(false);
      setPressureSP(false);
      setLockStages(false);
      setShowMenu(true);
    })
  }

  return (
    <>
      <div class="canvas-container">
        <SVGCanvas width={700} height={560} defs={Defs}>
          <Background />
          <Bucket x={225} y={() => 257 + paddedHeight()} />
          <TopPipes />
          <Pipes />
          <PowerSwitch x={134} y={321 + paddedHeight()} label="feed" isOn={feedIsOn} setIsOn={setFeedIsOn} />
          
          <Column gasIn={gasRate} feedIn={feedRate} />
          <Rotameter flowrate={feedRate} flowrange={[0, FEED_MAX_RATE]} x={145} y={64 + paddedHeight()} />
          <Tank x={31}  y={107 + paddedHeight()} />
          <Valve x={134.5} y={() => 195 + paddedHeight()} onLiftChange={setFeedLift} initialLift={INIT_FEED_LIFT} />

          <ColumnData feedIsOn={feedIsOn} />
        </SVGCanvas>

        {/* Menu for selecting stages */}
        <Show when={showMenu()}>
          <StagesMenu onClose={() => setShowMenu(!showMenu())} />
        </Show>

        {/* Hamburger */}
        <HamburgerMenu path={worksheet} downloadName="strippingCol_worksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <Switch>
          <Match when={!lockStages()}>
            <ControlButton icon="fa-solid fa-diagram-next" label="edit internals" top={100} onClick={() => setShowMenu(!showMenu())} active={showMenu} disabled={lockStages} />
          </Match>
          <Match when={true}>
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" top={100} onClick={reset} active={() => true} activeColor='#FF3B3B' />
          </Match>
        </Switch>
      </div>
      {/* <PlotlyChart /> */}
    </>
  )
}

export default App
