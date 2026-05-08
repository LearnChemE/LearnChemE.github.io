import { createEffect, createSignal, onMount } from 'solid-js';
import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import { AboutText, DirectionsText } from './components/Modal/modals'
import worksheet from './media/antoine_constants_worksheet.pdf'
import Gauge from './components/Gauge/Gauge';
import { StaticElements } from './components/Static/Static';
import { animate, animateEase, easeInOut, enableWindowResize, expMemo, initSvgDrag, initSvgZoom } from './ts/helpers';
import { Syringe } from './components/Syringe/Syringe';
import { Button } from './components/Button/Button';
import { Label } from './components/Label/Label';
import { Slider } from './components/Slider/Slider';
import { SelectList } from './components/List/List';
import { calcPressure, substances, TankVolume, type Substance } from './ts/calcs';
import { Thermometer } from './components/Thermometer/Thermometer';
import Magnifier from './components/Magnifier/Magnifier';

function App() {
  const [syringeVol, setSyringeVol] = createSignal(0);
  const [volInTank, setVolInTank] = createSignal(0);
  const [injecting, setInjecting] = createSignal(false);
  // Controls
  const [temperature, setTemperature] = createSignal(40); // °C
  const [displayTemp, setDisplayTemp] = expMemo(temperature, 1, .1);
  const [volumeToInject, setVolumeToInject] = createSignal(0.5); // mL
  const [substance, setSubstance] = createSignal(substances[0]);
  // Pressure
  // const [pressure, setPressure] = createSignal(0);
  // Labels
  const [topLabelText, setTopLabelText] = createSignal("the tank is empty.\nready to fill the syringe");
  const [bottomLabelText, setBottomLabelText] = createSignal("test");
  // Syringe angle for animation
  const [syringeAngle, setSyringeAngle] = createSignal(15);

  const [pressure, setPressure] = expMemo(() => {
    const v = volInTank();
    const T = temperature();
    return calcPressure(substance(), v, T);
  }, 2, .0001);

  // let playing = false;
  // const playTankAni = () => {
  //   if (playing) return;
  //   playing = true;

  //   const frame = (dt: number) => {
  //     const r = Math.exp(-1/2);
  //     setPressure(p => {
  //       p = smoothLerp(p, targetPressure(), r, dt);
  //       if (Math.abs(p - targetPressure()) <= .1) {
  //         playing = false;
  //         return targetPressure();
  //       }
  //       return p;
  //     });

  //     return playing;
  //   }

  //   animate(frame);
  // }

  // // Animate pressure when target is changed
  // createEffect(() => {
  //   targetPressure();
  //   playTankAni();
  // });

  const syringeAniDuration = 1000; // ms
  let syringeAniPlaying = false;
  const playSyringeAni = () => {
    if (syringeAniPlaying) return;
    syringeAniPlaying = true;
    const targetAngle = 0;

    const frame = (s: number) => {
      const angle = s * targetAngle + (1 - s) * 15;
      setSyringeAngle(angle);
    }

    animateEase(frame, syringeAniDuration, easeInOut);
  }

  const resetSyringeAni = () => {
    setSyringeAngle(15);
    syringeAniPlaying = false;
  }

  const fillSyringe = () => {
    resetSyringeAni();
    setSyringeVol(volumeToInject());
    playSyringeAni();
  }
  
  const inject = () => {
    if (injecting()) return; // Prevent multiple injections
    setInjecting(true);
    
    const frame = (dt: number) => {
      let playing = true;
      let injected = 0;
      setSyringeVol(v => {
        const newV = v - 0.33 * dt; // Inject at 0.5 L/s
        injected = v - newV;
        if (newV <= 0) {
          playing = false;
          return 0;
        }
        return newV;
      });
      // Update moles injected
      setVolInTank(n => n + injected); // Multiply by concentration (M) to get moles

      return playing;
    }
    // Start animation
    animate(frame, () => {
      setTimeout(() => setInjecting(false), 2000);
    });
  }

  const reset = () => {
    setSubstance(substances[0]);
    setTemperature(40);
    setDisplayTemp(40);
    setVolumeToInject(.5);
    setVolInTank(0);
    setSyringeVol(0);
    resetSyringeAni();
    setPressure(0);
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

  createEffect(() => {
    if (injecting()) {
      if (syringeVol() === 0) {
        setBottomLabelText("system is equilibrating...");
        setTopLabelText(" system is at equilibrium.\nyou may refill the syringe.");
        return;
      }
      setBottomLabelText("injecting liquid...");
      return;
    }
    if (volInTank() > 0 && syringeVol() === 0) {
      setBottomLabelText(" system is at equilibrium.\nyou may refill the syringe.");
      return;
    }

    setBottomLabelText(`syringe contains\n${syringeVol().toFixed(2)} mL liquid`);
  });

  createEffect(() => {
    if (volInTank() > 0) {
      if (syringeVol() > 0) {
        setTopLabelText("");
      } else {
        setTopLabelText(`you have injected a\n total of ${volInTank().toFixed(2)} mL`);
      }
    } 
    else {
      if (syringeVol() > 0) {
        setTopLabelText("ready to inject liquid\ninto empty vessel");
      } else {
        setTopLabelText("the tank is empty.\nready to fill the syringe");
      }
    }
  });

  createEffect(() => console.log(displayTemp()));

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='antoine_constants_worksheet.pdf' Directions={DirectionsText} About={AboutText} />
      <div class="sliders-container">
        <Slider label="temperature:"      units="°C" min={() => substance().tempRange[0]} max={() => substance().tempRange[1]} step={1} initValue={40} value={temperature} onChange={setTemperature} disabled={injecting} />
        <Slider label="volume to inject:" units="mL" min={0} max={1} step={.01} initValue={0.5} value={volumeToInject} onChange={setVolumeToInject} decimalPlaces={2} disabled={injecting} />
      </div>
      
      {/* SVG */}
      <svg id="main-svg" width="583" viewBox="0 0 583 391" height="391" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="content">
        <StaticElements />
        <Syringe vol={syringeVol} angle={syringeAngle} />
        <Gauge pressure={pressure} maxPressure={1.2} />
        <Thermometer temperature={displayTemp} />
        {/* Labels */}
        <Label fontSize="16" x={185} y={380} text={`tank volume = ${TankVolume} L`} />
        <Label fontSize="16" x={305} y={80} text={"hover mouse over\n gauge to enlarge"} />
        <Label fontSize="16" x={435} y={155} text={topLabelText} center={true} />
        <Label fontSize="16" x={435} y={230} text={bottomLabelText} center={true} />
        </g>
        <Magnifier targetId='content' followMouse={false} circle={{ cx: 249, cy: 73, r: 75 }} hideOnMouseLeave={true} />
      </svg>
      {/* End SVG */}

      {/* Controls */}
      <SelectList items={substances} disabled={() => volInTank() > 0} onSelect={(s) => { setSubstance(s as Substance); setSyringeVol(0); setVolInTank(0); resetSyringeAni(); }} right={20} bottom={170} />
      <Button coords={{ x: 20, y:  20 }} label="reset" onClick={reset} color="#e94646ff" />
      <Button coords={{ x: 20, y:  70 }} label="inject" onClick={inject} color="#67af55ff" disabled={() => injecting() || syringeVol() === 0} />
      <Button coords={{ x: 20, y: 120 }} label="fill syringe" onClick={fillSyringe} color="#659ee9ff" disabled={injecting} />
      {/* End Controls */}
    </>
  )
}

export default App
