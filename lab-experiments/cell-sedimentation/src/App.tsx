import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'
import { VialsArray } from './ts/Vials'

function App() {

  const vials = new VialsArray();

  return (
    <>
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ThreeCanvas onUniformPreparation={vials.attachUniforms} onMatrixPreparation={() => {}} />
    </>
  )
}

export default App
