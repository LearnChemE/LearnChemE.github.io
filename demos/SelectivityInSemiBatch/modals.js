var modalDirections = document.getElementById("modalDirections");

var modalDetails = document.getElementById("modalDetails");

var modalAbout = document.getElementById("modalAbout");

var modalBG = document.getElementsByClassName("modal")[0];

// Get the button that opens the modal
var directionsButton = document.getElementById("directionsButton");
var detailsButton = document.getElementById("detailsButton");
var aboutButton = document.getElementById("aboutButton");

// Get the element that closes the modal
var closeDirections = document.getElementsByClassName("close")[0];
var closeDetails = document.getElementsByClassName("close")[1];
var closeAbout = document.getElementsByClassName("close")[2];

// When the user clicks the button, open the modal 
directionsButton.onclick = function() {
  modalBG.style.visibility = "visible";
  modalBG.style.height = "1300px";
  modalBG.style.overflow = "auto";
  modalDirections.style.visibility = "visible";
}
detailsButton.onclick = function() {
  modalBG.style.visibility = "visible";
  modalBG.style.height = "1300px";
  modalBG.style.overflow = "auto";
  modalDetails.style.visibility = "visible";
}
aboutButton.onclick = function() {
  modalBG.style.visibility = "visible";
  modalBG.style.height = "1300px";
  modalBG.style.overflow = "auto";
  modalAbout.style.visibility = "visible";
}
// When the user clicks on <span> (x), close the modal
closeDirections.onclick = function() {
  modalBG.style.visibility = "hidden";
  modalBG.style.height = "0px";
  modalBG.style.overflow = "hidden";
  modalDirections.style.visibility = "hidden";
}
closeDetails.onclick = function() {
  modalBG.style.visibility = "hidden";
  modalBG.style.height = "0px";
  modalBG.style.overflow = "hidden";
  modalDetails.style.visibility = "hidden";
}
closeAbout.onclick = function() {
  modalBG.style.visibility = "hidden";
  modalBG.style.height = "0px";
  modalBG.style.overflow = "hidden";
  modalAbout.style.visibility = "hidden";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalBG) {
    modalBG.style.visibility = "hidden";
    modalDirections.style.visibility = "hidden";
    modalDetails.style.visibility = "hidden";
    modalAbout.style.visibility = "hidden";
    modalBG.style.height = "0px";
    modalBG.style.overflow = "hidden";
  }
}