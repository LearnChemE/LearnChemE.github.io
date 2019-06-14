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
let icewaterTemp = 0;
let waterHeatCap = 4.184; // J/(g K)
let waterMass = 100; // amount of water per beaker, grams
let waterHeatFusion = 333.05; // J/g
let maxIce = 10; // amount of ice in the beakers, g

let water1TempArray = [[0, 0]];
let water2TempArray = [[0, 0]];

for(i=1; i<=4000; i++) {
	water1TempArray.push([i, 0]);
	water2TempArray.push([i, 0]);
}

// Initial block properties, situation 1. Can be adjusted with sliders.
let initialTemp1; // celsius
let heatCapacity1; // J/(g K)
let mass1; // g
let area1; // cm^2 per block. This must always be divided by 10000 for stoichiometry.
let numBlocks1; // number of blocks
let stirFactor1; // note - stir factor is equivalent to heat transfer coefficient, "U". Units: W/(m^2 K)

// Initial block properties, situation 2. Can also be adjusted with sliders.
let initialTemp2; 
let heatCapacity2; 
let mass2; 
let area2; 
let numBlocks2;
let stirFactor2;

// Blank arrays in which the coordinate data for plotting will be stored.
let sit1IceArray = [[0, 0]];
let sit2IceArray = [[0, 0]];
let sit1TempArray = [[0, initialTemp1]];
let	sit2TempArray = [[0, initialTemp2]];
let iceMeltedVsTime1;
let iceMeltedVsTime2;
let tempVsTime1;
let tempVsTime2;

// Initiates the quicksettings sliders as "panel#"
let panel1;
let panel2;
let panel3;

/* Initiates the plots, and their initial axes limits. Upon loading
* the page displays only time vs. Ice melted graph.
*/
let plot1;
let plot2;
let tMax = 120; // 120 seconds are simulated
let dt = tMax / 2000; // plots 1000 points
let frMult = 2; // multiplier times real time (seconds per second)
//let fr;
let xAxisLimit = tMax;
let yAxisLimit1 = 1;
let yAxisLimit2 = 400;
let showWhichGraph = "3";

// Variables to keep track of animation state
let currentStep = 0;
let experimentStarted = false;
let experimentRunning = false;
let blocksDropped = false;

// CSS-related variables
let graphInfoShowing = false;
let iceMaxHeight1 = 14.3; // max height/width are 14.3% or 10.0% of the size of their parent div.
let iceMaxWidth1 = 10.0;
let iceMaxHeight2 = 14.3;
let iceMaxWidth2 = 10.0;
let currentIceWidth1; 
let currentIceHeight1;
let currentIceWidth2;
let currentIceHeight2;

/* jQuery variables for resizing things. Will retrieve or adjust the size
* of the beaker, box, blocks, and fall distance for the animation as window size is changed.
*/
let bkHeight;
let boxHeight;
let blockHeight;
let fallDist;
let y = 0.75;

var graphFontSize = 12;

// add a prototype to Array to save some time
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

	getAreas();

	// resizes the grid
	$(".wrapper").css("width", clientWidth + "px");
	$(".wrapper").css("height", clientHeight + "px");
	$(".box").css("height", clientHeight * 0.42 + "px");
	$(".d").css("height", clientHeight * 0.58 + "px");

	let aHeight = clientHeight * 0.42;

	// adjusts start/reset buttons
	$(".btn-lg").css({height: aHeight*0.11 + "px", width: aHeight*0.2 + "px", fontSize: aHeight/300 + "rem"});
	$(".btn-lg").css("line-height", aHeight*0.11 + "px");

	// adjusts pause/info/help buttons
	$(".b1").css("bottom", clientHeight * 0.13 + "px");
	$(".b2").css({right: aHeight*0.05 + "px", bottom: clientHeight * 0.08 + "px"});

	// "enable graph tooltips" button adjust
	$("#graphInfo").css({height: aHeight*0.11 + "px", width: aHeight*0.45 + "px", fontSize: aHeight/300 + "rem", bottom: aHeight*0.5 + "px"});
	$("#graphInfo").css("line-height", aHeight*0.11 + "px");
	$("#graphInfo").hide();

	$(".graphChoose").css("top", 35 + ((clientHeight - 500) / 500) * 50 + "px");
	$("input[type='radio']").css("margin-bottom", ((clientHeight - 500) / 500) * 20 + "px");

	/*$(".temps").css({bottom: aHeight*0.75 - 45 + "px"});
	$("#temps1").css({"margin-left": ((clientWidth - 600) / 600) * 50 + "px"});
	$("#temps2").css({"margin-right": ((clientWidth - 600) / 600) * 50 + "px"});*/

	$(":root").css({"font-size": 11 + ((clientWidth - 600) / 600) * 4 + "px"});
	graphFontSize = 12 + ((clientWidth - 600) / 600) * 4;
	plot1.setAllFontProperties("Helvetica", color(0, 0, 0), graphFontSize);
	plot2.setAllFontProperties("Helvetica", color(0, 0, 0), graphFontSize);


	// adjusts the quicksettings panel size and position
	let w1 = $("#topLeft").width();
	let w2 = $("#topRight").width();
	let w3 = 170;
	panel1.setWidth(w1);
	panel2.setWidth(w2);
	panel1.setPosition(0, 10);
	panel2.setPosition($("#bottomCenter").width() - w2, 10);
	panel3.setWidth(w3);
	panel3.setPosition($("#bottomCenter").width() - 170, clientHeight * 0.7 - 40);

	// retrieves the beaker height and the size to adjust falling distance
	bkHeight = $("#beakersImg").height();
	boxHeight = $("#topCenter").height();
	fallDist = 100*(0.6*bkHeight/boxHeight);

	// clears and resets the canvas; adjusts plot properties accordingly
	clear();
	switch(showWhichGraph) {
		case "1":
		plot1.setOuterDim(clientWidth - 170, clientHeight * 0.54);
		plot1.setPos(10, 0);
		break;
		case "2":
		plot2.setOuterDim(clientWidth - 170, clientHeight * 0.54);
		plot2.setPos(10, 0);
		break;
		case "3":
		plot1.setOuterDim(clientWidth*0.5 - 85, clientHeight * 0.54);
		plot2.setOuterDim(clientWidth*0.5 - 85, clientHeight * 0.54);
		plot2.setPos(clientWidth*0.5 - 85, 0);
		break;
	}
	resizeCanvas(clientWidth / 0.95, cnv.height = clientHeight * 0.54 / 0.95);
	clear();
}

/*
 *************************************************************************
 *						Initialization Functions						*
 *************************************************************************
 */

 /* first and foremost: */
window.onload = function () {
	// creates the quicksettings panels, gives initial values to each slider, etc.
	QuickSettings.useExtStyleSheet();
	panel1 = QuickSettings.create(0, 30, "Beaker 1", document.body, "red")
		.addRange("Initial temperature", 1, 100, 30, 1, function (value) {
			initialTemp1 = value;
		}, "°C")
		.addRange("Block heat capacity", 0.1, 10, 4, 0.1, function (value) {
			heatCapacity1 = value;
		}, `&nbspJ / (g°C)`)
		.addRange("Block mass", 0.1, 10, 2, 0.1, function (value) {
			mass1 = value;
		}, `&nbspg (per block)`)
		.addRange("Block area", 1, 9, 4, 1, function (value) {
			area1 = value;
			getAreas();
		}, `&nbspcm² (per block)`)
		.addRange("Number of blocks", 1, 4, 2, 1, function (value) {
			numBlocks1 = value;
			getNumBlocks();
		})
		.addBoolean("Add stir bar", false, function (value) {
			if (value) {
				$("#stirBar1").show();
				stirFactor1 = 1000;
			} else {
				$("#stirBar1").hide();
				stirFactor1 = 300;
			}
		})
		.setDraggable(true);

	panel2 = QuickSettings.create($("#bottomCenter").width() - 220, 30, "Beaker 2", document.body, "blue")
		.addRange("Initial temperature", 1, 100, 80, 1, function (value) {
			initialTemp2 = value;
		}, "°C")
		.addRange("Block heat capacity", 0.1, 10, 1, 0.1, function (value) {
			heatCapacity2 = value;
		}, `&nbspJ / (g°C)`)
		.addRange("Block mass", 0.1, 10, 1, 0.1, function (value) {
			mass2 = value;
		}, `&nbspg (per block)`)
		.addRange("Block area", 1, 9, 1, 1, function (value) {
			area2 = value;
			getAreas();
		}, `&nbspcm² (per block)`)
		.addRange("Number of blocks", 1, 4, 1, 1, function (value) {
			numBlocks2 = value;
			getNumBlocks();
		})
		.addBoolean("Add stir bar", false, function (value) {
			if (value) {
				$("#stirBar2").show();
				stirFactor2 = 1000;
			} else {
				$("#stirBar2").hide();
				stirFactor2 = 300;
			}
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
};

/*
 * Function: init
 * Sets up the page when it is loaded, hiding elements that aren't supposed to be visible right away, and
 * attaching event handlers. Also initializes input values, both in the program and in the display.
 */
function init() {
	// register event handlers for control buttons (start, pause, reset, help)
	$("#startButton").on('click', startMelting);
	$("#resetButton").on('click', resetExperiment);
	//$("#helpButton").on('click', showHelp);
	//$("#infoButton").on('click', displayAboutInfo);
	$("input[name='whichGraph']").click(function() {
		showWhichGraph = $("input[name='whichGraph']:checked").val();
		windowResized();
	  });
	showWhichGraph = $("input[name='whichGraph']:checked").val();
	// some CSS adjustments as well
	$("#stirBar1").hide();
	$("#stirBar2").hide();

	getAreas();
	getNumBlocks();
}

/*
 * Function: setup(). Part of the p5.js library. Required to run draw().
 * provides some setup information for the p5 canvas object.
 */
function setup() {
	pixelDensity(HD);
	cnv = createCanvas(100, 100);
	cnv.parent("bottomCenter");
	plot1 = new GPlot(this);
	plot1.setPos(10, 0);
	plot1.setOuterDim(100, 100);
	plot1.setYLim(0, 1);
	plot1.getXAxis().getAxisLabel().setText("time (s)");
	plot1.getYAxis().getAxisLabel().setText("mass of ice melted (g)");
	plot1.getTitle().setText("mass of ice melted");

	plot2 = new GPlot(this);
	plot2.setPos(10, 0);
	plot2.setOuterDim(100, 100);
	plot2.setYLim(0, 400);
	plot2.getXAxis().getAxisLabel().setText("time (s)");
	plot2.getYAxis().getAxisLabel().setText("temperature (°C)");
	plot2.getTitle().setText("temperature of blocks");

	smooth();
  }

/*
 *************************************************************************
 *								Calculations!							*
 *************************************************************************
 */

/*
 * Function: generateGraphPoints. Self-explanatory function. Generates 
 * an array of points that will be graphed.
 */
function generateGraphPoints() {

	// shortened the name of some variables to make typing this section less of a nightmare.
	let UA1 = stirFactor1 * area1 * numBlocks1 / 10000; // heat transfer coefficient times area
	let UA2 = stirFactor2 * area2 * numBlocks2 / 10000;
	let TB01 = initialTemp1; // initial block temp
	let TB02 = initialTemp2;
	let TW0 = icewaterTemp; // initial water temp

	let cpBmB1 = heatCapacity1 * mass1 * numBlocks1;
	let cpBmB2 = heatCapacity2 * mass2 * numBlocks2;
	let cpWmW = waterHeatCap * waterMass;
	let HfW = waterHeatFusion;

	/* 	ice melted vs time equation:
		mi(t) = cpB*mB*(TB0 - TW0)*(1-e^(-U*A*t/cpB*mB)) / Hfw
		(outputs this equation as a string, then feeds this into math.js via plotFun.js, 
		which I made to work with grafica.js)
	*/ 
	iceMeltedVsTime1 = `${cpBmB1*(TB01-TW0)} * (1 - e^( ${-UA1/cpBmB1} *t))/${HfW}`;
	iceMeltedVsTime2 = `${cpBmB2*(TB02-TW0)} * (1 - e^( ${-UA2/cpBmB2} *t))/${HfW}`;
	sit1IceArray = functionToArray(iceMeltedVsTime1, ["t", 0, tMax, dt]); // see plotFun.js for function definition
	sit2IceArray = functionToArray(iceMeltedVsTime2, ["t", 0, tMax, dt]);

	/*  temperature vs time equation, constant water temperature:
		T(t) = TW0 + (TB0 - TW0)e^(-U*A*t/cpB*mB) 
		(outputs a string, in the same fashion)
	*/
	tempVsTime1 = `${TW0} + ${TB01-TW0} *e^( ${-UA1/cpBmB1} *t)`;
	tempVsTime2 = `${TW0} + ${TB02-TW0} *e^( ${-UA2/cpBmB2} *t)`;
	/*  if the ice does not fully melt, meltedAt stays false and the array index
		at which "the ice melts" is the last item in the array.
	*/

	let meltedAt1 = false;
	let meltedAt2 = false;
	let meltIndex1 = Math.ceil(tMax / dt);
	let meltIndex2 = Math.ceil(tMax / dt);

	// Finds array index when ice melts and switches to a new temperature equation at that index.
	for (i = 0; i < sit1IceArray.length; i++) {
		if (sit1IceArray[i][1] >= maxIce) {
			sit1IceArray[i][1] = maxIce;
			if(!meltedAt1) {
				meltIndex1 = i;
			}
			meltedAt1 = true;
		}
	}
	for (i = 0; i < sit2IceArray.length; i++) {
		if (sit2IceArray[i][1] >= maxIce) {
			sit2IceArray[i][1] = maxIce;
			if(!meltedAt2) {
				meltIndex2 = i;
			}
			meltedAt2 = true;
		}
	}

	// Then stores the final value in an array, up to the time at which ice melts.
	sit1TempArray = functionToArray(tempVsTime1, ["t", 0, meltIndex1 * dt, dt]);
	sit2TempArray = functionToArray(tempVsTime2, ["t", 0, meltIndex2 * dt, dt]);
	
	// If the ice did melt fully, it will now use this equation. Similar method to tempVsTime1/2.
	if(meltedAt1) {
		let TB0 = sit1TempArray.last()[1];
		let tempVsTime3 = `(${cpBmB1*TB0 + cpWmW*TW0} + ${(TB0 - TW0)*cpWmW} * e^( ${(-cpBmB1-cpWmW)*UA1/(cpBmB1*cpWmW)} * (t - ${meltIndex1 * dt}) )) / ${cpBmB1 + cpWmW}`;
		
		let newArray = functionToArray(tempVsTime3, ["t", meltIndex1 * dt, tMax, dt]);
		sit1TempArray = sit1TempArray.concat(newArray);
		
		// equation for water temperature after ice melts has a similar form
		let waterTempVsTime1 = `(${cpBmB1*TB0 + cpWmW*TW0} - ${(TB0 - TW0)*cpBmB1} * e^( ${(-cpBmB1-cpWmW)*UA1/(cpBmB1*cpWmW)} * (t - ${meltIndex1 * dt}) )) / ${cpBmB1+cpWmW}`;
		let TW1= functionToArray(waterTempVsTime1, ["t", meltIndex1 * dt, tMax, dt]);

		for(i=meltIndex1; i<(meltIndex1 + TW1.length); i++) {
			water1TempArray[i][1] = TW1[i - meltIndex1][1];
		}
	}
	
	if(meltedAt2) {
		let TB0 = sit2TempArray.last()[1];
		let tempVsTime4 = `(${cpBmB2*TB0 + cpWmW*TW0} + ${(TB0 - TW0)*cpWmW} * e^(${(-cpBmB2-cpWmW)*UA2/(cpBmB2*cpWmW)} * (t - ${meltIndex2 * dt}))) / ${cpBmB2 + cpWmW}`;
		
		let newArray = functionToArray(tempVsTime4, ["t", meltIndex2 * dt, tMax, dt]);
		sit2TempArray = sit2TempArray.concat(newArray);

		let waterTempVsTime2 = `(${cpBmB2*TB0 + cpWmW*TW0} - ${(TB0 - TW0)*cpBmB2} * e^( ${(-cpBmB2-cpWmW)*UA2/(cpBmB2*cpWmW)} * (t - ${meltIndex2 * dt}) )) / ${cpBmB2+cpWmW}`;
		let TW2= functionToArray(waterTempVsTime2, ["t", meltIndex2 * dt, tMax, dt]);
		for(i=meltIndex2; i<(meltIndex2 + TW2.length); i++) {
			water2TempArray[i][1] = TW2[i - meltIndex2][1];
		}
	}
	

	// Finally, adjusts the limits on the plot accordingly.
	xAxisLimit = Math.ceil(tMax);
	yAxisLimit1 = Math.max(Math.min(sit2IceArray.last()[1] * 1.1, 10.5), Math.min(sit1IceArray.last()[1] * 1.1, 10.5));
	yAxisLimit2 = Math.max(initialTemp1, initialTemp2);
	console.log();
}

/* 
 * Function: pictureBehavior. Runs within the draw() loop, and changes
 * the CSS data of the beaker, ice cubes, blocks to give it an animation.
 */
function pictureBehavior() {

	if (currentStep == 0 && !blocksDropped && experimentRunning) {
		y *= 1.06;
		blockHeight -= y;


		$(".sit1block").css("bottom", blockHeight + "%");
		$(".sit2block").css("bottom", blockHeight + "%");

		if (blockHeight <= fallDist) {blocksDropped = true; y = 0.75;} else {blocksDropped = false;}

	} else if (experimentRunning) {

		currentIceHeight1 = Math.max(0, iceMaxHeight1 * (maxIce - sit1IceArray[currentStep][1]) / maxIce);
		let cssHeight1 = currentIceHeight1 + "%";
		currentIceWidth1 = Math.max(0, iceMaxWidth1 * (maxIce - sit1IceArray[currentStep][1]) / maxIce);
		let cssWidth1 = currentIceWidth1 + "%";

		// Calculate the new height and width values for the ice cubes of situation 2
		currentIceHeight2 = Math.max(0, iceMaxHeight2 * (maxIce - sit2IceArray[currentStep][1]) / maxIce);
		let cssHeight2 = currentIceHeight2 + "%";
		currentIceWidth2 = Math.max(0, iceMaxWidth2 * (maxIce - sit2IceArray[currentStep][1]) / maxIce);
		let cssWidth2 = currentIceWidth2 + "%";

		if ((blockHeight) > 3) // If the blocks are already at the bottom of the beaker, don't move them
			blockHeight -= 0.3;
		$(".sit1block").css("bottom", blockHeight + "%");
		$(".sit2block").css("bottom", blockHeight + "%");

		// Shrink the ice cubes
		$(".sit1Ice").css({
			height: cssHeight1,
			width: cssWidth1,
		});
		$(".sit2Ice").css({
			height: cssHeight2,
			width: cssWidth2,
		});
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
	generateGraphPoints();

	// Start the experiment
	experimentRunning = true;
	experimentStarted = true;

	currentStep = 0;
	blockHeight = 51;

	panel1.disableControl("Initial temperature");
	panel1.disableControl("Block heat capacity");
	panel1.disableControl("Block mass");
	panel1.disableControl("Block area");
	panel1.disableControl("Number of blocks");
	panel1.disableControl("Add stir bar");

	panel2.disableControl("Initial temperature");
	panel2.disableControl("Block heat capacity");
	panel2.disableControl("Block mass");
	panel2.disableControl("Block area");
	panel2.disableControl("Number of blocks");
	panel2.disableControl("Add stir bar");

	panel3.disableControl("Simulation time");
}

/*
 * Function: resetExperiment
 * Resets the visual display to what it should look like before an experiment is run.
 */
function resetExperiment() {

	// Re-enable the input fields if they are disabled
	if (experimentRunning || experimentStarted) {
		panel1.enableControl("Initial temperature");
		panel1.enableControl("Block heat capacity");
		panel1.enableControl("Block mass");
		panel1.enableControl("Block area");
		panel1.enableControl("Number of blocks");
		panel1.enableControl("Add stir bar");
	
		panel2.enableControl("Initial temperature");
		panel2.enableControl("Block heat capacity");
		panel2.enableControl("Block mass");
		panel2.enableControl("Block area");
		panel2.enableControl("Number of blocks");
		panel2.enableControl("Add stir bar");
	
		panel3.enableControl("Simulation time");
	}

	experimentRunning = false;
	experimentStarted = false;
	blocksDropped = false;

	$("#startButton").removeAttr("disabled");
	$("#startButton").css("border-color", "#093");
	$("#startButton").html("Start");

	// Return the blocks to their original positions and the ice cubes to their
	// original sizes. Hide all data points and labels on the graph.
	$(".sit1Ice").css({
		height: "14.3%",
		width: "10.0%",
	});
	$(".sit2Ice").css({
		height: "14.3%",
		width: "10.0%",
	});

	currentIceHeight1 = 14.3;
	currentIceWidth1 = 10.0;
	currentIceHeight2 = 14.3;
	currentIceWidth2 = 10.0;

	currentStep = 0;
	blockHeight = 51;

	sit1PtsGraph1 = [];
	sit2PtsGraph1 = [];
	sit1PtsGraph2 = [];
	sit2PtsGraph2 = [];

	sit1IceArray = [[0, 0]];
	sit2IceArray = [[0, 0]];
	sit1TempArray = [[0, initialTemp1]];
	sit2TempArray = [[0, initialTemp2]];
	for(i=1; i<=4000; i++) {
		water1TempArray[i] = [i, 0];
		water2TempArray[i] = [i, 0];
	}

	// temperature inputs
	getAreas();
	getNumBlocks();

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

	$("#temps1").html(`water temperature: ${currentStep == 0 ? icewaterTemp : water1TempArray[currentStep][1].toFixed(1)} °C<br>block temperature: ${currentStep==0 ? initialTemp1 : sit1TempArray[currentStep][1].toFixed(1)} °C`);
	$("#temps2").html(`water temperature: ${currentStep == 0 ? icewaterTemp : water2TempArray[currentStep][1].toFixed(1)} °C<br>block temperature: ${currentStep==0 ? initialTemp2 : sit2TempArray[currentStep][1].toFixed(1)} °C`);

	/* This switch() look superfluous, but it is important. Both plots
	 * must be drawing at all times, so that if the user switches to
	 * a different plot while the simulation is running, all the values
	 * are still where they are supposed to be.*/
	switch (showWhichGraph) {
		case "1":
			drawPlot2();
			drawPlot1();
			break;
		case "2":
			drawPlot1();
			drawPlot2();
			break;
		case "3":
			drawPlot1();
			drawPlot2();
			break;
	}
	// Only advances in time once the blocks hit the water.
	if (blocksDropped && experimentRunning) {
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
 * function drawPlot1(): a method for drawing the mass of ice melted plot
 * within the draw() loop.
 */
function drawPlot1() {
	plot1.setXLim(0, xAxisLimit);
		plot1.setYLim(0, Math.ceil(yAxisLimit1));
		plot1.beginDraw();
		plot1.drawBackground();
		plot1.drawLimits();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTitle();
		plot1.drawBox();
		plot1.drawGridLines(2);
		push();
		strokeWeight(3.5);
		if(blocksDropped) {
			textAlign(BOTTOM);
			textSize(20);
			textStyle(BOLD);
			fill(204, 0, 0);
			let loc1 = plot1.mainLayer.valueToPlot(sit1IceArray[currentStep][0], sit1IceArray[currentStep][1]);
			text("1", loc1[0] + 5, loc1[1]);
			fill(0, 51, 204);
			let loc2 = plot1.mainLayer.valueToPlot(sit2IceArray[currentStep][0], sit2IceArray[currentStep][1]);
			text("2", loc2[0] + 5, loc2[1]);

			stroke(204, 0, 0);
			sit1PtsGraph1.push(sit1IceArray[currentStep]);
			arrayToPlot(sit1PtsGraph1, plot1, true);

			stroke(0, 51, 204);
			sit2PtsGraph1.push(sit2IceArray[currentStep]);
			arrayToPlot(sit2PtsGraph1, plot1, true);
		}
		pop();
		plot1.endDraw();
}
/*
 * function drawPlot2(): a method for drawing the temperature plot
 * within the draw() loop.
 */
function drawPlot2() {
	plot2.setXLim(0, xAxisLimit);
		plot2.setYLim(0, Math.ceil(yAxisLimit2 / 20.0) * 20);
		plot2.beginDraw();
		plot2.drawBackground();
		plot2.drawLimits();
		plot2.drawXAxis();
		plot2.drawYAxis();
		plot2.drawTitle();
		plot2.drawBox();
		plot2.drawGridLines(2);
		push();
		strokeWeight(3.5);
		if(blocksDropped) {
			textAlign(BOTTOM);
			textSize(20);
			textStyle(BOLD);
			fill(204, 0, 0);
			let loc1 = plot2.mainLayer.valueToPlot(sit1TempArray[currentStep][0], sit1TempArray[currentStep][1]);
			text("1", loc1[0] + 5, loc1[1]);
			fill(0, 51, 204);
			let loc2 = plot2.mainLayer.valueToPlot(sit2TempArray[currentStep][0], sit2TempArray[currentStep][1]);
			text("2", loc2[0] + 5, loc2[1]);

			stroke(204, 0, 0);
			sit1PtsGraph2.push(sit1TempArray[currentStep]);
			arrayToPlot(sit1PtsGraph2, plot2, true);

			stroke(0, 51, 204);
			sit2PtsGraph2.push(sit2TempArray[currentStep]);
			arrayToPlot(sit2PtsGraph2, plot2, true);
		}
		pop();
		plot2.endDraw();
}

/*
 * Event Handler Function: getAreas
 * Called when the user enters a new value for "area of each block" for either Situation
 *
 * Reads in and validates both area values, and updates global variables accordingly. Also changes
 * the size of the block pictures on the display, according to the current area values.
 */
function getAreas() {
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
/*
 * Event Handler Function: getNumBlocks
 * Called when the user enters a new value for "number of blocks" for either Situation
 *
 * Reads in and both values, and updates global variables accordingly. Also shows or hides
 * blocks in the display so that the numbers the user entered determine the number of blocks they see.
 */
function getNumBlocks() {

	switch (numBlocks1 * 1) {
		case 1:
			$("#sit1block1").hide();
			$("#sit1block2").hide();
			$("#sit1block3").show();
			$("#sit1block4").hide();
			break;
		case 2:
			$("#sit1block1").hide();
			$("#sit1block2").show();
			$("#sit1block3").show();
			$("#sit1block4").hide();
			break;
		case 3:
			$("#sit1block1").show();
			$("#sit1block2").show();
			$("#sit1block3").show();
			$("#sit1block4").hide();
			break;
		case 4:
			$("#sit1block1").show();
			$("#sit1block2").show();
			$("#sit1block3").show();
			$("#sit1block4").show();
			break;
	}

	switch (numBlocks2 * 1) {
		case 1:
			$("#sit2block1").hide();
			$("#sit2block2").hide();
			$("#sit2block3").show();
			$("#sit2block4").hide();
			break;
		case 2:
			$("#sit2block1").hide();
			$("#sit2block2").show();
			$("#sit2block3").show();
			$("#sit2block4").hide();
			break;
		case 3:
			$("#sit2block1").show();
			$("#sit2block2").show();
			$("#sit2block3").show();
			$("#sit2block4").hide();
			break;
		case 4:
			$("#sit2block1").show();
			$("#sit2block2").show();
			$("#sit2block3").show();
			$("#sit2block4").show();
			break;
	}
}