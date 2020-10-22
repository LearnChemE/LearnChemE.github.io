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
    height = height - dt*velocity;
    time += dt;
    return velocity;
}

function VT() // calculates the total time it will take to fall and sets the global variable "fallTime" to that value.
{
    initValue();
    dt = 0.01;

    while(height >= 0) { 
        advance();
    }

    max_velocity = velocity;
    fallTime = time;
    initValue();

    return fallTime;

}

function initValue()
{
    Cd = document.getElementById("dragCoeff").value;
    A = document.getElementById("area").value;
    M = document.getElementById("mass").value;

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
    document.getElementById("GForce").innerHTML = Number(g * M).toFixed(1);
    document.getElementById("HDrag").innerHTML = Number(dragForce).toFixed(1);
    document.getElementById("HVelocity").innerHTML = Math.round(velocity);
    document.getElementById("HHeight").innerHTML = Math.abs(Number(height).toFixed(0));
    document.getElementById("HAcceleration").innerHTML = Number(acceleration).toFixed(1);
}
