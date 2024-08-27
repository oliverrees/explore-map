import React, { useState } from "react";
import polyline from "@mapbox/polyline";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import { WaitingForDataScreen } from "./WaitingForDataScreen";
import { WaitingForData } from "./WaitingForData";
import { getColorFromValue } from "./lib/getColorFromValue";
import { Layers } from "./Layers";
import L from "leaflet";
import * as turf from "@turf/turf";

type Props = {
  data: any;
  isPublic: boolean;
  useSegments: boolean; // Add the flag as a prop
};

const Map = ({ data, isPublic, useSegments }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("averageSpeed");

  if (!data) return null;
  if (data.activities.length === 0)
    return isPublic ? (
      <WaitingForDataScreen />
    ) : (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <WaitingForData />
      </div>
    );

  const tileUrl = showSatellite
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const onChangeShowPins = (pinStatus: boolean) => {
    setShowPins(pinStatus);
  };

  const onChangeShowSatellite = (satelliteStatus: boolean) => {
    setShowSatellite(satelliteStatus);
  };

  // Define the range for blue shades
  const maxBlue = 255; // Lightest blue
  const minBlue = 50; // Darkest blue
  const stepSize = (maxBlue - minBlue) / (data.activities.length - 1);

  return (
    <>
      <Stats
        data={data}
        showPins={showPins}
        showSatellite={showSatellite}
        onChangeShowPins={onChangeShowPins}
        onChangeShowSatellite={onChangeShowSatellite}
      />
      <Layers
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        minMaxValues={data.minMaxValues}
      />
      <div className="w-full h-full relative z-0">
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          activityId={activityId}
          mapId={data.mapId}
        />
        <MapContainer
          center={data.centerCoords}
          zoom={data.zoomLevel}
          maxZoom={20}
          minZoom={1}
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />
          {data.activities.map((activity: any, i: number) => {
            const decodedPolyline = polyline.decode(activity.polyline);

            // Calculate the shade of blue for this activity
            const shadeOfBlue = Math.round(maxBlue - i * stepSize);
            const blue = `rgb(0, 0, ${shadeOfBlue})`;

            if (useSegments && activity.segments) {
              // Render segments if the flag is set to true and segments exist
              let segmentStartIndex = 0;

              return (
                <div key={i}>
                  {activity.segments.distances.map(
                    (distance: number, j: number) => {
                      const segmentCoords: [number, number][] = [];
                      let segmentDistanceCovered = 0;

                      if (segmentStartIndex > 0) {
                        segmentCoords.push(
                          decodedPolyline[segmentStartIndex - 1]
                        );
                      }

                      for (
                        let k = segmentStartIndex;
                        k < decodedPolyline.length;
                        k++
                      ) {
                        const from = decodedPolyline[k];
                        const to = decodedPolyline[k + 1];

                        if (!to) {
                          // If 'to' is undefined, just add 'from' and break
                          segmentCoords.push(from);
                          break;
                        }

                        const dist = turf.distance(
                          turf.point(from),
                          turf.point(to),
                          {
                            units: "meters",
                          }
                        );

                        if (segmentDistanceCovered + dist <= distance) {
                          segmentCoords.push(from);
                          segmentDistanceCovered += dist;
                        } else {
                          const remainingDistance =
                            distance - segmentDistanceCovered;
                          const direction = turf.bearing(
                            turf.point(from),
                            turf.point(to)
                          );
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
                        segmentCoords.push(
                          ...decodedPolyline.slice(segmentStartIndex)
                        );
                      }

                      // Check if selectedLayer exists in segments and minMaxValues
                      const layerData =
                        selectedLayer === "avgTemp" ||
                        selectedLayer === "rainSum" ||
                        selectedLayer === "windSpeed"
                          ? activity[selectedLayer]
                          : activity.segments[selectedLayer]?.[j];
                      const minMax = data.minMaxValues[selectedLayer];

                      const color =
                        selectedLayer === "None" || !layerData || !minMax
                          ? blue
                          : getColorFromValue(
                              layerData,
                              minMax[0],
                              minMax[1],
                              selectedLayer
                            );

                      const markerIcon = L.divIcon({
                        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5 15.5 7.07 15.5 9 13.93 12.5 12 12.5z"></path></svg>`,
                        className: "",
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                      });

                      return (
                        <>
                          {j === activity.segments.distances.length - 1 &&
                            showPins && (
                              <Marker
                                icon={markerIcon}
                                eventHandlers={{
                                  click: (e) => {
                                    setActivityId(activity.activityId);
                                    setOpen(true);
                                  },
                                }}
                                position={
                                  segmentCoords[segmentCoords.length - 1]
                                }
                              />
                            )}
                          {segmentCoords.length > 1 && (
                            <Polyline
                              key={`${i}-${j}`}
                              pathOptions={{
                                fillColor: color,
                                color: color,
                                weight: 3.5,
                              }}
                              positions={segmentCoords}
                            />
                          )}
                        </>
                      );
                    }
                  )}
                </div>
              );
            } else {
              if (!decodedPolyline) return null;
              // Render the entire polyline if not using segments or if segments don't exist
              const layerData = activity[selectedLayer];
              const minMax = data.minMaxValues[selectedLayer];
              const color =
                selectedLayer === "None" || !layerData || !minMax
                  ? blue
                  : getColorFromValue(
                      layerData,
                      minMax[0],
                      minMax[1],
                      selectedLayer
                    );
              const markerIcon = L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5 15.5 7.07 15.5 9 13.93 12.5 12 12.5z"></path></svg>`,
                className: "",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              });
              return (
                <div key={i}>
                  <Polyline
                    pathOptions={{
                      fillColor: color,
                      color: color,
                      weight: 3.5,
                    }}
                    positions={decodedPolyline}
                  />
                  {decodedPolyline[decodedPolyline.length - 1] && showPins && (
                    <Marker
                      icon={markerIcon}
                      eventHandlers={{
                        click: (e) => {
                          setActivityId(activity.activityId);
                          setOpen(true);
                        },
                      }}
                      position={decodedPolyline[decodedPolyline.length - 1]}
                    />
                  )}
                </div>
              );
            }
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
