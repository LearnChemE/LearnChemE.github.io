import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import worksheet from "./assets/worksheet.pdf?url"
import { AboutText, DirectionsText } from './components/Modal/modals'
import { RxrContextProvider } from './components/Context'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Defs from './components/Defs'
import { resetSignal } from './globals'
import { Cartridge } from './components/Cartridge/Cartridge'

function App() {
  
  resetSignal.init();

  return (
    <>
        <RxrContextProvider descriptor={{ }}>
          <div class="canvas-container">
            {/* Hamburger */}
            <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
            <SVGCanvas width={280} height={280} defs={Defs}>
              <Cartridge />
              
            </SVGCanvas>
          </div>
        </RxrContextProvider>
    </>
  )
}

export default App
