//This JS file provides calculations for simulation
var g = 9.8; //gravity
var rho_air = 1.23; //air density
var time = 0;
var Cd = 0.5;
var A = 0.147;
var M = 0.75;
var fall_height = 324; // height of eiffel tower in meters

var acceleration = 0;
var velocity = 0;
var height = fall_height; 
var dragForce = 0;

//Position 
//Acceleration is also changing with time. Taking small time intervals (0.001) for calculation. 
function advance()
{
    dragForce = Cd*rho_air*velocity*velocity*A/2;
    acceleration = g - dragForce / M;
    velocity = velocity + dt*acceleration;
    height = Math.max(0, height - dt*velocity);
    time += dt;
}

function VT() // calculates the total time it will take to fall and sets the global variable "fallTime" to that value.
{
    initValue();
    dt = 0.01;

    while(height > 0) { 
        advance();
    }

    max_velocity = velocity;
    fallTime = time;
    initValue();

    return fallTime;

}

function initValue()
{
    Cd = Number(document.getElementById("dragCoeff").value) > 0 ? Number(document.getElementById("dragCoeff").value) : 0.001;
    A = Number(document.getElementById("area").value) > 0 ? Number(document.getElementById("area").value) : 0.001;
    M = Number(document.getElementById("mass").value) > 0 ? Number(document.getElementById("mass").value) : 0.001;

    cdInp.value = Cd;
    aInp.value = A;
    mInp.value = M;

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

function updateDOM()
{
    document.getElementById("GForce").innerHTML = formatNumber(g * M);
    document.getElementById("HDrag").innerHTML = formatNumber(dragForce);
    document.getElementById("HVelocity").innerHTML = formatNumber(velocity);
    document.getElementById("HHeight").innerHTML = formatNumber(height);
    document.getElementById("HAcceleration").innerHTML = formatNumber(acceleration);
    objImage.style.top = `${ (fall_height - height) * ( image_height / fall_height ) }px`;
}

// This returns a number, formatted to be around 3-4 characters long
function formatNumber(num) {
    let n = Number.parseFloat(num);
    if (isNaN(n)) { n = 0 }
    n = Math.round(n * 10000) / 10000;
    if ( n === 0 ) { return 0 }
    else if ( n > 100 ) { return Number.parseInt(n) }
    else if ( n > 1 ) { return Number( Number( Math.round( n * 10 ) / 10 ).toFixed(1) ) }
    else { 
        if ( n < 0.001 ) { return 0 }
        return Number( Number( Math.round( n * 1000 ) / 1000 ).toPrecision(1) )
    }
}