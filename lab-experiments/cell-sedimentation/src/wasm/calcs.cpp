#include "calcs.h"
#include <stdexcept>

inline double d_Ep(double r_conc, double w_conc) {
	if (r_conc + w_conc == 0.0) return 0.0;
	double d_avg = (r_conc * DP_R + w_conc * DP_W) / (r_conc + w_conc);
	double ep = 1.0 - (r_conc + w_conc) * (1.0 - 0.4);
	if (ep >= 1.0) return 0.0;
	double powv = std::pow(1.0 - ep, -1.0/3.0);
	return d_avg * (powv - 1.0);
}

static const double INV_RHO_DIFF_R = 1.0 / (RHO_R - RHO_F);
static const double INV_RHO_DIFF_W = 1.0 / (RHO_W - RHO_F);

// build once at program init
#define EP_N 1024
static double ep_pow_table[EP_N];
static double ep_min = 1e-8;

void init_ep_table() {
    for (int i=0;i<EP_N;i++){
        double e = ep_min + (1.0 - ep_min) * i / (EP_N-1);
        ep_pow_table[i] = std::pow(e, 4.6);
    }
}

inline double ep_pow_lookup(double ep) {
    if (ep <= ep_min) return ep_pow_table[0];
    if (ep >= 1.0) return 1.0;
    double t = (ep - ep_min) / (1.0 - ep_min) * (EP_N - 1);
    int i = (int) t;
    double frac = t - i;
    return (1.0 - frac) * ep_pow_table[i] + frac * ep_pow_table[i+1];
}

inline Velocities particle_velocities(double conc_r, double conc_w) {
    double ph_r = phi_r(conc_r);
    double ph_w = phi_w(conc_w);
    if (ph_r + ph_w >= 1.0) return {0.0, 0.0};

    double conc_f = 1.0 - ph_r - ph_w;
    double rho_susp = ph_r * RHO_R + ph_w * RHO_W + conc_f * RHO_F;

    double d_ep = d_Ep(ph_r, ph_w);
    double ep_r = (d_ep > 0.0) ? 1.0 - std::pow(1.0 + d_ep / DP_R, -3.0) : 1.0;
    double ep_w = (d_ep > 0.0) ? 1.0 - std::pow(1.0 + d_ep / DP_W, -3.0) : 1.0;

    // clamp to avoid log(0) in approximations
    ep_r = std::fmax(ep_r, 1e-12);
    ep_w = std::fmax(ep_w, 1e-12);

    double vrs = SR_G * (RHO_R - rho_susp) * INV_RHO_DIFF_R * ep_pow_lookup(ep_r);
    double vws = SW_G * (RHO_W - rho_susp) * INV_RHO_DIFF_W * ep_pow_lookup(ep_w);

    double vfc = -(ph_r * vrs + ph_w * vws);
    return { vrs + vfc, vws + vfc };
}

double grad(RunningWindow y, double dx) {
	double dydx = (y.next - y.last) / 2.0 / dx;
	return dydx;
}

void shift(RunningWindow& win, double newValue) {
    win.last = win.curr;
    win.curr = win.next;
    win.next = newValue;
}

void movingAverageConvolve(double* y, int n, int windowSize) {
    if (windowSize <= 1) return; // no change

    double* result = new double[n];
    int halfWindow = windowSize / 2;

    for (int i = 0; i < n; ++i) {
        double sum = 0.0;
        for (int j = -halfWindow; j <= halfWindow; ++j) {
            int idx = i + j;
            if (idx >= 0 && idx < n) {
                sum += y[idx];
            }
            else if (idx < 0) {
                sum += y[0]; // replicate edge
            }
            else {
                sum += y[n-1]; // replicate edge
            }
        }
        result[i] = sum / windowSize;
    }

    // Copy back to original array
    for (int i = 0; i < n; ++i) {
        y[i] = result[i];
    }

    delete[] result;
}
    
double interp(double xp, double x_lo, double x_hi, double* y, int n) {
    double range = x_hi - x_lo;
    xp = (xp - x_lo) / range * (n - 1);
    int i_lo = (int)xp;
    int i_hi = i_lo + 1;
    if (i_lo < 0) return y[0];
    if (i_hi >= n) return y[n-1];
    double denom = (double)(i_hi - i_lo);
    if (denom == 0.0) return y[i_lo];

    // Linear interpolation
    double fi = y[i_lo] + (y[i_hi] - y[i_lo]) * (xp - (double)i_lo) / denom;
    return fi;
}

double calc_dz(double lz) {
    return lz / (CONC_ARRAY_SIZE - 1);
}

// void rhs_adv_diff(const ConcPair y[], ConcPair out[], double dz) {
//     // Pack Left BC in. First iteration will shift out "last" values.
//     RunningWindow crvr = { 0.0, 0.0, 0.0 };
//     RunningWindow cwvw = { 0.0, 0.0, 0.0 };
//     RunningWindow inner_dif_r = { 0.0, 0.0, 5 * y[1].r / dz };
//     RunningWindow inner_dif_w = { 0.0, 0.0, 5 * y[1].w / dz };

//     for (size_t i = 0; i < CONC_ARRAY_SIZE-2; ++i) {
//         // Unpack y
//         double cr = y[i].r;
//         double cw = y[i].w;
//         double cr_next = y[i + 1].r;
//         double cw_next = y[i + 1].w;

//         // Calculate crvr and cwvw
//         Velocities vels = particle_velocities(cr_next, cw_next);
//         shift(crvr, cr_next * vels.red);
//         shift(cwvw, cw_next * vels.white);

//         // Use to calculate advection terms
//         double adv_r = grad(crvr, dz);
//         double adv_w = grad(cwvw, dz);

//         // Calculate inner diffusion terms
//         RunningWindow cr_next_3 = { cr, cr_next, y[i + 2].r };
//         RunningWindow cw_next_3 = { cw, cw_next, y[i + 2].w };
//         double dr_next = grad(cr_next_3, dz);
//         double dw_next = grad(cw_next_3, dz);
//         shift(inner_dif_r, 5 * dr_next * std::pow((1.0 - cr_next / CR_MAX), 10));
//         shift(inner_dif_w, 5 * dw_next * std::pow((1.0 - cw_next / CW_MAX), 10));
//         double dif_r = grad(inner_dif_r, dz);
//         double dif_w = grad(inner_dif_w, dz);

//         // Combine to get rhs
//         out[i].r = -adv_r + dif_r;
//         out[i].w = -adv_w + dif_w;
//     }
//     out[0].r = 0.0;
//     out[0].w = 0.0;
//     // Compute second to last point (i = CONC_ARRAY_SIZE - 2)
//     shift(crvr, 0.0);
//     shift(cwvw, 0.0);
//     shift(inner_dif_r, 0);
//     shift(inner_dif_w, 0);
//     double adv_r = grad(crvr, dz);
//     double adv_w = grad(cwvw, dz);
//     double dif_r = (inner_dif_r.next - inner_dif_r.last) / 2 / dz;
//     double dif_w = (inner_dif_w.next - inner_dif_w.last) / 2 / dz;
//     out[CONC_ARRAY_SIZE - 2].r = -adv_r + dif_r;
//     out[CONC_ARRAY_SIZE - 2].w = -adv_w + dif_w;

//     // Last element
//     out[CONC_ARRAY_SIZE - 1].r = out[CONC_ARRAY_SIZE - 2].r;
//     out[CONC_ARRAY_SIZE - 1].w = out[CONC_ARRAY_SIZE - 2].w;
// }

#define PAD_SIZE 2

void rhs_adv_diff(const ConcPair y[], ConcPair out[], double dz) {
    // // Pack Left BC in. First iteration will shift out "last" values.
    ConcPair y_padded[CONC_ARRAY_SIZE + 2 * PAD_SIZE];
    ConcPair cv_arr[CONC_ARRAY_SIZE + 2];
    ConcPair inner_dif_arr[CONC_ARRAY_SIZE + 2];

    // Pad y with BCs
    y_padded[0] = {0.0, 0.0};
    y_padded[1] = {0.0, 0.0};
    for (int i = 0; i < CONC_ARRAY_SIZE; ++i) {
        y_padded[i + PAD_SIZE] = y[i];
    }
    y_padded[CONC_ARRAY_SIZE + PAD_SIZE] = {0.0, 0.0};
    y_padded[CONC_ARRAY_SIZE + PAD_SIZE + 1] = {0.0, 0.0};

    // First stage: Calculate all cv values and inner diffusion terms.
    // #pragma omp parallel for
    for (int i = 0; i < CONC_ARRAY_SIZE; ++i) {
        int idx = i + PAD_SIZE; // account for padding

        double cr = y_padded[idx].r;
        double cw = y_padded[idx].w;

        // Calculate crvr and cwvw
        Velocities vels = particle_velocities(cr, cw);
        cv_arr[i + 1] = { cr * vels.red, cw * vels.white };

        // Calculate inner diffusion terms
        double dr = 5.0 * (y_padded[idx + 1].r - y_padded[idx - 1].r) / (2 * dz) * std::pow(1.0 - cr / CR_MAX, 10);
        double dw = 5.0 * (y_padded[idx + 1].w - y_padded[idx - 1].w) / (2 * dz) * std::pow(1.0 - cr / CR_MAX, 10);
        inner_dif_arr[i + 1] = { dr, dw };
    }

    // Pad cv_arr and inner_dif_arr for BCs
    cv_arr[0] = {0.0, 0.0};
    cv_arr[1] = {0.0, 0.0};
    cv_arr[CONC_ARRAY_SIZE] = {0.0, 0.0};
    cv_arr[CONC_ARRAY_SIZE + 1] = {0.0, 0.0};

    inner_dif_arr[0] = {0.0, 0.0};
    // inner_dif_arr[1] = { 5 * y[0].r / dz, 5 * y[0].w / dz };
    inner_dif_arr[CONC_ARRAY_SIZE] = { 0, 0 };
    inner_dif_arr[CONC_ARRAY_SIZE + 1] = {0.0, 0.0};

    // Second stage: Calculate advection and diffusion gradients and combine.
    for (int i = 0; i < CONC_ARRAY_SIZE; ++i) {
        // int y_idx = i + PAD_SIZE; // account for padding
        int cv_idx = i + 1; // account for cv_arr padding

        // Advection gradients
        double adv_r = (cv_arr[cv_idx + 1].r - cv_arr[cv_idx - 1].r) / (2 * dz);
        double adv_w = (cv_arr[cv_idx + 1].w - cv_arr[cv_idx - 1].w) / (2 * dz);

        // Diffusion gradients
        double dif_r = (inner_dif_arr[cv_idx + 1].r - inner_dif_arr[cv_idx - 1].r) / (2 * dz);
        double dif_w = (inner_dif_arr[cv_idx + 1].w - inner_dif_arr[cv_idx - 1].w) / (2 * dz);

        // Combine to get rhs
        out[i].r = -adv_r + dif_r;
        out[i].w = -adv_w + dif_w;
    }

    out[0] = { 0, 0 };
    out[CONC_ARRAY_SIZE - 1] = out[CONC_ARRAY_SIZE - 2];
}

double resize(double* y, double top, double lo) {
	double cr[CONC_ARRAY_SIZE];
	double cw[CONC_ARRAY_SIZE];
    for (size_t i = 0; i < CONC_ARRAY_SIZE; ++i) {
        cr[i] = y[i];
        cw[i] = y[i + CONC_ARRAY_SIZE];
    }

    double lz = 305 - top;
	int min_idx = -1;
	double sum = 0.0;
    double min_z = top;
	for (size_t i = 0; i < CONC_ARRAY_SIZE; ++i) {
        double zi = (double)i / (double)(CONC_ARRAY_SIZE - 1) * lz + top;
		double ph = phi_r(cr[i]) + phi_w(cw[i]);
		sum += ph;
		if (sum < lo) {
            min_idx = (int)i;
            min_z = zi; // store the actual z value at min_idx. Eventually return as new top
        }
		else if (sum >= 2.0 * lo) break;
	}
	if (min_idx == -1) return min_z; // no resizing needed

    double nlz = 305 - min_z;
    // Resize concentration profiles
	for (size_t i = 0; i < CONC_ARRAY_SIZE; ++i) {
        double z_new = (double)i / (double)(CONC_ARRAY_SIZE - 1) * nlz + min_z;
        double cr_new = interp(z_new, top, 305.0, cr, CONC_ARRAY_SIZE);
        double cw_new = interp(z_new, top, 305.0, cw, CONC_ARRAY_SIZE);
        y[i] = cr_new;
        y[i + CONC_ARRAY_SIZE] = cw_new;
    }

	return min_z;
}

