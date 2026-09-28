#ifndef CALCS
#define CALCS

#include "rk45.h"
// #include <iostream> // Debug only

// ---------- Physical constants (fixed) ----------
double Cpc = 4.185;      // kJ/(kg K), coolant heat capacity
double U = 300.0 / 3600;        // kJ/(m^2 s K)
double Cao = 15.0;       // kmol/m^3
double Cpo = 159.0;      // kJ/(kmol K)
double rhoC = 1000.0;    // kg/m^3
double Vc = 800.0 / 3600;       // m/s
double Vr = 3.4;         // m/s (reactant velocity)
double rhoA = 600.0;     // kg/m^3
double MWa = 58.12;      // kg/kmol
double Ef = 40000.0;     // J/mol
double Rgas = 8.314;     // J/(mol K)
double A1 = 1.0e6 / 3600;       // 1/hr

double Vmax = 5.0;       // m^3, reactor volume span

ODEFunc create_rhs_cocurrent(double r, double dH);

enum class TVDMethod {
    UPWIND = 0,
    SUPERBEE = 1,
    MINMOD = 2,
    VANLEER = 3
};

class CoCurrentCalc {
    public:
        CoCurrentCalc(double r, double dH, double TTAin, double tStart, double tEnd, unsigned int nSteps);
        ~CoCurrentCalc();
        
        void solve();

        // Native only
        double* getResultArray(int index); // 0: Ta, 1: X, 2: T

    #ifdef __EMSCRIPTEN__
        emscripten::val getResultView(int idx) const;
        emscripten::val getTEval() const;
    #endif
        
    private:
        ODEFunc rhs;
        RK45Solver* solver_;
        
        // results storage for WebAssembly
        double* result[3]; // 0: Ta, 1: X, 2: T
        double tStep; // time step for results storage
        unsigned int nSteps; // number of steps for results storage
};

class CounterCurrentCalc {
    public:
        CounterCurrentCalc(double r, double dH, double TTAin, double len, unsigned int nSteps);
        ~CounterCurrentCalc();
        
        void solve();

        // Native only
        double* getResultArray(int index); // 0: Ta, 1: X, 2: T

    #ifdef __EMSCRIPTEN__
        emscripten::val getResultView(int idx) const;
        emscripten::val getTEval() const;
    #endif
        
    private:
        ODEFunc rhs;
        RK45Solver* solver_;
        
        // results storage for WebAssembly
        double* result[3]; // 0: Ta, 1: X, 2: T
        double dx; // space step for results storage
        unsigned int nSteps; // number of steps for results storage
};

#endif