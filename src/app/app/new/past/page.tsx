"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import Pagination from "./components/Pagination";
import { CardHolder } from "../../components/CardHolder";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text.toUpperCase();
}

interface Activity {
  id: number;
  strava_id: number;
  activity_id: number;
  activity_data: any;
}

export default function ActivitiesTable() {
  const router = useRouter();
  const { userData, supabase, fetchMapData } = useUserContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Fetching activities from Strava..."
  );
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "start_date", // Sort by start_date initially
    direction: "descending", // Descending order
  });
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 250;

  // State to handle selected activities
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const fetchActivitiesFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("exploremap_activities")
        .select("*")
        .eq("strava_id", userData.strava_id);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        if (data.length === 0) {
          syncActivitiesWithStrava();
        } else {
          setActivities(data);
          setLoading(false);
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  const syncActivitiesWithStrava = async (forceReload?: boolean) => {
    try {
      setLoading(true);
      const response = await fetch("/auth/get-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forceReload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync activities with Strava");
      }

      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivitiesFromSupabase();
  }, []);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedActivities = () => {
    let sortableItems = [...activities];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a.activity_data[sortConfig.key];
        let bValue = b.activity_data[sortConfig.key];

        if (sortConfig.key === "distance") {
          aValue = aValue / 1000;
          bValue = bValue / 1000;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const paginatedActivities = sortedActivities().slice(
    (currentPage - 1) * activitiesPerPage,
    currentPage * activitiesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectActivity = (activity: Activity) => {
    const isSelected = selectedActivities.includes(activity.activity_id);
    if (isSelected) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activity.activity_id)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity.activity_id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === activities.length) {
      setSelectedActivities([]); // Deselect all if all are selected
    } else {
      setSelectedActivities(activities.map((activity) => activity.activity_id)); // Select all
    }
  };

  const handleSyncButtonClick = async () => {
    await syncActivitiesWithStrava(true);
  };

  const createMap = async () => {
    setLoading(true);
    setLoadingMessage("Creating map...");
    const mapId = makeid();
    const { error } = await supabase.from("exploremap_maps").insert({
      strava_id: userData.strava_id,
      unique_id: userData.unique_id,
      map_id: mapId,
      map_activities: selectedActivities,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      fetchMapData();
      router.push(`/app/map/${mapId}`);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between p-6 gap-4">
      <CardHolder>
        <div className="px-4 py-5 sm:p-6 flex justify-between items-center w-full">
          <div>
            <h3 className="text-2xl font-semibold font-display leading-6 text-gray-900">
              Select Activities
            </h3>
            <div className="mt-4 max-w-xl text-sm text-gray-500">
              <p>
                Select the activities you want to include in your ExploreMap
              </p>
            </div>
          </div>
        </div>
      </CardHolder>
      {loading ? (
        <>
          <div className="flex justify-center items-center h-full w-full py-12 flex-col">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500">{loadingMessage}</p>
          </div>
        </>
      ) : (
        <>
          {error && (
            <CardHolder classNames="p-4 text-center">
              <div className="text-red-500">ERROR: {error}</div>
            </CardHolder>
          )}
          <div className="flex justify-center p-2 gap-4">
            <button
              type="button"
              onClick={handleSyncButtonClick}
              className="block rounded-md border-gray-500 bg-white border px-3 py-1.5 text-center text-sm font-semibold leading-6 text-black shadow-sm w-full"
            >
              <ArrowPathIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
              Get new Activities
            </button>
            <button
              disabled={selectedActivities.length === 0}
              style={{
                cursor: selectedActivities.length === 0 ? "not-allowed" : "",
                opacity: selectedActivities.length === 0 ? 0.5 : 1,
              }}
              type="button"
              onClick={createMap}
              className="block rounded-md bg-blue-600 px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full"
            >
              <MapIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
              Create Map
            </button>
          </div>
          <CardHolder classNames="relative overflow-auto">
            <table className="min-w-full table-fixed">
              <TableHeader
                sortConfig={sortConfig}
                handleSort={handleSort}
                isAllSelected={selectedActivities.length === activities.length} // Pass the state to the header
                handleSelectAll={handleSelectAll} // Pass the select all handler to the header
              />
              <tbody className="divide-y divide-gray-200 bg-white ">
                {paginatedActivities.map((activity) => (
                  <TableRow
                    key={activity.activity_id}
                    activity={activity}
                    selected={selectedActivities.includes(activity.activity_id)}
                    onSelect={handleSelectActivity}
                  />
                ))}
              </tbody>
            </table>
          </CardHolder>
          <div className="mt-4 flex justify-center w-full">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(activities.length / activitiesPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
