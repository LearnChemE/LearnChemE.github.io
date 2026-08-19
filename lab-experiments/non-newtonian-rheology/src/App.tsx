import './App.css'
import { AppContextProvider } from './components/Context';
import { HamburgerMenu } from './components/Hamburger/Hamburger';

import worksheet from "./assets/worksheet.pdf";
import { AboutText, DirectionsText } from './components/Modal/modals';
import { ControlButton } from './components/ControlButton/ControlButton';
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas';
import Defs from './components/Defs';
import { AnimationTimer, resetSignal } from './globals';
import { Cylindrical } from './components/Cylindrical/Cylindrical';
import { Fade } from './components/Fade/Fade';
import { Arm } from './components/Arm/Arm';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { onMount } from 'solid-js';

function App() {

  const ctxDescriptor = {};

  // On reset
  resetSignal.init();
  const reset = () => {
    resetSignal.emit();
  };

  // Transition animation
  const transitionTimer = new AnimationTimer();
  onMount(() => {
    transitionTimer.play();
  })

  return (
    <>
      <AppContextProvider descriptor={ctxDescriptor}>
        <div class="canvas-container">
          {/* Hamburger */}
          <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
          <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
          
          <SVGCanvas width={135} height={190} defs={Defs}>
            <Cylindrical transition={transitionTimer} />
            <Fade opacity={() => .5}/>
            <Arm />
            <ControlPanel />
          </SVGCanvas>
        </div>
      </AppContextProvider>
    </>
  )
}

export default App
