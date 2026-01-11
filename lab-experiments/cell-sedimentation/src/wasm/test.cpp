#include <iostream>
#include <time.h>
#include "sediment.h"

void run_driver(double xr0, double xw0, double time) {
    std::cout << "[C++] Running driver with xr0=" << xr0 << ", xw0=" << xw0 << ", time=" << time << std::endl;
    // Call the sediment solver here
    SedimentSolver* solver = new SedimentSolver(xr0, xw0);
    init_ep_table();

    clock_t start = clock();
    bool status = solver->solve(time);
    clock_t end = clock();
    if (!status) {
        std::cout << "[C++] Sediment solver failed." << std::endl;
        delete solver;
        return;
    }
    double elapsed_secs = double(end - start) / CLOCKS_PER_SEC;
    std::cout << "[C++] Solver elapsed time: " << elapsed_secs << " seconds." << std::endl;

    double* prof = solver->getProfilePointer();
    std::cout << "[C++] Final concentration profile (first 10 values):" << std::endl;
    for (int i = 0; i < 10; ++i) {
        std::cout << prof[i] << " ";
    }
    std::cout << std::endl;
    delete solver;
}

int main() {
    run_driver(0.60, 0.05, 40.0);
    return 0;
}