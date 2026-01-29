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

function App() {

  return (
    <>
      <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} />
      <SVGCanvas width={740} height={560} defs={Defs}>
        <Background />
        <Bucket x={225} y={() => 257 + paddedHeight()} />
        <Bucket x={632} y={() => 257 + paddedHeight()} />
        <TopPipes />
        <Pipes />
        
        <Column numberOfStages={numberOfStages} />
        <Rotameter flowrate={() => 5} flowrange={() => [0, 10]} x={145} y={64 + paddedHeight()} />
        <Rotameter flowrate={() => 0} flowrange={() => [0, 10]} x={477} y={64 + paddedHeight()} />
        <Tank x={31}  y={107 + paddedHeight()} />
        <Tank x={522} y={107 + paddedHeight()} />
        <Valve x={134.5} y={() => 195 + paddedHeight()} />
        <Valve x={466.5} y={() => 195 + paddedHeight()} />
      </SVGCanvas>
    </>
  )
}

export default App
