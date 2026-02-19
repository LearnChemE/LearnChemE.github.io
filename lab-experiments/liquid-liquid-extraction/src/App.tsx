import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import TopPipes from './components/TopPipes/TopPipes'
import Defs from './components/Defs'
import { Column } from './components/Column/Column'
import { colFull, paddedHeight, triggerResetEvent } from './globals'
import Rotameter from './components/Rotameter/Rotameter'
import Background from './components/Background/Background'
import Tank from './components/Tank/Tank'
import Valve from './components/Valve/Valve'
import Bucket from './components/Bucket/Bucket'
import Pipes from './components/Pipes/Pipes'
import { PowerSwitch } from './components/PowerSwitch/Switch'
import { batch, createEffect, createMemo, createSignal, Match, Show, Switch } from 'solid-js'
import { FEED_MAX_RATE, SOLVENT_MAX_RATE } from './ts/config'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { StagesMenu } from './components/StagesMenu/StagesMenu'
import { ControlButton } from './components/ControlButton/ControlButton'
import { ColumnData } from './components/Column/ColumnData'
import { PlotlyChart } from './components/PlotlyChart'
import { ColumnContextProvider } from './calcs'

function App() {
  const [feedIsOn, setFeedIsOn] = createSignal(false);
  const [solvIsOn, setSolvIsOn] = createSignal(false);
  const [feedLift, setFeedLift] = createSignal(0);
  const [solvLift, setSolvLift] = createSignal(0);
  const [showMenu, setShowMenu] = createSignal(true);
  const [lockStages, setLockStages] = createSignal(false);
  const [feedSwitchDisabled, setFeedSwitchDisabled] = createSignal(true);

  const solvRate = createMemo(() => {
    const effective_lift = solvLift() * (solvIsOn() ? 1 : 0)
    return SOLVENT_MAX_RATE * effective_lift;
  });

  const feedRate = createMemo(() => {
    const effective_lift = feedLift() * (feedIsOn() ? 1 : 0)
    return FEED_MAX_RATE * effective_lift;
  });

  // Lock in the stages when solvent is first turned on
  createEffect(() => {
    if (!lockStages() && solvIsOn()) {
      setShowMenu(false);
      setLockStages(true);
    }
  });

  // Reset simulation handler
  const reset = () => {
    batch(() => {
      setShowMenu(true);
      setLockStages(false);
      setFeedSwitchDisabled(true);

      // Reset streams
      setFeedIsOn(false);
      setFeedLift(0);
      setSolvIsOn(false);
      setSolvLift(0);

      // Trigger reset event so other scopes can reset
      triggerResetEvent();
    });
  };

  // Column Full Event
  createEffect(() => {
    if (colFull()) {
      setFeedSwitchDisabled(false);
    }
  })

  return (
    <>
    <ColumnContextProvider>
      <div class="canvas-container">
        <SVGCanvas width={740} height={560} defs={Defs}>
          <Background />
          <Bucket x={225} y={() => 257 + paddedHeight()} />
          <Bucket x={632} y={() => 257 + paddedHeight()} />
          <TopPipes />
          <Pipes />
          <PowerSwitch x={134} y={321 + paddedHeight()} label="feed" isOn={feedIsOn} setIsOn={setFeedIsOn} disabled={feedSwitchDisabled} />
          <PowerSwitch x={434} y={321 + paddedHeight()} label="solvent" isOn={solvIsOn} setIsOn={setSolvIsOn} />
          
          <Column solvIn={solvRate} feedIn={feedRate} />
          <Rotameter flowrate={feedRate} flowrange={[0, FEED_MAX_RATE]} x={145} y={64 + paddedHeight()} />
          <Rotameter flowrate={solvRate} flowrange={[0, SOLVENT_MAX_RATE]} x={477} y={64 + paddedHeight()} />
          <Tank x={31}  y={107 + paddedHeight()} />
          <Tank x={522} y={107 + paddedHeight()} />
          <Valve x={134.5} y={() => 195 + paddedHeight()} onLiftChange={setFeedLift} />
          <Valve x={466.5} y={() => 195 + paddedHeight()} onLiftChange={setSolvLift} />

          <Show when={feedIsOn()}>
            <ColumnData />
          </Show>
        </SVGCanvas>

        {/* Menu for selecting stages */}
        <Show when={showMenu()}>
          <StagesMenu onClose={() => setShowMenu(!showMenu())} />
        </Show>

        {/* Hamburger */}
        <HamburgerMenu path="" downloadName="lle_worksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <Switch>
          <Match when={!lockStages()}>
            <ControlButton icon="fa-solid fa-diagram-next" label="edit internals" top={100} onClick={() => setShowMenu(!showMenu())} active={showMenu} disabled={lockStages} />
          </Match>
          <Match when={true}>
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" top={100} onClick={reset} />
          </Match>
        </Switch>
      </div>
      <PlotlyChart />
    </ColumnContextProvider>
    </>
  )
}

export default App
