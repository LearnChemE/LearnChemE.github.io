#include "calcs.h"

#include <iostream>

// ---------- ODE right-hand side ----------
ODEFunc create_rhs_cocurrent(double r, double dH) {
    // { Ta, X, T }
    return [r, dH](double t, const double y[3], double res[3]) {
        // Unpack the state variables
        double Ta = y[0], X = y[1], T = y[2]; // K, unitless, K
        // Compute the volumetric flow rates based on the reactor radius and coolant area
        double areaFactor = M_PI * r * r / 10000; // cm^2 to m^2 conversion
        double jacketFactor = (M_PI * 4 - M_PI * r * r) / 10000; // cm^2 to m^2
        double Vdot_r = Vr * areaFactor; // m^3/s
        double Vdot_c = Vc * jacketFactor; // m^3/s

        // Compute the reaction rates
        double kf = A1 * exp(-Ef / (Rgas * T)); // 1/s
        double kr = A1 * exp(-((Ef - dH * 1000) / (Rgas * T))); // 1/s
        double rate = -(kf * Cao * (1 - X) - kr * Cao * X); // kmol/(m^3 s) conversion
        
        // State derivatives in d/dV
        double dTa = U * (2 / r) * (T - Ta) / (Vdot_c * rhoC * Cpc);
        double dX = (-rate) / (Vdot_r * Cao); // m^-3
        double dT = (rate * dH * 1000 - U * (2 / r) * (T - Ta)) / (Cpo * Vdot_r * (rhoA / MWa));

        res[0] = dTa; res[1] = dX; res[2] = dT;
    };
}

double fluxLimiter(double r, TVDMethod method) {
    if (method == TVDMethod::SUPERBEE) {
        double a = fmax(fmin(2.0 * r, 1), fmin(r, 2.0));
        return fmax(0, a);
    }
    else if (method == TVDMethod::MINMOD) {
        return fmax(0, fmin(1.0, r));
    }
    else if (method == TVDMethod::VANLEER) {
        return (r + fabs(r)) / (1.0 + fabs(r));
    }
    else { // upwind only
        return 0.0;
    }
}

/**
 * Compute the flux at a cell interface using the specified TVD method.
 * @param phi_n The value of the variable in the cell downwind of the face (next).
 * @param phi_p The value of the variable in the cell upwind of the face (previous).
 * @param phi_pp The value of the variable in the cell two cells upwind of the face (previous previous).
 * @param method The TVD method to use for flux computation.
 * @return The computed flux at the cell interface.
 */
double computeFlux(double phi_n, double phi_p, double phi_pp, TVDMethod method) {
    double r = (phi_p - phi_pp != 0) ? (phi_n - phi_p) / (phi_p - phi_pp) : 0.0;
    double limiter = fluxLimiter(r, method);
    return phi_p + 0.5 * limiter * (phi_p - phi_pp);
}

ODEFunc create_rhs_countercurrent(int N, double r, double dH, double dx) {
    // { Ta, X, T }
    return [N, r, dH, dx](double x, const double y[], double res[]) {
        // Iterate through each spatial step and compute the derivatives
        for (int i = 0; i < N; ++i) {
            double Ta = y[i * 3 + 0], X = y[i * 3 + 1], T = y[i * 3 + 2];
            double kf = A1 * exp(-Ef / (Rgas * T));
            double kr = A1 * exp(-((Ef - dH * 1000) / (Rgas * T)));
            double rate = -(kf * Cao * (1 - X) - kr * Cao * X);
            double areaFactor = M_PI * r * r / 10000;
            double jacketFactor = (M_PI * 4 - M_PI * r * r) / 10000;
            double dTa = U * (2 / r) * ((T - Ta) / (Vc * jacketFactor * rhoC)) / Cpc;
            double dX = (-rate) / (Vr * 3600 * areaFactor * (rhoA / MWa));
            double dT = (rate * dH * 1000 - U * (2 / r) * (T - Ta)) / (Cpo * Vr * 3600 * areaFactor * (rhoA / MWa));

            // Store results in the res array
            if (x > i* dx) {
                dTa = 0;
                dX = 0;
                dT = 0;
            }
            res[i * 3 + 0] = dTa; res[i * 3 + 1] = dX; res[i * 3 + 2] = dT;
        }
    };
}


/**
 * Co-current calculation class. nSteps becomes a division of time instead of space for the solver.
 */
CoCurrentCalc::CoCurrentCalc(double r, double dH, double TTAin, double tStart, double tEnd, unsigned int nSteps) : nSteps(nSteps) {
    this->rhs = create_rhs_cocurrent(r, dH);
    this->solver_ = new RK45Solver();

    // Allocate results arrays
    this->result[0] = new double[nSteps];
    this->result[1] = new double[nSteps];
    this->result[2] = new double[nSteps];

    // Save initial conditions
    this->result[0][0] = TTAin; // Initial condition for Ta
    this->result[1][0] = 0.0;   // Initial condition for X
    this->result[2][0] = 305.0; // Initial condition for T

    this->tStep = (tEnd - tStart) / (nSteps - 1);
}

CoCurrentCalc::~CoCurrentCalc() {
    delete this->solver_;
    delete[] this->result[0];
    delete[] this->result[1];
    delete[] this->result[2];
}
    
void CoCurrentCalc::solve() {
    double y0[3] = {
        this->result[0][0],
        this->result[1][0],
        this->result[2][0]
    }; // Initial conditions: Ta = TTAin, X = 0, T = 305

    for (unsigned int i = 0; i < nSteps - 1; ++i) {
        
        RK45Result res = this->solver_->solve(this->rhs, y0, 3, 0.0, tStep, 0.02, 1e-8, 4, 1e-6, 1e-3, 0.9);
        
        // Store results
        this->result[0][i+1] = res.y[0]; // Ta
        this->result[1][i+1] = res.y[1]; // X
        this->result[2][i+1] = res.y[2]; // T

        // Update initial conditions for next step
        y0[0] = res.y[0];
        y0[1] = res.y[1];
        y0[2] = res.y[2];

        delete[] res.y; // Free the result array
    }
}

double* CoCurrentCalc::getResultArray(int index) {
    if (index < 0 || index > 2) {
        // throw std::out_of_range("Index must be 0, 1, or 2.");
        index = 0;
    }
    return this->result[index];
}

/**
 * Counter current calculation class. nSteps becomes a division of space instead of time for the solver.
 */
CounterCurrentCalc::CounterCurrentCalc(double r, double dH, double TTAin, double len, unsigned int nSteps) : nSteps(nSteps) {
    this->dx = len / (nSteps - 1);
    this->rhs = create_rhs_countercurrent(nSteps, r, dH, this->dx);
    this->solver_ = new RK45Solver();

    // Allocate results arrays
    this->result[0] = new double[nSteps];
    this->result[1] = new double[nSteps];
    this->result[2] = new double[nSteps];

    // Initial conditions: Ta = TTAin, X = 0, T = 305
    for (unsigned int i = 0; i < nSteps; i++) {
        this->result[0][i] = TTAin; // Initial condition for Ta
        this->result[1][i] = 0.0; // Initial condition for X
        this->result[2][i] = 305.0; // Initial condition for T
    }

}

CounterCurrentCalc::~CounterCurrentCalc() {
    delete this->solver_;
    delete[] this->result[0];
    delete[] this->result[1];
    delete[] this->result[2];
}

void CounterCurrentCalc::solve() {
    const unsigned int N = this->nSteps;
    double* y0 = new double[3 * N];

    for (unsigned int i = 0; i < N; ++i) {
        y0[3 * i + 0] = this->result[0][i]; // Ta
        y0[3 * i + 1] = this->result[1][i]; // X
        y0[3 * i + 2] = this->result[2][i]; // T
    }
    std::cout << "CounterCurrentCalc::solve() - Initial conditions set." << std::endl;

    RK45Result res = this->solver_->solve(this->rhs, y0, 3*N, 0.0, 10, 0.02, 1e-8, 4, 1e-6, 1e-3, 0.9);
    std::cout << "CounterCurrentCalc::solve() - RK45 solver completed." << std::endl;
    delete [] y0; // Free the initial conditions array

    std::cout << "CounterCurrentCalc::solve() - Storing results." << std::endl;
    for (unsigned int i = 0; i < nSteps; ++i) {
        // Store results
        this->result[0][i] = res.y[3*i + 0]; // Ta
        this->result[1][i] = res.y[3*i + 1]; // X
        this->result[2][i] = res.y[3*i + 2]; // T

    }
    std::cout << "CounterCurrentCalc::solve() - Results stored. Clearing memory." << std::endl;
    delete[] res.y; // Free the result array
}

double* CounterCurrentCalc::getResultArray(int index) {
    if (index < 0 || index > 2) {
        // throw std::out_of_range("Index must be 0, 1, or 2.");
        index = 0;
    }
    return this->result[index];
}

// WebAssembly Bindings (Only compiles when using emcc)
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;

val CoCurrentCalc::getResultView(int idx) const {
    // std::cout << "Providing concentration view." << std::endl;
    return val(typed_memory_view(nSteps, result[idx]));
}

val CounterCurrentCalc::getResultView(int idx) const {
    // std::cout << "Providing concentration view." << std::endl;
    return val(typed_memory_view(nSteps, result[idx]));
}

val CoCurrentCalc::getTEval() const {
    // std::cout << "Providing time evaluation view." << std::endl;
    double* tEval = new double[nSteps];
    for (unsigned int i = 0; i < nSteps; ++i) {
        tEval[i] = i * tStep;
    }
    return val(typed_memory_view(nSteps, tEval));
}

val CounterCurrentCalc::getTEval() const {
    // std::cout << "Providing time evaluation view." << std::endl;
    double* tEval = new double[nSteps];
    for (unsigned int i = 0; i < nSteps; ++i) {
        tEval[i] = i * dx;
    }
    return val(typed_memory_view(nSteps, tEval));
}

EMSCRIPTEN_BINDINGS(my_class_example) {
    class_<CoCurrentCalc>("CoCurrentCalc")
        .constructor<double, double, double, double, double, unsigned int>()
        .function("solve", &CoCurrentCalc::solve)
        .function("getResultView", &CoCurrentCalc::getResultView)
        .function("getTEval", &CoCurrentCalc::getTEval);
    class_<CounterCurrentCalc>("CounterCurrentCalc")
        .constructor<double, double, double, double, unsigned int>()
        .function("solve", &CounterCurrentCalc::solve)
        .function("getResultView", &CounterCurrentCalc::getResultView)
        .function("getTEval", &CounterCurrentCalc::getTEval);
}
#endif

// Native Entry Point (Ignored by WebAssembly)
#ifndef __EMSCRIPTEN__
#include <iostream>

int main() {
    std::cout << "[Native C++] Starting native execution..." << std::endl;
    uint n = 5; // Number of steps for results storage
    
    CoCurrentCalc calc(0.6, -10.0, 290.0, 0.0, 10.0, n);
    calc.solve();
    
    // Print results
    for (uint i = 0; i < n; ++i) {
        std::cout << "tStamp " << i << ": Ta = " << calc.getResultArray(0)[i] << ", X = " << calc.getResultArray(1)[i] << ", T = " << calc.getResultArray(2)[i] << std::endl;
    }
    
    return 0;
}
#endif