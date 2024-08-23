import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { ArrowPathIcon, MapIcon } from "@heroicons/react/24/outline";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { CardHolder } from "../CardHolder";
import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext";
import {
  sortActivities,
  handleSort,
  handleSelectActivity,
  handleSelectAll,
} from "./activityTableUtilities";

interface ActivityTableProps {
  onConfirm: (selectedActivities: number[]) => void;
  initialSelectedActivities?: number[];
  ctaText?: string;
}

interface Activity {
  id: number;
  strava_id: number;
  activity_id: number;
  activity_data: any;
}

export const ActivityTable = ({
  onConfirm,
  ctaText = "Create Map",
  initialSelectedActivities,
}: ActivityTableProps) => {
  const { userData, supabase } = useUserContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading activities");
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

  const [selectedActivities, setSelectedActivities] = useState<number[]>(
    initialSelectedActivities || []
  );
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  ); // For shift-click selection

  const checkTaskStatus = async () => {
    try {
      const response = await fetch(
        `/api/check-function-status?stravaId=${userData.strava_id}`
      );
      const result = await response.json();
      const updatedDate = new Date(result.lastUpdated);
      const currentDate = new Date();
      const diff = currentDate.getTime() - updatedDate.getTime();
      const diffInMinutes = diff / 1000 / 60;

      if (diffInMinutes > 5) {
        fetchActivitiesFromSupabase();
        setLoading(false);
      }

      if (result.status === "in_progress") {
        setError(null);
        setLoading(true);
        setLoadingMessage("Loading activities from Strava...");
      } else if (result.status === "completed") {
        setError(null);
        fetchActivitiesFromSupabase();
      } else if (result.status === "failed") {
        setLoading(false);
        setError("Failed to sync activities.");
      }
    } catch (err: any) {
      setLoading(false);
      setError("Failed to check task status.");
    }
  };

  const fetchActivitiesFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("exploremap_activities")
        .select(
          `
          id,
          strava_id,
          activity_id,
          activity_data
        `
        )
        .eq("strava_id", userData.strava_id);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        if (data.length === 0) {
          syncActivitiesWithStrava();
          checkTaskStatus();
        } else {
          setActivities(data);
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  const syncActivitiesWithStrava = async (forceReload?: boolean) => {
    setLoadingMessage("Loading activities from Strava...");
    const { data, error } = await supabase.functions.invoke(
      "fetch-strava-activities",
      {
        body: { stravaId: userData.strava_id },
      }
    );

    if (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    checkTaskStatus();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        checkTaskStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const paginatedActivities = sortActivities(activities, sortConfig).slice(
    (currentPage - 1) * activitiesPerPage,
    currentPage * activitiesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSyncButtonClick = async () => {
    setLoading(true);
    setTimeout(() => {
      checkTaskStatus();
    }, 500);
    await syncActivitiesWithStrava(true);
  };

  const handleShiftSelect = (index: number) => {
    if (lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const activitiesToSelect = paginatedActivities.slice(start, end + 1);
      const activityIds = activitiesToSelect.map(
        (activity) => activity.activity_id
      );

      setSelectedActivities((prevSelected) => [
        ...new Set([...prevSelected, ...activityIds]),
      ]);
    }
    setLastSelectedIndex(index);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full w-full py-12 flex-col">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500">{loadingMessage}</p>
        </div>
      ) : (
        <>
          {error && (
            <CardHolder classNames="p-4 text-center">
              <div className="text-red-500">ERROR: {error}</div>
            </CardHolder>
          )}

          <CardHolder classNames={`relative overflow-auto`}>
            <table className="min-w-full table-fixed font-light">
              <TableHeader
                sortConfig={sortConfig}
                handleSort={(key) => handleSort(key, sortConfig, setSortConfig)}
                isAllSelected={paginatedActivities.every((activity) =>
                  selectedActivities.includes(activity.activity_id)
                )}
                handleSelectAll={() =>
                  handleSelectAll(
                    paginatedActivities,
                    selectedActivities,
                    setSelectedActivities
                  )
                }
              />
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedActivities.map((activity, index) => (
                  <TableRow
                    key={activity.activity_id}
                    activity={activity}
                    selected={selectedActivities.includes(activity.activity_id)}
                    onSelect={(e) => {
                      if (e.shiftKey) {
                        handleShiftSelect(index);
                      } else {
                        handleSelectActivity(
                          activity,
                          selectedActivities,
                          setSelectedActivities
                        );
                        setLastSelectedIndex(index);
                      }
                    }}
                  />
                ))}
              </tbody>
            </table>
          </CardHolder>
          <div className="flex justify-center pb-2 mt-4 gap-4">
            <button
              type="button"
              onClick={handleSyncButtonClick}
              className="block rounded-md border-gray-500 bg-white border px-3 py-1.5 text-center text-sm font-semibold leading-6 text-black shadow-sm w-full"
            >
              <ArrowPathIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
              Sync{" "}
              <span className="hidden md:inline-block">
                activities from Strava
              </span>
            </button>
            <button
              disabled={selectedActivities.length === 0}
              style={{
                cursor: selectedActivities.length === 0 ? "not-allowed" : "",
                opacity: selectedActivities.length === 0 ? 0.5 : 1,
              }}
              type="button"
              onClick={() => onConfirm(selectedActivities)}
              className="block rounded-md bg-blue-600 px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full"
            >
              <MapIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
              {ctaText}
            </button>
          </div>
          <div className="mt-2 flex justify-center w-full">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(activities.length / activitiesPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};
