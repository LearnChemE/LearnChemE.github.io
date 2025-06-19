// Canvas-based hamburger menu implementation

// State variables
let isMenuOpen = false;
// menuBounds will be calculated dynamically
let menuBounds = {};
let buttonBounds = [];
let isHovering = false;

// Function to update all bounds dynamically
function updateHamburgerBounds() {
    // Calculate menu bounds relative to canvas dimensions
    const menuWidth = 45;
    const menuHeight = 40;
    menuBounds = {
        x: width * 0.02, // Position 2% from the left edge of the canvas
        y: height * 0.03, // Position 3% from the top edge of the canvas
        width: menuWidth,
        height: menuHeight
    };

    // Calculate button bounds if menu is open
    if (isMenuOpen) {
        const buttonWidth = 120; // Reduced width further
        const buttonHeight = 40; // Reduced height
        const buttonSpacing = 15; // Spacing between vertical buttons
        const popupPadding = 15; // Padding inside the popup

        // Calculate popup position relative to menu bounds
        const popupX = menuBounds.x;
        const popupY = menuBounds.y + menuBounds.height + 5; // Position below the hamburger icon

        // Calculate start position for buttons within the popup, considering padding
        const startX = popupX + popupPadding;
        const startY = popupY + popupPadding;

        // Clear button bounds before repopulating
        buttonBounds = [];

        // Directions button bounds
        buttonBounds[0] = { x: startX, y: startY, w: buttonWidth, h: buttonHeight, label: "Directions" };

        // About button bounds
        buttonBounds[1] = { x: startX, y: startY + buttonHeight + buttonSpacing, w: buttonWidth, h: buttonHeight, label: "About" };

        // Worksheet button bounds
        buttonBounds[2] = { x: startX, y: startY + (buttonHeight + buttonSpacing) * 2, w: buttonWidth, h: buttonHeight, label: "Worksheet" };
    } else {
        buttonBounds = []; // Clear button bounds when menu is closed
    }
}

// Removed resize event listener - bounds will be updated in drawHamburgerMenu and handleHamburgerClick
// window.addEventListener('resize', updateHamburgerBounds);

// Also call update on initial setup
// This assumes p5 setup() has been called and width/height are available
// If this causes issues, we might need to call it from sketch.js after setupCanvas
// updateHamburgerBounds(); 


export function drawHamburgerMenu() {
    // Update all bounds for drawing
    updateHamburgerBounds();

    // Check if mouse is hovering over the hamburger menu using scaled window.mX/window.mY
    isHovering = window.mX >= menuBounds.x && window.mX <= menuBounds.x + menuBounds.width &&
                 window.mY >= menuBounds.y && window.mY <= menuBounds.y + menuBounds.height;
    
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
        
        // These values are calculated in updateHamburgerBounds, but kept here for drawing
        const buttonWidth = 120; // Reduced width further
        const buttonHeight = 40; // Reduced height
        const buttonSpacing = 15;
        const popupPadding = 15;
        const popupX = menuBounds.x;
        const popupY = menuBounds.y + menuBounds.height + 5;

        // Calculate popup size based on button dimensions and padding
        const popupWidth = buttonWidth + popupPadding * 2;
        const totalButtonsHeight = (buttonHeight * 3) + (buttonSpacing * 2);
        const popupHeight = totalButtonsHeight + popupPadding * 2;

        // Calculate start position for buttons within the popup for drawing
        const startX = popupX + popupPadding;
        const startY = popupY + popupPadding;

        // Add mild shadow before drawing the popup
        push();
        drawingContext.shadowOffsetX = 5;
        drawingContext.shadowOffsetY = 5;
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

        rect(popupX, popupY, popupWidth, popupHeight, 10);
        
        pop();

        // Draw buttons vertically using bounds calculated in updateHamburgerBounds for positioning
        // buttonBounds are populated by updateHamburgerBounds and used for hover in drawButton and interaction in handleHamburgerClick
        
        // Directions button
        drawButton(startX, startY, buttonWidth, buttonHeight, "Directions", 0);
        
        // About button
        drawButton(startX, startY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, "About", 1);
        
        // Worksheet button
        drawButton(startX, startY + (buttonHeight + buttonSpacing) * 2, buttonWidth, buttonHeight, "Worksheet", 2);
    }
}

// drawButton uses bounds calculated and stored in updateHamburgerBounds for hover check
function drawButton(x, y, w, h, label, index) {
    // Check if mouse is hovering over this button using the bounds stored in buttonBounds
    let isButtonHovering = false;
    // Use scaled mouse coordinates for check from window.mX/window.mY (updated in index.js)
    if (buttonBounds[index]) { // Ensure bounds exist before checking
        isButtonHovering = window.mX >= buttonBounds[index].x && window.mX <= buttonBounds[index].x + buttonBounds[index].w &&
                           window.mY >= buttonBounds[index].y && window.mY <= buttonBounds[index].y + buttonBounds[index].h;
    }

    // Draw button with border
    fill(isButtonHovering ? color('#0A58CA') : color('#0D6EFD')); // Default 0D6EFD, darker 0A58CA on hover
    noStroke();
    rect(x, y, w, h, 5);
    
    // Draw text
    fill(255); // Ensure text is plain white
    stroke(255); // Add black stroke to make text thicker
    strokeWeight(0.5); // Set stroke weight for thicker text
    textAlign(CENTER, CENTER);
    
    textSize(18); // Text size 18 as per your change
    text(label, x + w/2, y + h/2);
    noStroke(); // Remove stroke after drawing text

    // Bounds are calculated and stored in updateHamburgerBounds
}

export function handleHamburgerClick() { // No longer accept mx and my parameters
    // Update all bounds immediately before checking interaction
    updateHamburgerBounds();

    // Use window.mX and window.mY (scaled mouse coordinates from index.js) for interaction checks
    const mx = window.mX; // Use global scaled mouseX
    const my = window.mY; // Use global scaled mouseY

    // Check if hamburger icon was clicked using the dynamically calculated bounds
    if (mx >= menuBounds.x && mx <= menuBounds.x + menuBounds.width &&
        my >= menuBounds.y && my <= menuBounds.y + menuBounds.height) {
        isMenuOpen = !isMenuOpen;
        // Update all bounds immediately when menu opens/closes
        updateHamburgerBounds();
        return true;
    }
    
    // If menu is open, check button clicks using the dynamically calculated bounds
    // buttonBounds are populated by updateHamburgerBounds
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
    // Update all bounds immediately when menu closes
    updateHamburgerBounds();
} 