//This JS file provides calculations for simulation
var g = 9.8; //gravity
var rho_air = 1.23; //air density
var d_t = 0.001;
var velocity = 0;
var acceleration = 0;

//Drag force function
//Input: Drag Coefficient, Velocity,Area
//Return: magnitude of force
function Drag(Cd, V, A)
{
    var F = Cd*rho_air*V*V*A/2;
    return F;
}

//The acc function 
//Input:takes mass, drag, objects position, time interal
//Return: acceleration
function acc(mass, drag)
{
    acceleration =  (g-drag/mass);
    return acceleration;
}

//Position 
//Acceleration is also changing with time. Taking small time intervals (0.001) for calculation. 
function position(pos)
{
    velocity = velocity + d_t*acceleration;
    pos = pos+ velocity*d_t;
    return pos;
}