import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger'
import worksheet from "./assets/worksheet.pdf?url"
import { AboutText, DirectionsText } from './components/Modal/modals'
import { RxrContextProvider } from './components/Context'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Defs from './components/Defs'
import { resetSignal, totInjTime } from './globals'
import { Cartridge } from './components/Cartridge/Cartridge'
import { AnimationTimer, createEaseOut, EasedAnimation } from './globals/animate'
import { ControlButton } from './components/ControlButton/ControlButton'
import { InjectMenu } from './components/InjectMenu/InjectMenu'
import { createSignal, Show } from 'solid-js'
import { SvgColorTooltip } from './components/SvgColorTooltip/SvgColorTooltip'

function App() {
  const [showInj, setShowInj] = createSignal(true);
  const [playing, setPlaying] = createSignal(false);
  const [useDropper, setUseDropper] = createSignal(false);
  const [injFinished, setInjFinished] = createSignal(false);
  const [svgRef, setSvgRef] = createSignal<SVGSVGElement | null>(null);

  const aniTimer = new AnimationTimer();
  const injTimer = new EasedAnimation(createEaseOut(4), totInjTime, 0);
  
  resetSignal.init();

  const reset = () => {
    resetSignal.emit();
    setShowInj(false);
    setUseDropper(false);
    setInjFinished(false);
  }

  const inject = () => {
    injTimer.play();
    setShowInj(false);
  }

  const play = () => {
    aniTimer.play();
    setPlaying(true);
  }

  const rxrCtxDescriptor = { 
    aniTimer, 
    injTimer,
    playing
  };

  injTimer.onFinish(() => {
    setInjFinished(true);
  });

  return (
    <>
        <RxrContextProvider descriptor={rxrCtxDescriptor}>
          <div class="canvas-contaiColorPner">
            {/* Hamburger */}
            <HamburgerMenu path={worksheet} downloadName="glucoseAnalyzerWorksheet.pdf" Directions={DirectionsText} About={AboutText} />
            <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
            <ControlButton icon="fa-solid fa-play" label="play" left={155} onClick={play} active={() => true} activeColor='#3d9c3b' disabled={() => !injFinished()} />
            <ControlButton icon="fa-solid fa-eye-dropper" label="color picker" left={220} onClick={() => setUseDropper(using => !using)} active={useDropper} activeColor='#3498db' disabled={showInj} />
            
            <SvgColorTooltip svgRef={svgRef} disabled={() => !useDropper()} animate={aniTimer} />

            <SVGCanvas width={280} height={280} defs={Defs} onSvgRef={setSvgRef} >
              <Cartridge />
            </SVGCanvas>
          </div>
          <Show when={showInj()}>
            <InjectMenu key="upper" onInject={inject} />
          </Show>
        </RxrContextProvider>
    </>
  )
}

export default App
