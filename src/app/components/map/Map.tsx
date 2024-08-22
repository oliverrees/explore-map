"use client";
import polyline from "@mapbox/polyline";
import React, { Suspense, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import Stats from "./Stats";
import Sidebar from "./Sidebar";

type Props = {
  data: any;
};

const Map = ({ data }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityData, setActivityData] = useState(0);
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);

  const coords = data.polyLines.map((line: any) => {
    const coords = polyline.decode(line);
    return { coords };
  });

  if (!data) return null;
  if (coords.length === 0) return null;

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
          setOpen={setOpen}
          activityData={activityData}
          activityId={activityId}
          mapId={data.mapId}
        />
        <MapContainer
          center={coords[0].coords[0]}
          zoom={10}
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
                        if (data.activitiesData) {
                          setActivityData(
                            data.activitiesData[i]?.activity_data
                          );
                          setActivityId(data.activitiesData[i]?.activity_id);
                        } else {
                          setActivityId(i);
                        }
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
