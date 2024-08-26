import React, { useEffect, useState } from "react";
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

type Props = {
  data: any;
  isPublic: boolean;
};

const Map = ({ data, isPublic }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("avgSpeeds");

  const centerCoords: any = data.centerPoint ? [data.centerPoint] : [];

  const minMaxValues: any = {
    avgSpeeds: [
      Math.min(...(data.avgSpeeds || [])),
      Math.max(...(data.avgSpeeds || [])),
    ],
    totalElevationGains: [
      Math.min(...(data.totalElevationGains || [])),
      Math.max(...(data.totalElevationGains || [])),
    ],
    avgHeartrates: [
      Math.min(...(data.avgHeartrates || [])),
      Math.max(...(data.avgHeartrates || [])),
    ],
    avgTemp: [
      Math.min(...(data.avgTemp || [])),
      Math.max(...(data.avgTemp || [])),
    ],
    rainSum: [
      Math.min(...(data.rainSum || [])),
      Math.max(...(data.rainSum || [])),
    ],
    windSpeed: [
      Math.min(...(data.windSpeed || [])),
      Math.max(...(data.windSpeed || [])),
    ],
    maxHeartRates: [
      Math.min(...(data.maxHeartRates || [])),
      Math.max(...(data.maxHeartRates || [])),
    ],
  };

  const [minValue, maxValue] = minMaxValues[selectedLayer] || [];

  const coords = data.polyLines.map((line: any, indx: number) => {
    const activityId = data.activityIds[indx];
    const coords = polyline.decode(line);
    if (activityId === data.mostRecentActivityId && !data.centerPoint) {
      centerCoords.push(coords[coords.length - 1]);
    }
    return { coords };
  });

  if (!data) return null;
  if (coords.length === 0)
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
        data={data}
        selectedLayer={selectedLayer}
        setSelectedLayer={(layer: string) => {
          setSelectedLayer(layer);
        }}
        minValue={minValue}
        maxValue={maxValue}
      />

      <div className="w-full h-full relative z-0">
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          activityId={activityId}
          mapId={data.mapId}
        />
        <MapContainer
          center={[centerCoords[0][0], centerCoords[0][1]]}
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
          {coords.map((activity: any, i: number) => {
            // Safely access the selected layer data
            const layerData = data[`${selectedLayer}`] || [];
            const color =
              selectedLayer === "None"
                ? "rgb(37 99 235)"
                : getColorFromValue(
                    layerData[i] !== undefined ? layerData[i] : minValue, // Default to minValue if undefined
                    minValue,
                    maxValue
                  );

            // Generate a colored marker icon
            const markerIcon = L.divIcon({
              html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5 15.5 7.07 15.5 9 13.93 12.5 12 12.5z"></path></svg>`,
              className: "",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            const markerImage = L.icon({
              iconUrl: "/marker.png",
              iconSize: [25, 36],
              iconAnchor: [12, 36],
              popupAnchor: [1, -34],
            });

            // Check if there is a lat and lng
            if (!activity.coords[0]) return null;
            return (
              <div key={i}>
                <Polyline
                  pathOptions={{
                    fillColor: color,
                    color: color,
                    weight: 5,
                  }}
                  positions={activity.coords}
                />

                {showPins && (
                  <Marker
                    icon={selectedLayer === "None" ? markerImage : markerIcon}
                    eventHandlers={{
                      click: (e) => {
                        setActivityId(data.activityIds[i]);
                        setOpen(true);
                      },
                    }}
                    position={[
                      activity.coords[activity.coords.length - 1][0],
                      activity.coords[activity.coords.length - 1][1],
                    ]}
                  />
                )}
              </div>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
