import { createSignal } from 'solid-js'
import './App.css'
import { ControlButton } from './components/ControlButton/ControlButton'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'
import { VialsArray } from './ts/Vials'

function App() {
  const [magnifying, setMagnifying] = createSignal(false);

  const vials = new VialsArray();

  return (
    <>
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ThreeCanvas onUniformPreparation={vials.attachUniforms} drag={magnifying} />
      <ControlButton icon="fa-solid fa-magnifying-glass" active={magnifying} label="mix vials" top={120} onClick={() => setMagnifying(!magnifying())} />
      <ControlButton icon="fa-solid fa-rotate" label="mix vials" top={190} onClick={vials.resetAnimation} />
    </>
  )
}

export default App
