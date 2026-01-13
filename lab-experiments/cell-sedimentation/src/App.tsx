import { createEffect, createSignal } from 'solid-js'
import './App.css'
import { ControlButton } from './components/ControlButton/ControlButton'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ThreeCanvas } from './components/ThreeCanvas/ThreeCanvas'
import { VialsArray } from './ts/Vials'
import { Magnifier } from './components/Magnifier/Magnifier'
import type { InitConc } from './types/globals'
import { TooltipSelector } from './components/Tooltip/TooltipSelector'
// import { PlotlyChart } from './components/PlotlyChart'
// import { createProfile } from './ts/calcs'
import { LoadWheel } from './components/LoadWheel/LoadWheel'
import { ConcSelector } from './components/ConcSelector/ConcSelector'
import { Ruler } from './components/Ruler/Ruler'
import worksheet from "./assets/worksheet.pdf?url";

function App() {
  const [loading, setLoading] = createSignal(true);
  const [magnifying, setMagnifying] = createSignal(false);
  const [mixTrigger, setMixTrigger] = createSignal(false);
  const [pause, setPause] = createSignal(false);
  const [animating, setAnimating] = createSignal(true);
  const [concMenuShowing, setConcMenuShowing] = createSignal(false);
  const [ics, setIcs] = createSignal<Array<InitConc>>([
      { xr0: 0.60, xw0: 0.05 },
      { xr0: 0.45, xw0: 0.05 },
      { xr0: 0.30, xw0: 0.05 },
      { xr0: 0.15, xw0: 0.05 },
      { xr0: 0.05, xw0: 0.05 },
  ]);

  // const [plotProfile, setPlotProfile] = createSignal(createProfile({ xr0: 0.05, xw0: 0.05 }));

  const vials = new VialsArray(ics(), setLoading);
  // vials.attachPlot(4, setPlotProfile);

  const reset = () => {
    // Reset vials
    setPause(false);
    vials.reset(ics());
    setMagnifying(false);
    setAnimating(true);
    // Trigger mix animation
    setMixTrigger(!mixTrigger());
  }

  const onAnimationEnd = () => {
    setAnimating(false);
    vials.play();
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
      <Ruler showing={() => !animating()} />
      <Magnifier magnifying={magnifying} particleInfo={vials.getParticleInfo} />
      <LoadWheel isLoading={loading} />

      {/* Controls */}
      <HamburgerMenu path={worksheet} downloadName="bloodCellSedimentationWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
      <ConcSelector showing={concMenuShowing} ics={ics} setIcs={setIcs} resetMessage={mixTrigger} />
      <ControlButton icon="fa-solid fa-magnifying-glass" disabled={animating} active={magnifying} label="magnify particles" top={120} onClick={() => setMagnifying(!magnifying())} />
      <ControlButton icon="fa-solid fa-rotate" label="mix vials" top={190} disabled={animating} onClick={reset} />
      <ControlButton icon={() => { return pause() ? "fa-solid fa-play" : "fa-solid fa-pause" }} label="play/pause" top={260} disabled={animating} onClick={() => setPause(!pause())} />
      <ControlButton icon="fa-solid fa-vial" label="change vial compositions" top={330} onClick={() => setConcMenuShowing(!concMenuShowing())} active={concMenuShowing} />

      <TooltipSelector showing={() => !animating()} ics={ics} />
      {/* <PlotlyChart data={plotProfile} layout={{ xaxis: { range: [0, 305] } }} /> */}
    </>
  )
}

export default App
