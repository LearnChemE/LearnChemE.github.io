import { createSignal } from 'solid-js'
import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'

function App() {

  return (
    <>
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
    </>
  )
}

export default App
