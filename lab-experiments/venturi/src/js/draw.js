const liquid_color = "rgb(220, 220, 255)";
const pipe_color = "rgba(0, 0, 0, 0.1)";

function mmToPix(x, y) {
  const xPix = (x / 100) * (width / 3);
  const yPix = (y / 100) * (width / 3);
  return [xPix, yPix]
}

export default function drawAll() {
  push();
  translate(width / 2 + 50, height / 2 + 170);

  // start of manometer fluid section

  rectMode(CORNERS);
  fill(liquid_color);
  noStroke();
  let coord1 = mmToPix(-78, 0);
  let coord2 = mmToPix(-72, -1 * gvs.manometer_1_pressure);
  rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-33, 0);
  coord2 = mmToPix(-27, -1 * gvs.manometer_2_pressure);
  rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, 0);
  coord2 = mmToPix(3, -1 * gvs.manometer_3_pressure);
  rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(27, 0);
  coord2 = mmToPix(33, -1 * gvs.manometer_4_pressure);
  rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(72, 0);
  coord2 = mmToPix(78, -1 * gvs.manometer_5_pressure);
  rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  stroke(100, 100, 255);
  strokeWeight(1);
  coord1 = mmToPix(-78, -1 * gvs.manometer_1_pressure);
  coord2 = mmToPix(-72, -1 * gvs.manometer_1_pressure);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-33, -1 * gvs.manometer_2_pressure);
  coord2 = mmToPix(-27, -1 * gvs.manometer_2_pressure);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, -1 * gvs.manometer_3_pressure);
  coord2 = mmToPix(3, -1 * gvs.manometer_3_pressure);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(27, -1 * gvs.manometer_4_pressure);
  coord2 = mmToPix(33, -1 * gvs.manometer_4_pressure);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.manometer_5_pressure);
  coord2 = mmToPix(72, -1 * gvs.manometer_5_pressure);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // start of venturi meter outline section

  const outline_list_mm = [
    [-100, -1 * gvs.outer_diameter / 2],
    [-50, -1 * gvs.outer_diameter / 2],
    [-10, -1 * gvs.inner_diameter / 2],
    [10, -1 * gvs.inner_diameter / 2],
    [50, -1 * gvs.outer_diameter / 2],
    [100, -1 * gvs.outer_diameter / 2],
    [108, -1 * gvs.outer_diameter / 2],
    [120, -1 * gvs.outer_diameter / 2 + 2],
    [150, -1 * gvs.outer_diameter / 2 + 17],
    [150, gvs.outer_diameter / 2 + 19],
    [120, gvs.outer_diameter / 2 + 2],
    [108, gvs.outer_diameter / 2],
    [100, gvs.outer_diameter / 2],
    [50, gvs.outer_diameter / 2],
    [10, gvs.inner_diameter / 2],
    [-10, gvs.inner_diameter / 2],
    [-50, gvs.outer_diameter / 2],
    [-100, gvs.outer_diameter / 2],
  ];
  const outline_list_pix = [];
  noStroke();
  fill(liquid_color);
  beginShape();
  for (let i = 0; i < outline_list_mm.length; i++) {
    const coord = outline_list_mm[i];
    const pix = mmToPix(coord[0], coord[1]);
    vertex(pix[0], pix[1]);
  }
  endShape();
  stroke(0);
  strokeWeight(1);
  noFill();

  coord1 = mmToPix(-100, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-78, -1 * gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-50, -1 * gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-50, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-10, -1 * gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-10, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-3, -1 * gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(10, -1 * gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(10, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(50, -1 * gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(50, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(72, -1 * gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(100, -1 * gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(100, gvs.outer_diameter / 2);
  coord2 = mmToPix(50, gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(50, gvs.outer_diameter / 2);
  coord2 = mmToPix(10, gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(10, gvs.inner_diameter / 2);
  coord2 = mmToPix(-10, gvs.inner_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-10, gvs.inner_diameter / 2);
  coord2 = mmToPix(-50, gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-50, gvs.outer_diameter / 2);
  coord2 = mmToPix(-100, gvs.outer_diameter / 2);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // start of manometers section

  coord1 = mmToPix(-78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-78, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-72, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-33, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-27, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-3, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(3, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(27, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(33, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(78, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(72, -1 * gvs.outer_diameter / 2 - 130);
  line(coord1[0], coord1[1], coord2[0], coord2[1]);

  fill(pipe_color);

  let coords = [
    mmToPix(98, -1 * gvs.outer_diameter / 2 - 2),
    mmToPix(110, -1 * gvs.outer_diameter / 2 - 2),
    mmToPix(120, -1 * gvs.outer_diameter / 2),
    mmToPix(150, -1 * gvs.outer_diameter / 2 + 15),
    mmToPix(150, gvs.outer_diameter / 2 + 19),
    mmToPix(120, gvs.outer_diameter / 2 + 4),
    mmToPix(110, gvs.outer_diameter / 2 + 2),
    mmToPix(98, gvs.outer_diameter / 2 + 2),
  ];

  beginShape();

  for (let i = 0; i < coords.length; i++) {
    vertex(coords[i][0], coords[i][1]);
  }

  endShape(CLOSE);

  pop();
}