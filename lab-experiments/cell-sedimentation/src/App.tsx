import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'

function App() {

  return (
    <>
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ThreeCanvas />
    </>
  )
}

export default App
