import { onMount } from 'solid-js';
import './App.css'
import { Apparatus } from './components/Apparatus';
import { HamburgerMenu } from './components/Hamburger/Hamburger';
import worksheet from './media/testMe.txt'
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/helpers';

function App() {

  onMount(() => {
    // Initialize SVG zooming
    initSvgZoom();
    // Initialize SVG dragging with exempt element IDs
    initSvgDrag();
    // Add the resizing handler
    enableWindowResize();
  });

  return (
    <>
      <HamburgerMenu path={worksheet} downloadName='test.txt' />
      <Apparatus/>
    </>
  )
}

export default App;
