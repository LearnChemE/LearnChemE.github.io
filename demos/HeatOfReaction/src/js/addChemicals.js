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
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
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
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
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
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
    },
};

window.gvs.chemicals.methane = {
    A : function(T) { 
        if( T < 1300 ) { return -0.703029 }
        if( T <= 6000 ) { return 85.81217 }
    },
    B: function(T) { 
        if( T < 1300 ) { return 108.4773 }
        if( T <= 6000 ) { return 11.26467 }
    },
    C: function(T) { 
        if( T < 1300 ) { return -42.52157 }
        if( T <= 6000 ) { return -2.114146 }
    },
    D: function(T) { 
        if( T < 1300 ) { return 5.862788 }
        if( T <= 6000 ) { return 0.138190 }
    },
    E: function(T) { 
        if( T < 1300 ) { return 0.678565 }
        if( T <= 6000 ) { return -26.42221 }
    },
    F: function(T) { 
        if( T < 1300 ) { return -76.84376 }
        if( T <= 6000 ) { return -153.5327 }
    },
    H: function(T) { 
        if( T < 1300 ) { return -74.87310 }
        if( T <= 6000 ) { return -74.87310 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for methane" };
        if( T < 298 ) { throw "Methane temperature below valid range" };
        if( T > 6000 ) { throw "Methane temperature above valid range" };
        const t = T / 1000;
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
    },
};

window.gvs.chemicals.oxygen = {
    A : function(T) { 
        if( T < 700 ) { return 31.32234 }
        if( T < 2000 ) { return 30.03235 }
        if( T <= 6000 ) { return 20.91111 }
    },
    B: function(T) { 
        if( T < 700 ) { return -20.23531 }
        if( T < 2000 ) { return 8.772972 }
        if( T <= 6000 ) { return 10.72071 }
    },
    C: function(T) { 
        if( T < 700 ) { return 57.86644 }
        if( T < 2000 ) { return -3.988133 }
        if( T <= 6000 ) { return -2.020498 }
    },
    D: function(T) { 
        if( T < 700 ) { return -36.50624 }
        if( T < 2000 ) { return 0.788313 }
        if( T <= 6000 ) { return 0.146449 }
    },
    E: function(T) { 
        if( T < 700 ) { return -0.007374 }
        if( T < 2000 ) { return -0.741599 }
        if( T <= 6000 ) { return 9.245722 }
    },
    F: function(T) { 
        if( T < 700 ) { return -8.903471 }
        if( T < 2000 ) { return -11.32468 }
        if( T <= 6000 ) { return 5.337651 }
    },
    H: function(T) { 
        if( T < 700 ) { return 0 }
        if( T < 2000 ) { return 0 }
        if( T <= 6000 ) { return 0 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for oxygen" };
        if( T < 100 ) { throw "Oxygen temperature below valid range" };
        if( T > 6000 ) { throw "Oxygen temperature above valid range" };
        const t = T / 1000;
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
    },
};

window.gvs.chemicals.water = {
    A : function(T) { 
        if( T < 500 ) { return -203.6060 }
        if( T < 1700 ) { return 30.09200 }
        if( T <= 6000 ) { return 41.96426 }
    },
    B: function(T) { 
        if( T < 500 ) { return 1523.290 }
        if( T < 1700 ) { return 6.832514 }
        if( T <= 6000 ) { return 8.622053 }
    },
    C: function(T) { 
        if( T < 500 ) { return -3196.413 }
        if( T < 1700 ) { return 6.793435 }
        if( T <= 6000 ) { return -1.499780 }
    },
    D: function(T) { 
        if( T < 500 ) { return 2474.455 }
        if( T < 1700 ) { return -2.534480 }
        if( T <= 6000 ) { return 0.098119 }
    },
    E: function(T) { 
        if( T < 500 ) { return 3.855326 }
        if( T < 1700 ) { return 0.082139 }
        if( T <= 6000 ) { return -11.15764 }
    },
    F: function(T) { 
        if( T < 500 ) { return -256.5478 }
        if( T < 1700 ) { return -250.8810 }
        if( T <= 6000 ) { return -272.1797 }
    },
    H: function(T) { 
        if( T < 500 ) { return -285.8304 }
        if( T < 1700 ) { return -241.8264 }
        if( T <= 6000 ) { return -241.8264 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for water" };
        if( T < 298 ) { throw "Water temperature below valid range" };
        if( T > 6000 ) { throw "Water temperature above valid range" };
        const t = T / 1000;
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
    },
};

window.gvs.chemicals.carbondioxide = {
    A : function(T) { 
        if( T < 1200 ) { return 24.99735 }
        if( T <= 6000 ) { return 58.16639 }
    },
    B: function(T) { 
        if( T < 1200 ) { return 55.18696 }
        if( T <= 6000 ) { return 2.720074 }
    },
    C: function(T) { 
        if( T < 1200 ) { return -33.69137 }
        if( T <= 6000 ) { return -0.492289 }
    },
    D: function(T) { 
        if( T < 1200 ) { return 7.948387 }
        if( T <= 6000 ) { return 0.038844 }
    },
    E: function(T) { 
        if( T < 1200 ) { return -0.136638 }
        if( T <= 6000 ) { return -6.447293 }
    },
    F: function(T) { 
        if( T < 1200 ) { return -403.6075 }
        if( T <= 6000 ) { return -425.9186 }
    },
    H: function(T) { 
        if( T < 1200 ) { return -393.5224 }
        if( T <= 6000 ) { return -393.5224 }
    },
    enthalpy: function(T) {
        if( typeof(T) !== "number" ) { throw "invalid temperature specified for carbon dioxide" };
        if( T < 298 ) { throw "Carbon dioxide temperature below valid range" };
        if( T > 6000 ) { throw "Carbon dioxide temperature above valid range" };
        const t = T / 1000;
        return this.A(T)*(t) + this.B(T)*(t**2) / 2 + this.C(T)*(t**3) / 3 + this.D(T)*(t**4) / 4 - this.E(T) / t + this.F(T);
    },
};