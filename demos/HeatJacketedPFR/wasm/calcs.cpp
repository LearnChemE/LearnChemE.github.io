#include "calcs.h"

// ---------- ODE right-hand side ----------
ODEFunc create_rhs_cocurrent(double r, double dH) {
    // { Ta, X, T }
    return [r, dH](double t, const double y[3], double res[3]) {
        double Ta = y[0], X = y[1], T = y[2];
        double kf = A1 * exp(-Ef / (Rgas * T));
        double kr = A1 * exp(-((Ef - dH * 1000) / (Rgas * T)));
        double rate = -(kf * Cao * (1 - X) - kr * Cao * X);
        double areaFactor = M_PI * r * r / 10000;
        double jacketFactor = (M_PI * 4 - M_PI * r * r) / 10000;
        double dTa = U * (2 / r) * ((T - Ta) / (Vc * jacketFactor * rhoC)) / Cpc;
        double dX = (-rate) / (Vr * 3600 * areaFactor * (rhoA / MWa));
        double dT = (rate * dH * 1000 - U * (2 / r) * (T - Ta)) / (Cpo * Vr * 3600 * areaFactor * (rhoA / MWa));

        res[0] = dTa; res[1] = dX; res[2] = dT;
    };
}

// Co-current
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

// WebAssembly Bindings (Only compiles when using emcc)
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;

val CoCurrentCalc::getResultView(int idx) const {
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

EMSCRIPTEN_BINDINGS(my_class_example) {
    class_<CoCurrentCalc>("CoCurrentCalc")
        .constructor<double, double, double, double, double, unsigned int>()
        .function("solve", &CoCurrentCalc::solve)
        .function("getResultView", &CoCurrentCalc::getResultView)
        .function("getTEval", &CoCurrentCalc::getTEval);
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