const buttons = [
    { label: 'Directions', url: './overlay/directions.html', action: 'modal' },
    { label: 'About', url: './overlay/about.html', action: 'modal' },
    { label: 'Details', url: './overlay/details.html', action: 'modal' },
    { label: 'Worksheet', url: 'assets/worksheet.pdf', action: 'download', filename: 'worksheet.pdf' }
  ];

  buttons.forEach((btnConfig) => {
    const button = document.getElementById(btnConfig.label.toLowerCase() + '-button');
    if (!button) {
      console.warn(`Button element for ${btnConfig.label} not found.`);
      return;
    }
    // Pass draw and pipeGroup to the reset function
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
            } else {
               console.error(`Modal element with ID '${modalId}' not found in fetched HTML from ${btnConfig.url}.`);
            }
          })
          .catch(error => console.error('Error loading/showing modal:', error));

      } else if (btnConfig.action === 'download') {
        // Trigger download
        downloadFile(btnConfig.url, btnConfig.filename);
      }
    });
  });

function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }