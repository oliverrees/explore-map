import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import { WaitingForDataScreen } from "./WaitingForDataScreen";
import { WaitingForData } from "./WaitingForData";
import { Layers } from "./Layers";
import ActivityPolyline from "./ActivityPolyline";
import { ExploreBadge } from "./ExploreBadge";
import StatsTable from "./StatsTable";

type Props = {
  data: any;
  isPublic: boolean;
  isScreenshot?: boolean;
  isHome?: boolean;
};

const Map = ({
  data,
  isPublic,
  isScreenshot = false,
  isHome = false,
}: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [activityId, setActivityId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(
    !isHome ? "averageSpeed" : "averageHeartrate"
  );
  const [dark, setDark] = useState(false);

  if (!data) return null;

  if (data.activities.length === 0) {
    return isPublic ? (
      <WaitingForDataScreen />
    ) : (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <WaitingForData />
      </div>
    );
  }

  if (data.centerCoords.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        Error loading GPS data
      </div>
    );
  }

  const tileUrl =
    showSatellite || isHome
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

  return (
    <div
      className={`w-full h-full flex flex-col ${
        dark ? "map-dark" : isHome ? "map-home" : "not-dark"
      }`}
    >
      {!isScreenshot && !isHome && (
        <ExploreBadge
          isScreenshot={isScreenshot}
          isPublic={isPublic}
          dark={dark}
        />
      )}
      <div className="h-full w-full relative">
        {!isScreenshot && (
          <>
            <Layers
              selectedLayer={selectedLayer}
              setSelectedLayer={setSelectedLayer}
              minMaxValues={
                data.activitiesWithSegmentsCount > 0
                  ? data.minMaxSegments
                  : data.minMaxActivities
              }
              dark={dark}
              isSegments={data.activitiesWithSegmentsCount > 0}
              isHome={isHome}
            />
            {!isHome && (
              <Sidebar
                open={open}
                onClose={() => setOpen(false)}
                activityId={activityId}
                mapId={data.mapId}
              />
            )}
          </>
        )}
        <MapContainer
          center={data.centerCoords}
          zoom={data.zoomLevel}
          maxZoom={20}
          minZoom={1}
          className="w-full h-full z-0 relative"
          scrollWheelZoom={isHome ? false : true}
          zoomControl={isScreenshot || isHome ? false : true}
        >
          <TileLayer attribution="Powered by Esri" url={tileUrl} />
          {data.activities.map((activity: any, i: number) => (
            <ActivityPolyline
              key={i}
              activity={activity}
              selectedLayer={selectedLayer}
              showPins={showPins}
              data={data}
              onMarkerClick={(id: number) => {
                setActivityId(id);
                setOpen(true);
              }}
            />
          ))}
        </MapContainer>
        {!isScreenshot && !isHome && (
          <div className="absolute bottom-0 left-0 w-full z-50 flex justify-between flex-col items-start lg:w-auto">
            <Stats data={data} showSatellite={showSatellite} dark={dark} />
          </div>
        )}
      </div>
      {!isScreenshot && !isHome && (
        <div className="lg:fixed bottom-0 md:bottom-10 left-0 right-0 md:right-10 md:left-auto">
          <StatsTable
            data={data}
            showPins={showPins}
            onChangeShowPins={setShowPins}
            showSatellite={showSatellite}
            onChangeShowSatellite={setShowSatellite}
            dark={dark}
            onChangeDark={setDark}
          />
        </div>
      )}
    </div>
  );
};

export default Map;
