
window.g = {
  cnv : undefined,
  x_over_xc : 0,
  rng_2_value : 0,
  rng_3_value : 0,
  Pr_no : "0.6",
  boundaryType : "Velocity",
}

// Variables filled with boundaryLayer function
let b = {
  eta : [],
  f : [],
  df_deta : [],
  d2f_deta : [],
  TH : [],
  dTH_deta : [],
  Uinf : 1,
  delT : 1,
  kf : 0.0263,
  nu : 15.89*Math.pow(10,-6),
  Lcrit : 5*Math.pow(10,5)*(15.89*Math.pow(10,-6))/1, // 5e5*nu/Uinf
  x : [],
  x_pos : 5,
  Rex : [],
  delta : [],
  vProfX : [],
  vProfY : [],
  du_dy0 : [],
  Cfx : [],
  deltaT : [],
  tProfx : [],
  tProfy : [],
  dT_dy0 : [],
  Nu_x : [],
  h_x : [],
  h_avg : 0,
  h_local : 0,

}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");
  document.getElementsByTagName("main")[0].remove();

  let temp = boundaryLayer();
  // These values are set and hold all the info for each Pr number (TH and dTH_deta are 2D arrays, all other values are const)
  b.eta = temp[0];
  b.f = temp[1];
  b.df_deta = temp[2];
  b.d2f_deta = temp[3];
  b.TH = temp[4];
  b.dTH_deta = temp[5];
  
  
  addValues(); // Values calculated outside of boundaryLayer function
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
  thDVec[0] = [0.277, 0.332, 0.48485]; // Defining inital values of thDVec
  let Pr = [0.6, 1, 3];
  // Temporary vectors to be used to fill thVec and thDVec
  let thTEMP = [];
  let thDTEMP = []; 
  

  for(let i = 0; i < total/dEta; i++){
    for(let j = 0; j < Pr.length; j++){
      thTEMP.push(thVec[i][j] + thDVec[i][j]*dEta);
      thDTEMP.push(thDVec[i][j] - fVec[i]*Pr[j]*thDVec[i][j]*dEta/2);
    }
    thVec.push(thTEMP);
    thDVec.push(thDTEMP);
    // Removing previous elements from the temporary arrays (originally I was rewriting the values in the temp array after declaring them with new Array(3) and that was breaking something)
    thTEMP = [];
    thDTEMP = [];
  }

 return([etaVec,fVec,gVec,hVec,thVec,thDVec])
}

function addValues(){
  
  let counter = 0;
  // Adding values to x and Rex
  for(let i = 0; i < b.Lcrit*1.26; i += b.Lcrit/10000){
    b.x.push(i);
    b.x[counter] = b.x[counter].toFixed(4) // Resolving decimals
    b.Rex.push(50*counter);
    counter++;
  }
  
  // Adding values to delta
  //let val; I was using val to fix the number to 4 decimal places but that was just how Matlab was showing me the numbers
  // Might need to do something like that... My numbers are slightly different than what comes out of the matlab code
  for(let i = 0; i < b.x.length; i++){
    //val = b.eta[4920]*Math.pow(b.nu*b.x[i]/b.Uinf,0.5);
    b.delta.push(b.eta[4920]*Math.pow(b.nu*b.x[i]/b.Uinf,0.5));

    //val = b.d2f_deta[0]*b.Uinf*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5);
    b.du_dy0.push(b.d2f_deta[0]*b.Uinf*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5));

    b.Cfx.push(2*b.nu*b.du_dy0[i]/Math.pow(b.Uinf,2));

    b.deltaT.push(b.eta[3266]*Math.pow(b.nu*b.x[i]/b.Uinf,2));

    // for(let j = 0; j < 3; j++){
    //   temp.push(-1*b.dTH_deta[i][j]*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5));
    //   temp2.push(-1*x[i]*temp[j]/b.delT);
    //   temp3.push(-1*temp[j]*b.kf/b.delT);
    // }
    // b.dT_dy0.push(temp);
    // b.Nu_x.push(temp2);
    // b.h_x.push(temp3);
    // temp = [];
    // temp2 = [];
    // temp3 = [];
  }
  
  let temp = [];
  let temp2 = [];
  let temp3 = [];
  // Defining initial values in these vectors to avoid errors in computation
  b.dT_dy0[0] = [-1/0, -1/0, -1/0];
  b.Nu_x[0] = [NaN, NaN, NaN];
  b.h_x[0] = [1/0, 1/0, 1/0];
  let counter1 = 0;
  // To avoid the errors I'm iterating from 1 to 12601 rather than 0
  // for(let i = 1; i < b.x.length; i++){
  //   for(let j = 0; j < 3; j++){
  //     temp.push(-1*b.dTH_deta[i][j]*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5));
  //     counter1++;
  //     console.log(counter1)
  //     console.log(temp[j])
  //     //temp2.push(-1*x[i]*temp[j]/b.delT);
  //     //temp3.push(-1*temp[j]*b.kf/b.delT);
  //   }
  //   b.dT_dy0.push(temp);
  //   b.Nu_x.push(temp2);
  //   b.h_x.push(temp3);
  //   temp = [];
  //   temp2 = [];
  //   temp3 = [];
  // }


 
 
 
}