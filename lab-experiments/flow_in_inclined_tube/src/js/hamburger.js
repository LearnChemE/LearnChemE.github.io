 export function toggleMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const isCurrentlyShown = hamburgerMenu.classList.contains('show');
    hamburgerMenu.classList.toggle('show');
    
    // Only populate if opening
    if (!isCurrentlyShown) {
        // Clear any existing buttons
        hamburgerMenu.innerHTML = '';
        
        // --- Button Configuration ---
        const buttons = [
            { label: 'Directions', url: 'html/overlay/directions.html', action: 'modal' },
            // { label: 'Details', url: 'html/overlay/details.html', action: 'modal' },
            { label: 'About', url: 'html/overlay/about.html', action: 'modal' },
            { label: 'Worksheet', url: 'assets/worksheet.pdf', action: 'download', filename: 'Viscous Flow in Two Connected Pipes worksheet.pdf' }
        ];
        
        buttons.forEach((btnConfig) => {
            const button = document.createElement('button');
            button.type = 'button';
            // Use classes defined in main.css if available, otherwise default Bootstrap
            button.className = 'btn btn-primary btn-sm hamburger-menu-button'; // Added a class for potential specific styling
            button.textContent = btnConfig.label;
            
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from closing menu immediately
                
                if (btnConfig.action === 'modal') {
                    // Fetch and display modal content
                    fetch(btnConfig.url)
                    .then(response => {
                        if (!response.ok) throw new Error(`Network error loading ${btnConfig.url}`);
                        return response.text();
                    })
                    .then(html => {
                        const container = document.getElementById('overlayContainer');
                        container.innerHTML = html; // Replace previous modal HTML
                        
                        // Modal ID assumed to be the same as the label lowercased
                        const modalId = btnConfig.label.toLowerCase();
                        const modalEl = document.getElementById(modalId);
                        
                        if (modalEl) {
                            // Make sure no stray modals are lingering from previous fetches
                            const existingModalInstance = bootstrap.Modal.getInstance(modalEl);
                            if(existingModalInstance) {
                                // If an instance exists but might be hidden or closing, dispose of it
                                // before creating a new one to avoid conflicts.
                                existingModalInstance.dispose();
                            }
                            const modal = new bootstrap.Modal(modalEl); // Create new instance
                            modal.show();

                            if (window.MathJax && window.MathJax.typesetPromise) {
                                window.MathJax.typesetPromise([container]);
                            }
                        } else {
                            console.error(`Modal element with ID '${modalId}' not found in fetched HTML from ${btnConfig.url}.`);
                        }
                    })
                    .catch(error => console.error('Error loading/showing modal:', error));
                    
                } else if (btnConfig.action === 'download') {
                    // Trigger download
                    downloadFile(btnConfig.url, btnConfig.filename);
                }
                
                // Close menu after action
                hamburgerMenu.classList.remove('show');
            });
            
            hamburgerMenu.appendChild(button);
        });
    }
} // End of toggleMenu

// Function to download a file
export function downloadFile(fileUrl, fileName) {
  // 1) Fetch the file as a blob
  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      return response.blob();
    })
    .then((blob) => {
      // 2) Create a temporary object URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // 3) Create a hidden <a> tag pointing to that blob URL
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      // Use the provided fileName, or fall back to the last segment of fileUrl
      link.download = fileName || fileUrl.split('/').pop();

      // 4) Append, click, and then clean up
      document.body.appendChild(link);
      link.click();

      // 5) Release the object URL and remove the element
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    })
    .catch((err) => {
      console.error('Download failed:', err);
    });
}

// Close the hamburger menu when clicking outside
document.addEventListener('click', (event) => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    
    // Check if the menu/icon exist and if the click was outside both
    if (hamburgerMenu && hamburgerIcon && !hamburgerMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
        hamburgerMenu.classList.remove('show');
    }
});