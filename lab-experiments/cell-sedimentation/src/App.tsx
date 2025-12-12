import { createEffect, createSignal } from 'solid-js'
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
  const [mixTrigger, setMixTrigger] = createSignal(false);
  const [pause, setPause] = createSignal(false);
  const [animating, setAnimating] = createSignal(true);
  // const [plotProfile, setPlotProfile] = createSignal(createProfile({ xr0: 0.05, xw0: 0.05 }));

  const vials = new VialsArray();

  const reset = () => {
    // Reset vials
    setPause(false);
    vials.reset();
    setMagnifying(false);
    setAnimating(true);
    // Trigger mix animation
    setMixTrigger(!mixTrigger());
  }

  const onAnimationEnd = () => {
    vials.play();
    setAnimating(false);
  }

  createEffect(() => {
    if (pause()) {
      vials.pause();
    } else {
      vials.play();
    }
  });

  return (
    <>
      {/* Canvas */}
      <ThreeCanvas onUniformPreparation={vials.attachUniforms} drag={magnifying} mixTrigger={mixTrigger} onAnimationEnd={onAnimationEnd} />
      <Magnifier magnifying={magnifying} particleInfo={vials.getParticleInfo} />

      {/* Controls */}
      <HamburgerMenu path="" downloadName="" Directions={DirectionsText} About={AboutText} />
      <ControlButton icon="fa-solid fa-magnifying-glass" disabled={animating} active={magnifying} label="magnify particles" top={120} onClick={() => setMagnifying(!magnifying())} />
      <ControlButton icon="fa-solid fa-rotate" label="mix vials" top={190} disabled={animating} onClick={reset} />
      <ControlButton icon={() => { return pause() ? "fa-solid fa-play" : "fa-solid fa-pause" }} label="play/pause" top={260} disabled={animating} onClick={() => setPause(!pause())} />

      {/* <PlotlyChart data={plotProfile} layout={{ xaxis: { range: [0, 305] } }} /> */}
    </>
  )
}

export default App
