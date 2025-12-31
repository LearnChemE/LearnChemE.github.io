#ifndef CALCS_CPP
#define CALCS_CPP

#include <cmath>

#define CONC_ARRAY_SIZE 500
#define PROFILE_LENGTH 1000
#define WHITE_INDEX_OFFSET 500
#define SMOOTH_FILT_SIZE 5

// Physical constants (ported from calcs.ts)
constexpr double RHO_F = 0.868; // Fluid density (g/cc)
constexpr double GRAV = 981; // Gravitational acceleration (cm/s^2)
constexpr double MU_F = 2.15; // Fluid viscosity (mPa.s)

constexpr double DP_R = 275e-4; // particle diameter in cm
constexpr double DP_W = 550e-4; // particle diameter in cm
constexpr double RHO_R = 1.08; // Red cell density (g/cc)
constexpr double RHO_W = 1.00; // White cell density (g/cc)

const int TUBE_LENGTH = 305;
const int SOLVER_TIMESTEP = 20;

// Simple macros for converting volume fraction -> number concentration
#define conc_r(phi) (6.0 * (phi) / (M_PI * DP_R * DP_R * DP_R))
#define conc_w(phi) (6.0 * (phi) / (M_PI * DP_W * DP_W * DP_W))
#define phi_r(conc) ((conc) * M_PI * DP_R * DP_R * DP_R / 6.0)
#define phi_w(conc) ((conc) * M_PI * DP_W * DP_W * DP_W / 6.0)

// Settling coefficient macros
// #define settling_coeff_g(d_p, rho_p) ( ((rho_p - RHO_F) * GRAV * d_p * d_p / (18.0 * MU_F)) * 1000.0 )

constexpr double SR_G = ((RHO_R - RHO_F) * GRAV * DP_R * DP_R / (18.0 * MU_F)) * 1000.0;
constexpr double SW_G = ((RHO_W - RHO_F) * GRAV * DP_W * DP_W / (18.0 * MU_F)) * 1000.0;

const double CR_MAX = conc_r(1.0);
const double CW_MAX = conc_w(1.0);

// Particle velocity pair return type
struct Velocities {
	double red;
	double white;
};

struct ConcPair {
	double r;
	double w;
};

// For efficient moving window calculations
struct RunningWindow {
    double last;
    double curr;
    double next;
};

// Function declarations
double d_Ep(double r_conc, double w_conc);
Velocities particle_velocities(double conc_r, double conc_w);
double calc_dz(double lz);

double grad(RunningWindow y, double dx);
void rhs_adv_diff(const ConcPair y[], ConcPair out[], double dz);
void movingAverageConvolve(double* y, int n, int windowSize);
double interp(double xp, double x_lo, double x_hi, double* y, int n);
void init_ep_table();

struct ResizeResult {
	double y[PROFILE_LENGTH];
	double top;
};
double resize(double* y, double top, double lo);


#endif // CALCS_CPP