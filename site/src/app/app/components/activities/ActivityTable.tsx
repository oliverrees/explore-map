import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { ArrowPathIcon, MapIcon } from "@heroicons/react/24/outline";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { CardHolder } from "../CardHolder";
import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext";

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
  const [selectedActivities, setSelectedActivities] = useState<number[]>(
    initialSelectedActivities || []
  );

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
    setLoadingMessage("Syncing activities with Strava...");
    const { data, error } = await supabase.functions.invoke('fetch-strava-activities', {
      body: { stravaId: userData.strava_id }
      
    })

    console.log(data)
    
    if (error) {
      setError(error.message);
    } else {
      fetchActivitiesFromSupabase();
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
  return (
    <>
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

          <CardHolder classNames={`relative overflow-auto`}>
            <table className="min-w-full table-fixed font-light">
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
