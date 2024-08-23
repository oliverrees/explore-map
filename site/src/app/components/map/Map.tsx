"use client";
import polyline from "@mapbox/polyline";
import React, { Suspense, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import { WaitingForDataScreen } from "./WaitingForDataScreen";
import { WaitingForData } from "./WaitingForData";

type Props = {
  data: any;
  isPublic: boolean;
};

const Map = ({ data, isPublic }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityData, setActivityData] = useState({});
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const [animationCoords, setAnimationCoords] = useState<any>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const centerCoords: any = [];

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationCoords((prev: any) => {
          if (prev.length === combinedCoords.length) {
            setIsAnimating(false);
            setAnimationCoords([]);
            return prev;
          }
          return [...prev, combinedCoords[prev.length]];
        });
      }, 5);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const coords = data.polyLines.map((line: any, indx: number) => {
    const activityId = data.activityIds[indx];

    const coords = polyline.decode(line);
    if (activityId === data.mostRecentActivityId) {
      centerCoords.push(coords[coords.length - 1]);
    }

    return { coords };
  });

  const combinedCoords = coords.reduce((acc: any, val: any) => {
    return acc.concat(val.coords);
  }, []);

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

      <div className="w-full h-full relative z-0">
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          activityData={activityData}
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
          {!isAnimating ? (
            coords.map((activity: any, i: number) => {
              // Check if there in a lat and lng
              if (!activity.coords[0]) return null;
              return (
                <div key={i}>
                  <Polyline
                    pathOptions={{
                      fillColor: "rgb(37 99 235)",
                      color: "rgb(37 99 235)",
                    }}
                    positions={activity.coords}
                  />
                  {showPins && (
                    <Marker
                      icon={L.icon({
                        iconUrl: "/marker.png",
                        iconSize: [27, 40],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      })}
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
            })
          ) : (
            <Polyline
              pathOptions={{
                fillColor: "rgb(37 99 235)",
                color: "rgb(37 99 235)",
              }}
              positions={animationCoords}
            />
          )}
        </MapContainer>
      </div>
      {/* <div className="absolute bottom-0 left-0 z-10">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Animate
        </button>
      </div> */}
    </>
  );
};

export default Map;
