import { createSignal, onMount } from 'solid-js';
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

function App() {
  const [pressure, setPressure] = createSignal(0);
  const [syringeVol, setSyringeVol] = createSignal(0);
  const [molsInTank, setMolsInTank] = createSignal(0);
  const [injecting, setInjecting] = createSignal(false);
  // Sliders
  const [temperature, setTemperature] = createSignal(50); // °C
  const [volumeToInject, setVolumeToInject] = createSignal(50); // mL

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

  // On mount, setup zooming and dragging
  onMount(() => {
    // Initialize SVG zooming
    initSvgZoom();
    // Initialize SVG dragging with exempt element IDs
    initSvgDrag();
    // Add the resizing handler
    enableWindowResize();
  });

  // Memos to determine what is disabled

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='antoine_constants_worksheet.pdf' Directions={DirectionsText} About={AboutText} />
      <div style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'grid', "grid-template-columns": "auto auto", gap: '3rem', 'z-index': 10}}>
        <Slider label="temperature:"      units="°C" min={0} max={100} step={1} initValue={50} onChange={setTemperature} />
        <Slider label="volume to inject:" units="mL" min={0} max={1} step={.01} initValue={0.5} onChange={setVolumeToInject} decimalPlaces={2} />
      </div>
      
      {/* SVG */}
      <svg width="583" viewBox="0 0 583 391" height="391" fill="none" xmlns="http://www.w3.org/2000/svg">
        <StaticElements />
        <Syringe vol={syringeVol} />
        <Gauge pressure={pressure} maxPressure={1.2} />
        {/* Labels */}
        <Label fontSize="16" x={185} y={380} text="tank volume = 4 L" />
      </svg>
      {/* End SVG */}

      {/* Controls */}
      <Button coords={{ x: 20, y:  20 }} label="reset" onClick={() => setPressure(0)} color="#e94646ff" />
      <Button coords={{ x: 20, y:  70 }} label="inject" onClick={inject} color="#67af55ff" disabled={injecting} />
      <Button coords={{ x: 20, y: 120 }} label="fill syringe" onClick={fillSyringe} color="#659ee9ff" disabled={injecting} />
      {/* End Controls */}
    </>
  )
}

export default App
