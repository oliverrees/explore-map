// PolylineSvg.tsx
import React from "react";
import {
  decodePolyline,
  latLngToSvg,
  generateSvgPath,
} from "../../../../lib/functions/polylineUtils";

interface PolylineSvgProps {
  encodedPolyline: string;
  width: number;
  height: number;
}

const PolylineSvg: React.FC<PolylineSvgProps> = ({
  encodedPolyline,
  width,
  height,
}) => {
  // Decode the polyline
  const latLngPoints = decodePolyline(encodedPolyline);

  // Convert lat/lng points to SVG coordinates
  const svgPoints = latLngToSvg(latLngPoints, width, height);

  // Generate the SVG path
  const svgPath = generateSvgPath(svgPoints);

  return (
    <svg width={width} height={height}>
      <path d={svgPath} fill="none" stroke="rgb(37 99 235)" />
    </svg>
  );
};

export default PolylineSvg;
