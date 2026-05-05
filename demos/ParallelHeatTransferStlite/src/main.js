import { mount } from 'https://cdn.jsdelivr.net/npm/@stlite/browser@1.7.2/build/stlite.js';

// Grab all modules in the python app
const modules = import.meta.glob("./python_app/**/*", {
  query: '?raw',
  import: 'default',
  eager: true
});

// Format modules to be read by stlite
const files = {};
for (const path in modules) {
  // Convert ./python_app/*.py to *.py
  const fileName = path.replace("./python_app/", "");
  // Insert the module contents to the corresponding filename
  files[fileName] = modules[path];
}

const requirements = ["plotly", "numpy", "scipy"];

window.controller = mount({
    entrypoint: 'main.py',
    files,
    requirements
  }, 
  document.getElementById('app'),
);