#include "sediment.h"

SedimentSolver::SedimentSolver(double xr0, double xw0) {
    initialize(xr0, xw0);
    init_ep_table();
    solver_ = new RK45Solver();
}

SedimentSolver::~SedimentSolver() {
    delete solver_;
}

void SedimentSolver::initialize(double xr0, double xw0) {
    head_[0] = 0; // initial time
    head_[1] = 0; // top coordinate
    double cr0 = conc_r(xr0);
    double cw0 = conc_w(xw0);
    
    // Initialize red concentration profile
    for (int i = 0; i < CONC_ARRAY_SIZE; ++i) {
        concs_[i].r = cr0;
        concs_[i].w = cw0;
    }
    for (int i = 0; i < WHITE_INDEX_OFFSET; ++i) {
        prof_[i] = xr0; // TODO: use conc
    }
    // Initialize white concentration profile
    for (int i = WHITE_INDEX_OFFSET; i < PROFILE_LENGTH; ++i) {
        prof_[i] = xw0; // TODO: use conc
    }
}

bool SedimentSolver::solve(double time) {
    // std::cout << "Starting sediment solver for time=" << time << "..." << std::endl;

    // Define ODE function
    double lz = 305.0 - head_[1];
    double dz = calc_dz(lz);
    ODEFunc f = [dz](double t, const double* y, double* result) {
        // Call rhs_adv_diff from calcs.cpp
        rhs_adv_diff((const ConcPair*)y, (ConcPair*)result, dz);
    };

    ConcPair y0[PROFILE_LENGTH];
    // double res_y[PROFILE_LENGTH]; // to hold rC y[],esult (temp)
    y0[0] = {0, 0}; // Free surface BC
    for (int i = 1; i < PROFILE_LENGTH; ++i) {
        y0[i] = { conc_r(prof_[i]), conc_w(prof_[i + WHITE_INDEX_OFFSET])};
    }
    y0[WHITE_INDEX_OFFSET] = {0, 0}; // Free surface BC for white cells
    // f(0.0, y0, res_y); // test call to ensure f works
    RK45Result res = solver_->solve(
        f,
        (const double*)y0,
        PROFILE_LENGTH,
        0.0,
        time,
        0.02, // initial dt
        1e-8, // dtMin
        4.0  // dtMax
    );

    if (res.y == nullptr) {
        // std::cout << "Sediment solver failed." << std::endl;
        return false;
    }
    ConcPair* final_conc = (ConcPair*)res.y;

    // Update profile with final concentrations
    for (size_t i = 0; i < CONC_ARRAY_SIZE; ++i) {
        prof_[i] = final_conc[i].r;
        prof_[i + WHITE_INDEX_OFFSET] = final_conc[i].w;
    }
    delete[] res.y;

    // Smooth profile to avoid numerical artifacts
    movingAverageConvolve(prof_, CONC_ARRAY_SIZE, SMOOTH_FILT_SIZE);
    movingAverageConvolve(prof_ + WHITE_INDEX_OFFSET, CONC_ARRAY_SIZE, SMOOTH_FILT_SIZE);

    for (size_t i = 0; i < CONC_ARRAY_SIZE; ++i) {
        prof_[i] = phi_r(prof_[i]);
    }
    for (size_t i = WHITE_INDEX_OFFSET; i < WHITE_INDEX_OFFSET + CONC_ARRAY_SIZE; ++i) {
        prof_[i] = phi_w(prof_[i]);
    }

    // Resize profile and update top coordinate
    double new_top = resize(prof_, head_[1], 1e-8);
    head_[1] = new_top;
    head_[0] += time; // update time
    // std::cout << "Sediment solver completed." << std::endl;

    return true;
}


double* SedimentSolver::getProfilePointer() {
    return head_;
}

#ifdef __EMSCRIPTEN__
val SedimentSolver::getConcentrationView() const {
    // std::cout << "Providing concentration view." << std::endl;
    return val(typed_memory_view(HEAD_LENGTH, head_));
}

EMSCRIPTEN_BINDINGS(sediment_module) {
    class_<SedimentSolver>("SedimentSolver")
        .constructor<double, double>()
        .function("initialize", &SedimentSolver::initialize)
        .function("solve", &SedimentSolver::solve)
        .function("getConcentrationView", &SedimentSolver::getConcentrationView);
}
#endif