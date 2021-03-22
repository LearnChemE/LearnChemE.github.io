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
        return Math.max(0, this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T));
    },
};

window.gvs.chemicals.ethylene = {
    A : function(T) { 
        if( T < 1200 ) { return -6.387880 }
        if( T <= 6000 ) { return 106.5104 }
    },
    B: function(T) { 
        if( T < 1200 ) { return 184.4019 }
        if( T <= 6000 ) { return 13.73260 }
    },
    C: function(T) { 
        if( T < 1200 ) { return -112.9718 }
        if( T <= 6000 ) { return -2.628481 }
    },
    D: function(T) { 
        if( T < 1200 ) { return 28.49593 }
        if( T <= 6000 ) { return 0.174595 }
    },
    E: function(T) { 
        if( T < 1200 ) { return 0.315540 }
        if( T <= 6000 ) { return -26.14469 }
    },
    F: function(T) { 
        if( T < 1200 ) { return 48.17332 }
        if( T <= 6000 ) { return -35.36237 }
    },
    H: function(T) { 
        if( T < 1200 ) { return 52.46694 }
        if( T <= 6000 ) { return 52.46694 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for ethylene" };
        if( T < 298 ) { throw "Ethylene temperature below valid range" };
        if( T > 6000 ) { throw "Ethylene temperature above valid range" };
        const t = T / 1000;
        return Math.max(0, this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T));
    },
};

window.gvs.chemicals.hydrogen = {
    A : function(T) { 
        if( T < 1000 ) { return 33.066178 }
        if( T < 2500 ) { return 18.563083 }
        if( T <= 6000 ) { return 43.413560 }
    },
    B: function(T) { 
        if( T < 1000 ) { return -11.363417 }
        if( T < 2500 ) { return 12.257357 }
        if( T <= 6000 ) { return -4.293079 }
    },
    C: function(T) { 
        if( T < 1000 ) { return 11.432816 }
        if( T < 2500 ) { return -2.859786 }
        if( T <= 6000 ) { return 1.272428 }
    },
    D: function(T) { 
        if( T < 1000 ) { return -2.772874 }
        if( T < 2500 ) { return 0.268238 }
        if( T <= 6000 ) { return -0.096876 }
    },
    E: function(T) { 
        if( T < 1000 ) { return -0.158558 }
        if( T < 2500 ) { return 1.977990 }
        if( T <= 6000 ) { return -20.533862 }
    },
    F: function(T) { 
        if( T < 1000 ) { return -9.980797 }
        if( T < 2500 ) { return -1.147438 }
        if( T <= 6000 ) { return -38.515158 }
    },
    H: function(T) { 
        if( T < 1000 ) { return 0 }
        if( T < 2500 ) { return 0 }
        if( T <= 6000 ) { return 0 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for hydrogen" };
        if( T < 298 ) { throw "Hydrogen temperature below valid range" };
        if( T > 6000 ) { throw "Hydrogen temperature above valid range" };
        const t = T / 1000;
        return Math.max(0, this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T));
    },
};
