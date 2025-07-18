# Simulation Webpack Template

## First and foremost

- Change any simulation names, descriptions, and author in the `_dev/webpack.config.js` file
- Change simulation name, description, and author in the `package.json` file
- Change simulation name, description, and author in the `index.html` file

## Installation

- Run `npm run install-dependencies` to install all dependencies.
- Run `npm run start` to start the development server.
- Run `npm run build` to build the project for production.

## For digital experiments:

- Add the worksheet to the `src/assets` folder.
- Update the import statement for the worksheet in `src/index.js` file.
- Update the "worksheet" button href in the `src/html/index.html` file.

## For regular simulations:

- Remove the "worksheet" button from the `src/html/index.html` file.
- Add a "details" button to the `src/html/index.html` file.
- Add a corresponding modal to the `src/html/index.html` file and update the data-bs-target tags.
- Uncomment the MathJax script import in the head of the `src/html/index.html` file.