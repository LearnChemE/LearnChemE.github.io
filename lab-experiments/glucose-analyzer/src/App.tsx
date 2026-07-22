import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import worksheet from "./assets/worksheet.pdf?url"
import { AboutText, DirectionsText } from './components/Modal/modals'
import { RxrContextProvider } from './components/Context'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Defs from './components/Defs'
import { resetSignal } from './globals'
import { Cartridge } from './components/Cartridge/Cartridge'
import { AnimationTimer } from './globals/animate'
import { ControlButton } from './components/ControlButton/ControlButton'
import { InjectMenu } from './components/InjectMenu/InjectMenu'
import { createSignal, Show } from 'solid-js'

function App() {
  const [showInj, setShowInj] = createSignal(true);
  const [playing, setPlaying] = createSignal(false);

  const aniTimer = new AnimationTimer();
  const injTimer = new AnimationTimer();
  
  resetSignal.init();

  const reset = () => {
    resetSignal.emit();
    setShowInj(false);
  }

  const inject = () => {
    injTimer.play();
    setShowInj(false);
  }

  const play = () => {
    aniTimer.play();
    setPlaying(true);
  }

  const rxrCtxDescriptor = { 
    aniTimer, 
    injTimer,
    playing
  };

  return (
    <>
        <RxrContextProvider descriptor={rxrCtxDescriptor}>
          <div class="canvas-container">
            {/* Hamburger */}
            <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
            <ControlButton icon="fa-solid fa-play" label="reset" left={155} onClick={play} active={() => true} activeColor='#3d9c3b' disabled={showInj} />
            <SVGCanvas width={280} height={280} defs={Defs}>
              <Cartridge />
            </SVGCanvas>
          </div>
          <Show when={showInj()}>
            <InjectMenu key="upper" onInject={inject} />
          </Show>
        </RxrContextProvider>
    </>
  )
}

export default App
