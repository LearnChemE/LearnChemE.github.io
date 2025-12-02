import { onMount } from 'solid-js';
import './App.css'
import { Apparatus } from './components/Apparatus';
import { HamburgerMenu } from './components/Hamburger/Hamburger';
import worksheet from './media/Kettle-Boiler-Worksheet.pdf'
import { enableWindowResize, initSvgDrag, initSvgZoom } from './ts/helpers';
import { AboutText, DirectionsText } from './components/Modal/modals';
import { MagnifierProvider } from './components/Magnifier/MagnifierContext';
import { MagnifierLens } from './components/Magnifier/MagnifierLens';

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
      <HamburgerMenu path={worksheet} downloadName='Kettle-Boiler-Worksheet.pdf' Directions={DirectionsText} About={AboutText} />
      <MagnifierProvider>
        <Apparatus />
        <MagnifierLens scale={4} />
      </MagnifierProvider>
      <button type='button' class='btn btn-danger' onclick={() => location.reload()}>reset</button>
    </>
  )
}

export default App;
