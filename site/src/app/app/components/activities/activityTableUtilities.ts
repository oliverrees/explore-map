// activityTableUtilities.ts

interface Activity {
  id: number;
  strava_id: number;
  activity_id: number;
  activity_data: any;
}

interface SortConfig {
  key: string;
  direction: string;
}

export const sortActivities = (
  activities: Activity[],
  sortConfig: SortConfig
): Activity[] => {
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

export const handleSort = (
  key: string,
  sortConfig: SortConfig,
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>
) => {
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

export const handleSelectActivity = (
  activity: Activity,
  selectedActivities: number[],
  setSelectedActivities: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const isSelected = selectedActivities.includes(activity.activity_id);
  if (isSelected) {
    setSelectedActivities(
      selectedActivities.filter((id) => id !== activity.activity_id)
    );
  } else {
    setSelectedActivities([...selectedActivities, activity.activity_id]);
  }
};

export const handleSelectAll = (
  activities: Activity[],
  selectedActivities: number[],
  setSelectedActivities: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (selectedActivities.length === activities.length) {
    setSelectedActivities([]); // Deselect all if all are selected
  } else {
    setSelectedActivities(activities.map((activity) => activity.activity_id)); // Select all
  }
};
