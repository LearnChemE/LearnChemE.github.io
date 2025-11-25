import { createSignal, onMount } from 'solid-js'
import './App.css'
import { ControlButton } from './components/ControlButton/ControlButton'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'
import { VialsArray } from './ts/Vials'
import { Magnifier } from './components/Magnifier/Magnifier'
// import { PlotlyChart } from './components/PlotlyChart'
// import { createProfile } from './ts/calcs'
import { constrain } from './ts/helpers'

function App() {
  const [magnifying, setMagnifying] = createSignal(false);
  const [pInfo, setPInfo] = createSignal({ num: 0, fracR: 0, rVel: 0, wVel: 0 });
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  // const [plotProfile, setPlotProfile] = createSignal(createProfile({ xr0: 0.05, xw0: 0.05 }));

  const followMouse = (evt: MouseEvent | Touch) => {
      // Set new coordinates for the magnifier
      const bds = document.getElementById("root")!.getBoundingClientRect();
      // Y
      const topBd =  8.5;
      const botBd = 90.5;
      // X
      const vialWidth = .086;
      const lBd = .328 - vialWidth / 2;
      const x_cnv = (evt.clientX - bds.x) / bds.width;
      const y_cnv = (evt.clientY - bds.y) / bds.height;
      // Determine vial
      const vial = constrain(Math.floor((x_cnv - lBd) / vialWidth), 0, 4);

      // Calculate new coords
      const newCoord = {
          x: 32.8 + vial * vialWidth * 100, 
          y: constrain(y_cnv * 100, topBd, botBd)
      };
      setCoord(newCoord);
      const vialY = (newCoord.y - topBd) / (botBd - topBd) * 305;
      const partInfo = vials.getParticleInfo(vial, vialY);
      setPInfo(partInfo);
  }

  onMount(() => {
      window.addEventListener("pointermove", followMouse);
  });


  const vials = new VialsArray();
  // vials.attachPlot(0, setPlotProfile);

  return (
    <>
      {/* Canvas */}
      <ThreeCanvas onUniformPreparation={vials.attachUniforms} drag={magnifying} />
      <Magnifier magnifying={magnifying} coord={coord} particleInfo={pInfo} />

      {/* Controls */}
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ControlButton icon="fa-solid fa-magnifying-glass" active={magnifying} label="mix vials" top={120} onClick={() => setMagnifying(!magnifying())} />
      <ControlButton icon="fa-solid fa-rotate" label="mix vials" top={190} onClick={vials.reset} />

      {/* <PlotlyChart data={plotProfile} layout={{ xaxis: { range: [0, 305] } }} /> */}
    </>
  )
}

export default App
