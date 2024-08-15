"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import { UserContainer } from "@/app/components/authed/components/UserContainer";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import grid from "../../assets/img/grid.png";

interface UserContextProps {
  loading: boolean;
  userData: any;
  mapData: any;
  supabase: any;
  fetchMapData: () => void;
}

interface UserProviderProps {
  token: string;
  children: React.ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({
  token,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [mapData, setMapData] = useState<any[]>([]);
  const supabase = getSupabaseClient(token);
  const fetchMapData = async () => {
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .select("map_id, map_name");

    if (mapData) {
      setMapData(mapData);
    }
  };
  useEffect(() => {
    const getData = async () => {
      const { data: userData, error: userError } = await supabase
        .from("exploremap_users")
        .select("*");

      await fetchMapData(); // Fetch map data

      if (userData) {
        setUserData(userData[0]);
        setLoading(false);
      }
    };

    getData();
  }, [supabase]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider
      value={{ loading, userData, mapData, fetchMapData, supabase }}
    >
      <div className="w-full flex">
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <UserContainer />
        </div>
        <div className="lg:pl-72 w-full relative min-h-screen">
          <div
            style={{
              backgroundImage: `url(${grid.src})`,
            }}
            className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full -z-10 bg-repeat opacity-50"
          />
          {children}
        </div>
      </div>
    </UserContext.Provider>
  );
};
