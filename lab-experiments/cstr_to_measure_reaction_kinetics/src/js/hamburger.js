// Canvas-based hamburger menu implementation

// State variables
let isMenuOpen = false;
let menuBounds = {
    x: 20,
    y: 20,
    width: 45,
    height: 40
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
    fill(isHovering ? color('#c9e5f2') : color('#add8e6'));
    rect(menuBounds.x, menuBounds.y, menuBounds.width, menuBounds.height, 5);
    
    // Draw the three lines
    const barHeight = 2; // Thickness of each bar (line)
    const totalBarHeight = 3 * barHeight + 2 * 6; // 3 bars + 2 spaces of 6 pixels each
    const startY = menuBounds.y + (menuBounds.height - totalBarHeight) / 2 + barHeight/2; // Calculate starting Y to center the group
    const lineSpacing = 6; // Space between bars
    
    for (let i = 0; i < 3; i++) {
        stroke(0); // Changed lines to black
        strokeWeight(barHeight);
        line(
            menuBounds.x + 8, // Adjusted horizontal position for lines
            startY + (i * (barHeight + lineSpacing)),
            menuBounds.x + menuBounds.width - 8, // Adjusted horizontal position for lines
            startY + (i * (barHeight + lineSpacing))
        );
    }
    
    // Draw menu panel if open
    if (isMenuOpen) {
        // Draw solid white background with border
        fill(255);
        stroke(0);
        strokeWeight(2);
        
        // Adjust popup size for horizontal buttons
        const buttonWidth = 110; // Match drawButton width
        const buttonHeight = 38; // Match drawButton height
        const buttonSpacing = 20; // Reduced spacing between horizontal buttons
        const totalButtonsWidth = (buttonWidth * 3) + (buttonSpacing * 2);

        const padding = 25; // Increased padding
        const popupWidth = totalButtonsWidth + padding * 2; // Add padding on sides
        const popupHeight = buttonHeight + padding * 2; // Add padding top/bottom

        // Position popup relative to menu icon
        const popupX = menuBounds.x;
        const popupY = menuBounds.y + menuBounds.height + 5;

        // Add mild shadow before drawing the popup
        push(); // Save current drawing state
        drawingContext.shadowOffsetX = 5; // Horizontal offset
        drawingContext.shadowOffsetY = 5; // Vertical offset
        drawingContext.shadowBlur = 10; // Blur radius
        drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Shadow color with transparency

        rect(popupX, popupY, popupWidth, popupHeight, 5); // Reduced corner radius for popup as well
        
        pop(); // Restore drawing state to disable shadow for buttons

        // Draw buttons horizontally
        const startX = popupX + padding; // Start drawing buttons with left padding
        const startY = popupY + padding; // Start drawing buttons with top padding

        // Clear previous button bounds
        buttonBounds = [];
        
        // Directions button
        drawButton(startX, startY, buttonWidth, buttonHeight, "Directions", 0);
        
        // About button
        drawButton(startX + buttonWidth + buttonSpacing, startY, buttonWidth, buttonHeight, "About", 1);
        
        // Worksheet button
        drawButton(startX + (buttonWidth + buttonSpacing) * 2, startY, buttonWidth, buttonHeight, "Worksheet", 2);
    }
}

function drawButton(x, y, w, h, label, index) {
    // Store button bounds for interaction
    buttonBounds[index] = { x, y, w, h, label };
    
    // Check if mouse is hovering over this button
    const isButtonHovering = mouseX >= x && mouseX <= x + w &&
                            mouseY >= y && mouseY <= y + h;
    
    // Draw button with border
    // Use the specified blue color from the image, lighter shade for hovering
    fill(isButtonHovering ? color('#3086FF') : color('#0D6EFD')); // Changed color to 0D6EFD and a lighter hover shade
    noStroke(); // Removed stroke for buttons
    rect(x, y, w, h, 5); // Reduced corner radius to 5
    
    // Draw text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18); // Increased text size slightly
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