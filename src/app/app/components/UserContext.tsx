"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import { UserContainer } from "@/app/components/authed/components/UserContainer";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import grid from "../../assets/img/grid.png";

interface UserContextProps {
  loading: boolean;
  userData: any;
  supabase: any;
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
  const supabase = getSupabaseClient(token);

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.from("exploremap_users").select("*");
      if (data) {
        setUserData(data[0]);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider value={{ loading, userData, supabase }}>
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
