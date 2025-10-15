import numpy as np
import matplotlib.pyplot as plt

class PDESolver1D:
    def __init__(self, x_min, x_max, nx, dt, t_max, rhs_func, bc="dirichlet"):
        """
        Parameters
        ----------
        x_min, x_max : float
            Spatial domain boundaries.
        nx : int
            Number of grid points.
        dt : float
            Time step.
        t_max : float
            Maximum time to simulate.
        rhs_func : callable
            Function F(u, x, t) that defines du/dt = F(u, x, t).
        bc : str
            Boundary condition type ('dirichlet' or 'neumann').
        """
        self.x = np.linspace(x_min, x_max, nx)
        self.dx = self.x[1] - self.x[0]
        self.dt = dt
        self.t_max = t_max
        self.nt = int(t_max / dt)
        self.rhs = rhs_func
        self.bc = bc

    def apply_bc(self, u):
        if self.bc == "dirichlet":
            u[0], u[-1] = 0.0, 0.0
        elif self.bc == "neumann":
            u[0] = u[1]
            u[-1] = u[-2]
        return u

    def step(self, u, t, method="euler"):
        """Take one time step using Euler or RK4."""
        if method == "euler":
            return u + self.dt * self.rhs(u, self.x, t)
        elif method == "rk4":
            k1 = self.rhs(u, self.x, t)
            k2 = self.rhs(u + 0.5 * self.dt * k1, self.x, t + 0.5 * self.dt)
            k3 = self.rhs(u + 0.5 * self.dt * k2, self.x, t + 0.5 * self.dt)
            k4 = self.rhs(u + self.dt * k3, self.x, t + self.dt)
            return u + (self.dt / 6) * (k1 + 2*k2 + 2*k3 + k4)
        else:
            raise ValueError("Unknown method: choose 'euler' or 'rk4'")

    def solve(self, u0, method="euler", save_every=10):
        """Evolve in time from initial condition u0."""
        u = u0.copy()
        t = 0.0
        solutions = [(t, u.copy())]

        for n in range(1, self.nt + 1):
            u = self.step(u, t, method)
            u = self.apply_bc(u)
            t += self.dt

            if n % save_every == 0:
                solutions.append((t, u.copy()))

        return np.array(self.x), solutions


# Example: 1D diffusion equation du/dt = D * d²u/dx²
def diffusion_rhs(u, x, t, D=0.1):
    dx = x[1] - x[0]
    dudx2 = (np.roll(u, -1) - 2*u + np.roll(u, 1)) / dx**2
    # dudx2[0] = dudx2[-1] = 0.0  # for Dirichlet BC
    dudx = (np.roll(u, -1) - np.roll(u, 1)) / (2*dx)
    dudx[0] = dudx[-1] = 0.0  # for Neumann BC
    vs = -.5
    return D * dudx2 - vs * dudx

# Set up solver
solver = PDESolver1D(
    x_min=0, x_max=1, nx=100, dt=0.0005, t_max=2,
    rhs_func=lambda u, x, t: diffusion_rhs(u, x, t, D=0.001),
    bc="neumann"
)

# Initial condition: Gaussian pulse
x = solver.x
u0 = np.exp(-100 * (x - 0.5)**2)

# Solve
x, sol = solver.solve(u0, method="rk4", save_every=1000)

# Plot results
plt.figure()
for t, u in sol:
    plt.plot(x, u, label=f"t={t:.3f}")
plt.legend()
plt.xlabel("x")
plt.ylabel("u(x, t)")
plt.title("1D Diffusion PDE Solution")
plt.show()
