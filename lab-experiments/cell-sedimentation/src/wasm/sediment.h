#ifndef SEDIMENT_H
#define SEDIMENT_H

// #include <iostream>
#include <cmath>
#include "rk45.h"
#include "calcs.h"

#define HEAD_LENGTH 1002
#define PROFILE_LENGTH 1000
#define WHITE_INDEX_OFFSET 500

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

class SedimentSolver {
private:
    double head_[PROFILE_LENGTH + 2]; // extra space for top and time
    double* prof_ = head_ + 2; // profile starts after time and top
    ConcPair concs_[CONC_ARRAY_SIZE];
    RK45Solver* solver_;

public:
    SedimentSolver(double xr0, double xw0);
    ~SedimentSolver();

    void initialize(double xr0, double xw0);
    bool solve(double time);
    double* getProfilePointer();

#ifdef __EMSCRIPTEN__
    val getConcentrationView() const;
#endif
};

#endif // SEDIMENT_H