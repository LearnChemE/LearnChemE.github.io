//This JS file provides calculations for simulation
var g = 9.8; //gravity
var rho_air = 1.23; //air density
var mspc = 1; //ms per calculation
var d_t = mspc/1000;
var Cd = 0.5;
var A = 0.147;
var M = 0.75;
var max_t = 8000;


var acceleration = 0;
var velocity = 0;
var height = 200; 
var dragForce = 0;

let VTdict = {};
let HTdict = {};
let FTdict = {};

//Drag force function
//Input: Drag Coefficient, Velocity,Area
//Return: magnitude of force
function Drag()
{
    dragForce = Cd*rho_air*velocity*velocity*A/2;
    return dragForce;
}

//The acc function 
//Input:takes mass, drag, objects position, time interal
//Return: acceleration
function acc()
{
    acceleration =  (g-Drag()/M);
    return acceleration;
}

//Position 
//Acceleration is also changing with time. Taking small time intervals (0.001) for calculation. 
function V()
{
    velocity = velocity + d_t*acc();
    height = height - velocity*d_t;
    return velocity;
}

function VT()
{
    var time = 0; // time of falling
    while((height >= 0) && (time <= max_t)) //Max time 10 secs
    {
        VTdict[time] = V();
        HTdict[time] = height;
        FTdict[time] = dragForce;
        time = time + mspc;
    }
    
}

function initValue()
{
    Cd = document.getElementById("dragCoeff").value;
    A = document.getElementById("area").value;
    M = document.getElementById("mass").value;

    acceleration = 0;
    velocity = 0;
    height = 400;
    VTdict[0] = velocity;
    HTdict[0] = height;
    FTdict[0] = Drag();

    start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
    now = Date.now();
    elapsed = now - start;

    updateData();

}

function updateData()
{
    document.getElementById("GForce").innerHTML = (g * M).toFixed(2);
    document.getElementById("HVelocity").innerHTML = VTdict[elapsed].toFixed(1);
    document.getElementById("HHeight").innerHTML = HTdict[elapsed].toFixed(0);
    document.getElementById("HAcceleration").innerHTML = ((VTdict[elapsed]-VTdict[elapsed-1])/0.001).toFixed(3);
    document.getElementById("HDrag").innerHTML = FTdict[elapsed].toFixed(2);

}

