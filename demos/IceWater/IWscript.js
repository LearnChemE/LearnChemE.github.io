/*
 * File: MISscript.js
 * Purpose: To provide the animations and interactivity for the Melting Ice Simulation (melting-ice.html)
 * Original Author: Emily Ehrenberger (July 2011)
 *		   Under the supervision of Margot Vigeant, Bucknell University
 *		   Based on Flash simulation by Matt Koppenhaver under Professor Michael Prince
 * (c) Margot Vigeant 2011
 * 
 * Current Version Author: Neil Hendren (May 2019)
 * 		Under the supervision of Dr. John Flaconer, University of Colorado Boulder
 */


/*
 * This file makes use of the following javascript libraries:
 * jQuery (https://jquery.com/)
 * p5.js (https://www.p5js.org/)
 * math.js (https://mathjs.org/)
 * grafica.js (https://github.com/jagracar/grafica.js)
 * quicksettings 3 (https://github.com/bit101/quicksettings)
 * 
 *//* jshint esversion: 6 */


$(document).ready(init);

/* This document is designed to have a static aspect ratio
 * of 1.2, and to work between widths of 600 and 1200 px. Would have
 * expanded the range but CSS is hard
 */
let maxWidth = Math.min(document.documentElement.clientWidth, 1200);
let	maxHeight = Math.min(document.documentElement.clientHeight, 1000);
let	minWidth = Math.max(600, document.documentElement.clientWidth);
let	minHeight = Math.max(500, document.documentElement.clientHeight);

let	clientWidth = Math.max(minWidth, maxWidth);
let clientHeight = Math.max(minHeight, maxHeight);

if (clientWidth > 1.2 * clientHeight) {
	clientWidth = clientHeight * 1.2;
} else {
	clientHeight = clientWidth / 1.2;
}

// Adapt the device pixel ratio
let HD=window.devicePixelRatio;

// Water properties
let iceTemp = 0;
let waterHeatCap = 4.184; // J/(g K)
let waterMass = 100; // amount of water per beaker, grams
let waterHF = 333.05; // water heat of fusion, J/g

/*for(i=1; i<=4000; i++) {
	water1TempArray.push([i, 0]);
	water2TempArray.push([i, 0]);
}*/

// Initial block properties, situation 1. Can be adjusted with sliders.
let initialTemp; // celsius
let heatCapacity; // J/(g K)
let mass; // g
let U; // note - stir factor is equivalent to heat transfer coefficient, "U". Units: W/(m^2 K)

// Initiates the quicksettings sliders as "panel#"
let panel1;
let panel2;
let panel3;

/* Initiates the plots, and their initial axes limits. Upon loading
* the page displays only time vs. Ice melted graph.
*/
let plot;
let tMax = 120; // 120 seconds are simulated
let dt = tMax / 2000; // plots 1000 points
let frMult = 2; // multiplier times real time (seconds per second)
//let fr;
let xAxisLimit = tMax;
let yAxisLimit = 400;

var beaker1;
var beaker2;

let sit1GraphPts = [];
let sit2GraphPts = [];

// Variables to keep track of animation state
let currentStep = 0;
let experimentStarted = false;
let experimentRunning = false;
let iceDropped = false;

// CSS-related variables
let iceMaxHeight = 14.3; // max height/width are 14.3% or 10.0% of the size of their parent div.
let iceMaxWidth = 10.0;

/* jQuery variables for resizing things. Will retrieve or adjust the size
* of the beaker, box, blocks, and fall distance for the animation as window size is changed.
*/
let bkHeight;
let boxHeight;
let iceHeight;
let fallDist;

let y = 0.75;

var graphFontSize = 12;

// add a prototype to Array class to save some time
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}

// really bad at CSS so resizing functionality is with javascript .. don't judge me
function windowResized() {
	maxWidth = Math.min(document.documentElement.clientWidth * 0.95, 1200);
	maxHeight = Math.min(document.documentElement.clientHeight * 0.95, 1000);
	minWidth = Math.max(600, document.documentElement.clientWidth * 0.95);
	minHeight = Math.max(500, document.documentElement.clientHeight * 0.95);

	clientWidth = Math.max(minWidth, maxWidth);
	clientHeight = Math.max(minHeight, maxHeight);

	if (clientWidth > 1.2 * clientHeight) {
		clientWidth = clientHeight * 1.2;
	} else {
		clientHeight = clientWidth / 1.2;
	}

	$(":root").css({"font-size": 11 + ((clientWidth - 600) / 600) * 4 + "px"});

	graphFontSize = 12 + ((clientWidth - 600) / 600) * 4;
	
	plot.setAllFontProperties("Helvetica", color(0, 0, 0), graphFontSize);

	// adjusts the quicksettings panel size and position
	let w1 = $("#topLeft").width();
	let w2 = $("#topRight").width();
	let w3 = 170;

	panel1.setWidth(w1 - 10);
	panel2.setWidth(w2 - 10);
	panel1.setPosition(0, 10);
	panel2.setPosition($("#bottomCenter").width() - w2, 10);
	panel3.setWidth(w3 - 10);
	panel3.setPosition($("#bottomCenter").width() - 170, clientHeight * 0.7 - 40);

	// retrieves the beaker height and the size to adjust falling distance
	bkHeight = $("#beakersImg").height();
	boxHeight = $("#topCenter").height();
	fallDist = 100*(0.6*bkHeight/boxHeight);

	// clears and resets the canvas; adjusts plot properties accordingly
	plot.setOuterDim(clientWidth - 170, clientHeight * 0.54);
	plot.setPos(10, 0);
	resizeCanvas(clientWidth / 0.95, cnv.height = clientHeight * 0.54 / 0.95);
	clear();
}

/*
 *************************************************************************
 *						Initialization Functions						*
 *************************************************************************
 */


/*
 * Function: init
 * Sets up the page when it is loaded, initializes input values, both in the program and in the display.
 */
function init() {
	// register event handlers for some buttons
	$("#startButton").on('click', startMelting);
	$("#resetButton").on('click', resetExperiment);
	beaker1 = new Beaker(10, 10, 303);
	beaker2 = new Beaker(10, 50, 303);
	QuickSettings.useExtStyleSheet();
	panel1 = QuickSettings.create(0, 30, "Beaker 1", document.body, "red")
		.addRange("Mass of ice", 10, 100, 30, 1, function (value) {
			beaker1.mI = value;
		}, " g")
		.addRange("Crushedness", 0, 100, 50, 1, function (value) {
			beaker1.crushedness = value;
		})
		.setDraggable(true);

	panel2 = QuickSettings.create(0, 30, "Beaker 1", document.body, "red")
		.addRange("Mass of ice", 10, 100, 30, 1, function (value) {
			beaker2.mI = value;
		}, " g")
		.addRange("Crushedness", 0, 100, 50, 1, function (value) {
			beaker2.crushedness = value;
		})
		.setDraggable(true);

	panel3 = QuickSettings.create(0, 30, "Plot Options", document.body, "graph")
		.addRange("Simulation time", 10, 500, 120, 1, function (value) {
			tMax = value;
			dt = tMax / 2000;
		}, "s")
		.addRange("Animation speed", 0.5, 5, 1, 0.5, function (value) {
			frMult = value;
		}, "x");
windowResized();
}

/*
 * Function: setup(). Part of the p5.js library. Required to run draw().
 * provides some setup information for the p5 canvas object.
 */
function setup() {
	pixelDensity(HD);

	cnv = createCanvas(100, 100);
	cnv.parent("bottomCenter");

	plot = new GPlot(this);
	plot.setPos(10, 0);
	plot.setOuterDim(200, 100);
	plot.setYLim(0, 1);
	plot.getXAxis().getAxisLabel().setText("time (s)");
	plot.getYAxis().getAxisLabel().setText("temperature (K)");
	plot.getTitle().setText("temperature of water");

	smooth();
  }

/*
 *************************************************************************
 *								Calculations!							*
 *************************************************************************
 */

/*
 * 
 */
class Beaker {
	constructor(initialMass, crushedness, initialTemp) {
		this.mI = initialMass;
		this.mW = waterMass;
		this.crushedness = crushedness;
		this.Ti = initialTemp; // water temperature, not ice temperature
		this.k = crushedness / 1000;
		this.HF = waterHF;
		this.cp = waterHeatCap;
		this.height = iceMaxHeight / crushedness;
		this.width = iceMaxWidth / crushedness;
	}

	generateGraphPoints() {
		this.finalTemp = (this.mW*this.cp*this.Ti-this.mI*this.HF)/(this.cp*(this.mI+this.mW));
		this.tempArray = functionToArray(`${this.finalTemp} + ${this.Ti-this.finalTemp}e^(${-this.k}*t)`, ["t", 0, tMax, dt]);
	}
}

/* 
 * Function: pictureBehavior. Runs within the draw() loop, and changes
 * the CSS data of the beaker, ice cubes, blocks to give it an animation.
 */
function pictureBehavior() {

	if (currentStep == 0 && !iceDropped && experimentRunning) {
		y *= 1.06;
		iceHeight -= y;


		if (iceHeight <= fallDist) {iceDropped = true; y = 0.75;} else {iceDropped = false;}

	} else if (experimentRunning) {

	}
}

/*
 *************************************************************************
 *							Simulation Controls							*
 *************************************************************************
 */

/*
 * Function: pauseMelting
 * Called when the user clicks the Pause button while an experiment is running
 *
 * Pauses the experiment by setting experimentRunning to false (so values/display do not keep updating) without
 * resetting or changing any other aspects of the display or state. Also changes the Pause button to read "RESUME" instead.
 */
function pauseMelting() {
	if (!experimentStarted) {
		return;
	}

	if (experimentRunning) {
		experimentRunning = false;
		$("#startButton").html("Start");
	} else {
		experimentRunning = true;
		$("#startButton").html("Pause");
		pictureBehavior();
	}
}

/*
 * Function: startMelting
 * Called when the user clicks the Start button
 *
 * Performs all setup/initialization that needs to occur at the beginning of every experiment, and
 * then begins the execution of the experiment.
 */
function startMelting() {
	// Reset experiment to the beginning (ex. unmelt ice cubes, move blocks back to their starting location, etc.) just
	// in case the user re-starts the experiment without explicitly clicking the Reset button first
	if (experimentStarted) {
		pauseMelting();
		return;
	}

	resetExperiment();

	// Disable "start" button and enable "pause" button
	$("#startButton").attr("disabled", "disabled");
	$("#startButton").css("border-color", "gray");
	$("#startButton").html("Pause");

	// Initialize starting values for the calculations
	beaker1.generateGraphPoints();
	beaker2.generateGraphPoints();

	// Start the experiment
	experimentRunning = true;
	experimentStarted = true;

	currentStep = 0;

	/*panel1.disableControl("Initial Temperature");
	panel1.disableControl("Block Heat Capacity");

	panel2.disableControl("Initial Temperature");
	panel2.disableControl("Block Heat Capacity");*/

	panel3.disableControl("duration to simulate");
}

/*
 * Function: resetExperiment
 * Resets the visual display to what it should look like before an experiment is run.
 */
function resetExperiment() {
	/*
	// Re-enable the input fields if they are disabled
	if (experimentRunning || experimentStarted) {
		panel1.enableControl("Initial Temperature");
		panel1.enableControl("Block Heat Capacity");

		panel2.enableControl("Number of Blocks");
		panel2.enableControl("Add Stir Bar");

		panel3.enableControl("duration to simulate");
	}*/

	experimentRunning = false;
	experimentStarted = false;
	iceDropped = false;

	sit1GraphPts = [];
	sit2GraphPts = [];

	$("#startButton").removeAttr("disabled");
	$("#startButton").css("border-color", "#093");
	$("#startButton").html("Start");

	currentStep = 0;
	iceHeight = 51;
}

/*
 *************************************************************************
 *							Main Program Loop						*
 *************************************************************************
 */
/*
 * draw() is a function that is looping continuously, updating the canvas object
 * continuously. It is always looping (about 60 Hz) unless the noLoop() command is
 * called. This is part of the p5.js library.
 */
function draw() {
	frameRate(60);
	pictureBehavior();
	background(color(255,255,255));

	//$("#temps1").html(`water temperature: ${currentStep == 0 ? icewaterTemp : water1TempArray[currentStep][1].toFixed(1)} °C<br>block temperature: ${currentStep==0 ? initialTemp1 : sit1TempArray[currentStep][1].toFixed(1)} °C`);
	//$("#temps2").html(`water temperature: ${currentStep == 0 ? icewaterTemp : water2TempArray[currentStep][1].toFixed(1)} °C<br>block temperature: ${currentStep==0 ? initialTemp2 : sit2TempArray[currentStep][1].toFixed(1)} °C`);

	drawPlot();

	// Only advances in time once the blocks hit the water.
	if (iceDropped && experimentRunning) {
		{currentStep += Math.floor(2 * frMult);
			if (currentStep >= Math.floor(tMax / dt - 1)) {currentStep = Math.floor(tMax / dt - 1);}
		}
	}

	if (currentStep >= Math.floor(tMax / dt - 1)) {
		experimentRunning = false;
		$("#startButton").removeAttr("disabled");
		$("#startButton").css("border-color", "#093");
		$("#startButton").html("Start");
	}
}

/*
 *************************************************************************
 *							Auxilliary Functions						*
 *************************************************************************
 */
/*
 * function drawplot(): a method for drawing the mass of ice melted plot
 * within the draw() loop.
 */
function drawPlot() {
	plot.setXLim(0, xAxisLimit);
		plot.setYLim(0, Math.ceil(yAxisLimit));
		plot.beginDraw();
		plot.drawBackground();
		plot.drawLimits();
		plot.drawXAxis();
		plot.drawYAxis();
		plot.drawTitle();
		plot.drawBox();
		plot.drawGridLines(2);
		push();
		strokeWeight(3.5);
		if(iceDropped) {
			textAlign(BOTTOM);
			textSize(20);
			textStyle(BOLD);
			fill(204, 0, 0);
			let loc1 = plot.mainLayer.valueToPlot(beaker1.tempArray[currentStep][0], beaker1.tempArray[currentStep][1]);
			text("1", loc1[0] + 5, loc1[1]);
			fill(0, 51, 204);
			let loc2 = plot.mainLayer.valueToPlot(beaker2.tempArray[currentStep][0], beaker2.tempArray[currentStep][1]);
			text("2", loc2[0] + 5, loc2[1]);

			stroke(204, 0, 0);
			sit1GraphPts.push(beaker1.tempArray[currentStep]);
			arrayToPlot(sit1GraphPts, plot, true);

			stroke(0, 51, 204);
			sit2GraphPts.push(beaker2.tempArray[currentStep]);
			arrayToPlot(sit2GraphPts, plot, true);
		}
		pop();
		plot.endDraw();
}

/*
 * Event Handler Function: getAreas
 * Called when the user enters a new value for "area of each block" for either Situation
 *
 * Reads in and validates both area values, and updates global variables accordingly. Also changes
 * the size of the block pictures on the display, according to the current area values.
 */
/*function getAreas() {
	let scalingFactor = Math.min(clientWidth / 1200, clientHeight / 1000);
	// Change the blocks' size according to the input surface area
	let size1 = Math.min(48, 5 + Math.sqrt(area1) * scalingFactor * 8) + "px";
	let size2 = Math.min(48, 5 + Math.sqrt(area2) * scalingFactor * 8) + "px";
	$(".sit1block").css({
		height: size1,
		width: size1,
		bottom: "51%"
	});

	$(".sit2block").css({
		height: size2,
		width: size2,
		bottom: "51%"
	});
	
}
*/