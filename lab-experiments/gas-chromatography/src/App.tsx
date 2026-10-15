import './App.css'
import { AppContextProvider } from './components/Context';
import { HamburgerMenu } from './components/Hamburger/Hamburger';

import worksheet from "./assets/worksheet.pdf";
import { AboutText, DirectionsText } from './components/Modal/modals';
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas';
import Defs from './components/Defs';
import { AnimationTimer, aniSeqDescriptors, injectDuration, resetSignal } from './globals';
import { createMemo, createSignal } from 'solid-js';
import { GCFront } from './components/GCFront/GCFront';
import { Slider } from './components/Slider/Slider';

function App() {
  const [injReady, setInjReady] = createSignal(false);
  const injectionTimer = new AnimationTimer(injectDuration);
  const [injecting, setInjecting] = createSignal(false);
  const inject = () => {
    setInjecting(true);
    injectionTimer.play();
  }
  injectionTimer.onFinish(() => setInjecting(false));

  const [prepTimer, setPrepTimer] = createSignal<AnimationTimer | null>(null);
  const prepping = createMemo(() => prepTimer() !== null);
  const endPrepping = () => {
    setPrepTimer(null);
    setInjReady(true);
  }
  const startPrepping = () => {
    const duration = 1; // getDuration()
    const timer = new AnimationTimer(duration);
    timer.onFinish(endPrepping);
  }

  const ctxDescriptor = {};

  // On reset
  resetSignal.init();
  const reset = () => {
    resetSignal.emit();
    injectionTimer.reset();
    setPrepTimer(null);
    setInjecting(false);
  };

  return (
<>

<AppContextProvider descriptor={ctxDescriptor}>
  <div class="canvas-container">
    {/* Hamburger */}
    <HamburgerMenu left={0} top={0} path={worksheet} downloadName="gcWorksheet.pdf" Directions={DirectionsText} About={AboutText} />

    <div class="sim-wrapper">
      {/* Graphics canvas */}
      <SVGCanvas width={203} height={186} defs={Defs}>
        <GCFront prepTimer={prepTimer} injTimer={injectionTimer} />
      </SVGCanvas>
      <div class="inj-form">
        <Slider value={() => 1} label='option 1' />
        <Slider value={() => 2} label='option 2' />
        <button class="prep-btn" disabled={prepping() || injecting()} onclick={startPrepping}>Prep</button>
      </div>
    </div>

  </div>
</AppContextProvider>

</>
  );
}

export default App
