import { createSignal } from 'solid-js'
import './App.css'
import { ControlButton } from './components/ControlButton/ControlButton'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'
import { VialsArray } from './ts/Vials'
import { Magnifier } from './components/Magnifier/Magnifier'
// import { PlotlyChart } from './components/PlotlyChart'
// import { createProfile } from './ts/calcs'

function App() {
  const [magnifying, setMagnifying] = createSignal(false);
  // const [plotProfile, setPlotProfile] = createSignal(createProfile({ xr0: 0.05, xw0: 0.05 }));

  const vials = new VialsArray();
  // vials.attachPlot(4, setPlotProfile);

  return (
    <>
      {/* Canvas */}
      <ThreeCanvas onUniformPreparation={vials.attachUniforms} drag={magnifying} />
      <Magnifier magnifying={magnifying} particleInfo={vials.getParticleInfo} />

      {/* Controls */}
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ControlButton icon="fa-solid fa-magnifying-glass" active={magnifying} label="mix vials" top={120} onClick={() => setMagnifying(!magnifying())} />
      <ControlButton icon="fa-solid fa-rotate" label="mix vials" top={190} onClick={vials.reset} />

      {/* <PlotlyChart data={plotProfile} layout={{ xaxis: { range: [0, 305] } }} /> */}
    </>
  )
}

export default App
