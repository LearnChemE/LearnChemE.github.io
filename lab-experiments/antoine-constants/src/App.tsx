import { createSignal } from 'solid-js';
import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import worksheet from './media/antoine_constants_worksheet.pdf'
import Gauge from './components/Gauge/Gauge';
import { StaticElements } from './components/Static/Static';

function App() {
  const [pressure, setPressure] = createSignal(0);

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='antoine_constants_worksheet.pdf' Directions={DirectionsText} About={AboutText} />
      
      {/* SVG */}
      <svg width="583" height="391" fill="none" xmlns="http://www.w3.org/2000/svg">
        <StaticElements />
      <Gauge pressure={pressure} maxPressure={1.2} />
      </svg>
      {/* End SVG */}
    </>
  )
}

export default App
