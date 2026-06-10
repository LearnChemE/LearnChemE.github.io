import { createMemo, createSignal, For, Show } from 'solid-js'
import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import Defs from './components/Defs'
import Background from './components/Background/Background'
import { Regulator } from './components/Regulator/Regulator'
import { CylinderValve } from './components/CylinderValve/CylinderValve'
import { Controller } from './components/Controller/Controller'
import { HamburgerMenu } from './components/Hamburger/Hamburger'

import worksheet from './assets/worksheet.pdf?url';
import { AboutText, DirectionsText } from './components/Modal/modals'
import { ControlButton } from './components/ControlButton/ControlButton'
import { BETA_MAX, BETA_MIN, BETA_STEP, createCylinders, expMemo, MAX_SCCM_FLOWRATE, MIN_SCCM_FLOWRATE, SCCM_FLOW_INIT, SCCM_FLOW_STEP, SIM_MODE, TEMP_ROOM, V1_ANGLE_INIT, V2_ANGLE_INIT, V2_BED_ANGLE, V2_BYPASS_ANGLE, VALVE_1_ANGLES, VALVE_2_ANGLES } from './globals'
import { MultiValve } from './components/MultiValve/MultiValve'
import { Manometer } from './components/Manometer/Manometer'
import { BetaCtrl } from './components/BetaCtrl/BetaCtrl'
import { DigitalGauge } from './components/DigitalGauge/DigitalGauge'
import { BedContextProvider, type ContextDescriptor } from './components/Context'
import { AniLines } from './components/AniLines/AniLines'
import { SVGTooltip } from './components/Tooltip/TooltipSelector'
import { RecordMenu } from './components/RecordMenu/RecordMenu'

// import { PlotlyChart } from './components/PlotlyChart'

function App() {
  const cylinders = createCylinders();

  const [valve1Angle, setValve1Angle] = createSignal(V1_ANGLE_INIT);
  const [valve2Angle, setValve2Angle] = createSignal(V2_ANGLE_INIT);
  const [showLines, setShowLines] = createSignal(false);

  const [sccmSP, setSccmSP] = createSignal(SCCM_FLOW_INIT);
  const currentCylinder = createMemo(() => {
    const cyl = cylinders.find(cyl => cyl.angle === valve1Angle());
    if (cyl === undefined) throw new Error(`Cylinder undefined for angle ${valve1Angle()}`);
    return cyl;
  });
  const bedPressure = expMemo(() => {
    const cyl = currentCylinder();
    return (valve2Angle() === V2_BYPASS_ANGLE) ? 0 : cyl.linePres();
  });

  const [temperature, setTemperature] = createSignal(TEMP_ROOM);
  const [out, setOut] = createSignal({ y: 0, u: 0 });

  const comp = createMemo(() => {
    if (valve2Angle() === V2_BYPASS_ANGLE) {
      const y = currentCylinder().yCO2;
      const flowing = sccmSP() > 0 && currentCylinder().linePres() > 0;
      return flowing ? y.toFixed(4) : 0;
    }
    else {
      const { y, u } = out();
      return u > 0.01 ? y.toFixed(4) : 0;
    }
    
  });
  const compLabel = createMemo(() => {
    if (valve2Angle() === V2_BYPASS_ANGLE) {
      const y = currentCylinder().yCO2;
      const flowing = sccmSP() > 0 && currentCylinder().linePres() > 0;
      return `${flowing ? (y * 100).toFixed(2) : "--"} %`;
    }
    else {
      const { y, u } = out();
      return `${u > 0.01 ? (y * 100).toFixed(2) : "--"} %`;
    }
  });

  // const flowLabel = createMemo(() => {
  //   if (valve2Angle() === V2_BYPASS_ANGLE) {
  //     // PV = nRT
  //     // n = m/M = PV / RT; P = 1 bar, T = 273.15, R = 83.14 mL bar / mol K
  //     // m = MPV / RT
  //     if (currentCylinder().linePres() <= 0) return "0.0";
  //     const sccm = sccmSP();
  //     const ndot = sccm / 83.14 / 273.15; // mol / min
  //     const y = currentCylinder().yCO2;
  //     const MM = molar_mass(y);
  //     const mdot = ndot * MM * 1000; // mg/min
  //     return `${mdot.toFixed(1)}`;
  //   }
  //   else {
  //     const { y, u } = out();
  //     return `${u.toFixed(1)}`;
  //   }
  // });

  const reset = () => window.location.reload();

  const ctxDescriptor: ContextDescriptor = {
    tempK: temperature,
    cylinder: currentCylinder,
    v2Angle: valve2Angle,
    sccmSP,
    onOut: setOut
  };

  const exportData = () => {
    return {
      "temperature (K)": temperature(),
      "inlet composition": currentCylinder().yCO2,
      "bed pressure (bar)": bedPressure(),
      "sccm setpoint": sccmSP(),
      "bypass bed": valve2Angle() === V2_BYPASS_ANGLE,
      "outlet mole fraction CO2": comp(),
    }
  };


  return (
    <BedContextProvider descriptor={ctxDescriptor}>
      <div class="canvas-container">
        <SVGCanvas width={809} height={684} defs={Defs}>
          <Background />
          <For each={cylinders}>
            {
              cyl => { 
                let ref!: SVGGElement;
              return <>
                <CylinderValve x={cyl.x} y={324} pressure={cyl.cylPres.get} setPressure={cyl.cylPres.set} />
                <g ref={ref}>
                  <Regulator x={59 + cyl.x} y={310} inPres={cyl.cylPres.get} outPres={cyl.linePres} gasSP={cyl.regSP.get} setGasSP={cyl.regSP.set} />
                  <SVGTooltip x={59 + cyl.x} y={370} anchor={ref} label={() => `${(cyl.linePres()).toFixed(2)} bar`} width={70} height={26} />
                </g>
              </>}
            }
          </For>
          <Controller sp={sccmSP} setSP={setSccmSP} range={[MIN_SCCM_FLOWRATE, MAX_SCCM_FLOWRATE]} step={SCCM_FLOW_STEP} />
          <MultiValve x={303} y={240} key="valve1-ani" angle={valve1Angle} setAngle={setValve1Angle} directions={VALVE_1_ANGLES} setShowLines={setShowLines} />
          <MultiValve x={487} y={184} key="valve2-ani" angle={valve2Angle} setAngle={setValve2Angle} directions={VALVE_2_ANGLES} setShowLines={setShowLines} />

          <Manometer pressure={bedPressure} maxPressure={12} />
          <Show when={SIM_MODE === "desorption"}>
            <BetaCtrl temperature={temperature} setTemperature={setTemperature} range={[BETA_MIN, BETA_MAX]} step={BETA_STEP} />
          </Show>

          <DigitalGauge x={556} y={310} label={() => `${temperature().toFixed(0)} K`} />
          <DigitalGauge x={597} y={110} label={compLabel} />
          {/* <DigitalGauge x={601} y={16} label={flowLabel} /> */}
          
          <AniLines 
            isShowing={showLines} 
            cyls={cylinders}
            cyl={currentCylinder} 
            passMfc={() => sccmSP() > 0}
            showLoop={() => valve2Angle() === V2_BED_ANGLE}
          />

          {/* <g transform='translate(618.5, 67)'>
            <rect x="3.25" y="0.25" width="36.5" height="12.5" rx="0.75" fill="#D9D9D9" stroke="black" stroke-width="0.5"/>
            <path d="M4.63521 10V4.54545H5.44487V5.39773H5.51589C5.62953 5.10653 5.813 4.88045 6.06632 4.71946C6.31963 4.55611 6.62385 4.47443 6.97896 4.47443C7.33881 4.47443 7.63829 4.55611 7.8774 4.71946C8.11887 4.88045 8.30708 5.10653 8.44203 5.39773H8.49885C8.63852 5.116 8.84804 4.89228 9.1274 4.72656C9.40675 4.55848 9.74174 4.47443 10.1324 4.47443C10.6201 4.47443 11.019 4.62713 11.3291 4.93253C11.6392 5.23556 11.7943 5.70786 11.7943 6.34943V10H10.9562V6.34943C10.9562 5.94697 10.8461 5.65933 10.626 5.48651C10.4058 5.31368 10.1466 5.22727 9.84828 5.22727C9.46476 5.22727 9.16764 5.34328 8.95694 5.57528C8.74624 5.80492 8.64089 6.09612 8.64089 6.44886V10H7.78862V6.2642C7.78862 5.95407 7.688 5.70431 7.48677 5.51491C7.28554 5.32315 7.02631 5.22727 6.70907 5.22727C6.49127 5.22727 6.28767 5.28527 6.09828 5.40128C5.91125 5.51728 5.75974 5.67827 5.64373 5.88423C5.5301 6.08783 5.47328 6.32339 5.47328 6.59091V10H4.63521ZM15.5283 12.1591C15.1235 12.1591 14.7755 12.107 14.4843 12.0028C14.1931 11.901 13.9504 11.7661 13.7563 11.598C13.5645 11.4323 13.4118 11.2547 13.2982 11.0653L13.9658 10.5966C14.0416 10.696 14.1375 10.8097 14.2535 10.9375C14.3695 11.0677 14.5281 11.1802 14.7293 11.2749C14.9329 11.3719 15.1992 11.4205 15.5283 11.4205C15.9687 11.4205 16.3321 11.3139 16.6185 11.1009C16.905 10.8878 17.0482 10.554 17.0482 10.0994V8.99148H16.9772C16.9156 9.09091 16.828 9.21402 16.7144 9.3608C16.6031 9.50521 16.4421 9.63423 16.2314 9.74787C16.0231 9.85914 15.7414 9.91477 15.3863 9.91477C14.9459 9.91477 14.5506 9.81061 14.2002 9.60227C13.8522 9.39394 13.5764 9.09091 13.3728 8.69318C13.1715 8.29545 13.0709 7.8125 13.0709 7.24432C13.0709 6.68561 13.1692 6.1991 13.3657 5.7848C13.5622 5.36813 13.8356 5.04616 14.186 4.81889C14.5364 4.58925 14.9412 4.47443 15.4005 4.47443C15.7556 4.47443 16.0373 4.53362 16.2456 4.65199C16.4564 4.76799 16.6173 4.90057 16.7286 5.04972C16.8422 5.1965 16.9298 5.31723 16.9914 5.41193H17.0766V4.54545H17.8863V10.1562C17.8863 10.625 17.7797 11.0062 17.5667 11.2997C17.356 11.5956 17.0719 11.8123 16.7144 11.9496C16.3593 12.0893 15.9639 12.1591 15.5283 12.1591ZM15.4999 9.16193C15.8361 9.16193 16.1202 9.08499 16.3522 8.93111C16.5842 8.77723 16.7606 8.55587 16.8813 8.26705C17.002 7.97822 17.0624 7.63258 17.0624 7.23011C17.0624 6.83712 17.0032 6.49029 16.8849 6.18963C16.7665 5.88897 16.5913 5.65341 16.3593 5.48295C16.1273 5.3125 15.8408 5.22727 15.4999 5.22727C15.1448 5.22727 14.8489 5.31723 14.6121 5.49716C14.3778 5.67708 14.2014 5.91856 14.083 6.22159C13.967 6.52462 13.909 6.8608 13.909 7.23011C13.909 7.6089 13.9682 7.94389 14.0866 8.23509C14.2073 8.52391 14.3849 8.75118 14.6192 8.9169C14.856 9.08026 15.1495 9.16193 15.4999 9.16193ZM21.9914 2.38636L19.6476 11.0938H18.8806L21.2243 2.38636H21.9914ZM22.9848 10V4.54545H23.7945V5.39773H23.8655C23.9791 5.10653 24.1626 4.88045 24.4159 4.71946C24.6692 4.55611 24.9735 4.47443 25.3286 4.47443C25.6884 4.47443 25.9879 4.55611 26.227 4.71946C26.4685 4.88045 26.6567 5.10653 26.7916 5.39773H26.8485C26.9881 5.116 27.1977 4.89228 27.477 4.72656C27.7564 4.55848 28.0914 4.47443 28.482 4.47443C28.9697 4.47443 29.3686 4.62713 29.6787 4.93253C29.9888 5.23556 30.1439 5.70786 30.1439 6.34943V10H29.3058V6.34943C29.3058 5.94697 29.1958 5.65933 28.9756 5.48651C28.7554 5.31368 28.4962 5.22727 28.1979 5.22727C27.8144 5.22727 27.5173 5.34328 27.3066 5.57528C27.0959 5.80492 26.9905 6.09612 26.9905 6.44886V10H26.1382V6.2642C26.1382 5.95407 26.0376 5.70431 25.8364 5.51491C25.6352 5.32315 25.3759 5.22727 25.0587 5.22727C24.8409 5.22727 24.6373 5.28527 24.4479 5.40128C24.2609 5.51728 24.1093 5.67827 23.9933 5.88423C23.8797 6.08783 23.8229 6.32339 23.8229 6.59091V10H22.9848ZM31.6762 10V4.54545H32.5143V10H31.6762ZM32.1024 3.63636C31.939 3.63636 31.7981 3.58073 31.6798 3.46946C31.5638 3.35819 31.5058 3.22443 31.5058 3.06818C31.5058 2.91193 31.5638 2.77817 31.6798 2.6669C31.7981 2.55563 31.939 2.5 32.1024 2.5C32.2657 2.5 32.4054 2.55563 32.5214 2.6669C32.6398 2.77817 32.699 2.91193 32.699 3.06818C32.699 3.22443 32.6398 3.35819 32.5214 3.46946C32.4054 3.58073 32.2657 3.63636 32.1024 3.63636ZM34.8873 6.71875V10H34.0493V4.54545H34.8589V5.39773H34.93C35.0578 5.12074 35.2519 4.8982 35.5123 4.73011C35.7728 4.55966 36.1089 4.47443 36.5209 4.47443C36.8902 4.47443 37.2133 4.55019 37.4903 4.7017C37.7673 4.85085 37.9827 5.07812 38.1366 5.38352C38.2905 5.68655 38.3675 6.07008 38.3675 6.53409V10H37.5294V6.59091C37.5294 6.16241 37.4181 5.8286 37.1956 5.58949C36.973 5.34801 36.6676 5.22727 36.2794 5.22727C36.0119 5.22727 35.7728 5.28527 35.5621 5.40128C35.3537 5.51728 35.1892 5.68655 35.0684 5.90909C34.9477 6.13163 34.8873 6.40152 34.8873 6.71875Z" fill="black"/>
          </g> */}

        </SVGCanvas>

        {/* Hamburger */}
        <HamburgerMenu path={worksheet} downloadName="co2AdsorptionWorksheet.pdf" Directions={DirectionsText} About={AboutText} />

        {/* Stages/Reset Button */}
        <ControlButton icon="fa-solid fa-arrows-rotate" label="reset" left={90} onClick={reset} active={() => true} activeColor='#FF3B3B' />
        <RecordMenu exportData={exportData} />
      </div>

      {/* <PlotlyChart /> */}

    </BedContextProvider>
  )
}

export default App
