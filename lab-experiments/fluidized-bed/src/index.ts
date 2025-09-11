// Packages
import "bootstrap";
import "./style/style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

document
  .getElementById("worksheet-download")
  .setAttribute("href", require("./media/fluidizedBedWorksheet.pdf"));

// Scripts
import "./js/init";
import "./js/state";
import "./js/calculations.ts";
import "./js/interactions.ts";
import "./js/canvas";

declare const __DEV__: boolean;
// Debug
if (__DEV__) {
  // require("./debug.ts");
}
