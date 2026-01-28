import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import TopPipes from './components/TopPipes/TopPipes'
import Defs from './components/Defs'
import { Column } from './components/Column/Column'
import { numberOfStages, paddedHeight, setNumberOfStages } from './globals'
import { Slider } from './components/Slider/Slider'
import Rotameter from './components/Rotameter/Rotameter'

function App() {

  return (
    <>
      <Slider value={numberOfStages} setValue={setNumberOfStages} min={1} max={8} step={1} />
      <SVGCanvas width={740} height={560} defs={Defs}>
        <TopPipes />
        <Column numberOfStages={numberOfStages} />
        <Rotameter flowrate={() => 5} flowrange={() => [0, 10]} x={145} y={64 + paddedHeight()} />
        <Rotameter flowrate={() => 0} flowrange={() => [0, 10]} x={477} y={64 + paddedHeight()} />
      </SVGCanvas>
    </>
  )
}

export default App
