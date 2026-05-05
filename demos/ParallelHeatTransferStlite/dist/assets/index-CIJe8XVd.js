import{mount as c}from"https://cdn.jsdelivr.net/npm/@stlite/browser@1.7.2/build/stlite.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function l(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(n){if(n.ep)return;n.ep=!0;const e=l(n);fetch(n.href,e)}})();const _=`
import streamlit as st
import numpy as np
import plotly.graph_objects as go
import streamlit.components.v1 as components
# from styling import apply_page_style

st.set_page_config(page_title="Heat Loss from a Cylindrical Reactor", layout="wide")
# apply_page_style()

# Make Plotly size correctly on first paint inside Streamlit tabs/columns.
# Streamlit mounts tab contents before their final widths are fully settled, so Plotly may do an
# initial layout using a transiently small container. The result is the tiny first-render chart that
# becomes normal after any widget interaction. This script forces an early relayout whenever the page,
# tabs, or plot containers change size.
components.html(
    """
<script>
(function () {
  const w = window.parent;
  const d = w.document;

  function relayoutPlot(plotEl) {
    try {
      if (!w.Plotly || !plotEl) return;
      const holder = plotEl.closest('[data-testid="stPlotlyChart"]') || plotEl.parentElement;
      const rect = holder ? holder.getBoundingClientRect() : plotEl.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 120) return;
      if (w.Plotly.Plots && typeof w.Plotly.Plots.resize === 'function') {
        w.Plotly.Plots.resize(plotEl);
      }
      if (typeof w.Plotly.relayout === 'function') {
        w.Plotly.relayout(plotEl, {autosize: true});
      }
    } catch (e) {}
  }

  function resizeAllPlotly() {
    try {
      d.querySelectorAll('.js-plotly-plot').forEach(relayoutPlot);
    } catch (e) {}
  }

  function nudge() {
    try { w.dispatchEvent(new Event('resize')); } catch (e) {}
    resizeAllPlotly();
  }

  function burst(delays) {
    delays.forEach((t) => setTimeout(nudge, t));
  }

  function attachTabHandlers() {
    const btns = d.querySelectorAll('button[data-baseweb="tab"]');
    btns.forEach((b) => {
      if (b.dataset._plotlyResizeAttached) return;
      b.dataset._plotlyResizeAttached = '1';
      b.addEventListener('click', () => burst([0, 40, 120, 240, 500, 900]));
    });
  }

  function attachObservers() {
    try {
      const ro = new ResizeObserver(() => burst([0, 40, 120]));
      d.querySelectorAll('[data-testid="stPlotlyChart"]').forEach((el) => {
        if (el.dataset._plotlyResizeObserved) return;
        el.dataset._plotlyResizeObserved = '1';
        ro.observe(el);
      });
    } catch (e) {}

    try {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const plotEl = entry.target.querySelector('.js-plotly-plot') || entry.target;
            relayoutPlot(plotEl);
          }
        });
      }, { threshold: 0.2 });

      d.querySelectorAll('[data-testid="stPlotlyChart"], .js-plotly-plot').forEach((el) => {
        if (el.dataset._plotlyIntersectObserved) return;
        el.dataset._plotlyIntersectObserved = '1';
        io.observe(el);
      });
    } catch (e) {}
  }

  attachTabHandlers();
  attachObservers();

  const mo = new MutationObserver(() => {
    attachTabHandlers();
    attachObservers();
    burst([0, 80, 200]);
  });
  mo.observe(d.body, { childList: true, subtree: true });

  // Strong first-load relayout burst so charts open at their final size without user interaction.
  burst([0, 30, 80, 160, 320, 600, 1000, 1500, 2200]);

  try {
    let rafCount = 0;
    const tick = () => {
      nudge();
      rafCount += 1;
      if (rafCount < 20) w.requestAnimationFrame(tick);
    };
    w.requestAnimationFrame(tick);
  } catch (e) {}
})();
<\/script>
""",
    height=0,
)

PLOTLY_CONFIG = {"displayModeBar": False, "responsive": True}


# ---- Global UI polish (visual only) ----
st.markdown(
    """
<style>
/* Compact, card-like metrics (keeps Streamlit metrics, just makes them cleaner/smaller) */
div[data-testid="stMetric"]{
  padding: 0.70rem 0.85rem;
  border: 1px solid rgba(49, 51, 63, 0.18);
  border-radius: 0.85rem;
  background: rgba(255,255,255,0.75);
}
div[data-testid="stMetricLabel"] > div{
  font-size: 0.85rem;
  color: rgba(49, 51, 63, 0.75);
}
div[data-testid="stMetricValue"]{
  font-size: 1.60rem;
  line-height: 1.15;
}
/* Slightly reduce vertical whitespace in captions/headers */
div[data-testid="stCaptionContainer"]{ margin-top: -0.25rem; }
</style>
    """,
    unsafe_allow_html=True,
)


SIGMA = 5.67e-8  # Stefan–Boltzmann constant (W/m^2/K^4)

# -----------------------------
# Compact styling (avoid scroll)
# -----------------------------
st.markdown(
    """
    <style>
      .block-container { padding-top: 1.1rem; padding-bottom: 1.1rem; }
      [data-testid="stVerticalBlock"] { gap: 0.75rem; }
      [data-testid="stMetricValue"] { font-size: 1.55rem; line-height: 1.1; }
      [data-testid="stMetricLabel"] { font-size: 0.95rem; }
      h1 { font-size: 2.0rem; margin-bottom: 0.25rem; }
      h2 { font-size: 1.35rem; margin-top: 0.25rem; }
      h3 { font-size: 1.1rem; margin-top: 0.25rem; }
      .small { font-size: 0.92rem; color: #555; }
    </style>
    """,
    unsafe_allow_html=True,
)


# -----------------------------
# Compact "mini metrics" styling (shared across tabs)
# -----------------------------

DEFAULTS = {
    "L": 1.87,
    "D": 0.63,
    "Ta": 310.0,
    "Ts": 600.0,
    "Tin": 650.0,
    "eps": 0.85,
    "t": 0.05,
    "k": 0.08,
    "h": 8.0,
}


REFERENCE_VESSEL = {
    "company": "Thermo Fisher Scientific",
    "model": "HyPerforma DynaDrive 500 L Single-Use Bioreactor",
    "diameter_m": 0.63,
    "length_m": 1.87,
    "working_volume_l": 500,
    "total_volume_l": 586,
    "liquid_height_m": 1.59,
    "jacket_area_m2": 0.51,
    "reference_note": "Dimensions based on Table 6.3 of the Thermo Scientific DynaDrive S.U.B. Service Guide (500 L DynaDrive S.U.B. specifications).",
}

# Visual-only wall thickness for the schematic (does NOT change worksheet physics)
WALL_THICKNESS_VIS = 0.012  # m

# --- Visual palette (clean, vivid, no unintended gray mixing) ---
# Key change: the region circles are now drawn with *transparent fills* and vivid outlines.
# This prevents the overlay-tinting that was turning the hot-fluid region brownish and
# creating grayish edges. Temperature color is shown purely by the heatmap.
OUTLINE_COLOR = "rgba(20, 20, 20, 1.0)"        # near-black for text/anchors
INSULATION_EDGE = OUTLINE_COLOR  # boundary color (single palette)
WALL_EDGE = OUTLINE_COLOR        # boundary color (single palette)
FLUID_EDGE = OUTLINE_COLOR       # boundary color (single palette)

# Heat-flux arrows
QRAD_COLOR = "rgba(255, 92, 0, 1.0)"           # bright orange (radiation)
QCONV_COLOR = "rgba(0, 170, 255, 1.0)"         # bright cyan (convection)

TRANSPARENT = "rgba(0, 0, 0, 0.0)"

# -----------------------------
# Physics
# -----------------------------
def area_cylinder(D, L):
    return np.pi * D * L

def q_radiation(eps, A, Ts, Ta):
    return eps * SIGMA * A * (Ts**4 - Ta**4)

def solve_case_b(Tin, Ta, eps, L, D, t, k, h):
    r1 = D / 2.0
    r2 = r1 + t

    if t <= 1e-9:
        r2 = r1
        A_out = 2.0 * np.pi * r1 * L
        R_cond = 0.0
    else:
        A_out = 2.0 * np.pi * r2 * L
        R_cond = np.log(r2 / r1) / (2.0 * np.pi * L * k)

    R_conv = 1.0 / (h * A_out)

    # iterate for Tz using linearized radiation resistance
    Tz = (Tin + Ta) / 2.0
    R_rad = None
    Q = None
    for _ in range(40):
        R_rad = 1.0 / (eps * SIGMA * A_out * (Tz**2 + Ta**2) * (Tz + Ta))
        R_surf = 1.0 / (1.0 / R_conv + 1.0 / R_rad)
        R_tot = R_cond + R_surf
        Q = (Tin - Ta) / R_tot
        Tz_new = Tin - Q * R_cond
        if abs(Tz_new - Tz) < 1e-7:
            Tz = Tz_new
            break
        Tz = Tz_new

    Q_conv = (Tz - Ta) / R_conv
    Q_rad = (Tz - Ta) / R_rad

    return {
        "Q_total": float(Q),
        "Tz": float(Tz),
        "Q_conv": float(Q_conv),
        "Q_rad": float(Q_rad),
        "R_cond": float(R_cond),
        "R_conv": float(R_conv),
        "R_rad": float(R_rad),
        "A_out": float(A_out),
        "r1": float(r1),
        "r2": float(r2),
    }


def compute_reference_summary():
    """Baseline numbers using the real-world reference geometry and the homework thermal inputs."""
    A_shell = area_cylinder(DEFAULTS["D"], DEFAULTS["L"])
    case_a_qrad = q_radiation(DEFAULTS["eps"], A_shell, DEFAULTS["Ts"], DEFAULTS["Ta"])
    case_b = solve_case_b(
        DEFAULTS["Tin"],
        DEFAULTS["Ta"],
        DEFAULTS["eps"],
        DEFAULTS["L"],
        DEFAULTS["D"],
        DEFAULTS["t"],
        DEFAULTS["k"],
        DEFAULTS["h"],
    )

    target = 330.0
    t_vals = np.linspace(0.0, 0.30, 1201)
    t_minimum = None
    for t_scan in t_vals:
        out_i = solve_case_b(
            DEFAULTS["Tin"],
            DEFAULTS["Ta"],
            DEFAULTS["eps"],
            DEFAULTS["L"],
            DEFAULTS["D"],
            float(t_scan),
            DEFAULTS["k"],
            DEFAULTS["h"],
        )
        if out_i["Tz"] <= target:
            t_minimum = float(t_scan)
            break

    old_area = np.pi * 0.5 * 2.0
    new_area = A_shell

    return {
        "A_shell": float(A_shell),
        "case_a_qrad": float(case_a_qrad),
        "case_b": case_b,
        "target": float(target),
        "t_minimum": t_minimum,
        "old_area": float(old_area),
        "new_area": float(new_area),
        "area_change_pct": float(100.0 * (new_area / old_area - 1.0)),
    }

# -----------------------------
# Visuals (Plotly, hover per layer)
# -----------------------------
def _thermal_rgba_scale():
    """Minimal, textbook-style temperature scale (blue → warm → red).

    Adds a clear *cold-end blue* (as requested) while keeping the palette
    restrained (no full rainbow). This makes the radial temperature drop
    read as: cold ambient → warmer insulation → hottest fluid.
    """
    return [
        [0.00, "rgb(0, 120, 255)"],     # vivid blue (cool end)
        [0.35, "rgb(180, 230, 255)"],   # light blue transition
        [0.60, "rgb(255, 245, 210)"],   # warm cream
        [0.82, "rgb(255, 170, 80)"],    # orange
        [1.00, "rgb(240, 59, 32)"],     # vivid red (hot end)
    ]


# Cache colorscale once (used by both cross-section and vessel views)
COLORSCALE = _thermal_rgba_scale()


def _temp_and_region_cross(R, r_fluid, r_wall, r_ins, Tin, Tz, Ta):
    if R <= r_fluid:
        return Tin, "Fluid"
    if R <= r_wall:
        return Tin, "Metal wall"
    if R <= r_ins:
        if r_ins <= r_wall + 1e-12:
            return Tz, "Outer surface"
        T = Tin - (Tin - Tz) * ((R - r_wall) / (r_ins - r_wall))
        return T, "Insulation"
    return Ta, "Ambient"


# Backward-compatible alias (some parts call _temp_and_region)
def _temp_and_region(R, r_fluid, r_wall, r_ins, Tin, Tz, Ta):
    return _temp_and_region_cross(R, r_fluid, r_wall, r_ins, Tin, Tz, Ta)

def build_cross_section(
    D,
    t,
    Tin,
    Tz,
    Ta,
    Qconv=0.0,
    Qrad=0.0,
    show_colorbar=True,
    # Visual-only tuning knobs (defaults preserve prior behavior)
    range_mult=1.65,
    # Visual-only: keep the plot window from shrinking below a chosen insulation thickness.
    # This stabilizes the apparent size at first render and when t is small.
    range_t=None,
    fig_height=310,
    fig_width=None,
    arrow_y=1.40,
    arrow_ay=1.15,
    label_y=1.52,
    flux_fixed=False,
    lw_rad_fixed=9,
    lw_conv_fixed=4):
    r_wall = D / 2.0
    r_fluid = max(r_wall - WALL_THICKNESS_VIS, 0.001)
    r_ins = r_wall + max(t, 0.0)

    # Visual-only scaling radius for the plot window (do not affect physics)
    t_for_range = max(float(t), float(range_t)) if range_t is not None else float(t)
    r_ins_range = r_wall + max(t_for_range, 0.0)

    n = 220
    xs = np.linspace(-r_ins_range, r_ins_range, n)
    ys = np.linspace(-r_ins_range, r_ins_range, n)
    X, Y = np.meshgrid(xs, ys)
    R = np.sqrt(X**2 + Y**2)

    T = np.full_like(R, np.nan, dtype=float)
    region = np.full(R.shape, "", dtype=object)

    inside = R <= r_ins
    if np.any(inside):
        Ri = R[inside]
        reg = []
        ti = []
        for r in Ri:
            Tij, rg = _temp_and_region(r, r_fluid, r_wall, r_ins, Tin, Tz, Ta)
            ti.append(Tij)
            reg.append(rg)
        T[inside] = np.array(ti)
        region[inside] = np.array(reg, dtype=object)

    fig = go.Figure()

    fig.add_trace(
        go.Heatmap(
            x=xs,
            y=ys,
            z=T,
            colorscale=COLORSCALE,
            zmin=Ta,
            zmax=Tin,
            colorbar=(dict(title="Temperature (K)", len=0.78) if show_colorbar else None),
            customdata=region,
            hovertemplate="<b>%{customdata}</b><br>T=%{z:.1f} K<extra></extra>",
            showscale=show_colorbar,
            hoverongaps=False,
            zsmooth=False,
        )
    )

    # Outline boundaries
    fig.add_shape(type="circle", x0=-r_ins, y0=-r_ins, x1=r_ins, y1=r_ins,
                  fillcolor=TRANSPARENT, line=dict(color=OUTLINE_COLOR, width=3.2))
    fig.add_shape(type="circle", x0=-r_wall, y0=-r_wall, x1=r_wall, y1=r_wall,
                  fillcolor=TRANSPARENT, line=dict(color=OUTLINE_COLOR, width=2.6))
    fig.add_shape(type="circle", x0=-r_fluid, y0=-r_fluid, x1=r_fluid, y1=r_fluid,
                  fillcolor=TRANSPARENT, line=dict(color=OUTLINE_COLOR, width=2.0))

    if fig_width is None:
        fig_width = int(round(fig_height * 0.90))

    fig.update_layout(
        margin=dict(l=8, r=8, t=18, b=8),
        autosize=False,
        width=fig_width,
        xaxis=dict(visible=False, scaleanchor="y", scaleratio=1, range=[-range_mult * r_ins_range, range_mult * r_ins_range]),
        yaxis=dict(visible=False, range=[-range_mult * r_ins_range, range_mult * r_ins_range]),
        height=fig_height,
        paper_bgcolor="white",
        plot_bgcolor="white",
        hoverlabel=dict(bgcolor="white"),
    )

    Qt = max(Qconv + Qrad, 1e-12)
    if flux_fixed:
        lw_rad = float(lw_rad_fixed)
        lw_conv = float(lw_conv_fixed)
    else:
        lw_rad = 2 + 6 * (Qrad / Qt)
        lw_conv = 2 + 6 * (Qconv / Qt)

    # Move arrows/labels away from boundaries (visual only; defaults match prior)
    fig.add_annotation(x=-0.38 * r_ins, y=arrow_y * r_ins, ax=-0.38 * r_ins, ay=arrow_ay * r_ins,
                       xref="x", yref="y", axref="x", ayref="y",
                       text="", showarrow=True, arrowwidth=lw_rad, arrowhead=2, arrowcolor=QRAD_COLOR)
    fig.add_annotation(x=-0.38 * r_ins, y=label_y * r_ins, xref="x", yref="y",
                       text="Q̇rad", showarrow=False, font=dict(size=12, color=QRAD_COLOR))

    fig.add_annotation(x=0.38 * r_ins, y=arrow_y * r_ins, ax=0.38 * r_ins, ay=arrow_ay * r_ins,
                       xref="x", yref="y", axref="x", ayref="y",
                       text="", showarrow=True, arrowwidth=lw_conv, arrowhead=2, arrowcolor=QCONV_COLOR)
    fig.add_annotation(x=0.38 * r_ins, y=label_y * r_ins, xref="x", yref="y",
                       text="Q̇conv", showarrow=False, font=dict(size=12, color=QCONV_COLOR))

    return fig



# -----------------------------
# Vessel side-view schematic (capsule with insulation band)
# -----------------------------
def _capsule_distance(X, Y, a):
    """Distance from points (X,Y) to the centerline segment of a capsule.

    The capsule is a line segment from (-a, 0) to (a, 0) with circular end-caps.
    """
    Xc = np.clip(X, -a, a)
    return np.sqrt((X - Xc) ** 2 + Y ** 2)

def _capsule_outline(a, r, n=180):
    """Polyline points outlining a capsule (stadium) centered at origin.

    Plotly shape paths do not reliably support SVG arc commands across all renderers.
    This helper generates an explicit polyline for clean, deterministic outlines.
    """
    n_line = max(int(n * 0.35), 20)
    n_arc = max(int(n * 0.30), 30)

    # Bottom straight
    xb = np.linspace(-a, a, n_line, endpoint=True)
    yb = np.full_like(xb, -r)

    # Right semicircle (bottom -> top)
    th_r = np.linspace(-np.pi / 2.0, np.pi / 2.0, n_arc, endpoint=True)
    xr = a + r * np.cos(th_r)
    yr = r * np.sin(th_r)

    # Top straight
    xt = np.linspace(a, -a, n_line, endpoint=True)
    yt = np.full_like(xt, r)

    # Left semicircle (top -> bottom)
    # IMPORTANT: use angles π/2 → 3π/2 so the left end-cap bulges to the LEFT (symmetry with right end-cap).
    th_l = np.linspace(np.pi / 2.0, 3.0 * np.pi / 2.0, n_arc, endpoint=True)
    xl = -a + r * np.cos(th_l)
    yl = r * np.sin(th_l)

    x = np.concatenate([xb, xr, xt, xl, [xb[0]]])
    y = np.concatenate([yb, yr, yt, yl, [yb[0]]])
    return x, y



def build_vessel_side_view(
    D,
    t,
    Tin,
    Tz,
    Ta,
    Qconv=0.0,
    Qrad=0.0,
    show_colorbar=True,
    # Visual-only tuning knobs (defaults preserve prior behavior)
    fig_height=360,
    # Visual-only: keep the plot window from shrinking below a chosen insulation thickness.
    # This stabilizes the apparent size at first render and when t is small.
    range_t=None,
    # Visual-only: multiply the side-view length (capsule straight section) without changing physics.
    length_mult=1.0,
    xpad_frac=0.06,
    ylow=-1.25,
    yhigh=1.55,
    arrow_y=1.38,
    arrow_ay=1.18,
    label_y=1.50,
    colorbar_x=1.02,
    colorbar_y=0.50,
    margin_r=8,
    flux_style="arrows",
    flux_fixed=False,
    lw_rad_fixed=9,
    lw_conv_fixed=4):
    """Side-view vessel schematic.

    Visual-only: shows a horizontal capsule (reactor) with the same temperature
    layering logic as the cross-section view (fluid → wall → insulation → ambient).
    Does not affect any physics calculations.
    """
    r_wall = D / 2.0
    r_fluid = max(r_wall - WALL_THICKNESS_VIS, 0.001)
    r_ins = r_wall + max(t, 0.0)

    # Visual-only scaling radius for the plot window (do not affect physics)
    t_for_range = max(float(t), float(range_t)) if range_t is not None else float(t)
    r_ins_range = r_wall + max(t_for_range, 0.0)

    # Geometry of capsule
    a = 0.55 * (DEFAULTS["L"] / 2.0) * float(length_mult)  # visual-only length adjustment

    # Temperature field sampled on a grid (inside capsule only)
    nx, ny = 520, 220
    xs = np.linspace(-(a + r_ins_range), (a + r_ins_range), nx)
    ys = np.linspace(-r_ins_range, r_ins_range, ny)
    X, Y = np.meshgrid(xs, ys)

    # Convert (x,y) -> "radial distance" to capsule boundary to mimic radial layers
    # Capsule boundary defined by: distance to segment [-a,a] on x-axis, then circle of radius r_ins
    Xc = np.clip(X, -a, a)
    R = np.sqrt((X - Xc) ** 2 + Y ** 2)

    T = np.full_like(R, np.nan, dtype=float)
    region = np.full(R.shape, "", dtype=object)

    inside = R <= r_ins
    if np.any(inside):
        Ri = R[inside]
        reg = []
        ti = []
        for r in Ri:
            Tij, rg = _temp_and_region(r, r_fluid, r_wall, r_ins, Tin, Tz, Ta)
            ti.append(Tij)
            reg.append(rg)
        T[inside] = np.array(ti)
        region[inside] = np.array(reg, dtype=object)

    fig = go.Figure()
    fig.add_trace(
        go.Heatmap(
            x=xs,
            y=ys,
            z=T,
            colorscale=COLORSCALE,
            zmin=Ta,
            zmax=Tin,
            colorbar=(
                dict(
                    title="Temperature (K)",
                    len=0.78,
                    x=colorbar_x,
                    y=colorbar_y,
                    xanchor="left",
                    yanchor="middle",
                    thickness=16,
                )
                if show_colorbar
                else None
            ),
            customdata=region,
            hovertemplate="<b>%{customdata}</b><br>T=%{z:.1f} K<extra></extra>",
            showscale=show_colorbar,
            hoverongaps=False,
            zsmooth=False,
        )
    )

    # Deterministic capsule outlines (avoid SVG arc path rendering artifacts)
    for r_bnd, lw in [(r_ins, 3.2), (r_wall, 2.6), (r_fluid, 2.0)]:
        xo, yo = _capsule_outline(a, r_bnd, n=240)
        fig.add_trace(
            go.Scatter(
                x=xo,
                y=yo,
                mode="lines",
                line=dict(color=OUTLINE_COLOR, width=lw),
                hoverinfo="skip",
                showlegend=False,
            )
        )

    # Keep the vessel perfectly centered (fixed, symmetric axes)
    xpad = xpad_frac * (a + r_ins_range)
    xrange = [-(a + r_ins_range) - xpad, (a + r_ins_range) + xpad]
    yrange = [ylow * r_ins_range, yhigh * r_ins_range]

    fig.update_layout(
        margin=dict(l=8, r=margin_r, t=18, b=8),
        autosize=True,
        xaxis=dict(visible=False, scaleanchor="y", scaleratio=1, range=xrange, fixedrange=True),
        yaxis=dict(visible=False, range=yrange, fixedrange=True),
        height=fig_height,
        paper_bgcolor="white",
        plot_bgcolor="white",
        hoverlabel=dict(bgcolor="white"),
    )

    # Small dot marker above the vessel (to match the reference sketch)
    fig.add_trace(
        go.Scatter(
            x=[0.0],
            y=[r_ins + 0.20 * r_ins_range],
            mode="markers",
            marker=dict(size=7, color="black"),
            hoverinfo="skip",
            showlegend=False,
        )
    )

    _use_marker_flux = str(flux_style).lower() in ["marker", "markers", "ref", "reference", "b2"]

    Qt = max(Qconv + Qrad, 1e-12)
    if flux_fixed:
        lw_rad = float(lw_rad_fixed)
        lw_conv = float(lw_conv_fixed)
    else:
        lw_rad = 2 + 6 * (Qrad / Qt)
        lw_conv = 2 + 6 * (Qconv / Qt)

    if _use_marker_flux:
        # Reference-style flux glyphs (match the provided screenshot).
        x_rad = -0.27 * a
        x_conv = 0.27 * a
        y_mark = r_ins + 0.14 * r_ins_range
        y_lab = r_ins + 0.28 * r_ins_range

        fig.add_annotation(
            x=x_rad,
            y=y_lab,
            xref="x",
            yref="y",
            text="Q̇rad",
            showarrow=False,
            font=dict(size=12, color=QRAD_COLOR),
        )
        fig.add_trace(
            go.Scatter(
                x=[x_rad],
                y=[y_mark],
                mode="markers",
                marker=dict(symbol="square", size=10, color=QRAD_COLOR),
                hoverinfo="skip",
                showlegend=False,
            )
        )

        fig.add_annotation(
            x=x_conv,
            y=y_lab,
            xref="x",
            yref="y",
            text="Q̇conv",
            showarrow=False,
            font=dict(size=12, color=QCONV_COLOR),
        )
        # Small vertical tick under Q̇conv label
        fig.add_shape(
            type="line",
            x0=x_conv,
            y0=y_mark - 0.06 * r_ins,
            x1=x_conv,
            y1=y_mark + 0.06 * r_ins,
            xref="x",
            yref="y",
            line=dict(color=QCONV_COLOR, width=3),
        )
    else:
        # Move arrows/labels away from boundaries (visual only; defaults match prior)
        fig.add_annotation(
            x=-0.42 * (a + r_ins),
            y=arrow_y * r_ins,
            ax=-0.42 * (a + r_ins),
            ay=arrow_ay * r_ins,
            xref="x",
            yref="y",
            axref="x",
            ayref="y",
            text="",
            showarrow=True,
            arrowwidth=lw_rad,
            arrowhead=0,
            arrowcolor=QRAD_COLOR,
        )
        fig.add_annotation(
            x=-0.42 * (a + r_ins),
            y=label_y * r_ins,
            xref="x",
            yref="y",
            text="Q̇rad",
            showarrow=False,
            font=dict(size=12, color=QRAD_COLOR),
        )

        fig.add_annotation(
            x=0.42 * (a + r_ins),
            y=arrow_y * r_ins,
            ax=0.42 * (a + r_ins),
            ay=arrow_ay * r_ins,
            xref="x",
            yref="y",
            axref="x",
            ayref="y",
            text="",
            showarrow=True,
            arrowwidth=lw_conv,
            arrowhead=0,
            arrowcolor=QCONV_COLOR,
        )
        fig.add_annotation(
            x=0.42 * (a + r_ins),
            y=label_y * r_ins,
            xref="x",
            yref="y",
            text="Q̇conv",
            showarrow=False,
            font=dict(size=12, color=QCONV_COLOR),
        )

    
    return fig





def build_mode_split_bar(q_conv_w: float, q_rad_w: float, *, fig_height: int = 260, fig_width: int = 360) -> go.Figure:
    """Small 'Mode split' bar chart (Convection vs Radiation) matching the reference styling."""
    fig = go.Figure()
    fig.add_trace(go.Bar(x=["Convection", "Radiation"], y=[float(q_conv_w), float(q_rad_w)]))
    fig.update_layout(
        title="Mode split",
        height=fig_height,
        width=fig_width,
        margin=dict(l=60, r=20, t=60, b=80),
        showlegend=False,
    )
    fig.update_yaxes(title_text="W", rangemode="tozero")
    fig.update_xaxes(tickangle=35)
    return fig

# -----------------------------
# App
# -----------------------------
st.title("Heat Loss from a Cylindrical Reactor")

reference_summary = compute_reference_summary()

st.caption(
    "Updated to a real industrial reference geometry based on the Thermo Scientific HyPerforma "
    "DynaDrive 500 L vessel (D = 0.63 m, L = 1.87 m in this simplified cylindrical model)."
)

# Expander - this needs to go in details section
with st.expander("Reference geometry, updated equations, and baseline calculations", expanded=False):
    st.markdown(
        f"""
**Industrial reference used**
- Company: **{REFERENCE_VESSEL["company"]}**
- Equipment: **{REFERENCE_VESSEL["model"]}**
- Diameter used in this model: **{REFERENCE_VESSEL["diameter_m"]:.2f} m**
- Length used in this model: **{REFERENCE_VESSEL["length_m"]:.2f} m**
- Vendor working volume: **{REFERENCE_VESSEL["working_volume_l"]} L**
- Vendor total vessel volume: **{REFERENCE_VESSEL["total_volume_l"]} L**
- Vendor liquid height at rated working volume: **{REFERENCE_VESSEL["liquid_height_m"]:.2f} m**
- Vendor jacket area: **{REFERENCE_VESSEL["jacket_area_m2"]:.2f} m²**

**What changed from the original homework geometry**
- Original problem geometry: **L = 2.00 m, D = 0.50 m**
- Updated reference geometry: **L = {DEFAULTS["L"]:.2f} m, D = {DEFAULTS["D"]:.2f} m**
- Cylindrical shell area change: **{reference_summary["old_area"]:.3f} → {reference_summary["new_area"]:.3f} m²** (**{reference_summary["area_change_pct"]:+.1f}%**)

**Case A baseline with the updated real-world dimensions**
- Exposed shell area: **A = πDL = π × {DEFAULTS["D"]:.2f} × {DEFAULTS["L"]:.2f} = {reference_summary["A_shell"]:.3f} m²**
- Radiation-only heat loss at the default temperatures: **Q̇_rad = {reference_summary["case_a_qrad"]:,.0f} W**

**Case B baseline with the updated real-world dimensions**
- Inner radius: **r₁ = D/2 = {reference_summary["case_b"]["r1"]:.3f} m**
- Outer insulated radius: **r₂ = r₁ + t = {reference_summary["case_b"]["r2"]:.3f} m**
- Outside area: **A_out = 2πr₂L = {reference_summary["case_b"]["A_out"]:.3f} m²**
- Total heat loss: **Q̇_total = {reference_summary["case_b"]["Q_total"]:,.0f} W**
- Surface temperature: **T surface = {reference_summary["case_b"]["Tz"]:.1f} K**
- Convection split: **Q̇_conv = {reference_summary["case_b"]["Q_conv"]:,.0f} W**
- Radiation split: **Q̇_rad = {reference_summary["case_b"]["Q_rad"]:,.0f} W**

**Safety Challenge baseline**
- Minimum insulation thickness to keep **T surface ≤ {reference_summary["target"]:.0f} K** at the default settings:
  **{reference_summary["t_minimum"]:.3f} m**

**Reference text for your report**
- {REFERENCE_VESSEL["reference_note"]}
"""
    )

tabA, tabB, tabC = st.tabs(["Case A: Radiation Only", "Case B: Insulated", "Safety Challenge"])

## Case A: Radiation Only
with tabA:
    st.subheader("Case A — Radiation Only")

    # Layout: Inputs on the left; results + BOTH schematics on the right (no toggles)
    left, main = st.columns([1.0, 2.6])

    with left:
        st.markdown("### Inputs")
        Ts = st.slider("surface temperature Ts (K)", 450, 750, int(DEFAULTS["Ts"]), 5, key="Ts_case_a")
        eps = st.slider("emissivity ε (–)", 0.10, 0.95, float(DEFAULTS["eps"]), 0.05, key="eps_case_a")
        st.markdown("### Given (fixed)")
        st.write(f"L = {DEFAULTS['L']} m")
        st.write(f"D = {DEFAULTS['D']} m")
        st.write(f"Ta = {DEFAULTS['Ta']} K")

    A = area_cylinder(DEFAULTS["D"], DEFAULTS["L"])
    Qrad = q_radiation(eps, A, Ts, DEFAULTS["Ta"])

    # Pack results into a common dict so the metric layout is identical across tabs.
    out = {"Q_total": float(Qrad), "Tz": float(Ts), "Q_conv": 0.0, "Q_rad": float(Qrad)}


    with main:
        st.markdown("### Results")
        r1, r2, r3, r4 = st.columns(4)
        r1.metric("Q̇_total (W)", f"{out['Q_total']:,.0f}")
        r2.metric("T surface (K)", f"{out['Tz']:.1f}")
        r3.metric("Q̇_conv (W)", f"{out['Q_conv']:,.0f}")
        r4.metric("Q̇_rad (W)", f"{out['Q_rad']:,.0f}")

        v1, v2 = st.columns([0.80, 1.40])

        with v1:
            st.caption("Cross-section")
            fig_cs = build_cross_section(
                DEFAULTS["D"], 0.0, Ts, Ts, DEFAULTS["Ta"], Qconv=0.0, Qrad=Qrad, show_colorbar=False,
                fig_height=330, fig_width=300
            )
            st.plotly_chart(fig_cs, width='stretch', config=PLOTLY_CONFIG)

        with v2:
            st.caption("Vessel side-view")
            fig_sv = build_vessel_side_view(
                DEFAULTS["D"], 0.0, Ts, Ts, DEFAULTS["Ta"], Qconv=0.0, Qrad=Qrad, show_colorbar=True
            )
            st.plotly_chart(fig_sv, width='stretch', config=PLOTLY_CONFIG)

## Case B: Insulated
with tabB:
    st.subheader("Case B — Insulated")

    # Layout: Inputs on the left; results + BOTH schematics on the right (no extra panels)
    left, main = st.columns([1.0, 2.6])

    with left:
        st.markdown("### Inputs")
        Tin = st.slider("Fluid temperature Tin (K)", 500, 800, int(DEFAULTS["Tin"]), 5, key="Tin_case_b2")
        t = st.slider("Insulation thickness t (m)", 0.0, 0.15, float(DEFAULTS["t"]), 0.005, key="t_case_b2")
        k = st.selectbox("Insulation conductivity k (W/m·K)", [0.04, 0.08, 0.12], index=1, key="k_case_b2")
        eps = st.slider("Emissivity ε (–)", 0.10, 0.95, float(DEFAULTS["eps"]), 0.05, key="eps_case_b2")
        h = st.slider("Convection coefficient h (W/m²K)", 2.0, 25.0, float(DEFAULTS["h"]), 0.5, key="h_case_b2")
        st.markdown("### Given (fixed)")
        st.write(f"L = {DEFAULTS['L']} m")
        st.write(f"D = {DEFAULTS['D']} m")
        st.write(f"Ta = {DEFAULTS['Ta']} K")
        st.markdown('<div class="small">Hover the schematics to see the layer name and temperature.</div>', unsafe_allow_html=True)

    out = solve_case_b(Tin, DEFAULTS["Ta"], eps, DEFAULTS["L"], DEFAULTS["D"], t, float(k), h)

    with main:
        st.markdown("### Results")
        r1, r2, r3, r4 = st.columns(4)
        r1.metric("Q̇_total (W)", f"{out['Q_total']:,.0f}")
        r2.metric("T surface (K)", f"{out['Tz']:.1f}")
        r3.metric("Q̇_conv (W)", f"{out['Q_conv']:,.0f}")
        r4.metric("Q̇_rad (W)", f"{out['Q_rad']:,.0f}")

        # Match the screenshot: two panels only (cross-section left, side-view right)
        v1, v2 = st.columns([0.95, 2.05])

        with v1:
            st.caption("Cross-section")
            fig_cs = build_cross_section(
                DEFAULTS["D"], t, Tin, out["Tz"], DEFAULTS["Ta"], out["Q_conv"], out["Q_rad"],
                show_colorbar=False,
                fig_height=360,
                fig_width=320,
                flux_fixed=True,
            )
            st.plotly_chart(fig_cs, width='content', config=PLOTLY_CONFIG)

        with v2:
            st.caption("Vessel side-view")
            fig_sv = build_vessel_side_view(
                DEFAULTS["D"], t, Tin, out["Tz"], DEFAULTS["Ta"], out["Q_conv"], out["Q_rad"],
                show_colorbar=True,
                fig_height=360,
                flux_style="markers",
                flux_fixed=True,
            )
            st.plotly_chart(fig_sv, width='stretch', config=PLOTLY_CONFIG)

        st.markdown('---')
        c_left, c_mid, c_right = st.columns([1, 1, 1])
        with c_mid:
            fig_ms = build_mode_split_bar(out['Q_conv'], out['Q_rad'])
            st.plotly_chart(fig_ms, width='content', config=PLOTLY_CONFIG)


## Safety challenge
with tabC:
    st.subheader("Safety Challenge — Find thickness for T surface ≤ 330 K")
    target = 330.0
    eps_fixed = float(DEFAULTS["eps"])  # emissivity is fixed for this safety check

    # Layout: Inputs on the left; results + BOTH schematics + safety curve on the right
    left, main = st.columns([1.0, 2.6])

    with left:
        st.markdown("### Inputs")
        Tin = st.slider("Fluid temperature Tin (K)", 500, 800, int(DEFAULTS["Tin"]), 5, key="Tin_safety")

        # User-controlled insulation conductivity and thickness
        k = st.selectbox("Insulation conductivity k (W/m·K)", [0.04, 0.08, 0.12], index=1, key="k_safety")

        # Wide-range thickness control (the design variable for this challenge)
        t_user = st.slider("Insulation thickness t (m)", 0.0, 0.30, float(DEFAULTS["t"]), 0.005, key="t_safety")

        h = st.slider("Convection coefficient h (W/m²K)", 2.0, 25.0, float(DEFAULTS["h"]), 0.5, key="h_safety")
        st.write(f"Target: T surface ≤ {target:.0f} K")

    # Evaluate the user-selected thickness
    out_user = solve_case_b(
        Tin,
        DEFAULTS["Ta"],
        eps_fixed,
        DEFAULTS["L"],
        DEFAULTS["D"],
        float(t_user),
        float(k),
        float(h),
    )

    # Sweep thickness across the full displayed range to find the minimum value that meets the target
    t_max = 0.30
    t_vals = np.linspace(0.0, t_max, 301)
    T_surface_vals = np.empty_like(t_vals)
    for i, t_scan in enumerate(t_vals):
        out_i = solve_case_b(Tin, DEFAULTS["Ta"], eps_fixed, DEFAULTS["L"], DEFAULTS["D"], float(t_scan), float(k), float(h))
        T_surface_vals[i] = out_i["Tz"]

    idx = np.where(T_surface_vals <= target)[0]
    if len(idx) > 0:
        minimum_thickness = float(t_vals[idx[0]])
        out_minimum = solve_case_b(
            Tin, DEFAULTS["Ta"], eps_fixed, DEFAULTS["L"], DEFAULTS["D"], minimum_thickness, float(k), float(h)
        )
        ok = True
    else:
        minimum_thickness = None
        out_minimum = solve_case_b(
            Tin, DEFAULTS["Ta"], eps_fixed, DEFAULTS["L"], DEFAULTS["D"], float(t_vals[-1]), float(k), float(h)
        )
        ok = False

    with main:
        # Status + compact results
        if ok:
            st.markdown(
                f'<div class="small"><b>Minimum required thickness (reference):</b> {minimum_thickness:.3f} m '
                f'to keep <b>T surface ≤ {target:.0f} K</b>.</div>',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f'<div class="small"><b>Safety target not reached</b> anywhere in the displayed thickness range '
                f'(0.00 to {t_max:.2f} m).</div>',
                unsafe_allow_html=True,
            )

        st.markdown("### Results")
        s1, s2, s3, s4, s5 = st.columns(5)
        s1.metric("t (m)", f"{float(t_user):.3f}")
        s2.metric("T surface (K)", f"{out_user['Tz']:.1f}")
        s3.metric("Q̇_total (W)", f"{out_user['Q_total']:,.0f}")
        s4.metric("Q̇_conv (W)", f"{out_user['Q_conv']:,.0f}")
        s5.metric("Q̇_rad (W)", f"{out_user['Q_rad']:,.0f}")

        # Safety status (pass/fail) for the user-selected thickness
        passed = out_user["Tz"] <= target + 1e-9
        if passed:
            if minimum_thickness is not None:
                st.success(
                    f"Safety PASSED at t = {float(t_user):.3f} m: T surface = {out_user['Tz']:.1f} K "
                    f"(≤ {target:.0f} K). Minimum required thickness: {minimum_thickness:.3f} m."
                )
            else:
                st.success(
                    f"Safety PASSED at t = {float(t_user):.3f} m: T surface = {out_user['Tz']:.1f} K "
                    f"(≤ {target:.0f} K)."
                )
        else:
            if minimum_thickness is None:
                st.error(
                    f"Safety FAILED at t = {float(t_user):.3f} m: T surface = {out_user['Tz']:.1f} K "
                    f"(> {target:.0f} K). Even {t_max:.2f} m does not achieve the target for this k and h."
                )
            else:
                st.error(
                    f"Safety FAILED at t = {float(t_user):.3f} m: T surface = {out_user['Tz']:.1f} K "
                    f"(> {target:.0f} K). Minimum required thickness: {minimum_thickness:.3f} m."
                )

        # Visual schematics (based on the user-selected thickness)
        v1, v2 = st.columns([0.80, 1.40])

        with v1:
            st.caption("Cross-section")
            fig_cs = build_cross_section(
                DEFAULTS["D"], float(t_user), Tin, out_user["Tz"], DEFAULTS["Ta"], out_user["Q_conv"], out_user["Q_rad"], show_colorbar=False
            )
            st.plotly_chart(fig_cs, width='content', config=PLOTLY_CONFIG)

        with v2:
            st.caption("Vessel side-view")
            fig_sv = build_vessel_side_view(
                DEFAULTS["D"], float(t_user), Tin, out_user["Tz"], DEFAULTS["Ta"], out_user["Q_conv"], out_user["Q_rad"], show_colorbar=True
            )
            st.plotly_chart(fig_sv, width='stretch', config=PLOTLY_CONFIG)

        st.caption(
            f"Chart range shown in full: insulation thickness from 0.00 to {t_max:.2f} m and surface temperature from 0 to 800 K."
        )

        # Clean safety chart
        fig_line = go.Figure()

        # Safe / unsafe background bands
        fig_line.add_shape(
            type="rect",
            xref="x",
            yref="y",
            x0=0.0,
            x1=t_max,
            y0=0.0,
            y1=target,
            fillcolor="rgba(34, 197, 94, 0.06)",
            line=dict(width=0),
            layer="below",
        )
        fig_line.add_shape(
            type="rect",
            xref="x",
            yref="y",
            x0=0.0,
            x1=t_max,
            y0=target,
            y1=800.0,
            fillcolor="rgba(239, 68, 68, 0.05)",
            line=dict(width=0),
            layer="below",
        )

        # Main curve
        fig_line.add_trace(
            go.Scatter(
                x=t_vals,
                y=T_surface_vals,
                mode="lines",
                name="T surface",
                line=dict(width=4),
                hovertemplate="Thickness t = %{x:.3f} m<br>T surface = %{y:.1f} K<extra></extra>",
            )
        )

        # Target line (horizontal only; no vertical guide lines)
        fig_line.add_shape(
            type="line",
            xref="x",
            yref="y",
            x0=0.0,
            x1=t_max,
            y0=target,
            y1=target,
            line=dict(width=2),
        )

        # Selected thickness marker
        fig_line.add_trace(
            go.Scatter(
                x=[float(t_user)],
                y=[out_user["Tz"]],
                mode="markers",
                name="Selected thickness",
                marker=dict(size=11, symbol="circle"),
                hovertemplate="Selected thickness = %{x:.3f} m<br>T surface = %{y:.1f} K<extra></extra>",
            )
        )

        # Minimum required thickness marker
        if ok and (minimum_thickness is not None):
            fig_line.add_trace(
                go.Scatter(
                    x=[minimum_thickness],
                    y=[out_minimum["Tz"]],
                    mode="markers",
                    name="Minimum thickness",
                    marker=dict(size=11, symbol="diamond"),
                    hovertemplate="Minimum thickness = %{x:.3f} m<br>T surface = %{y:.1f} K<extra></extra>",
                )
            )

        fig_line.add_annotation(
            x=0.01,
            y=target + 12.0,
            xref="x",
            yref="y",
            text=f"Target surface temperature = {target:.0f} K",
            showarrow=False,
            font=dict(size=12),
            bgcolor="rgba(255,255,255,0.85)",
            bordercolor="rgba(0,0,0,0.12)",
            borderwidth=1,
        )

        fig_line.update_xaxes(
            title_text="Insulation thickness, t (m)",
            range=[0.0, t_max],
            dtick=0.05,
            showgrid=True,
            gridcolor="rgba(0, 0, 0, 0.08)",
            zeroline=False,
        )
        fig_line.update_yaxes(
            title_text="Surface temperature, T surface (K)",
            range=[0.0, 800.0],
            dtick=100,
            showgrid=True,
            gridcolor="rgba(0, 0, 0, 0.08)",
            zeroline=False,
        )
        fig_line.update_layout(
            title="Surface temperature vs. insulation thickness",
            height=360,
            margin=dict(l=14, r=14, t=52, b=12),
            hovermode="closest",
            paper_bgcolor="white",
            plot_bgcolor="white",
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1.0,
            ),
        )
        st.plotly_chart(fig_line, width='stretch', config=PLOTLY_CONFIG)
`,s=Object.assign({"./python_app/main.py":_}),o={};for(const r in s){const t=r.replace("./python_app/","");o[t]=s[r]}const d=["plotly","numpy","scipy"];window.controller=c({entrypoint:"main.py",files:o,requirements:d},document.getElementById("app"));
