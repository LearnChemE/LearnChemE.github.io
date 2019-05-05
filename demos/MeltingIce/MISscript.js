/*
 * File: MISscript.js
 * Purpose: To provide the animations and interactivity for the Melting Ice Simulation (melting-ice.html)
 * Author: Emily Ehrenberger (July 2011)
 *		   Under the supervision of Margot Vigeant, Bucknell University
 *		   Based on Flash simulation by Matt Koppenhaver under Professor Michael Prince
 * (c) Margot Vigeant 2011
 */


/*
 * This file makes use of the JQuery libraries (http://jquery.com/)
 */


$(document).ready(init);

let maxWidth = Math.min(document.documentElement.clientWidth, 1200);
let	maxHeight = Math.min(document.documentElement.clientHeight, 1000);
let	minWidth = Math.max(600, document.documentElement.clientWidth);
let	minHeight = Math.max(500, document.documentElement.clientHeight);

let	clientWidth = Math.max(minWidth, maxWidth);
let clientHeight = Math.max(minHeight, maxHeight);

if (clientWidth > 1.2 * clientHeight) {
	clientWidth = clientHeight * 1.2
} else {
	clientHeight = clientWidth / 1.2
}

// Global constants
var icewaterTemp = 0;
var waterHeatCap = 4.184; // J/(g K)
var waterMass = 1000; // g

// Variables to keep track of state
var graphInfoShowing = false;
var experimentStarted = false;
var experimentRunning = false;
var blocksDropped = false;
var sit1BlockTop;
var sit2BlockTop;
var sit1BlockHeight;
var sit2BlockHeight;
var currentStep = 0;

// Variables to hold input values
var initialTemp1 = 400;
var heatCapacity1 = 10;
var mass1 = 5;
var area1 = 9;
var numBlocks1 = 1;
var stirFactor1 = 1000;

var initialTemp2 = 80; // celsius
var heatCapacity2 = 1; // J/(g K)
var mass2 = 1; // g
var area2 = 1; // cm^2 per block
var numBlocks2 = 1; // integer, number of blocks
var stirFactor2 = 1000; // heat transfer coefficient

var waterHeatFusion = 333.05; // J/g

var sit1IceArray = [[0, 0]];
var sit2IceArray = [[0, 0]];

var iceMeltedVsTime1;
var iceMeltedVsTime2;
var tempVsTime1;
var tempVsTime2;
var tempVsTime3;
var tempVsTime4;
var plotPts1 = [];
var plotPts2 = [];

var showWhichGraph = "1";

var iceMeltHeight1; // iceMeltHeight and iceMeltWidth represent the amount the ice's size should change in each dimension,
var iceMeltWidth1; // such that, for example, the ice's full size minus iceMeltHeight1 will give you the height the ice
var iceMeltHeight2; // should be at the end of a given experiment.
var iceMeltWidth2;
var currentIceWidth1;
var currentIceHeight1;
var currentIceWidth2;
var currentIceHeight2;

var panel1;
var panel2;

var arr;

var plot1;
var plot2;

var plotPts = [];
var xAxisLimit = 120;
var yAxisLimit1 = 1;
var yAxisLimit2 = 400;

var bkHeight;
var boxHeight;
var blockHeight;

let fallDist;
let maxIce = 10; // amount of ice in the beakers, g

class ControllerStyle {
	constructor(data) {
		this.data = data;

		var styleTag = document.getElementById("qs_styles");
		if (this.data == "defaultStyle") {
			styleTag.href = "libraries/quicksettings3/quicksettings_custom.css";
		} else {
			styleTag.href = "libraries/quicksettings3/quicksettings_custom_tiny.css";
		}
	}
};

function windowResized() {
	maxWidth = Math.min(document.documentElement.clientWidth * 0.95, 1200);
	maxHeight = Math.min(document.documentElement.clientHeight * 0.95, 1000);
	minWidth = Math.max(600, document.documentElement.clientWidth * 0.95);
	minHeight = Math.max(500, document.documentElement.clientHeight * 0.95);

	clientWidth = Math.max(minWidth, maxWidth);
	clientHeight = Math.max(minHeight, maxHeight);

	if (clientWidth > 1.2 * clientHeight) {
		clientWidth = clientHeight * 1.2
	} else {
		clientHeight = clientWidth / 1.2
	}
	getAreas();

	$(".wrapper").css("width", clientWidth + "px");
	$(".wrapper").css("height", clientHeight + "px");
	$(".box").css("height", clientHeight * 0.38 + "px");
	$(".b3").css("height", clientHeight * 0.04 + "px");
	$(".d").css("height", clientHeight * 0.58 + "px");

	let aHeight = clientHeight * 0.38;

	$("#startButton").css({height: aHeight*0.11 + "px", width: aHeight*0.2 + "px", fontSize: aHeight/300 + "rem"});
	$("#startButton").css("line-height", aHeight*0.11 + "px");
	$("#resetButton").css({height: aHeight*0.11 + "px", width: aHeight*0.2 + "px", fontSize: aHeight/300 + "rem"});
	$("#resetButton").css("line-height", aHeight*0.11 + "px");

	$("#pauseButton").css({height: aHeight*0.07 + "px", width: aHeight*0.07 + "px"});
	$("#pauseButton").css("line-height", aHeight*0.07 + "px");
	$("#pauseButton").css("font-size", aHeight*0.04 + "px");
	$("#infoButton").css({height: aHeight*0.07 + "px", width: aHeight*0.07 + "px"});
	$("#infoButton").css("line-height", aHeight*0.07 + "px");
	$("#infoButton").css("font-size", aHeight*0.04 + "px");
	$("#helpButton").css({height: aHeight*0.07 + "px", width: aHeight*0.07 + "px"});
	$("#helpButton").css("line-height", aHeight*0.07 + "px");
	$("#helpButton").css("font-size", aHeight*0.04 + "px");

	$("#buttons2").css("margin-top", aHeight*0.15 + "px");
	$("#buttons2").css("margin-left", aHeight*0.3 + "px");

	$("#graphInfo").css({height: aHeight*0.11 + "px", width: aHeight*0.45 + "px", fontSize: aHeight/300 + "rem", bottom: aHeight*0.5 + "px"});
	$("#graphInfo").css("line-height", aHeight*0.11 + "px");

	var w1 = $("#topLeft").width();
	var w2 = $("#topRight").width();
	panel1.setWidth(w1);
	panel2.setWidth(w2);

	panel1.setPosition(0, 10);
	panel2.setPosition($("#bottomCenter").width() - w2, 10);

	if (window.innerWidth > 900) {
		new ControllerStyle("defaultStyle");
	} else {
		new ControllerStyle("tiny")
	}
	/*if(window.innerWidth < 700) {
		$(".qs_label").css("fontSize", "0.8em");
	} else {$(".qs_label").css("fontSize", "");}*/
	bkHeight = $("#beakersImg").height();
	boxHeight = $("#topCenter").height();
	fallDist = 100*(0.6*bkHeight/boxHeight);
	clear();
	switch(showWhichGraph) {
		case "1":
		plot1.setOuterDim(clientWidth - 200, clientHeight * 0.54);
		plot1.setPos(10, clientHeight * 0.02);
		break;
		case "2":
		plot2.setOuterDim(clientWidth - 200, clientHeight * 0.54);
		plot2.setPos(10, clientHeight * 0.02);
		break;
		case "3":
		plot1.setOuterDim(clientWidth*0.5 - 100, clientHeight * 0.54);
		plot2.setOuterDim(clientWidth*0.5 - 100, clientHeight * 0.54);
		plot2.setPos(clientWidth*0.5 - 100, clientHeight * 0.02);
		break;
	}
	resizeCanvas(clientWidth / 0.95, cnv.height = clientHeight * 0.58 / 0.95);
	clear();
}

window.onload = function () {
	QuickSettings.useExtStyleSheet();
	panel1 = QuickSettings.create(0, 30, "Settings: Situation 1", document.body, "red")
		.addRange("Initial Temperature (°C)", 1, 400, 400, 1, function (value) {
			initialTemp1 = value;
		})
		.addRange("Block Heat Capacity (J/(g °C))", 0.1, 10, 10, 0.1, function (value) {
			heatCapacity1 = value;
		})
		.addRange("Block 1 Mass (g)", 0.1, 5, 5, 0.1, function (value) {
			mass1 = value;
		})
		.addRange("Block 1 area (cm²)", 1, 9, 9, 1, function (value) {
			area1 = value;
			getAreas();
		})
		.addRange("Number of Blocks", 1, 4, 1, 1, function (value) {
			numBlocks1 = value;
			getNumBlocks();
		})
		.addBoolean("Stir Bar:", false, function (value) {
			if (value) {
				$("#stirBar1").show();
				stirFactor1 = 3000;
			} else {
				$("#stirBar1").hide();
				stirFactor1 = 1000;
			}
		})
		.setDraggable(true);

	panel2 = QuickSettings.create($("#bottomCenter").width() - 220, 30, "Settings: Situation 2", document.body, "blue")
		.addRange("Initial Temperature (°C)", 1, 400, 80, 1, function (value) {
			initialTemp2 = value;
		})
		.addRange("Block Heat Capacity (J/(g °C))", 0.1, 10, 1, 0.1, function (value) {
			heatCapacity2 = value;
		})
		.addRange("Block 2 Mass (g)", 0.1, 10, 1, 0.1, function (value) {
			mass2 = value;
		})
		.addRange("Block 2 area (cm²)", 1, 9, 1, 1, function (value) {
			area2 = value;
			getAreas();
		})
		.addRange("Number of Blocks", 1, 4, 1, 1, function (value) {
			numBlocks2 = value;
			getNumBlocks();
		})
		.addBoolean("Stir Bar:", false, function (value) {
			if (value) {
				$("#stirBar2").show();
				stirFactor2 = 3000;
			} else {
				$("#stirBar2").hide();
				stirFactor2 = 1000;
			}
		})
		.setDraggable(true);

windowResized();
}

/*
 *************************************************************************
 *						Initialization Functions						*
 *************************************************************************
 */

/*
 * Function: init
 * Sets up the page when it is loaded, hiding elements that aren't supposed to be visible right away, and
 * attaching event handlers. Also initializes input values, both in the program and in the display.
 */
function init() {
	$("#stirBar1").hide();
	$("#stirBar2").hide();
	$("#graphHeightInfo").hide();
	$("#graphSlopeInfo").hide();

	$(".sit1Ice").css({
		height: "9.5%",
		width: "10.8%"
	});
	$(".sit2Ice").css({
		height: "9.5%",
		width: "10.8%"
	});

	// register event handlers for control buttons (start, pause, reset, help)
	$("#startButton").on('click', startMelting);
	$("#pauseButton").on('click', pauseMelting);
	$("#resetButton").on('click', resetExperiment);
	$("#helpButton").on('click', showHelp);

	// register event handlers for links to display more info
	$("#graphInfo").on('click', displayGraphInfo);
	$("#infoButton").on('click', displayAboutInfo);
	$("#IEexp").on('click', displayIEexp);
	
	$("input[name='whichGraph']").click(function() {
		showWhichGraph = $("input[name='whichGraph']:checked").val();
		windowResized();
	  });

	bkHeight = $("#beakersImg").height();
	boxHeight = $("#topCenter").height();
	fallDist = 100*(0.6*bkHeight/boxHeight);

	getAreas();
	updateBlockColors();
	getNumBlocks();
	//panel2.setPosition($("#topRight").offset().left, 10);
}

/*
 * Function: generateGraphPoints
 */
function generateGraphPoints() {

	var UA1 = stirFactor1 * area1 / 10000;
	var UA2 = stirFactor2 * area2 / 10000;
	var TB01 = initialTemp1;
	var TB02 = initialTemp2;
	var TW0 = 0;
	var cpBmB1 = heatCapacity1 * mass1;
	var cpBmB2 = heatCapacity2 * mass2;
	var cpWmW = waterHeatCap * waterMass;
	var HfW = waterHeatFusion;

	// ice melted vs time equation: mi(t) = cpB*mB*(TB0 - TW0)*(1-e^(-U*A*t/cpB*mB)) / (Hfw*mW) => outputs a string
	iceMeltedVsTime1 = String(cpBmB1*(TB01-TW0)).concat("(1 - e^(",String(-UA1/cpBmB1),"*t))/",String(HfW));

	iceMeltedVsTime2 = String(cpBmB2*(TB02-TW0)).concat("(1 - e^(",String(-UA2/cpBmB2),"*t))/",String(HfW))

	// temperature vs time equation, constant water temperature: T(t) = (m*cp*TB0 + U*A*Tw*t)/(M*cp + U*A*t) => outputs a string
	tempVsTime1 = String(TW0).concat("+",String(TB01-TW0),"*e^(",String(-UA1/cpBmB1),"*t)");

	tempVsTime2 = String(TW0).concat("+",String(TB02-TW0),"*e^(",String(-UA2/cpBmB2),"*t)");

	sit1IceArray = functionToArray(iceMeltedVsTime1, ["t", 0, 120, 0.2]);
	sit2IceArray = functionToArray(iceMeltedVsTime2, ["t", 0, 120, 0.2]);

	var meltedAt1 = false;
	var meltedAt2 = false;
	var meltIndex1 = 600;
	var meltIndex2 = 600;

	//finds the array index at which the ice is fully melted, if the ice fully melts. Otherwise, meltIndex is the last value in the array and never melts.
	for (i = 0; i < sit1IceArray.length; i++) {
		if (sit1IceArray[i][1] >= maxIce) {
			sit1IceArray[i][1] = maxIce;
			if(!meltedAt1) {
				meltIndex1 = i;
			}
			meltedAt1 = true;
		}
	};

	for (i = 0; i < sit2IceArray.length; i++) {
		if (sit2IceArray[i][1] >= maxIce) {
			sit2IceArray[i][1] = maxIce;
			if(!meltedAt2) {
				meltIndex2 = i;
			}
			meltedAt2 = true;
		}
	};

	sit1TempArray = functionToArray(tempVsTime1, ["t", 0, meltIndex1 * 0.2, 0.2]);
	sit2TempArray = functionToArray(tempVsTime2, ["t", 0, meltIndex2 * 0.2, 0.2]);

	if(meltedAt1) {
		let TB0 = sit1TempArray[meltIndex1][1];

		// string form of the equation to calculate the block temp when water temperature is not constant
		tempVsTime3 = "(".concat(String(cpBmB1*TB0 + cpWmW*TW0),"+",String((TB0 - TW0)*cpWmW),"*e^(",String((-cpBmB1-cpWmW)*UA1/(cpBmB1*cpWmW)),"*(t - ",String(meltIndex1 * 0.2),")))/",String(cpBmB1+cpWmW));	
		let newArray = functionToArray(tempVsTime3, ["t", meltIndex1 * 0.2, 120, 0.2]);
		sit1TempArray = sit1TempArray.concat(newArray);
	
	}

	if(meltedAt2) {
		let TB0 = sit2TempArray[meltIndex2][1];
		tempVsTime4 = "(".concat(String(cpBmB2*TB0 + cpWmW*TW0),"+",String((TB0 - TW0)*cpWmW),"*e^(",String((-cpBmB2-cpWmW)*UA2/(cpBmB2*cpWmW)),"*(t - ",String(meltIndex2 * 0.2),")))/",String(cpBmB2+cpWmW))
		let newArray = functionToArray(tempVsTime4, ["t", meltIndex2 * 0.2, 120, 0.2]);
		sit2TempArray = sit2TempArray.concat(newArray);
	}

	yAxisLimit1 = Math.max(Math.min(sit2IceArray[sit2IceArray.length - 1][1] * 1.1, 10), Math.min(sit1IceArray[sit1IceArray.length - 1][1] * 1.1, 10.5));

	yAxisLimit2 = Math.max(initialTemp1, initialTemp2);
}

/*
 * Function: resetExperiment
 * Resets the visual display to what it should look like before an experiment is run. Largely consists
 * of enabling input fields (which are disabled while an experiment is running). It is also necessary
 * to reset the temperature of the blocks, because that temperature changes while an experiment
 * is running.
 */
function resetExperiment() {

	// Re-enable the input fields if they are disabled
	if (experimentRunning || experimentStarted) {
		panel1.enableControl("Initial Temperature (°C)");
		panel1.enableControl("Block Heat Capacity (J/(g °C))");
		panel1.enableControl("Block 1 Mass (g)");
		panel1.enableControl("Block 1 area (cm²)");
		panel1.enableControl("Number of Blocks");
		panel1.enableControl("Stir Bar:");

		panel2.enableControl("Initial Temperature (°C)");
		panel2.enableControl("Block Heat Capacity (J/(g °C))");
		panel2.enableControl("Block 2 Mass (g)");
		panel2.enableControl("Block 2 area (cm²)");
		panel2.enableControl("Number of Blocks");
		panel2.enableControl("Stir Bar:");
	}

	experimentRunning = false;
	experimentStarted = false;
	blocksDropped = false;

	$("#startButton").removeAttr("disabled");

	$("#startButton").css("border-color", "#093");

	$("#pauseButton").find(".glyphicon").removeClass('glyphicon-play');
	$("#pauseButton").find(".glyphicon").addClass('glyphicon-pause');

	// Make sure the Pause button reads "PAUSE" rather than "RESET", and disable the Pause button
	$("#pauseButton").attr("disabled", "disabled");
	$("#pauseButton").css("border-color", "gray");

	// Return the blocks to their original positions and the ice cubes to their
	// original sizes. Hide all data points and labels on the graph.

	$(".sit1Ice").css({
		height: "9.5%",
		width: "10.8%"
	});
	$(".sit2Ice").css({
		height: "9.5%",
		width: "10.8%"
	});

	currentStep = 0;
	blockHeight = 50;

	sit1PtsGraph1 = [];
	sit2PtsGraph1 = [];
	sit1PtsGraph2 = [];
	sit2PtsGraph2 = [];

	sit1IceArray = [[0, 0]];
	sit2IceArray = [[0, 0]];
	sit1TempArray = [[0, initialTemp1]];
	sit2TempArray = [[0, initialTemp2]];

	currentIceHeight1 = 9.5;
	currentIceWidth1 = 10.8;
	currentIceHeight2 = 9.5;
	currentIceWidth2 = 10.8;

	iceMeltHeight1 = 9.5;
	iceMeltWidth1 = 10.8;
	iceMeltHeight2 = 9.5;
	iceMeltWidth2 = 10.8;

	// temperature inputs
	getAreas();
	updateBlockColors();
	getNumBlocks();
}


/*
 * Function: updateBlockColors
 * Updates the colors of the blocks on display, according to the
 * current temperature of the blocks for each situation. (Is also called to update the blocks
 * while an experiment is running.)
 */
function updateBlockColors() {
	// Change situation 1 blocks' color to reflect the temperature
	if (initialTemp1 < 40) {
		$(".sit1block").css("background", "url('blocks.png') 0 0"); // black
	} else if (initialTemp1 < 180) {
		$(".sit1block").css("background", "url('blocks.png') -48px 0"); // blue
	} else if (initialTemp1 < 400) {
		$(".sit1block").css("background", "url('blocks.png') -96px 0"); // purple/dark red
	} else {
		$(".sit1block").css("background", "url('blocks.png') -144px 0"); // bright red
	}

	// Change situation 2 blocks' color to reflect the temperature
	if (initialTemp2 < 40) {
		$(".sit2block").css("background", "url('blocks.png') 0 0"); // black
	} else if (initialTemp2 < 180) {
		$(".sit2block").css("background", "url('blocks.png') -48px 0"); // blue
	} else if (initialTemp2 < 400) {
		$(".sit2block").css("background", "url('blocks.png') -96px 0"); // purple/dark red
	} else {
		$(".sit2block").css("background", "url('blocks.png') -144px 0"); // bright red
	}
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
	let size1 = Math.min(48, area1 * scalingFactor * 5) + "px"
	let size2 = Math.min(48, area2 * scalingFactor * 5) + "px"
	$(".sit1block").css({
		height: size1,
		width: size1,
		bottom: "50%"
	});

	$(".sit2block").css({
		height: size2,
		width: size2,
		bottom: "50%"
	});
/* 
	sit1BlockTop = 50;
	sit1BlockHeight = area1 * scalingFactor; */
	
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

/*
 * Event Handler Function: resetSituation1
 * Called when the user clicks the "Default" button for Situation 1
 *
 * Restores all parameters for Situation 1 to default values, both in the program
 * and in the display.
 */
function resetSituation1() {
	initialTemp1 = 30;
	heatCapacity1 = 1;
	mass1 = 1;
	area1 = 1;
	numBlocks1 = 1;

	getAreas();
	getNumBlocks();
	//	toggleStirBar1();
}

/*
 * Event Handler Function: resetSituation2
 * Called when the user clicks the "Default" button for Situation 2
 *
 * Restores all parameters for Situation 2 to default values, both in the program
 * and in the display.
 */
function resetSituation2() {
	initialTemp2 = 30;
	heatCapacity2 = 1;
	mass2 = 1;
	area2 = 1;
	numBlocks2 = 1;

	getAreas();
	getNumBlocks();
	//	toggleStirBar1();
}


/*
 *************************************************************************
 *					Starting/Stopping the Simulation					*
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
		$("#pauseButton").find(".glyphicon").removeClass('glyphicon-pause');
		$("#pauseButton").find(".glyphicon").addClass('glyphicon-play');
	} else {
		experimentRunning = true;
		redraw();
		$("#pauseButton").find(".glyphicon").removeClass('glyphicon-play');
		$("#pauseButton").find(".glyphicon").addClass('glyphicon-pause');
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
		return;
	}

	resetExperiment();

	// Disable "start" button and enable "pause" button
	$("#startButton").attr("disabled", "disabled");
	$("#startButton").css("border-color", "gray");
	$("#pauseButton").removeAttr("disabled");
	$("#pauseButton").css("border-color", "#F00");

	// Initialize starting values for the calculations
	generateGraphPoints();

	// Start the experiment
	experimentRunning = true;
	experimentStarted = true;

	currentStep = 0;
	blockHeight = 50;

	panel1.disableControl("Initial Temperature (°C)");
	panel1.disableControl("Block Heat Capacity (J/(g °C))");
	panel1.disableControl("Block 1 Mass (g)");
	panel1.disableControl("Block 1 area (cm²)");
	panel1.disableControl("Number of Blocks");
	panel1.disableControl("Stir Bar:");

	panel2.disableControl("Initial Temperature (°C)");
	panel2.disableControl("Block Heat Capacity (J/(g °C))");
	panel2.disableControl("Block 2 Mass (g)");
	panel2.disableControl("Block 2 area (cm²)");
	panel2.disableControl("Number of Blocks");
	panel2.disableControl("Stir Bar:");
}

/*
 *************************************************************************
 *							Running the Simulation						*
 *************************************************************************
 */

function pictureBehavior() {

	if (currentStep == 0 && !blocksDropped && experimentRunning) {

		blockHeight -= 1;

		$(".sit1block").css("bottom", blockHeight + "%");
		$(".sit2block").css("bottom", blockHeight + "%");

		if (blockHeight <= fallDist) {blocksDropped = true} else {blocksDropped = false}

	} else if (experimentRunning) {

		currentIceHeight1 = Math.max(0, iceMeltHeight1 * (maxIce - sit1IceArray[currentStep][1]) / maxIce);
		var cssHeight1 = currentIceHeight1 + "%";
		currentIceWidth1 = Math.max(0, iceMeltWidth1 * (maxIce - sit1IceArray[currentStep][1]) / maxIce);
		var cssWidth1 = currentIceWidth1 + "%";

		updateBlockColors();

		// Calculate the new height and width values for the ice cubes of situation 2
		currentIceHeight2 = Math.max(0, iceMeltHeight2 * (maxIce - sit2IceArray[currentStep][1]) / maxIce);
		var cssHeight2 = currentIceHeight2 + "%";
		currentIceWidth2 = Math.max(0, iceMeltWidth2 * (maxIce - sit2IceArray[currentStep][1]) / maxIce);
		var cssWidth2 = currentIceWidth2 + "%";

		if ((blockHeight) > 2) // If the blocks are already at the bottom of the beaker, don't move them
			blockHeight -= 0.3;
		$(".sit1block").css("bottom", blockHeight + "%");
		$(".sit2block").css("bottom", blockHeight + "%");

		// Shrink the ice cubes
		$(".sit1Ice").css({
			height: cssHeight1,
			width: cssWidth1
		});
		$(".sit2Ice").css({
			height: cssHeight2,
			width: cssWidth2
		});
	}
}

/*
 *************************************************************************
 *						Hiding/Showing More Info						*
 *************************************************************************
 */

function showHelp() {
	var string = "Melting Ice Simulation lets you compare the rate of energy transfer";
	string += " from heated blocks to the water and ice cubes in two different beakers, each under";
	string += " its own set of initial conditions.   Choose the initial conditions";
	string += " for Situation 1 and Situation 2.  Then click the Start button to";
	string += " watch the ice melt.  After the ice has melted, in order to change";
	string += " the initial conditions for another experiment, you must first press the";
	string += " Reset button to return the ice and the heated blocks to their initial";
	string += " positions and energies.  While the ice is melting, you can watch the";
	string += " graph to see the mass of ice melted in each beaker over time. Note that";
	string += " the axes are recalculated every time to ensure a good view of the";
	string += " graph.  This simulation assumes that all energy transferred goes into";
	string += " melting ice at 0\xB0C into water at 0\xB0C, and none goes into changing the";
	string += " temperature of the water or ice.";
	alert(string);
}

function displayGraphInfo() {
	if (graphInfoShowing) {
		$("#graphHeightInfo").hide();
		$("#graphSlopeInfo").hide();
		graphInfoShowing = false;
	} else {
		$("#graphHeightInfo").fadeIn();
		$("#graphSlopeInfo").fadeIn();
		graphInfoShowing = true;
	}
	return false;
}

function displayAboutInfo() {
	alert("This program was originally created under the direction of Dr. Margot Vigeant " +
		"and Dr. Michael Prince at Bucknell University. It was first developed " +
		"in Flash by Matt Koppenhaver under Dr. Prince, and was adapted to " +
		"Javascript by Emily Ehrenberger under Dr. Vigeant in " +
		"2011. In 2019, it was modified for use on LearnChemE.com by Neil Hendren under the " +
		"direction of Dr. John Falconer at the University of Colorado Boulder. " +
		"The development of this program was funded by the National Science " +
		"Foundation Grant DUE-0442234 (Prince) and DUE-0717536 (Vigeant).  Address " +
		"any questions or comments to nehe8116@colorado.edu." +
		"\u00A9 Margot Vigeant 2011");
	return false;
}

function displayIEexp() {
	alert("Your ice cubes look like giant bricks because you are using a browser that cannot always display rounded corners correctly. " +
		"If you want nicer-looking ice cubes, try switching to a different browser. But don't worry, the simulation will " +
		"work fine either way!");

	return false;
}

function drawPlot1() {
	plot1.setXLim(0, xAxisLimit);
		plot1.setYLim(0, yAxisLimit1);
		plot1.beginDraw();
		plot1.drawBackground();
		plot1.drawBox();
		plot1.setFontSize(48);
		push();
		strokeWeight(5);
		if(blocksDropped) {
			textAlign(BOTTOM);
			textSize(24);
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
		plot1.drawLimits();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTitle();
		plot1.endDraw();
}

function drawPlot2() {
	plot2.setXLim(0, xAxisLimit);
		plot2.setYLim(0, yAxisLimit2);
		plot2.beginDraw();
		plot2.drawBackground();
		plot2.drawBox();
		plot2.setFontSize(48);
		push();
		strokeWeight(5);
		if(blocksDropped) {
			textAlign(BOTTOM);
			textSize(24);
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
		plot2.drawLimits();
		plot2.drawXAxis();
		plot2.drawYAxis();
		plot2.drawTitle();
		plot2.endDraw();
}

function setup() {
	cnv = createCanvas(100, 100);
	cnv.parent("bottomCenter");
	plot1 = new GPlot(this);
	plot1.setPos(10, 0);
	plot1.setOuterDim(100, 100);
	plot1.setYLim(0, 1);
	plot1.getXAxis().getAxisLabel().setText("time (sec)");
	plot1.getYAxis().getAxisLabel().setText("mass of ice melted (g)");
	plot1.setFontSize(48);
	plot1.getTitle().setText("mass of ice melted");

	plot2 = new GPlot(this);
	plot2.setPos(10, 0);
	plot2.setOuterDim(100, 100);
	plot2.setYLim(0, 400);
	plot2.getXAxis().getAxisLabel().setText("time (sec)");
	plot2.getYAxis().getAxisLabel().setText("temperature (°C)");
	plot2.setFontSize(48);
	plot2.getTitle().setText("temperature");
  }
  
  function draw() {

	pictureBehavior();

	background(255);

	switch(showWhichGraph) {
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

	if (blocksDropped && experimentRunning) {currentStep++}

	if (currentStep >= 599) {
		experimentRunning = false;
		$("#startButton").removeAttr("disabled");
		$("#startButton").css("border-color", "#093");
		$("#pauseButton").attr("disabled", "disabled");
		$("#pauseButton").css("border-color", "gray");
	}
  }
