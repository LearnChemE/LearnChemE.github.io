//This JS file provides calculations for simulation
var g = 9.8; //gravity
var rho_air = 1.23; //air density
var time = 0;
var Cd = 0.5;
var A = 0.147;
var M = 0.75;
var fall_height = 169; // height of washington monument

var acceleration = 0;
var velocity = 0;
var height = fall_height; 
var dragForce = 0;

// This updates all the global variables for position, velocity, etc.
function advance()
{
    dragForce = Cd*rho_air*velocity*velocity*A/2;
    acceleration = g - dragForce / M;
    velocity = velocity + dt*acceleration;
    height = Math.max(0, height - dt*velocity);
    time += dt;
}

// calculates the total time it will take to fall and sets the global variable "fallTime" to that value. Also sets the max_velocity
function VT() 
{
    initValue();
    dt = 0.01;

    const timeStart = Date.now(); 
    let timeElapsed = 0;

    while( height > 0 && timeElapsed < 3000 ) { 
        advance();
        timeElapsed = Date.now() - timeStart;
    }
    // so we don't get stuck in a while loop - refresh the page if it cannot solve in reasonable time frame
    // not the perfect bug fix but it will never freeze up the browser
    if (timeElapsed >= 3000) {
        window.location.reload();
    }

    max_velocity = velocity;
    fallTime = time;
    initValue();

    return fallTime;

}

function initValue()
{
    // We can span orders of magnitude by using Math.exp of the slider value
    Cd = Math.exp( document.getElementById("dragCoeff").value );
    A = Math.exp( document.getElementById("area").value );
    M = Math.exp( document.getElementById("mass").value );

    document.getElementById("cdValue").innerHTML = `${formatNumber(Cd)}`;
    document.getElementById("areaValue").innerHTML = `${formatNumber(A)}`;
    document.getElementById("massValue").innerHTML = `${formatNumber(M)}`;

    time = 0;
    acceleration = 0;
    velocity = 0;
    height = fall_height;
    dragForce = 0;
    time = 0;

    start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
    now = Date.now();
    elapsed = now - start;

    updateDOM();

}

// Update document object model (DOM).  Uses a function "formatNumber" for all numbers displayed on screen
function updateDOM()
{
    document.getElementById("GForce").innerHTML = formatNumber(g * M);
    document.getElementById("HDrag").innerHTML = formatNumber(dragForce);
    document.getElementById("HVelocity").innerHTML = formatNumber(velocity);
    document.getElementById("HHeight").innerHTML = formatNumber(height) - (sd==1)*fall_height;
    document.getElementById("HAcceleration").innerHTML = formatNumber(acceleration);
    objImage.style.top = `${ 40+(fall_height - height) * ( (image_height-40) / fall_height ) }px`;
}

// This returns a number as a string, formatted to be around 3-4 characters long
function formatNumber(num) {
    let n = Number.parseFloat(num);
    if (isNaN(n)) { n = 0 }
    n = Math.round(n * 10000) / 10000;
    if ( n === 0 ) { return 0 }
    else if ( n >= 10 ) { return Number.parseInt(n).toFixed(0) }
    else if ( n >= 1 ) { return Number( Math.round( n * 10 ) / 10 ).toFixed(1) }
    else if ( n >= 0.01 ) {
        return Number( Math.round( n * 100 ) / 100 ).toFixed(2);
    }
    else { 
        if ( n < 0.001 ) { return "0" }
        return Number( Math.round( n * 1000 ) / 1000 ).toPrecision(1);
    }
}
