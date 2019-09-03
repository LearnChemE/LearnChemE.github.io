/**
    For adding more complex HTML content to modals. Imports .txt file as string.
*/
export function modalFill(modal, url) {
    /**
        @param {string} url file location e.g. '../url/src.txt'
        @param {object} modal Modal object from Modal.js file
    */
   return fetch(url)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
    .then(function(doc) {
        var text = `${doc}`
        return text;
    })
    .then(function(text) {
        let innerhtml = document.getElementById(`${modal.modalid}`)
        .getElementsByClassName("modal-content")[0]
        .getElementsByClassName("modal-body")[0];
        
        innerhtml.innerHTML = text;
        return modal;
    })
    .then(function(modal) {
        return `${modal.modalid} filled`;
    })
}
