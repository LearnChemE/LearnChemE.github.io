const plot_points_button = document.getElementById("plot-points");
const draw_operating_lines_button = document.getElementById("draw-operating-lines");
const count_stages_button = document.getElementById("count-stages");
const optimal_feed_location_button = document.getElementById("optimal-feed-location");
const step_1_buttons_row = document.getElementById("step-1-buttons-row");
const steps_2_through_4_container = document.getElementById("steps-2-through-4-container");
const step_2_buttons_row = document.getElementById("step-2-buttons-row");
const step_stages_container = document.getElementById("step-stages-container");
const step_1_feed = document.getElementById("step-1-feed");
const step_1_distillate = document.getElementById("step-1-distillate");
const step_1_bottoms = document.getElementById("step-1-bottoms");
const step_2_feed = document.getElementById("step-2-feed");
const step_2_rectifying = document.getElementById("step-2-rectifying");
const step_2_stripping = document.getElementById("step-2-stripping");
const feed_quality_slider = document.getElementById("feed-quality-slider");
const feed_quality_value = document.getElementById("feed-quality-value");
const step_stages_slider = document.getElementById("step-stages-slider");

plot_points_button.addEventListener("click", () => {
  plot_points_button.classList.add("selected");
  draw_operating_lines_button.classList.remove("selected");
  count_stages_button.classList.remove("selected");
  optimal_feed_location_button.classList.remove("selected");
  step_1_buttons_row.style.display = "grid";
  steps_2_through_4_container.style.display = "none";
  if(gvs.step !== 1) {
    gvs.substep = 1;
    step_1_feed.classList.add("selected");
    step_1_distillate.classList.remove("selected");
    step_1_bottoms.classList.remove("selected");
  }
  gvs.step = 1;
  gvs.p.redraw();
});

draw_operating_lines_button.addEventListener("click", () => {
  plot_points_button.classList.remove("selected");
  draw_operating_lines_button.classList.add("selected");
  count_stages_button.classList.remove("selected");
  optimal_feed_location_button.classList.remove("selected");
  step_1_buttons_row.style.display = "none";
  steps_2_through_4_container.style.display = "grid";
  step_2_buttons_row.style.display = "grid";
  step_stages_container.style.display = "none";
  if(gvs.step !== 2) {
    gvs.substep = 1;
    step_2_feed.classList.add("selected");
    step_2_rectifying.classList.remove("selected");
    step_2_stripping.classList.remove("selected");
  }
  gvs.step = 2;
  gvs.p.redraw();
});

count_stages_button.addEventListener("click", () => {
  plot_points_button.classList.remove("selected");
  draw_operating_lines_button.classList.remove("selected");
  count_stages_button.classList.add("selected");
  optimal_feed_location_button.classList.remove("selected");
  step_1_buttons_row.style.display = "none";
  steps_2_through_4_container.style.display = "grid";
  step_2_buttons_row.style.display = "none";
  step_stages_container.style.display = "grid";
  if(gvs.step !== 3) {
    gvs.substep = 1;
  }
  gvs.step = 3;
  gvs.p.redraw();
});

optimal_feed_location_button.addEventListener("click", () => {
  plot_points_button.classList.remove("selected");
  draw_operating_lines_button.classList.remove("selected");
  count_stages_button.classList.remove("selected");
  optimal_feed_location_button.classList.add("selected");
  step_1_buttons_row.style.display = "none";
  steps_2_through_4_container.style.display = "grid";
  step_2_buttons_row.style.display = "none";
  step_stages_container.style.display = "none";
  if(gvs.step !== 4) {
    gvs.substep = 1;
  }
  gvs.step = 4;
  gvs.p.redraw();
});

step_1_feed.addEventListener("click", () => {
  step_1_feed.classList.add("selected");
  step_1_distillate.classList.remove("selected");
  step_1_bottoms.classList.remove("selected");
  gvs.substep = 1;
  gvs.p.redraw();
});

step_1_distillate.addEventListener("click", () => {
  step_1_feed.classList.remove("selected");
  step_1_distillate.classList.add("selected");
  step_1_bottoms.classList.remove("selected");
  gvs.substep = 2;
  gvs.p.redraw();
});

step_1_bottoms.addEventListener("click", () => {
  step_1_feed.classList.remove("selected");
  step_1_distillate.classList.remove("selected");
  step_1_bottoms.classList.add("selected");
  gvs.substep = 3;
  gvs.p.redraw();
});

step_2_feed.addEventListener("click", () => {
  step_2_feed.classList.add("selected");
  step_2_rectifying.classList.remove("selected");
  step_2_stripping.classList.remove("selected");
  gvs.substep = 1;
  gvs.p.redraw();
});

step_2_rectifying.addEventListener("click", () => {
  step_2_feed.classList.remove("selected");
  step_2_rectifying.classList.add("selected");
  step_2_stripping.classList.remove("selected");
  gvs.substep = 2;
  gvs.p.redraw();
});

step_2_stripping.addEventListener("click", () => {
  step_2_feed.classList.remove("selected");
  step_2_rectifying.classList.remove("selected");
  step_2_stripping.classList.add("selected");
  gvs.substep = 3;
  gvs.p.redraw();
});

feed_quality_slider.addEventListener("input", () => {
  const q = Number(feed_quality_slider.value);
  gvs.q = q;
  feed_quality_value.innerHTML = q.toFixed(1);
  gvs.p.redraw();
});

step_stages_slider.addEventListener("input", () => {
  const stage_inc = Number(step_stages_slider.value);
  gvs.stage_inc = stage_inc;
  gvs.p.redraw();
});