//This JS file provides calculations for simulation
var g = 9.8; //gravity
var rho_air = 1.23; //air density
var mspc = 1; //ms per calculation
var d_t = mspc/1000;
var Cd = 0.5;
var A = 0.147;
var mass = 5;
var max_t = 5;


var acceleration = 0;
var velocity = 0;
var height = 200; 

let VTdict = {};
let VHdict = {};

//Drag force function
//Input: Drag Coefficient, Velocity,Area
//Return: magnitude of force
function Drag()
{
    var F = Cd*rho_air*velocity*velocity*A/2;
    return F;
}

//The acc function 
//Input:takes mass, drag, objects position, time interal
//Return: acceleration
function acc()
{
    acceleration =  (g-Drag()/mass);
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
    while((height >= 0) && (time <= max_t*1000)) //Max time 10 secs
    {
        VTdict[time] = V();
        VHdict[time] = height;
        time = time + mspc;
    }
    
}