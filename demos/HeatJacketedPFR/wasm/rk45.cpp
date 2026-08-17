#include "rk45.h"

void swapPointers(double*& a, double*& b) {
    double* temp = a;
    a = b;
    b = temp;
}

RK45Result RK45Solver::solve(
        ODEFunc f,
        const double* y0,
        const size_t n,
        double t0,
        double tEnd,
        double dt,
        double dtMin,
        double dtMax,
        double atol,
        double rtol,
        double safety
) {
    if (dt < 0) dt = (tEnd - t0) / 1000.0;
    if (dtMax < 0) dtMax = std::abs(tEnd - t0) / 5.0;

    // Initialize
    double t = t0;
    double* y = new double[n];
    double* ys = new double[n];
    for (size_t i = 0; i < n; ++i) {
        y[i] = y0[i];
    }

    // First step
    double h = dt;
    double err = 1.0;
    
    // Pre allocate stage vectors and solution buffers to reuse across iterations
    double* K[7];
    for (int i = 0; i < 7; ++i) {
        K[i] = new double[n];
    }
    double* sol5 = new double[n];
    double* sol4 = new double[n];
    // For FSAL optimization
    bool has_last_k1 = false;

    // Stage pointers for readability
    double* k1 = K[0];
    double* k3 = K[2];
    double* k4 = K[3];
    double* k5 = K[4];
    double* k6 = K[5];
    double* k7 = K[6];

    while (t < tEnd) {
        // if (h != h) throw std::runtime_error("NaN in h");
        if (t + h > tEnd) h = tEnd - t;

        try {
            // Compute first stage with FSAL
            if (!has_last_k1) {
                f(t, y, k1);
                has_last_k1 = true;
            }

            // Compute all other stages
            for (int stage=1; stage<7; ++stage) {
                // Compute y for stage
                for (size_t i = 0; i < n; ++i) {
                    double a_dot_k = 0;
                    for (int j=0; j < stage; ++j) {
                        a_dot_k += A[stage][j] * K[j][i];
                    }
                    ys[i] = y[i] + h * a_dot_k;
                }
                f(t + C[stage] * h, ys, K[stage]);
                // if (VERBOSE && t == t0) std::cout << "[RK45.CPP] K[" << stage+1 << "][0]=" << K[stage][0] << std::endl;
            }

            // 5th and 4th order solutions
            for (size_t i = 0; i < n; ++i) {
                sol5[i] = y[i] + h * (b1  * k1[i] + b3  * k3[i] + b4  * k4[i] + b5  * k5[i] + b6  * k6[i] + b7  * k7[i]);
                sol4[i] = y[i] + h * (bs1 * k1[i] + bs3 * k3[i] + bs4 * k4[i] + bs5 * k5[i] + bs6 * k6[i] + bs7 * k7[i]);
            }
            // if (VERBOSE) std::cout << "[RK45] Step at t=" << t << " with h=" << h << " sol5=" << sol5[0] << " sol4=" << sol4[0] << std::endl;  

            // Error estimate
            double ssqe = 0.0;
            for (size_t i = 0; i < n; ++i) {
                double denom = atol + rtol * std::max(std::abs(y[i]), std::abs(sol5[i]));
                double sqe = std::pow((sol5[i] - sol4[i]) / denom, 2);
                ssqe += sqe;
            }
            err = std::sqrt(ssqe / n);

            // Accept step
            if (err <= 1.0) {
                t += h;
                // if (VERBOSE) std::cout << "[RK45] Accepted step to t=" << t << " with h=" << h << " (err=" << err << ")\n";
                // if (VERBOSE) std::cout << "    y[0] = " << sol5[0] << std::endl;
                // reuse sol5 as the new y by swapping to avoid allocations/copies
                // swapPointers(y, sol5);
                // Prepare k1 for next step (FSAL)
                for (size_t i = 0; i < n; ++i) {
                    y[i] = sol5[i];
                    k1[i] = k7[i];
                }
                has_last_k1 = true;
            }
            // else if (VERBOSE) {
            //     std::cout << "[RK45] Rejected step at t=" << t << " with h=" << h << " (err=" << err << ")" << std::endl;
            // }

            // Adapt timestep
            double scale = safety * std::pow(1.0 / std::max(err, 1e-10), 0.2);
            // if (scale != scale) throw std::runtime_error("NaN in h adaptation");
            h = std::min(dtMax, h * std::min(5.0, std::max(0.2, scale)));

        } catch (const std::exception& e) {
            // if (VERBOSE) std::cout << "Error at t=" << t << " with h=" << h << ": " << e.what() << std::endl;
            err = 2.0;
            h = h * 0.5;
        }

        if (h < dtMin && err > 1.0) {
            return RK45Result{ 0, t, nullptr };
            // throw std::runtime_error("Step size underflow — integration failed");
        }
    }

    // Clean up
    for (int i = 0; i < 7; ++i) {
        delete[] K[i];
    }
    delete[] sol5;
    delete[] sol4;
    delete[] ys;

    RK45Result result = {
        .length = n,
        .t = t,
        .y = y
    };
    // if (VERBOSE) std::cout << "[RK45] Integration completed at t=" << t << std::endl;

    return result;
}
