// Canvas-based hamburger menu implementation

// State variables
let isMenuOpen = false;
let menuBounds = {
    x: 20,
    y: 20,
    width: 40,
    height: 36
};
let buttonBounds = [];

export function drawHamburgerMenu() {
    // Draw hamburger icon with border
    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(menuBounds.x, menuBounds.y, menuBounds.width, menuBounds.height, 5);
    
    // Draw the three lines
    const lineSpacing = 8;
    const startY = menuBounds.y + 10;
    
    for (let i = 0; i < 3; i++) {
        line(
            menuBounds.x + 10,
            startY + (i * lineSpacing),
            menuBounds.x + menuBounds.width - 10,
            startY + (i * lineSpacing)
        );
    }
    
    // Draw menu panel if open
    if (isMenuOpen) {
        // Draw solid white background with border
        fill(255);
        stroke(0);
        strokeWeight(2);
        rect(menuBounds.x, menuBounds.y + menuBounds.height + 5, 200, 160, 5);
        
        // Draw buttons
        const buttonWidth = 180;
        const buttonHeight = 36;
        const buttonSpacing = 15;
        const startX = menuBounds.x + 10;
        const startY = menuBounds.y + menuBounds.height + 15;
        
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
    
    // Draw button with border
    fill(0, 123, 255); // Bootstrap primary blue
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h, 5);
    
    // Draw text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
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