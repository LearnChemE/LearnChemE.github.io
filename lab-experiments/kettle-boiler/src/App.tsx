// import { createSignal } from 'solid-js'
import './App.css'
import { Apparatus } from './components/Apparatus';
import { HamburgerMenu } from './components/Hamburger/Hamburger';
import worksheet from './media/testMe.txt'

function App() {

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='test.txt' />
      <Apparatus/>
    </>
  )
}

export default App;
