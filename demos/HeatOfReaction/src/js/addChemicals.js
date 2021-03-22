window.gvs.chemicals.acetylene = {
    A : function(T) { 
        if( T < 1100 ) { return 40.68697 }
        if( T <= 6000 ) { return 67.47244 }
    },
    B: function(T) { 
        if( T < 1100 ) { return 40.73279 }
        if( T <= 6000 ) { return 11.75110 }
    },
    C: function(T) { 
        if( T < 1100 ) { return -16.17840 }
        if( T <= 6000 ) { return -2.021470 }
    },
    D: function(T) { 
        if( T < 1100 ) { return 3.669741 }
        if( T <= 6000 ) { return 0.136195 }
    },
    E: function(T) { 
        if( T < 1100 ) { return -0.658411 }
        if( T <= 6000 ) { return -9.806418 }
    },
    F: function(T) { 
        if( T < 1100 ) { return 210.7067 }
        if( T <= 6000 ) { return 185.455 }
    },
    H: function(T) { 
        if( T < 1100 ) { return 226.7314 }
        if( T <= 6000 ) { return 226.7314 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for acetylene" };
        if( T < 298 ) { throw "Acetylene temperature below valid range" };
        if( T > 6000 ) { throw "Acetylene temperature above valid range" };
        const t = T / 1000;
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T) - this.H(T);
    },
};

window.gvs.chemicals.ethylene = {

};

window.gvs.chemicals.hydrogen = {

};
