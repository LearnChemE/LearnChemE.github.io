// Canvas-based hamburger menu implementation

// State variables
let isMenuOpen = false;
let menuBounds = {
    x: 20,
    y: 20,
    width: 50,
    height: 45
};
let buttonBounds = [];
let isHovering = false;

export function drawHamburgerMenu() {
    // Check if mouse is hovering over the hamburger menu
    isHovering = mouseX >= menuBounds.x && mouseX <= menuBounds.x + menuBounds.width &&
                 mouseY >= menuBounds.y && mouseY <= menuBounds.y + menuBounds.height;
    
    // Draw hamburger icon with border
    stroke(0);
    strokeWeight(2);
    // Use a lighter blue when hovering
    fill(isHovering ? color(100, 150, 255) : color(0, 123, 255));
    rect(menuBounds.x, menuBounds.y, menuBounds.width, menuBounds.height, 5);
    
    // Draw the three lines
    const lineSpacing = 10;
    const startY = menuBounds.y + 12;
    
    for (let i = 0; i < 3; i++) {
        stroke(255); // White lines
        strokeWeight(2);
        line(
            menuBounds.x + 12,
            startY + (i * lineSpacing),
            menuBounds.x + menuBounds.width - 12,
            startY + (i * lineSpacing)
        );
    }
    
    // Draw menu panel if open
    if (isMenuOpen) {
        // Draw solid white background with border
        fill(255);
        stroke(0);
        strokeWeight(2);
        const popupWidth = 400; // Define popup width
        const popupHeight = 350; // Define popup height
        rect(menuBounds.x, menuBounds.y + menuBounds.height + 5, popupWidth, popupHeight, 5);
        
        // Draw buttons
        const buttonWidth = 280;
        const buttonHeight = 55;
        const buttonSpacing = 30;
        const startX = menuBounds.x + (popupWidth - buttonWidth) / 2; // Calculate startX to center buttons
        const startY = menuBounds.y + menuBounds.height + 60; // Increased top margin from 40 to 60
        
        // Clear previous button bounds
        buttonBounds = [];
        
        // Directions button
        drawButton(startX, startY, buttonWidth, buttonHeight, "Directions", 0);
        
        // About button
        drawButton(startX, startY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, "About", 1);
        
        // Worksheet button
        drawButton(startX, startY + (buttonHeight + buttonSpacing) * 2, buttonWidth, buttonHeight, "Worksheet", 2);
    }
}

function drawButton(x, y, w, h, label, index) {
    // Store button bounds for interaction
    buttonBounds[index] = { x, y, w, h, label };
    
    // Check if mouse is hovering over this button
    const isButtonHovering = mouseX >= x && mouseX <= x + w &&
                            mouseY >= y && mouseY <= y + h;
    
    // Draw button with border
    fill(isButtonHovering ? color(100, 150, 255) : color(0, 123, 255)); // Lighter blue when hovering
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h, 8);
    
    // Draw text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20); // Decreased from 24 to 20
    text(label, x + w/2, y + h/2);
}

export function handleHamburgerClick(mx, my) {
    // Check if hamburger icon was clicked
    if (mx >= menuBounds.x && mx <= menuBounds.x + menuBounds.width &&
        my >= menuBounds.y && my <= menuBounds.y + menuBounds.height) {
        isMenuOpen = !isMenuOpen;
        return true;
    }
    
    // If menu is open, check button clicks
    if (isMenuOpen) {
        for (let i = 0; i < buttonBounds.length; i++) {
            const btn = buttonBounds[i];
            if (mx >= btn.x && mx <= btn.x + btn.w &&
                my >= btn.y && my <= btn.y + btn.h) {
                handleButtonClick(btn.label);
                return true;
            }
        }
    }
    
    return false;
}

function handleButtonClick(label) {
    switch (label) {
        case "Directions":
            // Trigger Directions modal
            const directionsModal = new bootstrap.Modal(document.getElementById('directions-modal'));
            directionsModal.show();
            break;
        case "About":
            // Trigger About modal
            const aboutModal = new bootstrap.Modal(document.getElementById('about-modal'));
            aboutModal.show();
            break;
        case "Worksheet":
            // Trigger worksheet download
            const worksheetLink = document.getElementById('worksheet');
            if (worksheetLink) {
                worksheetLink.click();
            }
            break;
    }
    isMenuOpen = false;
} 