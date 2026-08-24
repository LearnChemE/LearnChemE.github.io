import './App.css'
import { AppContextProvider } from './components/Context';
import { HamburgerMenu } from './components/Hamburger/Hamburger';

import worksheet from "./assets/worksheet.pdf";
import { AboutText, DirectionsText } from './components/Modal/modals';
import { ControlButton } from './components/ControlButton/ControlButton';
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas';
import Defs from './components/Defs';
import { AnimationSequence, Fluids, resetSignal, transitionDescriptors, type MenuFluidType } from './globals';
import { Cylindrical } from './components/Cylindrical/Cylindrical';
import { Fade } from './components/Fade/Fade';
import { Arm } from './components/Arm/Arm';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { Streamlines } from './components/Streamlines/Streamlines';
import { SelectList, type ListItem } from './components/SelectList/SelectList';

function App() {
  const [rpm, setRpm] = createSignal(0);
  const [showStream, setShowStream] = createSignal(false);
  const [aniDone, setAniDone] = createSignal(false);
  const [started, setStarted] = createSignal(false);
  const [fluid, setFluid] = createSignal<ListItem>(Fluids[0]);
  const [force, setForce] = createSignal(0);

  const ctxDescriptor = {};

  // On reset
  resetSignal.init();
  const reset = () => {
    resetSignal.emit();
    transitionTimer.reset();

    // Signals
    setStarted(false);
    setAniDone(false);
    setShowStream(false);
    setRpm(0);
  };

  // Transition animation
  const transitionTimer = new AnimationSequence(transitionDescriptors);
  const start = () => {
    setStarted(true);
    transitionTimer.play();
  }

  transitionTimer.getSegment("rotate").onFinish(() => {
    setShowStream(true);
  });
  transitionTimer.getSegment("fade-in").onFinish(() => {
    setAniDone(true);
  });

  return (
    <>
      <AppContextProvider descriptor={ctxDescriptor}>
        <div class="canvas-container">
          {/* Hamburger */}
          <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
          <Switch>
            <Match when={!started()}>
              <ControlButton icon="fa-solid fa-play" label="play" left={90} onClick={start} active={() => true} activeColor='#3d9c3b' />
            </Match>
            <Match when={true}>
              <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
            </Match>
          </Switch>
          <Show when={!started()}>
            <SelectList key="fluid-select" label="fluid selection:" options={Fluids} selected={fluid} setSelected={setFluid} />
          </Show>  
          <SVGCanvas width={160} height={190} defs={Defs}>
            <Arm transition={transitionTimer} force={force} />
            <Cylindrical transition={transitionTimer} fillColor={() => (fluid() as MenuFluidType).color} />
            <Fade transition={transitionTimer} />
            <ControlPanel disabled={() => !aniDone()} rpm={rpm} setRpm={setRpm} />
            <Streamlines rate={rpm} showing={showStream} />
          </SVGCanvas>
        </div>
      </AppContextProvider>
    </>
  )
}

export default App
