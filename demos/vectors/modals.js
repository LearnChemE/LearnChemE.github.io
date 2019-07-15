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
  modalBG.style.display = "block";
  modalDirections.style.display = "block";
}
detailsButton.onclick = function() {
  modalBG.style.display = "block";
  modalDetails.style.display = "block";
}
aboutButton.onclick = function() {
  modalBG.style.display = "block";
  modalAbout.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
closeDirections.onclick = function() {
  modalBG.style.display = "none";
  modalDirections.style.display = "none";
}
closeDetails.onclick = function() {
  modalBG.style.display = "none";
  modalDetails.style.display = "none";
}
closeAbout.onclick = function() {
  modalBG.style.display = "none";
  modalAbout.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalBG) {
    modalBG.style.display = "none";
    modalDirections.style.display = "none";
    modalDetails.style.display = "none";
    modalAbout.style.display = "none";
  }
}