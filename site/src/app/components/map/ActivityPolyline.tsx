import React from "react";
import { Marker, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import * as turf from "@turf/turf";
import L from "leaflet";
import { getColorFromValue } from "./lib/getColorFromValue";

type Props = {
  activity: any;
  selectedLayer: string;
  showPins: boolean;
  data: any;
  onMarkerClick: (activityId: number) => void;
};

const ActivityPolyline = ({
  activity,
  selectedLayer,
  showPins,
  data,
  onMarkerClick,
}: Props) => {
  const decodedPolyline = polyline.decode(activity.polyline);

  const maxBlue = 255;
  const minBlue = 50;
  const stepSize = (maxBlue - minBlue) / (data.activities.length - 1);

  const i = data.activities.indexOf(activity);
  const shadeOfBlue = Math.round(maxBlue - i * stepSize);
  const blue = `rgb(0, 0, ${shadeOfBlue})`;

  if (activity.segments) {
    let segmentStartIndex = 0;

    return (
      <div>
        {activity.segments.distances.map((distance: number, j: number) => {
          const segmentCoords: [number, number][] = [];
          let segmentDistanceCovered = 0;

          if (segmentStartIndex > 0) {
            segmentCoords.push(decodedPolyline[segmentStartIndex - 1]);
          }

          for (let k = segmentStartIndex; k < decodedPolyline.length; k++) {
            const from = decodedPolyline[k];
            const to = decodedPolyline[k + 1];

            if (!to) {
              // If 'to' is undefined, just add 'from' and break
              segmentCoords.push(from);
              break;
            }

            const dist = turf.distance(turf.point(from), turf.point(to), {
              units: "meters",
            });

            if (segmentDistanceCovered + dist <= distance) {
              segmentCoords.push(from);
              segmentDistanceCovered += dist;
            } else {
              const remainingDistance = distance - segmentDistanceCovered;
              const direction = turf.bearing(turf.point(from), turf.point(to));
              const destination = turf.destination(
                turf.point(from),
                remainingDistance,
                direction,
                { units: "meters" }
              );
              segmentCoords.push(
                from,
                destination.geometry.coordinates as [number, number]
              );
              segmentStartIndex = k + 1;
              break;
            }

            // Handle the last segment correctly
            if (k === decodedPolyline.length - 1) {
              segmentCoords.push(to);
              segmentStartIndex = k + 1;
            }
          }

          // Ensure the final segment is pushed if not already handled
          if (j === activity.segments.distances.length - 1) {
            segmentCoords.push(...decodedPolyline.slice(segmentStartIndex));
          }

          // Check if selectedLayer exists in segments and minMaxValues
          const remapping: any = {
            averageSpeed: "averageSpeeds",
            elevationGain: "totalElevationGains",
            averageHeartrate: "averageHeartrates",
            averageCadence: "averageCadence",
            maxHeartrate: "maxHeartrates",
          };

          const layerData =
            selectedLayer === "avgTemp" ||
            selectedLayer === "rainSum" ||
            selectedLayer === "windSpeed"
              ? activity[selectedLayer]
              : activity.segments[remapping[selectedLayer]]?.[j];
          const minMax =
            selectedLayer === "elevationGain"
              ? data.minMaxValues["segmentElevationGain"]
              : data.minMaxValues[selectedLayer];
          const speed = layerData * 3.6;
          const color =
            selectedLayer === "None" || !minMax
              ? blue
              : getColorFromValue(
                  selectedLayer === "averageSpeed" ? speed : layerData,
                  minMax[0],
                  minMax[1],
                  selectedLayer
                );

          return (
            <div key={`${i}-${j}`}>
              {segmentCoords.length > 1 && (
                <Polyline
                  pathOptions={{ fillColor: color, color: color, weight: 3.5 }}
                  positions={segmentCoords}
                />
              )}
              {j === activity.segments.distances.length - 1 && showPins && (
                <Marker
                  icon={createMarkerIcon(color)}
                  eventHandlers={{
                    click: () => onMarkerClick(activity.activityId),
                  }}
                  position={segmentCoords[segmentCoords.length - 1]}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  } else {
    if (!decodedPolyline) return null;

    const layerData = activity[selectedLayer];
    const minMax = data.minMaxValues[selectedLayer];
    const color =
      selectedLayer === "None"
        ? blue
        : getColorFromValue(layerData, minMax[0], minMax[1], selectedLayer);

    return (
      <div>
        <Polyline
          pathOptions={{ fillColor: color, color: color, weight: 3.5 }}
          positions={decodedPolyline}
        />
        {decodedPolyline[decodedPolyline.length - 1] && showPins && (
          <Marker
            icon={createMarkerIcon(color)}
            eventHandlers={{ click: () => onMarkerClick(activity.activityId) }}
            position={decodedPolyline[decodedPolyline.length - 1]}
          />
        )}
      </div>
    );
  }
};

const createMarkerIcon = (color: string) =>
  L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5 15.5 7.07 15.5 9 13.93 12.5 12 12.5z"></path></svg>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

export default ActivityPolyline;
