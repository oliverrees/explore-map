import React, { createContext, useContext } from "react";

interface MapDataContextType {
  data: any;
  loading: boolean;
  updateMapData: (mapSlug: string) => Promise<void>;
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export const useMapData = () => {
  const context = useContext(MapDataContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapDataProvider");
  }
  return context;
};

export const MapDataProvider: React.FC<{
  data: any;
  loading: boolean;
  updateMapData: (mapSlug: string) => Promise<void>;
  children: React.ReactNode;
}> = ({ data, loading, updateMapData, children }) => {
  return (
    <MapDataContext.Provider value={{ data, loading, updateMapData }}>
      {children}
    </MapDataContext.Provider>
  );
};
