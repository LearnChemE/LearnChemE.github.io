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

function App() {
  const aniTimer = new AnimationTimer();
  
  resetSignal.init();

  const reset = () => {
    resetSignal.emit();
  }

  return (
    <>
        <RxrContextProvider descriptor={{ aniTimer }}>
          <div class="canvas-container">
            {/* Hamburger */}
            <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
            <ControlButton icon="fa-solid fa-play" label="reset" left={155} onClick={() => aniTimer.play()} active={() => true} activeColor='#3d9c3b' />
            <SVGCanvas width={280} height={280} defs={Defs}>
              <Cartridge />
            </SVGCanvas>
          </div>
          <InjectMenu onClose={() => {}} />
        </RxrContextProvider>
    </>
  )
}

export default App
