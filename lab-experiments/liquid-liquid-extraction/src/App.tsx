import './App.css'
import { SVGCanvas } from './components/SVGCanvas/SVGCanvas'
import TopPipes from './components/TopPipes/TopPipes'
import Defs from './components/Defs'
import { Column } from './components/Column/Column'
import { numberOfStages } from './globals'
function App() {

  return (
    <>
      <SVGCanvas width={740} height={552} defs={Defs}>
        <TopPipes />
        <Column numberOfStages={numberOfStages} />
      </SVGCanvas>
    </>
  )
}

export default App
