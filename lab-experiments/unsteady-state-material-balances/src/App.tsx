import './App.css'
import { RxrContextProvider } from './components/Context';
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas';
import Defs from './components/Defs';
import Background from './components/Background/Background';
import { HamburgerMenu } from './components/Hamburger/Hamburger';
import { AboutText, DirectionsText } from './components/Modal/modals';

import worksheet from "./assets/worksheet.pdf?url";
import { ControlButton } from './components/ControlButton/ControlButton';
import { createMemo, createSignal } from 'solid-js';
import { CylinderValve } from './components/CylinderValve/CylinderValve';
import { CCS_DEFAULT, CCS_MAX, CCS_MIN, CCS_STEP, PRESSURE_LIFT_GAIN, resetSignal } from './globals';
import { Regulator } from './components/Regulator/Regulator';
import { SVGTooltip } from './components/Tooltip/TooltipSelector';
import { Controller } from './components/Controller/Controller';
import { Reactor } from './components/Reactor/Reactor';

function App() {
  const [cylLift, setCylLift] = createSignal(0);
  const [regLift, setRegLift] = createSignal(0);
  const [ccsSp, setCcsSp] = createSignal(CCS_DEFAULT);
  const [temp, setTemp] = createSignal(15);
  let regRef!: SVGGElement;

  const overallLift = createMemo(() => {
    return Math.min(cylLift(), regLift());
  });
  const pressure = createMemo(() => {
    return PRESSURE_LIFT_GAIN * overallLift();
  });
  
  resetSignal.init();
  const reset = () => {

  };

  return (
    <RxrContextProvider descriptor={{ }}>
      <div class="canvas-container">
        <SVGCanvas width={430} height={460} defs={Defs}>
          <Background />

          <Reactor x={260} y={75} pressure={pressure} ccsSP={ccsSp} temp={temp} />

          <CylinderValve x={40} y={127} lift={cylLift} setLift={setCylLift} maxRotation={120} />
          <g ref={regRef}>
            <Regulator x={94.5} y={117} 
              inPres={cylLift} outPres={overallLift} gasSP={regLift} setGasSP={setRegLift}
              maxPressure={1} maxNeedlePressure={10} rotationRange={120} />
            <SVGTooltip x={90} y={90} width={68} height={24}
              anchor={regRef}
              label={() => `${pressure().toFixed(2)} bar`} />
          </g>

          <Controller x={107.5} y={270.5}
            sp={ccsSp} setSP={setCcsSp} step={CCS_STEP} range={[CCS_MIN, CCS_MAX]} />
          <Controller x={347.5} y={391.5}
            sp={temp} setSP={setTemp} step={5} range={[15, 25]} />

        </SVGCanvas>

        {/* Hamburger */}
        <HamburgerMenu path={worksheet} downloadName="unsteadyStateMEBWorksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
      </div>

      {/* <PlotlyChart /> */}

    </RxrContextProvider>
  );
}

export default App;
