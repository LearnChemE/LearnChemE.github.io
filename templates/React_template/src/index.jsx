require("./style/style.scss");
const React = require("react");
const ReactDOM = require("react-dom");
const Welcome = require("./js/element.jsx");

const testtext = "world";

const element = (
    <Welcome wordtwo={testtext} />
)

const root = ReactDOM.createRoot(
    document.getElementById("main")
);

root.render(element);