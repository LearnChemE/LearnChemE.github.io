
#ifndef RK45_CPP
#define RK45_CPP

#define RK45_VERBOSE true

#ifdef RK45_VERBOSE
#define VERBOSE true
#else
#define VERBOSE false
#endif

#include <cmath>
#include <functional>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#endif

typedef std::function<void(double, const double[], double[])> ODEFunc;

struct RK45Result {
    size_t length;
    double t;
    double* y;
};

struct RK45Options {
    double dt;
    double atol;
    double rtol;
    double dtMin;
    double dtMax;
    double safety;
};

void swapPointers(double*& a, double*& b);

class RK45Solver {
    private:
        // Dormand-Prince coefficients
        static constexpr double C[7] = { 0, 1.0/5.0, 3.0/10.0, 4.0/5.0, 8.0/9.0, 1.0, 1.0 };
        // A is stored so that A[stage][j] gives the coefficient for stage (1..6)
        // include a leading zero-row so stages map directly to indices used
        static constexpr double A[7][6] = {
            { 0, 0, 0, 0, 0, 0 },
            { 1.0/5.0, 0, 0, 0, 0, 0 },
            { 3.0/40.0, 9.0/40, 0, 0, 0, 0 },
            { 44.0/45.0,  -56.0/15.0,  32.0/9.0, 0, 0, 0 },
            { 19372.0/6561.0,  -25360.0/2187.0,  64448.0/6561.0,  -212.0/729.0, 0, 0 },
            { 9017.0/3168.0,  -355.0/33.0,  46732.0/5247.0,  49.0/176.0,  -5103.0/18656.0, 0 },
            { 35.0/384.0,       0,  500.0/1113.0,  125.0/192.0,  -2187.0/6784.0,  11.0/84.0 }
        };

        static constexpr double b1 = 35.0/384.0, b3 = 500.0/1113.0, b4 = 125.0/192.0, b5 = -2187.0/6784.0, b6 = 11.0/84.0, b7 = 0.0;
        static constexpr double bs1 = 5179.0/57600.0, bs3 = 7571.0/16695.0, bs4 = 393.0/640.0, bs5 = -92097.0/339200.0, bs6 = 187.0/2100.0, bs7 = 1.0/40.0;

    public:
        static RK45Result solve(
            ODEFunc f,
            const double* y0,
            const size_t n,
            double t0,
            double tEnd,
            double dt = 0.02,
            double dtMin = 1e-8, // minimum timestep.
            double dtMax = 4, // maximum timestep. Recommended to keep this below (tEnd - t0)/10 to avoid huge jumps.
            double atol = 1e-6,
            double rtol = 1e-3,
            double safety = 0.9
        );
};

#endif