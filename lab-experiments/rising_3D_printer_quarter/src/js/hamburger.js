export function buttonAction(btnConfig) {
// Guard CSS.escape usage in older browsers
if (typeof window !== 'undefined' && !window.CSS) window.CSS = {};
if (typeof CSS !== 'undefined' && !CSS.escape) {
  CSS.escape = function(sel){ return sel.replace(/[^a-zA-Z0-9_-]/g, '\\$&'); };
}

function forceBackdropCleanup() {
  try {
    // Remove any stale Bootstrap backdrops
    document.querySelectorAll('.modal-backdrop').forEach(el => el.parentNode && el.parentNode.removeChild(el));
    // Reset body classes/styles Bootstrap uses while a modal is open
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('paddingRight');
    document.body.style.removeProperty('overflow');
  } catch (_) { /* no-op */ }
}

    if (btnConfig.action === 'modal') {
        // Fetch and display modal content
        fetch(btnConfig.url)
        .then(response => {
            if (!response.ok) throw new Error(`Network error loading ${btnConfig.url}`);
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('overlayContainer');
            if (!container) {
                console.error('#overlayContainer not found in DOM. Cannot render modal.');
                return;
            }
            container.innerHTML = html; // Replace previous modal HTML
            
            const modalId = (btnConfig.modalId || (btnConfig.label ? btnConfig.label.toLowerCase() : '')).trim();
            if (!modalId) {
                console.error('buttonAction: modalId could not be determined. Provide btnConfig.modalId or label.');
                return;
            }

            // Prefer querying inside the container to avoid context issues
            let modalEl = container.querySelector(`#${CSS.escape(modalId)}`);
            if (!modalEl) {
                // Fallback to global document search
                modalEl = document.getElementById(modalId);
            }

            if (!modalEl) {
                console.error(`Modal element with ID '${modalId}' not found in fetched HTML from ${btnConfig.url}.`);
                return;
            }

            // Ensure it has .modal role/structure; if not, warn
            if (!modalEl.classList.contains('modal')) {
                console.warn(`Element #${modalId} is not a .modal. Bootstrap may fail.`);
            }

            // Dispose any existing instance bound to this element
            try {
                const existing = bootstrap.Modal.getInstance(modalEl);
                if (existing) existing.dispose();
            } catch (e) { /* ignore if not initialised */ }

            forceBackdropCleanup();

            // Create or get instance safely (BS 5.2+)
            let modal;
            try {
                if (bootstrap.Modal.getOrCreateInstance) {
                    modal = bootstrap.Modal.getOrCreateInstance(modalEl, {});
                } else {
                    modal = new bootstrap.Modal(modalEl, {});
                }
                modal.show();
                modalEl.addEventListener('hidePrevented.bs.modal', () => {
                    // If hide was prevented (e.g., static backdrop), we still ensure no duplicate backdrops remain
                    forceBackdropCleanup();
                });
            } catch (e) {
                console.error('Bootstrap modal initialization failed:', e);
                return;
            }

            modalEl.addEventListener('hidden.bs.modal', () => {
                // Clear DOM for the fetched modal and remove any leftover overlays/backdrops
                const container = document.getElementById('overlayContainer');
                if (container) container.innerHTML = '';
                forceBackdropCleanup();
            }, { once: true });

            // Re-typeset MathJax content inside the overlay
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([container]).catch(() => {});
            }
        })
        .catch(error => { 
            console.error('Error loading/showing modal:', error);
            // If initialization failed mid-way, make sure no stuck overlay remains
            forceBackdropCleanup();
        });
        
    } else if (btnConfig.action === 'download') {
        // Trigger download
        downloadFile(btnConfig.url, btnConfig.filename);
    }
}

// export function toggleMenu() {
//     const hamburgerMenu = document.getElementById('hamburger-menu');
//     const isCurrentlyShown = hamburgerMenu.classList.contains('show');
//     hamburgerMenu.classList.toggle('show');
    
//     // Only populate if opening
//     if (!isCurrentlyShown) {
//         // Clear any existing buttons
//         hamburgerMenu.innerHTML = '';
        
//         // --- Button Configuration ---
//         const buttons = [
//             { label: 'Directions', url: 'html/overlay/directions.html', action: 'modal' },
//             // { label: 'Details', url: 'html/overlay/details.html', action: 'modal' },
//             { label: 'About', url: 'html/overlay/about.html', action: 'modal' },
//             { label: 'Worksheet', url: 'assets/worksheet.pdf', action: 'download', filename: 'worksheet.pdf' }
//         ];
        
//         buttons.forEach((btnConfig) => {
//             const button = document.createElement('button');
//             button.type = 'button';
//             // Use classes defined in main.css if available, otherwise default Bootstrap
//             button.className = 'btn btn-primary btn-sm hamburger-menu-button'; // Added a class for potential specific styling
//             button.textContent = btnConfig.label;
            
//             button.addEventListener('click', (e) => {
//                 e.stopPropagation(); // Prevent click from closing menu immediately
                
//                 if (btnConfig.action === 'modal') {
//                     // Fetch and display modal content
//                     fetch(btnConfig.url)
//                     .then(response => {
//                         if (!response.ok) throw new Error(`Network error loading ${btnConfig.url}`);
//                         return response.text();
//                     })
//                     .then(html => {
//                         const container = document.getElementById('overlayContainer');
//                         container.innerHTML = html; // Replace previous modal HTML
                        
//                         // Modal ID assumed to be the same as the label lowercased
//                         const modalId = btnConfig.label.toLowerCase();
//                         const modalEl = document.getElementById(modalId);
                        
//                         if (modalEl) {
//                             // Make sure no stray modals are lingering from previous fetches
//                             const existingModalInstance = bootstrap.Modal.getInstance(modalEl);
//                             if(existingModalInstance) {
//                                 // If an instance exists but might be hidden or closing, dispose of it
//                                 // before creating a new one to avoid conflicts.
//                                 existingModalInstance.dispose();
//                             }
//                             const modal = new bootstrap.Modal(modalEl); // Create new instance
//                             modal.show();
                            
//                             if (window.MathJax && window.MathJax.typesetPromise) {
//                                 window.MathJax.typesetPromise([container]);
//                             }
//                         } else {
//                             console.error(`Modal element with ID '${modalId}' not found in fetched HTML from ${btnConfig.url}.`);
//                         }
//                     })
//                     .catch(error => console.error('Error loading/showing modal:', error));
                    
//                 } else if (btnConfig.action === 'download') {
//                     // Trigger download
//                     downloadFile(btnConfig.url, btnConfig.filename);
//                 }
                
//                 // Close menu after action
//                 hamburgerMenu.classList.remove('show');
//             });
            
//             hamburgerMenu.appendChild(button);
//         });
//     }
// } // End of toggleMenu

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
        // If a modal was closed and backdrop lingered, purge it
        forceBackdropCleanup();
    }
});

export function initOverlayButtonsForNewIndex() {
    const configs = [
        { id: 'directions', label: 'Directions', url: 'html/overlay/directions.html', action: 'modal', modalId: 'directions' },
        { id: 'details',    label: 'Details',    url: 'html/overlay/details.html',    action: 'modal', modalId: 'details'    },
        { id: 'about',      label: 'About',      url: 'html/overlay/about.html',      action: 'modal', modalId: 'about'      },
        { id: 'worksheet',  label: 'Worksheet',  url: 'assets/worksheet.pdf',action: 'download', filename: '3D Printed Quarter: Face-Down vs. Edge-On Rising Worksheet.pdf' }
    ];
    // configs.forEach(cfg => {
    //     const el = document.getElementById(cfg.id);
    //     if (!el) return;
    //     // Style as extra small button
    //     el.classList.add('btn-sm');
    //     el.style.padding = '0px 3px';
    //     el.style.fontSize = '0.65rem';
    //     el.style.lineHeight = '1';
    //     el.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         buttonAction(cfg);
    //     });
    // });
}

// Auto-init on DOM ready so the new index page works without extra code
if (document && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
        try { initOverlayButtonsForNewIndex(); } catch (e) { /* no-op */ }
    });
}