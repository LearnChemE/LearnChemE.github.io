// import { createSignal } from 'solid-js'
import './App.css'
import { HamburgerMenu } from './components/Hamburger/Hamburger';

function App() {

  return (
    <>
      <HamburgerMenu path='./media/testMe.txt' downloadName='test.txt' />
    </>
  )
}

export default App;
