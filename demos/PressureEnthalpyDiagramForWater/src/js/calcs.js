gvs.coordToPix = function(x, y) {
  const margins = gvs.plot.margins;
  const height = gvs.plot.height;
  const width = gvs.plot.width;
  const axes_range = gvs.plot.axes_range;
  const xMin = axes_range[0][0];
  const xMax = axes_range[0][1];
  const yMin = axes_range[1][0];
  const yMax = axes_range[1][1];
  const yLogMin = Math.log10(yMin);
  const yLogMax = Math.log10(yMax);

  const fraction_x = (x - xMin) / (xMax - xMin);
  const fraction_y = (Math.log10(y) - yLogMin) / (yLogMax - yLogMin);

  const xPix = margins[0][0] + fraction_x * width;
  const yPix = margins[1][0] + height - fraction_y * height;

  return [xPix, yPix]
}