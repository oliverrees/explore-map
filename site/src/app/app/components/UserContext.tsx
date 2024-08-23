"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import { UserContainer } from "./UserContainer";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import grid from "../../assets/img/grid.png";

interface UserContextProps {
  loading: boolean;
  userData: any;
  mapData: any;
  supabase: any;
  fetchMapData: () => void;
  token: string;
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
      .select("map_id, map_name, slug");

    if (mapData) {
      setMapData(mapData);
    }
  };
  useEffect(() => {
    const getData = async () => {
      const { data: userData, error: userError } = await supabase
        .from("exploremap_users")
        .select("*");

      if (userData) {
        if (userData.length === 0) {
          // redirect to /auth/logout
          window.location.href = "/auth/logout";
        }
        setUserData(userData[0]);
        setLoading(false);
      }

      await fetchMapData(); // Fetch map data
    };

    getData();
  }, [supabase]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider
      value={{ loading, userData, mapData, fetchMapData, supabase, token }}
    >
      <div className="w-full">
        <UserContainer>{children}</UserContainer>
      </div>
    </UserContext.Provider>
  );
};
