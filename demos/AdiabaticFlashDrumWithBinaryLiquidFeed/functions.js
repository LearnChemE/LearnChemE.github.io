
// Draws general outlines
function frame(){
    push(); fill(250); strokeWeight(1.3);
    rect(50,height/2-60,150,120); // Moles in feed
    rect(500,50,150,120); // Moles in vapor
    rect(500,330,150,120); // Moles in liquid
    pop();

    push(); // Flash drum
    beginShape(); strokeWeight(2); fill(0,200,200,100);
    for(let i = 0; i < flashDrum.length; i++){
        vertex(265+.9*flashDrum[i][0],120+.8*flashDrum[i][1]);
    }
    endShape();
    pop();

    push();
    noStroke(); textSize(20);
    text('moles in feed',mf.lx+12,mf.ty-8); // Box labels
    text('moles in vapor',mv.lx+11,mv.ty-8);
    text('moles in liquid',ml.lx+10,ml.ty-8);
    text('flash drum',width/2-43,height/2+6);
    text(g.P.toFixed(2)+' bar',width/2-33,height/2+30);
    text('liquid feed: '+g.T+'°C',mf.lx,mf.by+50);
    textSize(16);
    text('methanol',mf.lx+5,mf.by+18); // Fluid labels
    text('water',mf.rx-56,mf.by+18);
    text('methanol',mv.lx+5,mv.by+18);
    text('water',mv.rx-56,mv.by+18);
    text('methanol',ml.lx+5,ml.by+18);
    text('water',ml.rx-56,ml.by+18);
    pop();

    // Lines and arrows
    push(); strokeWeight(2);
    line(mf.rx+10,height/2,mf.rx+80,height/2); // MF to flashdrum
    arrow([mf.rx+10,height/2],[mf.rx+85,height/2],0,17,5);
    line(353,134,353,110); // Top of flashdrum to MV
    line(353,110,mv.lx-10,110);
    arrow([353,110],[mv.lx-5,110],0,17,5);
    line(353,363,353,390); // Bottom of flashdrum to ML
    line(353,390,ml.lx-10,390);
    arrow([353,390],[ml.lx-5,390],0,17,5);
    pop();
    //line(353,50,353,height); // 353 px is midline of flashdrum
}

function mathAndDisplay(){
  // Moles in feed dipslay
  molesInFeed();
  function molesInFeed(){
      push();
      strokeWeight(.5); fill(g.green);
      rect(mf.lx+10,mf.by,60,map(g.moleFrac,0,1,0,-95));
      fill(g.blue);
      rect(mf.lx+80,mf.by,60,map(1-g.moleFrac,0,1,0,-95));
      pop();
      push();
      noStroke(); textSize(18);
      if(g.moleFrac == 1){
          text((10*g.moleFrac).toFixed(1),mf.lx+21,mf.by+map(g.moleFrac,0,1,0,-95)-5);
          text((10*(1-g.moleFrac)).toFixed(1),mf.lx+96,mf.by+map(1-g.moleFrac,0,1,0,-95)-5);
      } else if(g.moleFrac == 0){
          text((10*g.moleFrac).toFixed(1),mf.lx+26,mf.by+map(g.moleFrac,0,1,0,-95)-5);
          text((10*(1-g.moleFrac)).toFixed(1),mf.lx+91,mf.by+map(1-g.moleFrac,0,1,0,-95)-5);
      } else {
          text((10*g.moleFrac).toFixed(1),mf.lx+26,mf.by+map(g.moleFrac,0,1,0,-95)-5);
          text((10*(1-g.moleFrac)).toFixed(1),mf.lx+96,mf.by+map(1-g.moleFrac,0,1,0,-95)-5);
      }
      pop();
  }
  
  let answers = mathSolve(); // L, V, t, x, y
  answerDisplay();
  function answerDisplay(){

    push();
    noStroke(); textSize(20);
    text(answers[2].toFixed(0)+'°C',width/2-20,height/2-15);
    text('vapor = '+answers[1].toFixed(1)+' mol',348,60);
    text('liquid = '+answers[0].toFixed(1)+' mol',348,ml.ty+85);
    text(' = '+answers[4].toFixed(2),399,90);
    text(' = '+answers[3].toFixed(2),395,ml.ty+115);

    textStyle(ITALIC);
    text('y',378,90);
    text('x',375,ml.ty+115);

    textStyle(NORMAL); textSize(16);
    text('m',388,95);
    text('m',385,ml.ty+120);
    pop();

    push();
    strokeWeight(.5); fill(g.green);
    rect(mv.lx+10,mv.by,60,map(answers[1]*answers[4],0,10,0,-95));
    rect(ml.lx+10,ml.by,60,map(answers[0]*answers[3],0,10,0,-95));
    fill(g.blue);
    rect(mv.lx+80,mv.by,60,map(answers[1]*(1-answers[4]),0,10,0,-95));
    rect(ml.lx+80,ml.by,60,map(answers[0]*(1-answers[3]),0,10,0,-95));
    pop();
    push();
    noStroke(); textSize(18);
    //let temp = (answers[1]*answers[4]).toFixed(1)
    text((answers[1]*answers[4]).toFixed(1),mv.lx+26,mv.by+map(answers[1]*answers[4],0,10,0,-95)-5);
    text((answers[1]*(1-answers[4])).toFixed(1),mv.lx+96,mv.by+map(answers[1]*(1-answers[4]),0,10,0,-95)-5);
    text((answers[0]*answers[3]).toFixed(1),ml.lx+26,ml.by+map(answers[0]*answers[3],0,10,0,-95)-5);
    text((answers[0]*(1-answers[3])).toFixed(1),ml.lx+96,ml.by+map(answers[0]*(1-answers[3]),0,10,0,-95)-5);
    pop();
  }

}


function mathSolve(){
  let HF1, HF2, L, V, t, x, y;

  // These two values are dependent on the sliders \\
  HF1 = g.moleFrac*g.nf*g.cpL1*(g.T-g.Tref);
  HF2 = (1-g.moleFrac)*g.nf*g.cpL2*(g.T-g.Tref);

  // Starting points for solving variables
  L = 5; V = 5; t = 100; x = .5; y = .5; // These were the starting points for the variables used in Mathematica

  // Info on the bounds of the variables
  // 0 <= x,y <= 1
  // 0 <= V <= 8.4 (I think theoretically 10 but given the ranges of the sliders that's the upper limit)
  // 1.6 <= L <= 10 
  // 33 <= t <= 143

  let error;
  let errorStored = 100000;
  let x0Stored;


  // These are the equations used but all set equal to 0 so ideally val == 0 for all 5 equations
  function eq1(Hf1,Hf2,L,V,t,x,y){
    let val = x*L*g.cpL1*(t-g.Tref) + (1-x)*L*g.cpL2*(t-g.Tref) + y*V*(g.dHvap1 + g.cpV1*(t-g.Tref)) + (1-y)*V*(g.dHvap2 + g.cpV2*(t-g.Tref)) - Hf1 - Hf2;
    return val;
  }
  function eq2(L,V){
    let val = L + V - g.nf;
    return val;
  }
  function eq3(x,L,y,V){
    let val = x*L + y*V - g.moleFrac*g.nf;
    return val;
  }
  function eq4(x,t,y){
    let val = x*PsatM(t) - y*g.P;
    return val;
  }
  function eq5(x,t,y){
    let val = (1-x)*PsatW(t) - (1-y)*g.P;
    return val;
  }

  // Brute force method since I couldn't figure anything else out
  for(let i = 1.6; i <= 10; i+=.1){ // L
    L = i; V = 10-L;
    for(let j = 33; j <= 143; j++){ // t
      t = j;
      for(let k = 0; k <= 1; k+=0.01){ // x
        x = k;
        for(let n = 0; n <= 1; n+=0.01){ // y
          y = n;
          error = (eq1(HF1,HF2,L,V,t,x,y)**2 + eq2(L,V)**2 + eq3(x,L,y,V)**2 + eq4(x,t,y)**2 + eq5(x,t,y)**2)**(1/2);
          if(error < errorStored){
            errorStored = error;
            x0Stored = [L,10-L,t,x,y];
          }
        }
      }
    }
  }

  return(x0Stored);

}

// For methanol
function PsatM(T){
  let val = (1/750.06)*10**(8.08097 - 1582.271/(T+239.726));
  return(val);
}

// For water
function PsatW(T){
  let val = (1/750.06)*10**(8.07131 - 1730.63/(T+233.426));
  return(val);
}

// Attempted algorithm for setting better starting conditions
function defineICs(){
  let L0, V0, t0, x0, y0;

  // Adjusting initial guess based on slider values
  t0 = 55 + map(g.moleFrac,0,1,0,-30) + map(g.P,.25,4,0,70);
  x0 = .5 + map(g.T,120,300,.12,-.12) + map(g.P,.25,4,-.05,+.05) + map(g.moleFrac,0,1,-.3,.3);
  y0 = .5 + map(g.T,120,300,.04,-.04) + map(g.moleFrac,0,1,-.3,.3);
  L0 = 4.2 + map(g.T,120,200,0,2) + map(g.P,.25,4,-1,1) + map(g.moleFrac,0,1,0,-1);
  V0 = 10 - L0;

  // console.log('///////////////////')
  // console.log('L0: '+L0)
  // console.log('V0: '+V0)
  // console.log('t0: '+t0)
  // console.log('x0: '+x0)
  // console.log('y0: '+y0)
  return([L0,t0,x0,y0]);

}

// For creating arrows
function arrow(base,tip,color,arrowLength,arrowWidth){ 
  // base = [x,y] tip = [x,y]
  // let arrowLength = 20; // Length of arrow
  // let arrowWidth = 5; // width of arrow (1/2)
  let dx, dy, mag;
  let u_hat, u_perp;
  let point = new Array(2); // Point along unit vector that is base of triangle
  let vert = new Array(6); // Holds vertices of arrow
  // Need to define a unit vector
  dx = tip[0] - base[0];
  dy = tip[1] - base[1];
  mag = (dx**2 + dy**2)**(1/2);
  u_hat = [dx/mag,dy/mag];
  vert[0] = tip[0] - 2*u_hat[0]; // Shifts the arrow back some to keep the tip from going out too far
  vert[1] = tip[1] - 2*u_hat[1];
  // Perpendicular unit vector
  u_perp = [-u_hat[1],u_hat[0]];
  // Base of arrow
  point[0] = vert[0]+ -arrowLength*u_hat[0];
  point[1] = vert[1]+ -arrowLength*u_hat[1];
  
  vert[2] = point[0] + u_perp[0]*arrowWidth;
  vert[3] = point[1] + u_perp[1]*arrowWidth;
  vert[4] = point[0] + -u_perp[0]*arrowWidth;
  vert[5] = point[1] + -u_perp[1]*arrowWidth;
  push();
  stroke(color); fill(color); strokeWeight(1);
  triangle(vert[0],vert[1],vert[2],vert[3],vert[4],vert[5]);
  pop();

}

let flashDrum = [[25.3231031543052, 52.80136402387042],[25.861892583120206, 49.02983802216539],[27.20886615515772, 45.52770673486786],[28.82523444160273, 42.56436487638534],[30.710997442455245, 40.13981244671782],[32.86615515771526, 37.7152600170503],[35.290707587382784, 35.56010230179028],[37.9846547314578, 33.135549872122766],[40.67860187553283, 31.24978687127025],[43.372549019607845, 29.63341858482523],[46.33589087809037, 28.017050298380223],[49.29923273657289, 26.670076726342714],[53.34015345268543, 25.0537084398977],[56.84228473998295, 23.976129582267692],[60.34441602728048, 22.62915601023018],[64.65473145780051, 21.55157715260017],[68.15686274509804, 20.743393009377666],[71.92838874680308, 19.665814151747657],[76.2387041773231, 19.127024722932653],[80.81841432225065, 18.85763000852515],[84.85933503836317, 18.58823529411765],[88.90025575447571, 18.049445865302644],[94.28815004262574, 17.78005115089514],[98.86786018755329, 17.78005115089514],[103.44757033248082, 17.78005115089514],[107.48849104859336, 18.04944586530264],[111.26001705029839, 18.58823529411765],[115.03154305200341, 19.12702472293265],[118.80306905370844, 19.66581415174765],[122.57459505541348, 20.20460358056266],[126.34612105711851, 20.47399829497016],[129.84825234441604, 21.55157715260017],[133.08098891730606, 22.62915601023018],[136.58312020460357, 23.70673486786018],[139.81585677749362, 24.51491901108269],[143.58738277919863, 26.13128729752771],[147.62830349531117, 28.01705029838022],[151.9386189258312, 29.902813299232736],[155.44075021312875, 32.32736572890025],[158.40409207161127, 34.75191815856777],[162.1756180733163, 37.4458653026428],[164.60017050298381, 40.67860187553283],[166.75532821824382, 43.91133844842285],[167.83290707587383, 46.87468030690537],[168.64109121909635, 50.3768115942029],[168.91048593350385, 56.84228473998295],[168.91048593350385, 269.1253196930946],[168.10230179028133, 272.8968456947996],[166.48593350383632, 276.9377664109122],[164.33077578857632, 279.9011082693947],[161.6368286445013, 282.86445012787726],[159.21227621483376, 285.5583972719523],[155.97953964194375, 287.9829497016198],[152.4774083546462, 290.1381074168798],[148.97527706734869, 292.5626598465473],[145.20375106564364, 294.4484228473998],[140.8934356351236, 296.06479113384484],[136.8525149190111, 297.6811594202899],[132.27280477408357, 299.0281329923273],[128.23188405797103, 300.1057118499574],[123.92156862745098, 301.1832907075874],[118.26427962489345, 301.9914748508099],[113.6845694799659, 302.7996589940324],[108.56606990622336, 303.3384484228474],[103.98635976129583, 303.8772378516624],[98.86786018755329, 303.8772378516624],[93.47996589940324, 303.6078431372549],[88.3614663256607, 303.6078431372549],[83.24296675191816, 303.3384484228474],[79.74083546462063, 303.0690537084399],[75.4305200341006, 302.26086956521743],[71.12020460358056, 301.9914748508099],[67.34867860187553, 300.9138959931799],[63.307757885763, 299.2975277067349],[58.99744245524297, 298.21994884910487],[55.22591645353794, 296.8729752770674],[51.993179880647915, 295.2566069906223],[47.952259164535384, 293.9096334185848],[44.450127877237854, 291.4850809889173],[40.947996589940324, 289.5993179880648],[37.7152600170503, 287.17476555839727],[33.94373401534527, 284.75021312872974],[31.788576300085253, 282.3256606990622],[30.17220801364024, 280.70929241261723],[28.82523444160273, 278.5541346973572],[27.47826086956522, 275.5907928388747],[26.13128729752771, 272.62745098039215],[25.592497868712705, 268.8559249786871],[25.592497868712705, 264.2762148337596],[25.592497868712705, 56.57289002557545],[25.3231031543052, 52.80136402387042],[25.861892583120206, 49.02983802216539],[27.20886615515772, 45.52770673486786],[28.82523444160273, 42.56436487638534],[30.710997442455245, 40.13981244671782],[32.86615515771526, 37.7152600170503],[35.290707587382784, 35.56010230179028],[37.9846547314578, 33.135549872122766],[40.67860187553283, 31.24978687127025],[43.372549019607845, 29.63341858482523],[46.33589087809037, 28.017050298380223],[49.29923273657289, 26.670076726342714],[53.34015345268543, 25.0537084398977],[56.84228473998295, 23.976129582267692],[60.34441602728048, 22.62915601023018],[64.65473145780051, 21.55157715260017],[68.15686274509804, 20.743393009377666],[71.92838874680308, 19.665814151747657],[76.2387041773231, 19.127024722932653],[80.81841432225065, 18.85763000852515],[84.85933503836317, 18.58823529411765],[88.90025575447571, 18.049445865302644],[94.28815004262574, 17.78005115089514],[98.86786018755329, 17.78005115089514],[103.44757033248082, 17.78005115089514],[107.48849104859336, 18.04944586530264],[111.26001705029839, 18.58823529411765],[115.03154305200341, 19.12702472293265],[118.80306905370844, 19.66581415174765],[122.57459505541348, 20.20460358056266],[126.34612105711851, 20.47399829497016],[129.84825234441604, 21.55157715260017],[133.08098891730606, 22.62915601023018],[136.58312020460357, 23.70673486786018],[139.81585677749362, 24.51491901108269],[143.58738277919863, 26.13128729752771],[147.62830349531117, 28.01705029838022],[151.9386189258312, 29.902813299232736],[155.44075021312875, 32.32736572890025],[158.40409207161127, 34.75191815856777],[162.1756180733163, 37.4458653026428],[164.60017050298381, 40.67860187553283],[166.75532821824382, 43.91133844842285],[167.83290707587383, 46.87468030690537],[168.64109121909635, 50.3768115942029],[168.91048593350385, 56.84228473998295],[168.91048593350385, 269.1253196930946],[168.10230179028133, 272.8968456947996],[166.48593350383632, 276.9377664109122],[164.33077578857632, 279.9011082693947],[161.6368286445013, 282.86445012787726],[159.21227621483376, 285.5583972719523],[155.97953964194375, 287.9829497016198],[152.4774083546462, 290.1381074168798],[148.97527706734869, 292.5626598465473],[145.20375106564364, 294.4484228473998],[140.8934356351236, 296.06479113384484],[136.8525149190111, 297.6811594202899],[132.27280477408357, 299.0281329923273],[128.23188405797103, 300.1057118499574],[123.92156862745098, 301.1832907075874],[118.26427962489345, 301.9914748508099],[113.6845694799659, 302.7996589940324],[108.56606990622336, 303.3384484228474],[103.98635976129583, 303.8772378516624],[98.86786018755329, 303.8772378516624],[93.47996589940324, 303.6078431372549],[88.3614663256607, 303.6078431372549],[83.24296675191816, 303.3384484228474],[79.74083546462063, 303.0690537084399],[75.4305200341006, 302.26086956521743],[71.12020460358056, 301.9914748508099],[67.34867860187553, 300.9138959931799],[63.307757885763, 299.2975277067349],[58.99744245524297, 298.21994884910487],[55.22591645353794, 296.8729752770674],[51.993179880647915, 295.2566069906223],[47.952259164535384, 293.9096334185848],[44.450127877237854, 291.4850809889173],[40.947996589940324, 289.5993179880648],[37.7152600170503, 287.17476555839727],[33.94373401534527, 284.75021312872974],[31.788576300085253, 282.3256606990622],[30.17220801364024, 280.70929241261723],[28.82523444160273, 278.5541346973572],[27.47826086956522, 275.5907928388747],[26.13128729752771, 272.62745098039215],[25.592497868712705, 268.8559249786871],[25.592497868712705, 264.2762148337596],[25.592497868712705, 56.57289002557545]];

// Series of functions to perform gaussian elimination
function GaussianElimination(A,b){
  // function disp(M, msg) {
  //     console.log("======" + msg + "=========")
  //     for(var k=0; k<M.length; ++k) {
  //       console.log(M[k]);
  //     }
  //     console.log("==========================")
  // }
    
  function diagonalize(M) {
      var m = M.length;
      var n = M[0].length;
      for(var k=0; k<Math.min(m,n); ++k) {
        // Find the k-th pivot
        i_max = findPivot(M, k);
        if (A[i_max, k] == 0)
          throw "matrix is singular";
        swap_rows(M, k, i_max);
        // Do for all rows below pivot
        for(var i=k+1; i<m; ++i) {
          // Do for all remaining elements in current row:
          var c = A[i][k] / A[k][k];
          for(var j=k+1; j<n; ++j) {
            A[i][j] = A[i][j] - A[k][j] * c;
          }
          // Fill lower triangular matrix with zeros
          A[i][k] = 0;
        }
      }
  }
    
  function findPivot(M, k) {
      var i_max = k;
      for(var i=k+1; i<M.length; ++i) {
        if (Math.abs(M[i][k]) > Math.abs(M[i_max][k])) {
          i_max = i;
        }
      }
      return i_max;
  }
    
  function swap_rows(M, i_max, k) {
      if (i_max != k) {
        var temp = A[i_max];
        A[i_max] = A[k];
        A[k] = temp;
      }
  }
    
  function makeM(A, b) {
      for(var i=0; i<A.length; ++i) {
        A[i].push(b[i]);
      }
  }
    
  function substitute(M) {
      var m = M.length;
      for(var i=m-1; i>=0; --i) {
        var x = M[i][m] / M[i][i];
        for(var j=i-1; j>=0; --j) {
          M[j][m] -= x * M[j][i];
          M[j][i] = 0;
        }
        M[i][m] = x;
        M[i][i] = 1;
      }
  }
    
  function extractX(M) {
      var x = [];
      var m = M.length;
      var n = M[0].length;
      for(var i=0; i<m; ++i){
        x.push(M[i][n-1]);
      }
      return x;
  }
    
  function solve(A, b) {
      //disp(A, "A");
      makeM(A,b);
      //disp(A, "M");
      diagonalize(A);
      //disp(A, "diag");
      substitute(A);
      //disp(A, "subst");
      var x = extractX(A);
      //disp(x, "x");
      return x;
  }
  let x = solve(A,b)
  return(x)
}
//// ATTEMPTED SOL 2 \\\\

// Evaluate the error then pick one variable and iterate the value until local minima in error has been found
  // Move onto another variable iterate again until local minima is found
  // Repeat until the absolute error reaches some threshold
  // while(error > limit && count < 1000){ 
  //   L = x0[0]; V = 10 - L; t = x0[1]; x = x0[2]; y = x0[3];
  //   error = (eq1(HF1,HF2,L,V,t,x,y)**2 + eq2(L,V)**2 + eq3(x,L,y,V)**2 + eq4(x,t,y)**2 + eq5(x,t,y)**2)**(1/2); // L2 norm
  //   let test1 = true; let test2 = true;
  // let iterVar = 0; // Will range between 0 and 3
  // let direction = 1; // 1 or -1, used to change iteration value (if == -1 then forward and backwards have been tested -> move onto next variable)
  // let count = 0;
  // let limit = .1; // Value used to stop iteration
  //   // Iterating chosen variable
  //   if(error < errorStored && direction == 1 && iterVar < 4){ // Decreased value in error (positive iteration)
  //     errorStored = error; test2 = false;
  //   } else if (error > errorStored && direction == 1 && iterVar < 4){ // Increased value in error
  //     direction = -1; // Changing direction to negative
  //     x0[iterVar] = x0[iterVar] + direction*dx[iterVar];
  //   } else if (error < errorStored && direction == -1 && iterVar < 4){ // Decreased value in error (negative iteration)
  //     errorStored = error; test2 = false;
  //   } else if (error > errorStored && direction == -1 && iterVar < 4){ // Increased value in error (negative direction)
  //     iterVar++; direction = 1; // Changing variable to iterate and returing direction to positive
  //     test1 = false; // Used to prevent wrong variable being iterated after this
  //   }

  //   if(error > limit && test1 && iterVar < 4 && !test2){
  //     x0[iterVar] = x0[iterVar] + direction*dx[iterVar];
  //   }
  //   // Resets the iteration variable
  //   if(iterVar == 4 && !test1){
  //     iterVar = 0;
  //   }

  //   // For refining step size
  //   if(iterVar == 0){
  //     counts[0] = counts[iterVar] + 1;
  //     if(counts[0]%20 == 0){
  //       dx[0] = dx[0]/1.5;
  //     }
  //   } else if (iterVar == 1){
  //     counts[1] = counts[iterVar] + 1;
  //     if(counts[1]%20 == 0){
  //       dx[1] = dx[1]/1.5;
  //     }
  //   } else if (iterVar == 2){
  //     counts[2] = counts[iterVar] + 1;
  //     if(counts[2]%20 == 0){
  //       dx[2] = dx[2]/1.5;
  //     }
  //   } else if (iterVar == 3){
  //     counts[3] = counts[iterVar] + 1;
  //     if(counts[3]%20 == 0){
  //       dx[3] = dx[3]/1.5;
  //     }
  //   }

  //   //For resetting values when they exceed their bounds and the respective step size
  //   if(x0[0] < 0 || x0[0] > 10){
  //     x0[0] = 5; counts[0] = 0;
  //     dx[0] = .5;
  //   } else if (x0[1] < 33 || x0[1] > 143){
  //     x0[1] = 75; counts[1] = 0;
  //     dx[1] = 5;
  //   } else if (x0[2] < 0 || x0[2] > 1){
  //     x0[2] = .5; counts[2] = 0;
  //     dx[2] = .01;
  //   } else if (x0[3] < 0 || x0[3] > 1){
  //     x0[3] = .5; counts[3] = 0;
  //     dx[3] = .01;
  //   }

  //   count++;
  // }
  // console.log(count,[L,V,t,x,y])


//// ATTEMPTED SOLUTION \\\\

// Constructing the jacobian
// df1/dL, df1/dV, df1/dt, df1/dx, df1/dy
// [g.cpL2*(g.Tref-t)*(x-1) - g.cpL1*x*(g.Tref-t), y*(g.dHvap1-g.cpV1*(g.Tref-t))- (y-1)*(g.dHvap2 - g.cpV2*(g.Tref-t)), g.cpL1*L*x + g.cpV1*V*y - g.cpL2*L*(1-x) - g.cpV2*V*(1-y), g.cpL2*L*(g.Tref-t) - g.cpL1*L*(Tref-t), V*(g.dHvap1-g.cpV1*(g.Tref-t)) - V*(g.dHvap2 - g.cpV2*(g.Tref-t))]

// df2/dL, df2/dV, df2/dt, df2/dx, df2/dy
// [1,1,0,0,0]

// df3/dL, df3/dV, df3/dt, df3/dx, df3/dy
// [x,y,0,L,V]

// df4/dL, df4/dV, df4/dt, df4/dx, df4/dy
// [0,0,x*(c*Math.LN10*10**((b*(t+d)-c)/(t+d))/(a*(t+d)^2)),PsatW(t),-g.P]

// df4/dL, df4/dV, df5/dt, df5/dx, df5/dy
// [0,0,(1-x)*(e*Math.LN10*10**((f*(t+g)-e)/(t+g))/(h*(t+g)^2)),-PsatM(t),P]

 // // Starting values
  // defineICs();
  // let L, V, t, x, y;
  // //let x0 = defineICs(); // To compare the values (L, V, t, x, y)
  
  // //L = x0[0]; V = x0[1]; t = x0[2]; x = x0[3]; y = x0[4];
  // L = 5; V = 5; y = .5; x = .5; t = 100;
  // x0 = [5,5,t,x,y];

  // // Constants
  // let Tref = 25;
  // let cpL1 = .11;
  // let cpL2 = .076;
  // let cpV1 = .052;
  // let cpV2 = .034;
  // let dHvap1 = 35.3;
  // let dHvap2 = 40.656;
  // let nf = 10;

  // let count = 0;

  // // Methanol coefficients
  // let a = 750.06;
  // let b = 8.08097;
  // let c = 1582.271;
  // let d = 239.726;

  // // Water coefficients
  // let e = 750.06;
  // let f = 8.07131;
  // let g = 233.426;
  // let h = 750.06;

  // let difference = 100000; // To stop iteration
  
  // while (difference > .0001 && count < 1){
    
  //   // Define Jacobian Matrix
  //   let Jx0 = [
  //     [cpL2*(Tref-t)*(x-1) - cpL1*x*(Tref-t), y*(dHvap1-cpV1*(Tref-t)) - (y-1)*(dHvap2 - cpV2*(Tref-t)), cpL1*L*x + cpV1*V*y - cpL2*L*(1-x) - cpV2*V*(1-y), cpL2*L*(Tref-t) - cpL1*L*(Tref-t), V*(dHvap1-cpV1*(Tref-t)) - V*(dHvap2 - cpV2*(Tref-t))],
  //     [1,1,0,0,0],
  //     [x,y,0,L,V],
  //     [0,0,x*(c*Math.LN10*10**((b*(t+d)-c)/(t+d))/(a*(t+d)^2)),PsatM(t),P],
  //     [0,0,(1-x)*(e*Math.LN10*10**((f*(t+g)-e)/(t+g))/(h*(t+g)^2)),-PsatW(t),P]
  //   ];
  //   //console.log(math.inv(Jx0))
    

  //   // Fx0
  //   let Fx0 = [(x*L*cpL1*(t-Tref) + (1-x)*L*cpL2*(t-Tref) + y*V*(dHvap1 + cpV1*(t-Tref)) + (1-y)*V*(dHvap2 + cpV2*(t-Tref)) - HF1 - HF2), (L + V - nf), (x*L + y*V - z1*nf), (x*PsatM(t) - y*P), ((1-x)*PsatW(t) - (1-y)*P)];
  //   //let y0 = GaussianElimination(Jx0,Fx0);
  //   //console.log(y0)
  //   //let x1 = [x0[0]+y0[0],x0[1]+y0[1],x0[2]+y0[2],x0[3]+y0[3],x0[4]+y0[4]];
  //   let x1 = math.subtract(x0,math.multiply(Jx0,Fx0));

  //   // Redefine difference
  //   difference = ((x1[0] - x0[0])**2 + (x1[1] - x0[1])**2 + (x1[2] - x0[2])**2 + (x1[3] - x0[3])**2 + (x1[4] - x0[4])**2)**(1/2);
  //   x0 = x1;
  //   L = x0[0]; V = x0[1]; t = x0[2]; x = x0[3]; y = x0[4];

  
  //   count++;
  // }

  // return([L,V,t,x,y]);
