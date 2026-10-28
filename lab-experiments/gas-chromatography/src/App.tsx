import './App.css'
import { AppContextProvider } from './components/Context';
import { HamburgerMenu } from './components/Hamburger/Hamburger';

import worksheet from "./assets/worksheet.pdf";
import { AboutText, DirectionsText } from './components/Modal/modals';
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas';
import Defs from './components/Defs';
import { AnimationTimer, EasedAnimation, easeInOutQuad, injectDuration, resetSignal } from './globals';
import { createMemo, createSignal } from 'solid-js';
import { GCFront } from './components/GCFront/GCFront';
import { InjForm } from './components/InjForm/InjForm';
import { ResultsList } from './components/ResultsList/ResultsList';
import { Syringe } from './components/Syringe/Syringe';

function App() {
  const [injReady, setInjReady] = createSignal(false);
  const [syringeFill, setSyringeFill] = createSignal(0); 
  const injectionTimer = new EasedAnimation(easeInOutQuad, injectDuration);
  injectionTimer.subscribe((_, t) => {
    setSyringeFill(1 - t);
  });

  const [injecting, setInjecting] = createSignal(false);
  const inject = () => {
    setInjecting(true);
    injectionTimer.play();
    setInjReady(false);
  }
  injectionTimer.onFinish(() => setInjecting(false));

  const [prepTimer, setPrepTimer] = createSignal<AnimationTimer | null>(null);
  const [prepProgress, setPrepProgress] = createSignal(0);
  const prepping = createMemo(() => prepTimer() !== null);
  const endPrepping = () => {
    setPrepTimer(null);
    setInjReady(true);
    setSyringeFill(1);
  }
  const startPrepping = () => {
    console.log("prepping")
    const duration = 1; // getDuration()
    const timer = new EasedAnimation(a=>a, duration);
    timer.onFinish(endPrepping);
    timer.subscribe((_, t) => setPrepProgress(t));
    setPrepTimer(timer);
    timer.play();
  }

  const ctxDescriptor = {};

  // On reset
  resetSignal.init();
  const reset = () => {
    resetSignal.emit();
    injectionTimer.reset();
    prepTimer()?.reset();
    setPrepTimer(null);
    setPrepProgress(0);
    setInjReady(false);
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
        <GCFront injReady={injReady} onInject={inject} injTimer={injectionTimer} />
        <Syringe fill={syringeFill} />
      </SVGCanvas>
      <InjForm prepBtnDisabled={() => prepping() || injecting()} startPrepping={startPrepping} prepProgress={prepProgress}  />
      <ResultsList />
    </div>

  </div>
</AppContextProvider>

</>
  );
}

export default App
