import { createEffect, createMemo, createSignal, onMount } from 'solid-js';
import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import worksheet from './media/antoine_constants_worksheet.pdf'
import Gauge from './components/Gauge/Gauge';
import { StaticElements } from './components/Static/Static';
import { animate, enableWindowResize, initSvgDrag, initSvgZoom } from './ts/helpers';
import { Syringe } from './components/Syringe/Syringe';
import { Button } from './components/Button/Button';
import { Label } from './components/Label/Label';
import { Slider } from './components/Slider/Slider';
import { SelectList } from './components/List/List';
import { substances } from './ts/calcs';

function App() {
  const [syringeVol, setSyringeVol] = createSignal(0);
  const [molsInTank, setMolsInTank] = createSignal(0);
  const [injecting, setInjecting] = createSignal(false);
  // Controls
  const [temperature, setTemperature] = createSignal(40); // °C
  const [volumeToInject, setVolumeToInject] = createSignal(0.5); // mL
  const [substance, setSubstance] = createSignal(substances[0]);
  // Pressure
  const [pressure, setPressure] = createSignal(0);
  const [targetPressure, setTargetPressure] = createSignal(0);

  let playing = false;
  const playTankAni = () => {
    if (playing) return;
    playing = true;

    const frame = (dt: number) => {
      setPressure(p => smoothler)

      return playing;
    }
  }

  // Animate pressure when target is changed
  createEffect(() => {
    targetPressure();
    playTankAni();
  });

  const fillSyringe = () => {
    setSyringeVol(volumeToInject());
  }
  
  const inject = () => {
    if (injecting()) return; // Prevent multiple injections
    setInjecting(true);
    
    const frame = (dt: number) => {
      let injected = 0;
      setSyringeVol(v => {
        const newV = v - 0.33 * dt; // Inject at 0.5 L/s
        injected = v - newV;
        if (newV <= 0) {
          setInjecting(false);
          return 0;
        }
        return newV;
      });
      // Update moles injected
      setMolsInTank(n => n + injected * 0.04087); // Multiply by concentration (M) to get moles

      return injecting();
    }
    // Start animation
    animate(frame);
  }

  const reset = () => {
    setSubstance(substances[0]);
    setTemperature(40);
    setVolumeToInject(.5);
    setMolsInTank(0);

  }

  // On mount, setup zooming and dragging
  onMount(() => {
    // Initialize SVG zooming
    initSvgZoom();
    // Initialize SVG dragging with exempt element IDs
    initSvgDrag();
    // Add the resizing handler
    enableWindowResize();
  });

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='antoine_constants_worksheet.pdf' Directions={DirectionsText} About={AboutText} />
      <div style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'grid', "grid-template-columns": "auto auto", gap: '3rem', 'z-index': 10}}>
        <Slider label="temperature:"      units="°C" min={() => substance().tempRange[0]} max={() => substance().tempRange[1]} step={1} initValue={50} onChange={setTemperature} disabled={injecting} />
        <Slider label="volume to inject:" units="mL" min={0} max={1} step={.01} initValue={0.5} onChange={setVolumeToInject} decimalPlaces={2} disabled={injecting} />
      </div>
      
      {/* SVG */}
      <svg width="583" viewBox="0 0 583 391" height="391" fill="none" xmlns="http://www.w3.org/2000/svg">
        <StaticElements />
        <Syringe vol={syringeVol} />
        <Gauge pressure={pressure} maxPressure={1.2} />
        {/* Labels */}
        <Label fontSize="16" x={185} y={380} text="tank volume = 4 L" />
        <Label fontSize="12" x={355} y={230} text={() => `syringe contains ${syringeVol().toFixed(2)} mL liquid`} />
      </svg>
      {/* End SVG */}

      {/* Controls */}
      <SelectList items={substances} onSelect={setSubstance} right={20} bottom={170} />
      <Button coords={{ x: 20, y:  20 }} label="reset" onClick={reset} color="#e94646ff" />
      <Button coords={{ x: 20, y:  70 }} label="inject" onClick={inject} color="#67af55ff" disabled={injecting} />
      <Button coords={{ x: 20, y: 120 }} label="fill syringe" onClick={fillSyringe} color="#659ee9ff" disabled={injecting} />
      {/* End Controls */}
    </>
  )
}

export default App
