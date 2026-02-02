import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import TopPipes from './components/TopPipes/TopPipes'
import Defs from './components/Defs'
import { Column } from './components/Column/Column'
import { numberOfStages, paddedHeight, setNumberOfStages } from './globals'
import { Slider } from './components/Slider/Slider'
import Rotameter from './components/Rotameter/Rotameter'
import Background from './components/Background/Background'
import Tank from './components/Tank/Tank'
import Valve from './components/Valve/Valve'
import Bucket from './components/Bucket/Bucket'
import Pipes from './components/Pipes/Pipes'
import { PowerSwitch } from './components/PowerSwitch/Switch'
import { createMemo, createSignal } from 'solid-js'
import { FEED_MAX_RATE, SOLVENT_MAX_RATE } from './ts/config'

function App() {
  const [feedIsOn, setFeedIsOn] = createSignal(false);
  const [solvIsOn, setSolvIsOn] = createSignal(false);
  const [feedLift, setFeedLift] = createSignal(0);
  const [solvLift, setSolvLift] = createSignal(0);

  const solvRate = createMemo(() => {
    const effective_lift = solvLift() * (solvIsOn() ? 1 : 0)
    return SOLVENT_MAX_RATE * effective_lift;
  });

  const feedRate = createMemo(() => {
    const effective_lift = feedLift() * (feedIsOn() ? 1 : 0)
    return FEED_MAX_RATE * effective_lift;
  });

  return (
    <>
      <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} />
      <SVGCanvas width={740} height={560} defs={Defs}>
        <Background />
        <Bucket x={225} y={() => 257 + paddedHeight()} />
        <Bucket x={632} y={() => 257 + paddedHeight()} />
        <TopPipes />
        <Pipes />
        <PowerSwitch x={134} y={321 + paddedHeight()} label="feed" isOn={feedIsOn} setIsOn={setFeedIsOn} />
        <PowerSwitch x={434} y={321 + paddedHeight()} label="solvent" isOn={solvIsOn} setIsOn={setSolvIsOn} />
        
        <Column numberOfStages={numberOfStages} />
        <Rotameter flowrate={feedRate} flowrange={[0, FEED_MAX_RATE]} x={145} y={64 + paddedHeight()} />
        <Rotameter flowrate={solvRate} flowrange={[0, SOLVENT_MAX_RATE]} x={477} y={64 + paddedHeight()} />
        <Tank x={31}  y={107 + paddedHeight()} />
        <Tank x={522} y={107 + paddedHeight()} />
        <Valve x={134.5} y={() => 195 + paddedHeight()} onLiftChange={setFeedLift} />
        <Valve x={466.5} y={() => 195 + paddedHeight()} onLiftChange={setSolvLift} />
      </SVGCanvas>
    </>
  )
}

export default App
