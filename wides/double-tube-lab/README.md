# React + TypeScript + Vite

After cloning the environment, use `npm i` to install the node dependencies. The .gitignore file will prevent these from being pushed to GitHub since they don't need to be.

# Message to future Undergraduate Assistants

This simulation was made using the Vite + React Demo. It uses TypeScript instead of JavaScript, which is helpful to prevent bugs from inaccurate JS typings.

If you haven't worked with React or a similar framework, I would recommend taking a quick tutorial. React helps greatly in managing DOM elements and creating interactive UI's. It also utilizes JSX, so while metadata can still be found in the index.html file, the app itself is compiled from the code within the App.tsx and other element .tsx files.

Lastly, I tried to mostly keep the P5 simulation segregated from the React App, so they mostly interface with the p5-wrapper dependency. However, as this was originally a vanilla JS simulation, some parts of the original sketch were not easy to handle.
