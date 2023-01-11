// This file contains the functions for finding specific volume of water given pressure & temp and the states
function nuIce(T,P){
    let finalAnswer;

    function pi_p_ice(p){ // No imaginary components
        return(p/611.6571);
    }

    function tau_ice(t){ // No imaginary components
        return(t/c.Tt);
    }

    function r2p_ice(p){
        return(math.add(math.divide(c.r21,611.6571), math.multiply(c.r22,2/611.6571*(pi_p_ice(p) - c.pi0)))); // Has imaginary components
    }

    function g0p_ice(p){
        return(c.g01/611.6571 + c.g02*2/611.6571*(pi_p_ice(p) - c.pi0) + c.g03*3/611.6571*(pi_p_ice(p) - c.pi0)**2 + c.g04*4/611.6571*(pi_p_ice(p) - c.pi0)**3); // No imaginary components
    }

    function g_ice(t,p){ // Has imaginary components
        // ans = g0p(p) + Tt*Re[r2p(p)*{((t2-tau(t))*log(t2-tau(t)) + (t2+tau(t))*log(t2+tau(t)) - 2*t2*log(t2) - tau(t)^2/t2)}]

        let x1, x2, x3, x4;
        x1 = g0p_ice(p);
        x2 = math.multiply(math.subtract(c.t2, tau_ice(t)), math.log(math.subtract(c.t2, tau_ice(t))));
        x3 = math.multiply(math.add(c.t2, tau_ice(t)), math.log(math.add(c.t2, tau_ice(t))));
        x4 = math.subtract(math.multiply(math.multiply(2, c.t2), math.log(c.t2)), math.divide(tau_ice(t)**2,c.t2));

        let temp1, temp2, temp3, temp4;
        temp1 = math.add(x2,x3);
        temp2 = math.subtract(temp1,x4);
        temp3 = math.multiply(r2p_ice(p),temp2);
        temp4 = math.re(temp3)
        temp5 = math.multiply(c.Tt,temp4);
        temp6 = math.add(g0p_ice(p),temp5);

        return(temp6);
    }

    finalAnswer = g_ice(T,P)*1000*0.01801528; // molar specific volume of ice (L/mol)
    return(finalAnswer);
}

function nuLiquid(T,P){
    let finalAnswer;
    let IJ = [[1, 0, -2, 0.14632971213167], [2, 0, -1, -0.84548187169114], [3, 0, 0, -3.7563603672040], [4, 0, 1, 3.3855169168385], [5, 0, 2, -0.95791963387872], [6, 0, 3, 0.15772038513228], [7, 0, 4, -0.016616417199501], [8, 0, 5, 0.81214629983568*10**-3], [9, 1, -9, 0.28319080123804*10**-3], [10, 1, -7, -0.60706301565874*10**-3], [11, 1, -1, -0.18990068218419*10**-1], [12, 1, 0, -0.32529748770505*10**-1], [13, 1, 1, -0.21841717175414*10**-1], [14, 1, 3, -0.52838357969930*10**-4], [15, 2, -3, -0.47184321073267*10**-3], [16, 2, 0, -0.30001780793026*10**-3], [17, 2, 1, 0.47661393906987*10**-4], [18, 2,3, -0.44141845330846*10**-5], [19, 2, 17, -0.72694996297594*10**-15], [20, 3, -4, -0.31679644845054*10**-4], [21, 3, 0, -0.28270797985312*10**-5], [22, 3, 6, -0.85205128120103*10**-9], [23, 4, -5, -0.22425281908000*10**-5], [24, 4, -2, -0.65171222895601*10**-6], [25, 4, 10, -0.14341729937924*10**-12], [26, 5, -8, -0.40516996860117*10**-6], [27, 8, -11, -0.12734301741641*10**-8], [28, 8, -6, -0.17424871230634*10**-9], [29, 21, -29, -0.68762131295531*10**-18], [30, 23, -31, 0.14478307828521*10**-19], [31, 29, -38, 0.26335781662795*10**-22], [32, 30, -39, -0.11947622640071*10**-22], [33, 31, -40, 0.18228094581404*10**-23], [34, 32, -41, -0.93537087292458*10**-25]];
    
    function pi_p_liquid(p){
        return(p/16.53);
    }

    function tau_liquid(t){
        return(1386/t);
    }

    function gammapi_liquid(t,p){
        let sum = 0;

        for(let i = 0; i < IJ.length; i++){
            sum = sum + (-1*IJ[i][3]*IJ[i][1]*(7.1-pi_p_liquid(p))**(IJ[i][1]-1)*(tau_liquid(t)-1.222)**(IJ[i][2]));
        }
        return(sum);
    }

    function nuMass_liquid(t,p){
        return(c.R2*(t/p)*pi_p_liquid(p)*gammapi_liquid(t,p));
    }


    finalAnswer = nuMass_liquid(T,P)*0.01801528; // molar specific volume of water (L/mol)
    return(finalAnswer);
}

function nuVapor(T,P){
    let finalAnswer;
    let IJ = [[1, 1, 0, -0.17731742473213*10**-2], [2, 1, 1, -0.17834862292358*10**-1], [3, 1, 2, -0.45996013696365*10**-1], [4, 1, 3, -0.57581259083432*10**-1], [5, 1, 6, -0.50325278727930*10**-1], [6, 2, 1, -0.33032641670203*10**-4], [7, 2, 2, -0.18948987516315*10**-3], [8, 2, 4, -0.39392777243355*10**-2], [9, 2, 7, -0.43797295650573*10**-1], [10, 2,36, -0.26674547914087*10**-4], [11, 3, 0, 0.20481737692309*10**-7], [12, 3, 1, 0.43870667284435*10**-6], [13, 3, 3, -0.32277677238570*10**-4], [14,3, 6, -0.15033924542148*10**-2], [15, 3, 35, -0.40668253562649*10**-1], [16, 4, 1, -0.78847309559367*10**-9], [17, 4, 2, 0.12790717852285*10**-7], [18, 4, 3, 0.48225372718507*10**-6], [19, 5, 7, 0.22922076337661*10**-5], [20, 6, 3, -0.16714766451061*10**-10], [21, 6, 16, -0.21171472321355*10**-2], [22,6, 35, -0.23895741934104*10**2], [23, 7, 0, -0.59059564324270*10**-17], [24, 7, 11, -0.12621808899101*10**-5], [25,7, 25, -0.38946842435739*10**-1], [26, 8, 8, 0.11256211360459*10**-10], [27, 8, 36, -0.82311340897998*10**1], [28, 9, 13, 0.19809712802088*10**-7], [29, 10, 4, 0.10406965210174*10**-18], [30, 10, 10, -0.10234747095929*10**-12], [31, 10, 14, -0.10018179379511*10**-8], [32, 16, 29, -0.80882908646985*10**-10], [33, 16, 50, 0.10693031879409], [34, 18, 57, -0.33662250574171], [35, 20, 20, 0.89185845355421*10**-24], [36, 20, 35, 0.30629316876232*10**-12], [37, 20, 48, -0.42002467698208*10**-5], [38, 21, 21, -0.59056029685639*10**-25], [39, 22, 53, 0.37826947613457*10**-5], [40, 23, 39, -0.12768608934681*10**-14], [41, 24, 26, 0.73087610595061*10**-28], [42, 24, 40, 0.55414715350778*10**-16], [43, 24, 58, -0.94369707241210*10**-6]];

    function pi_p_vapor(p){
        return(p/1);
    }

    function tau_vapor(t){
        return(540/t);
    }

    function gamma_o_pi(p){
        return(1/pi_p_vapor(p));
    }

    function gamma_r_pi_vapor(t,p){
        let sum = 0;

        for(let i = 0; i < IJ.length; i++){
            sum = sum + IJ[i][3]*IJ[i][1]*(pi_p_vapor(p)**(IJ[i][1]-1))*(tau_vapor(t)-0.5)**IJ[i][2];
        }
        return(sum);
    }

    function nuMass_vapor(t,p){
        return((c.R2*t/p)*pi_p_vapor(p)*(gamma_o_pi(p)+gamma_r_pi_vapor(t,p)));
    }
    
    finalAnswer = nuMass_vapor(T,P)*0.01801528; // molar specific volume of water vapor (L/mol)
    return(finalAnswer);
}