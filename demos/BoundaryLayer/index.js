
window.g = {
  cnv : undefined,
  x_over_xc : 0,
  rng_2_value : 0,
  rng_3_value : 0,
  Pr_no : "0.6",
  boundaryType : "Velocity",

  // Variables filled with boundaryLayer function
  etaVec : [],
  fVec : [],
  gVec : [],
  hVec : [],
  thVec : [],
  thDVec : [],
}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");
  boundaryLayer();
  document.getElementsByTagName("main")[0].remove();
  let temp = boundaryLayer();


  // These values are set and hold all the info for each Pr number (thVec and thDVec are 2D arrays, all other values are const)
  g.etaVec = temp[0];
  g.fVec = temp[1];
  g.gVec = temp[2];
  g.hVec = temp[3];
  g.thVec = temp[4];
  g.thDVec = temp[5];
}

function draw() {
  background(250);
 


  
}


const range_1_element = document.getElementById("range-1");
const range_1_value_label = document.getElementById("range-1-value");
const range_2_element = document.getElementById("range-2");
const range_2_value_label = document.getElementById("range-2-value");
const select_element = document.getElementById("select-1");

const select_element2 = document.getElementById("select-2");


// x/x_crit or Re_x/Re_crit
range_1_element.addEventListener("input", function() {
  const x_over_xc = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${x_over_xc}`; // Edit the text of the global var range_1_value
  g.x_over_xc = x_over_xc; // Assign the number to the global object.
  console.log(`g.x_over_xc is ${g.x_over_xc}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

// Prandtl number
select_element.addEventListener("change", function() {
  const Pr_no = select_element.value;
  g.Pr_no = Pr_no;
  console.log(`g.Pr_no is ${Pr_no}`);
})

// Boundary type
select_element2.addEventListener("change", function() {
  const boundaryType = select_element2.value;
  g.boundaryType = boundaryType;
  console.log(`g.boundaryType is ${boundaryType}`);
})


// Copied from K. Regner's matlab code: function V_TH_BL
function boundaryLayer(){
  let dEta = 0.001;
  let total = 10;
  // Vectors to be returned. Need to define first spot as 0 for all to define next value
  let etaVec = [];
  etaVec[0] = 0;
  let fVec = [];
  fVec[0] = 0;
  let gVec = [];
  gVec[0] = 0;
  let hVec = []; // Starts at .3319
  hVec[0] = 0.3319;

  for(let i = 0; i < total/dEta; i++){
    etaVec.push(etaVec[i] + dEta);
    etaVec[i] = etaVec[i].toFixed(3); // Resolves minor rounding error
    fVec.push(fVec[i] + gVec[i]*dEta);
    gVec.push(gVec[i] + hVec[i]*dEta);
    hVec.push(hVec[i] - 0.5*fVec[i]*hVec[i]*dEta);
  }
  // Error checking
  let velCheck = gVec[total/dEta];
  if (Math.abs(velCheck - 1) > 0.01){
    console.log('Enter new guess for shooting method (velocity)');
  }
  
  let thVec = [];
  thVec[0] = [0, 0, 0]; // Defining initial values of thVec
  let thDVec = [];
  thDVec.push([0.277, 0.332, 0.48485]); // Defining inital values of thDVec
  let Pr = [0.6, 1, 3];

  // Temporary vectors to be used to fill thVec and thDVec
  let thTEMP = new Array(3);
  let thDTEMP = new Array(3); 

  for(let i = 0; i < total/dEta; i++){
    for(let j = 0; j < Pr.length; j++){
      thTEMP[j] = thVec[i][j] + thDVec[i][j]*dEta;
      thDTEMP[j] = thDVec[i][j] - fVec[i]*Pr[j]*thDVec[i][j]*dEta/2;
    }
    thVec.push(thTEMP);
    thDVec.push(thDTEMP);
  }
 return([etaVec,fVec,gVec,hVec,thVec,thDVec])

}