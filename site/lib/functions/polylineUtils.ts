// polylineUtils.ts
import polyline from "@mapbox/polyline";

export function decodePolyline(encodedPolyline: string): [number, number][] {
  return polyline.decode(encodedPolyline);
}

export function latLngToSvg(
  latLngPoints: [number, number][],
  width: number,
  height: number
): [number, number][] {
  let minLat = Infinity,
    minLng = Infinity,
    maxLat = -Infinity,
    maxLng = -Infinity;

  latLngPoints.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return latLngPoints.map(([lat, lng]) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return [x, y];
  });
}

export function generateSvgPath(svgPoints: [number, number][]): string {
  return svgPoints
    .map(([x, y], index) => {
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}
