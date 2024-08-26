import { scaleSequential } from "d3-scale";
import { interpolateViridis, interpolateYlOrRd } from "d3-scale-chromatic";

export function getColorFromValue(
  value: number,
  minValue: number,
  maxValue: number,
  type?: string
) {
  const scheme = type === "temp" ? interpolateYlOrRd : interpolateViridis;
  // Create a sequential color scale using the Viridis colormap
  const colorScale = scaleSequential(scheme).domain([minValue, maxValue]);

  // Get the color for the current value
  return colorScale(value);
}
