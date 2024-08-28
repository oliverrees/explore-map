import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import { WaitingForDataScreen } from "./WaitingForDataScreen";
import { WaitingForData } from "./WaitingForData";
import { Layers } from "./Layers";
import ActivityPolyline from "./ActivityPolyline";

type Props = {
  data: any;
  isPublic: boolean;
};

const Map = ({ data, isPublic }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("averageSpeed");
  const [dark, setShowDark] = useState(false);

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

  return (
    <div className={`w-full h-full ${dark ? "map-dark" : "not-dark"}`}>
      <Stats
        data={data}
        showPins={showPins}
        showSatellite={showSatellite}
        onChangeShowPins={setShowPins}
        onChangeShowSatellite={setShowSatellite}
        dark={dark}
        onChangeDark={setShowDark}
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
          {data.activities.map((activity: any, i: number) => (
            <ActivityPolyline
              key={i}
              activity={activity}
              selectedLayer={selectedLayer}
              showPins={showPins}
              data={data}
              onMarkerClick={(activityId: number) => {
                setActivityId(activityId);
                setOpen(true);
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
