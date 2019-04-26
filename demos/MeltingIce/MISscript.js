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

// Global constants
var icewaterTemp = 0;
var tauNumber = 5; // a scaling factor
var graphWidth = 811; // The width of the graph in pixels; used for scaling - 90% is used
var graphHeight = 453; // The height of the graph in pixels; used for scaling - top 88% is used

// Variables to keep track of state
var graphInfoShowing = false;
var experimentStarted = false;
var experimentRunning = false;
var sit1BlockTop;
var sit2BlockTop;
var sit1BlockHeight;
var sit2BlockHeight;
var currentStep = 1;

// Variables to hold input values
var initialTemp1 = 30;
var heatCapacity1 = 1;
var mass1 = 1;
var area1 = 1;
var numBlocks1 = 1;
var stirFactor1 = 0.03;

var initialTemp2 = 30;
var heatCapacity2 = 1;
var mass2 = 1;
var area2 = 1;
var numBlocks2 = 1;
var stirFactor2 = 0.03;

// Variables that will be necessary for calculations
var currentBlockTemp1;
var currentBlockTemp2;
var tau; // total "time" to simulate (depends on user's inputs; is NOT the number of steps to run)
var initialQ1;
var initialQ2;
var q1;
var q2;
var secondsPerStep;
var iceMeltHeight1;  // iceMeltHeight and iceMeltWidth represent the amount the ice's size should change in each dimension,
var iceMeltWidth1;   // such that, for example, the ice's full size minus iceMeltHeight1 will give you the height the ice
var iceMeltHeight2;  // should be at the end of a given experiment.
var iceMeltWidth2;
var currentIceWidth1;
var currentIceHeight1;
var currentIceWidth2;
var currentIceHeight2;
var xScale; // Used to store pixels/second for the x-axis of the graph
var yScale; // Used to store pixels/gram for the x-axis of the graph

var panel1;
var panel2;


window.onload = function() {
	panel1 = QuickSettings.create(0, 30, "Settings: Situation 1")
		.addRange("Initial Temperature (°C)", 1, 200, 30, 1, function(value) {
		initialTemp1 = value;
		getTemps();
	})
	.addRange("Block Heat Capacity (J/(g °C))", 0.1, 10, 1, 0.1, function(value) {
		heatCapacity1 = value;
	})
	.addRange("Block 1 Mass (g)", 0.1, 5, 1, 0.1, function(value) {
		mass1 = value;
	})
	.addRange("Block 1 area (cm²)", 1, 9, 1, 1, function(value) {
		area1 = value;
		getAreas();
	})
	.addRange("Number of Blocks", 1, 4, 1, 1, function(value) {
		numBlocks1 = value;
		getNumBlocks();
	})
	.addBoolean("Stir Bar:", false, function(value) {
		if(value) {$("#stirBar1").show();stirFactor1=0.1;} else {$("#stirBar1").hide();stirFactor1=0.03;}
	})
	.setWidth(220)
	.setDraggable(true);

	panel2 = QuickSettings.create($("#bottomCenter").width() - 220, 30, "Settings: Situation 2")
		.addRange("Initial Temperature (°C)", 1, 400, 30, 1, function(value) {
		initialTemp2 = value;
		getTemps();
	})
	.addRange("Block Heat Capacity (J/(g °C))", 0.1, 10, 1, 0.1, function(value) {
		heatCapacity2 = value;
	})
	.addRange("Block 2 Mass (g)", 0.1, 10, 1, 0.1, function(value) {
		mass2 = value;
	})
	.addRange("Block 2 area (cm²)", 1, 9, 1, 1, function(value) {
		area2 = value;
		getAreas();
	})
	.addRange("Number of Blocks", 1, 4, 1, 1, function(value) {
		numBlocks2 = value;
		getNumBlocks();
	})
	.addBoolean("Stir Bar:", false, function(value) {
		if(value) {$("#stirBar2").show();stirFactor2=0.1;} else {$("#stirBar2").hide();stirFactor2=0.03;}
	})
	.setWidth(220)
	.setDraggable(true);
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

	resetSituation1(); // restore Situation 1 parameters to default values (in program and on display)
	resetSituation2();
	generateGraphPoints(); // must initialize the objects used as points on the graph
	resetExperiment(); // the experiment animations must be reset AFTER the graph points are initialized

	// register event handlers for control buttons (start, pause, reset, help)
	$("#startButton").on('click', startMelting);
	$("#pauseButton").on('click', pauseMelting);
	$("#resetButton").on('click', resetExperiment);
	$("#helpButton").on('click', showHelp);

	// register event handlers for links to display more info
	$("#graphInfo").on('click', displayGraphInfo);
	$("#infoButton").on('click', displayAboutInfo);
	$("#IEexp").on('click', displayIEexp);

	//panel2.setPosition($("#topRight").offset().left, 10);
}

/*
 * Function: generateGraphPoints
 * Adds 1000 images (500 for each Situation) to the HTML page to represent points on the graph. This is
 * done only when the page is first loaded. Done dynamically to keep the saved HTML document concise.
*/
function generateGraphPoints() {
	var sit1HTML = "";
	var sit2HTML = "";

	for(var i=1; i<=500; i++) {
		sit1HTML += '<img id="sit1Point' + i + '" class="sit1Point" src="blank_img.png" />';
		sit2HTML += '<img id="sit2Point' + i + '" class="sit2Point" src="blank_img.png" />';
	}

	$("#graphBase").after('<div id="graphPointsDiv">' + sit1HTML + sit2HTML + '</div>');
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
	if(experimentRunning || experimentStarted) {
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

	graphWidth = Math.ceil($("#graphBase").width()*0.9); // The width of the graph in pixels; used for scaling
	graphHeight = Math.ceil($("#graphBase").height()*0.88);

	$("#startButton").removeAttr("disabled");
	
	$("#startButton").css("border-color", "#093");

	$("#pauseButton").find(".glyphicon").removeClass('glyphicon-play');
  $("#pauseButton").find(".glyphicon").addClass('glyphicon-pause');

	// Make sure the Pause button reads "PAUSE" rather than "RESET", and disable the Pause button
	$("#pauseButton").attr("disabled", "disabled");
	$("#pauseButton").css("border-color", "gray");

	// Return the blocks to their original positions and the ice cubes to their
	// original sizes. Hide all data points and labels on the graph.
	
	$(".sit1Ice").css({height:"9.5%", width:"10.8%"});
	$(".sit2Ice").css({height:"9.5%", width:"10.8%"});
	/*$(".sit1Ice").hide();
	$(".sit2Ice").hide();*/
	$(".sit1Point").hide();
	$(".sit2Point").hide();
	$(".graphLabel").hide();
	
	// reset currentBlockTemp1 and currentBlockTemp2 by simply re-reading in the initial
	// temperature inputs
	getTemps();
	getAreas();
	updateBlockColors();
	getNumBlocks();

}



/*
*************************************************************************
*					Event Handlers for Input Fields						*
*************************************************************************
*/

/*
 * Event Handler Function: getTemps
 * Called when the "initial block temperature" value is changed in the user input field, in either Situation.
 *
 * Reads in the values for "initial block temperature" in both Situation 1 and Situation 2, and updates the
 * "current block temperature" display and the color of the blocks according to the new temperature for each Situation.
*/
function getTemps() {
	// label to reflect the new temperature
	currentBlockTemp1 = initialTemp1;
	$("#currentBlockTemp1").html(currentBlockTemp1);

	// label to reflect the new temperature
	currentBlockTemp2 = initialTemp2;
	$("#currentBlockTemp2").html(currentBlockTemp2);

	updateBlockColors();
}

/*
 * Function: updateBlockColors
 * Auxiliary function for getTemps. Updates the colors of the blocks on display, according to the
 * current temperature of the blocks for each situation. (Is also called to update the blocks
 * while an experiment is running.)
*/
function updateBlockColors() {
	// Change situation 1 blocks' color to reflect the temperature
	if(currentBlockTemp1 < 40) {
		$(".sit1block").css("background", "url('blocks.png') 0 0"); // black
	}
	else if(currentBlockTemp1 < 180) {
		$(".sit1block").css("background", "url('blocks.png') -48px 0"); // blue
	}
	else if(currentBlockTemp1 < 400) {
		$(".sit1block").css("background", "url('blocks.png') -96px 0"); // purple/dark red
	}
	else {
		$(".sit1block").css("background", "url('blocks.png') -144px 0"); // bright red
	}

	// Change situation 2 blocks' color to reflect the temperature
	if(currentBlockTemp2 < 40) {
		$(".sit2block").css("background", "url('blocks.png') 0 0"); // black
	}
	else if(currentBlockTemp2 < 180) {
		$(".sit2block").css("background", "url('blocks.png') -48px 0"); // blue
	}
	else if(currentBlockTemp2 < 400) {
		$(".sit2block").css("background", "url('blocks.png') -96px 0"); // purple/dark red
	}
	else {
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
	// Change the blocks' size according to the input surface area
	switch(area1*1) { // must multiply by 1 to make sure area1 is treated as an integer
		case 0: $("#area1").val(1);
		area2 = 1;
		// If the entered area is 0, reset the area to 1, and then fall through to case 1
	case 1: $(".sit1block").css({height:"17px", width:"17px", bottom:"50%"});
			sit1BlockTop = 50;
			sit1BlockHeight = 17;
			break;
	case 2: $(".sit1block").css({height:"23px", width:"23px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 23;
			break;
	case 3: $(".sit1block").css({height:"28px", width:"28px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 28;
			break;
	case 4: $(".sit1block").css({height:"33px", width:"32px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 33;
			break;
	case 5: $(".sit1block").css({height:"36px", width:"36px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 36;
			break;
	case 6: $(".sit1block").css({height:"39px", width:"40px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 39;
			break;
	case 7: $(".sit1block").css({height:"43px", width:"42px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 43;
			break;
	case 8: $(".sit1block").css({height:"45px", width:"46px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 45;
			break;
	case 9: $(".sit1block").css({height:"48px", width:"48px", bottom:"50%"});
	sit1BlockTop = 50;
			sit1BlockHeight = 48;
			break;
	default: // This case should never run, but if it does, reset area1 to its default value
			area1 = 4;
			$("#area1").val(4);
			$(".sit1block").css({height:"33px", width:"32px", bottom:"50%"});
			sit1BlockTop = 50;
			sit1BlockHeight = 33;
			break;
	}

	// Change the blocks' size according to the input surface area
	switch(area2*1) { // must multiply by 1 to make sure area2 is treated as an integer
	case 0: $("#area2").val(1);
			area2 = 1;
			// If the entered area is 0, reset the area to 1, and then fall through to case 1
	case 1: $(".sit2block").css({height:"17px", width:"17px", bottom:"50%"});
			sit2BlockTop = 50;
			sit2BlockHeight = 17;
			break;
	case 2: $(".sit2block").css({height:"23px", width:"23px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 23;
			break;
	case 3: $(".sit2block").css({height:"28px", width:"28px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 28;
			break;
	case 4: $(".sit2block").css({height:"33px", width:"32px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 33;
			break;
	case 5: $(".sit2block").css({height:"36px", width:"36px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 36;
			break;
	case 6: $(".sit2block").css({height:"39px", width:"40px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 39;
			break;
	case 7: $(".sit2block").css({height:"43px", width:"42px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 43;
			break;
	case 8: $(".sit2block").css({height:"45px", width:"46px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 45;
			break;
	case 9: $(".sit2block").css({height:"48px", width:"48px", bottom:"50%"});
	sit2BlockTop = 50;
			sit2BlockHeight = 48;
			break;
	default: // This case should never run, but if it does, reset area2 to its default value
			area2 = 4;
			$("#area2").val(4);
			$(".sit2block").css({height:"33px", width:"32px", bottom:"50%"});
			sit2BlockTop = 50;
			sit2BlockHeight = 33;
			break;
	}

}
/*
 * Event Handler Function: getNumBlocks
 * Called when the user enters a new value for "number of blocks" for either Situation
 *
 * Reads in and both values, and updates global variables accordingly. Also shows or hides
 * blocks in the display so that the numbers the user entered determine the number of blocks they see.
*/
function getNumBlocks() {
	
	switch(numBlocks1*1) {
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

	switch(numBlocks2*1) {
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
	initialTemp1=30;
	heatCapacity1=1;
	mass1=1;
	area1=1;
	numBlocks1=1;
	
	getTemps();
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
	initialTemp2=30;
	heatCapacity2=1;
	mass2=1;
	area2=1;
	numBlocks2=1;
	
	getTemps();
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
	}
	else {
		experimentRunning = true;
		$("#pauseButton").find(".glyphicon").removeClass('glyphicon-play');
    	$("#pauseButton").find(".glyphicon").addClass('glyphicon-pause');
		calculateStep();
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
	resetExperiment();
	
	// Disable "start" button and enable "pause" button
	$("#startButton").attr("disabled", "disabled");
	$("#startButton").css("border-color", "gray");
	$("#pauseButton").removeAttr("disabled");
	$("#pauseButton").css("border-color", "#F00");

	// Initialize starting values for the calculations
	calculateGraphLabels();
	initializeCalculationVars();

	// Start the experiment
	experimentRunning = true;
	experimentStarted = true;
	dropBlocks();

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
 * Function: calculateGraphLabels
 * Determines the appropriate max values for the x and y axes on the graph for the current experiment (essentially, adjusts
 * the "zoom" of the graph to make it most readable). Also updates the display of how much ice each beaker starts with,
 * since this is where that number is calculated.
 *
 * To calculate appropriate max for the y-axis (amount of ice melted), the function must essentially run the whole simulation
 * mathematically before the simulation is run for the user, to determine how much ice should melt in 500 steps. Although it is
 * computationally redundant to run the experiment twice, the alternatives are to leave the y-axis unlabeled until the very end
 * of the experiment (not ideal for the user), or to store several data points for each of the 500 steps of calculation in order
 * to reuse them when running the experiment "for real". The computer can run the experiment quickly enough that the user does
 * not notice the lag produced by doing it twice, so this is the most effective alternative.
 *
 * The max value for the x-axis depends on tau, which is calculated in initializeCalculationVars, and represents the amount of time
 * it will take for the fastest Situation to melt all of the ice
*/
function calculateGraphLabels() {
	// Because we're essentially pre-running the whole experiment to find yMax, we need to initialize the variables here, too
	initializeCalculationVars();
	var qInstant1;
	var qInstant2;
	var xMax;
	var yMax;

	for(var i=1; i<=500; i++) {
		// Calculate heat transfer and new block temperatures for this step for the blocks of situation 1
		qInstant1 = stirFactor1 * area1 * numBlocks1 * (currentBlockTemp1 - icewaterTemp) * secondsPerStep;
		if (qInstant1 > initialQ1)
			qInstant1 = initialQ1;
		if((initialQ1-q1)/(1000*2.01) < 1) {
		q1 = q1 - qInstant1;
		currentBlockTemp1 = q1/(numBlocks1 * mass1 * heatCapacity1) + icewaterTemp;
		}
		else {q1 += 0};

		// Calculate heat transfer and new block temperatures for this step for the blocks of situation 2
		qInstant2 = stirFactor2 * area2 * numBlocks2 * (currentBlockTemp2 - icewaterTemp) * secondsPerStep;
		if (qInstant2 > initialQ2)
			qInstant2 = initialQ2;
		q2 = q2 - qInstant2;
		currentBlockTemp2 = q2/(numBlocks2 * mass2 * heatCapacity2) + icewaterTemp;
	}

	var iceMelt1 = (initialQ1 - q1) / 2.01; // The heat capacity for ice is 2.01 j/gC
	var iceMelt2 = (initialQ2 - q2) / 2.01;
	var maxIceMelt;

	if(iceMelt1 > iceMelt2)
		maxIceMelt = Math.floor(iceMelt1);
	else
		maxIceMelt = Math.floor(iceMelt2);

	// Now that we know the amount of ice that both beakers will start with (i.e. the max ice that will
	// be melted) we can update that amount on the display
	//$("#initialIce").html(maxIceMelt);

	// We only want the order of magnitude for y, so separate out the first digit
	// and fill in the rest with 0's
	if(maxIceMelt >= 100000)
		yMax = Math.ceil(maxIceMelt/100000) * 100000;
	else if(maxIceMelt >= 10000)
		yMax = Math.ceil(maxIceMelt/10000) * 10000;
	else if(maxIceMelt >= 1000)
		yMax = Math.ceil(maxIceMelt/1000) * 1000;
	else if(maxIceMelt >= 100)
		yMax = Math.ceil(maxIceMelt/100) * 100;
	else if(maxIceMelt >= 10)
		yMax = Math.ceil(maxIceMelt/10) * 10;
	else
		yMax = Math.ceil(maxIceMelt);

	yMax = Math.min(yMax, 1000);

	// Having calculated yMax, fill in the values of the 4 labels on the y-axis accordingly
	$("#yLabel1").html(yMax / 4);
	$("#yLabel2").html(yMax / 2);
	$("#yLabel3").html(yMax * 3/4);
	$("#yLabel4").html(yMax);


	// Now label the x-axis
	xMax = Math.floor(tau);
	$("#xLabel1").html(xMax / 4);
	$("#xLabel2").html(xMax / 2);
	$("#xLabel3").html(xMax * 3/4);
	$("#xLabel4").html(xMax);

	$(".graphLabel").show();

	// Finally, calculate xScale and yScale
	xScale = graphWidth / xMax;
	yScale = graphHeight / yMax;
}

/*
 * Function: initializeCalculationVars
 *
*/
function initializeCalculationVars() {
	currentStep = 1;

	// Ensure all input values are current
	getTemps();
	getAreas();
	getNumBlocks();

	//toggleStirBar1();
	//toggleStirBar2();

	var tau1 = mass1 * heatCapacity1/(numBlocks1 * stirFactor1 * area1);
	var tau2 = mass2 * heatCapacity2/(numBlocks2 * stirFactor2 * area2);
	if(tau1 > tau2)
		tau = tau1 * tauNumber;
	else
		tau  = tau2 * tauNumber;

	secondsPerStep = tau/500;

	initialQ1 = mass1 * heatCapacity1 * (currentBlockTemp1-icewaterTemp) * numBlocks1;
	q1 = initialQ1;
	initialQ2 = mass2 * heatCapacity2 * (currentBlockTemp2-icewaterTemp) * numBlocks2;
	q2 = initialQ2;

	currentIceHeight1 = 9.5;
	currentIceWidth1 = 10.8;
	currentIceHeight2 = 9.5;
	currentIceWidth2 = 10.8;

	iceMeltHeight1 = 9.5;
	iceMeltWidth1 = 10.8;
	iceMeltHeight2 = 9.5;
	iceMeltWidth2 = 10.8;
}

function dropBlocks() {

	var bkHeight = $("#beakersImg").height();
	var boxHeight = $("#topCenter").height();

	const fallHeight = (0.01*sit1BlockTop*boxHeight - 0.6*bkHeight)/boxHeight;
	
	sit1BlockTop = sit1BlockTop - fallHeight*100;
	var cssVal1 = sit1BlockTop + "%";

	sit2BlockTop = sit2BlockTop - fallHeight*100;
	var cssVal2 = sit2BlockTop + "%";

	// Move the blocks down until they hit the water (the coordinates that were just calculated). Make
	// the fall take half a second (500ms). Then call calculateStep to start the heat-transfer calculations.
	$(".sit1block").animate({bottom:cssVal1}, 500, "linear");
	$("#sit2block1, #sit2block2, #sit2block3").animate({bottom:cssVal2}, 500, "linear");
	//sit2block4 must be animated separately so that the callback can be attached to only that one block;
	// otherwise it will be called four times (one for each block selected by ".sit2block")
	$("#sit2block4").animate({bottom:cssVal2}, 500, "linear", calculateStep);
}


/*
*************************************************************************
*							Running the Simulation						*
*************************************************************************
*/

function calculateStep() {
	if(!experimentRunning) return;
	if(currentStep > 500) {
		experimentRunning = false;
		$("#startButton").removeAttr("disabled");
		$("#startButton").css("border-color", "#093");
		$("#pauseButton").attr("disabled", "disabled");
		$("#pauseButton").css("border-color", "gray");
		return;
	}

	// Calculate heat transfer and new block temperatures for this step for the blocks of situation 1
	var qInstant1 = stirFactor1 * area1 * numBlocks1 * (currentBlockTemp1 - icewaterTemp) * secondsPerStep;
	if (qInstant1 > initialQ1)
		qInstant1 = initialQ1;
	if((initialQ1-q1+qInstant1)/(1000*2.01) < 1) {
		q1 = q1 - qInstant1;
		currentBlockTemp1 = q1/(numBlocks1 * mass1 * heatCapacity1) + icewaterTemp;
		}
		else {q1 += 0};

	// Calculate heat transfer and new block temperatures for this step for the blocks of situation 2
	var qInstant2 = stirFactor2 * area2 * numBlocks2 * (currentBlockTemp2 - icewaterTemp) * secondsPerStep;
	if((initialQ2-q2+qInstant2)/(1000*2.01) < 1) {
		q2 = q2 - qInstant2;
		currentBlockTemp2 = q2/(numBlocks2 * mass2 * heatCapacity2) + icewaterTemp;
		}
		else {q2 += 0};

	// Calculate the coordinates for the points on the graph
	var x = currentStep * secondsPerStep * xScale + $("#graphBase").offset().left + 0.1*graphWidth;
	x = x + "px";
	var y1 = ((initialQ1 - q1) / 2.01) * yScale + $("#graphBase").position().top; // The amount of ice melted is equal to the change in q divided by the
												// heat capacity of water (2.01)
	y1 = graphHeight - y1; // account for the fact that element positioning on a page counts from the top, not the bottom
	y1 = y1 + "px";
	var y2 = ((initialQ2 - q2) / 2.01) * yScale + $("#graphBase").position().top;
	y2 = graphHeight - y2;
	y2 = y2 + "px";


	// Calculate the new height and width values for the ice cubes of situation 1
	// Note that since currentIceHeight is a global variable, it is necessary to make a copy of it
	// to format it correctly for CSS, because if you change the format of the original you'll have
	// to change it back again afterwards.
	currentIceHeight1 = Math.max(0, iceMeltHeight1 - ((initialQ1-q1)/(1000*2.01)) * iceMeltHeight1);
	var cssHeight1 = currentIceHeight1 + "%";
	currentIceWidth1 = Math.max(0, iceMeltWidth1 - ((initialQ1-q1)/(1000*2.01)) * iceMeltWidth1);
	var cssWidth1 = currentIceWidth1 + "%";

	// Update the current temperature of the blocks on the screen, and change the color to match
	$("#currentBlockTemp1").html(currentBlockTemp1.toFixed(2));
	$("#currentBlockTemp2").html(currentBlockTemp2.toFixed(2));
	updateBlockColors();

	// Calculate the new height and width values for the ice cubes of situation 2
	currentIceHeight2 = Math.max(0, iceMeltHeight2 - ((initialQ2-q2)/(1000*2.01)) * iceMeltHeight2);
	var cssHeight2 = currentIceHeight2 + "%";
	currentIceWidth2 = Math.max(0, iceMeltWidth2 - ((initialQ2-q2)/(1000*2.01)) * iceMeltWidth2);
	var cssWidth2 = currentIceWidth2 + "%";

	// Animate blocks. The rest of the visual changes will take place while the animation is
	// running; as a callback, the animation will re-call this function. Like in dropBlocks,
	// sit2block4 will be animated separately so that the callback can be attached to that block alone,
	// to make sure the callback is only called once.
	if((sit1BlockTop) > 2) // If the blocks are already at the bottom of the beaker, don't move them
		sit1BlockTop-=0.3;
	if((sit2BlockTop) > 2)
		sit2BlockTop-=0.3;
	var cssVal1 = sit1BlockTop + "%";
	var cssVal2 = sit2BlockTop + "%";
	$(".sit1block").css("bottom", cssVal1);
	$("#sit2block1, #sit2block2, #sit2block3").css("bottom", cssVal2);
	$("#sit2block4").animate({bottom:cssVal2}, 15, "linear", calculateStep); // One frame should take about 50ms

	// Shrink the ice cubes
	$(".sit1Ice").css({height:cssHeight1, width:cssWidth1});
	$(".sit2Ice").css({height:cssHeight2, width:cssWidth2});

	var dot1 = "#sit1Point" + currentStep;
	var dot2 = "#sit2Point" + currentStep;
	$(dot1).css({top:y1, left:x});
	$(dot2).css({top:y2, left:x});
	$(dot1).show();
	$(dot2).show();

	currentStep++;
}



/*
*************************************************************************
*						Hiding/Showing More Info						*
*************************************************************************
*/

function showHelp() {
	var string = "Melting Ice Simulation lets you compare the rate of energy transfer";
    string += " from heated blocks to ice cubes in two different beakers, each under";
    string += " its own set of initial conditions. \n\nChoose the initial conditions";
    string += " for Situation 1 and Situation 2.\n\nThen click the Start button to";
    string += " watch the ice melt.\n\nAfter the ice has melted, in order to change";
    string += " the initial conditions for another experiment, you must first press the";
    string += " Reset button to return the ice and the heated blocks to their initial";
    string += " positions and energies.\n\nWhile the ice is melting, you can watch the";
    string += " graph to see the mass of ice melted in each beaker over time. Note that";
    string += " the axes are recalculated every time to ensure a good view of the";
    string += " graph.\n\nThis simulation assumes that all energy transferred goes into";
    string += " melting ice at 0\xB0C into water at 0\xB0C, and none goes into changing the";
    string += " temperature of the water or ice.";
  alert(string);
}

function displayGraphInfo() {
	if (graphInfoShowing) {
		$("#graphHeightInfo").hide();
		$("#graphSlopeInfo").hide();
		graphInfoShowing = false;
	}
	else {
		$("#graphHeightInfo").fadeIn();
		$("#graphSlopeInfo").fadeIn();
		graphInfoShowing = true;
	}
	return false;
}

function displayAboutInfo(){
	alert("This program was created under the direction of Dr. Margot Vigeant " +
		"and Dr. Michael Prince at Bucknell University. It was first developed " +
		"in Flash by Matt Koppenhaver under Dr. Prince, and was adapted to " +
		"Javascript by Emily Ehrenberger under Dr. Vigeant in " +
		"2011.\n\nThe development of this program was funded by the National Science " +
		"Foundation Grant DUE-0442234 (Prince) and DUE-0717536 (Vigeant).\n\nAddress " +
		"any questions or comments to prince@bucknell.edu.\n\n" +
		"\u00A9 Margot Vigeant 2011");
	return false;
}

function displayIEexp() {
	alert("Your ice cubes look like giant bricks because you are using a browser that cannot always display rounded corners correctly. " +
		  "If you want nicer-looking ice cubes, try switching to a different browser. But don't worry, the simulation will " +
		  "work fine either way!");

	return false;
}
