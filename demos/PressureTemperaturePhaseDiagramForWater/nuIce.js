
// Contains all the functions required for determining specific volume of ice (L/mol)
function nuIce(T,P){
    let finalAnswer;

    function pi_p_ice(p){
        return(p/611.6571);
    }

    function tau_ice(t){
        return(t/c.Tt);
    }

    function r2p_ice(p){
        return(c.r21/611.6571 + c.r22*2/611.6571*(pi_p_ice(p) - c.pi0));
    }

    function g0p_ice(p){
        let x;
        return(c.g01/611.6571 + c.g02*2/611.6571 + c.g03*3/611.6571*(pi_p_ice(p) - c.pi0)**2 + c.g04*4/611.6571*(pi_p_ice(p) - c.pi0)**3);
    }

    function g_ice(t,p){
        let x1, x2, x3;
        x1 = g0p_ice(p);
         
    }


    // Math.log(x) -> returns log base e of x
















    
    finalAnswer = g_ice(T,P)*1000*0.01801528; // molar specific volume of ice (L/mol)
    
    return(finalAnswer);
}