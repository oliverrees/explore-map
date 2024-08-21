import polyline from "@mapbox/polyline";

interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
}

export const processMapData = (mapData: any, activitiesData: any) => {
  // Process the activities to extract coordinates and other details
  const allCoords = activitiesData.map((activity: Activity) => {
    const coords = polyline.decode(
      activity.activity_data.map?.summary_polyline || ""
    );
    return { coords };
  });

  const activityIds = activitiesData.map(
    (activity: Activity) => activity.activity_id
  );

  // Calculate total distance (you can implement this if needed)
  const totalDistance = activitiesData.reduce(
    (total: any, activity: Activity) =>
      total + (activity.activity_data.distance || 0),
    0
  );

  // Calculate total moving time
  const totalTime = activitiesData.reduce(
    (total: any, activity: Activity) =>
      total + (activity.activity_data.elapsed_time || 0),
    0
  );

  // Calculate total elevation gain
  const totalElevationGain = activitiesData.reduce(
    (total: any, activity: Activity) =>
      total + (activity.activity_data.total_elevation_gain || 0),
    0
  );
  return {
    mapData,
    allCoords,
    activityIds,
    totalDistance,
    totalTime,
    totalElevationGain,
    activitiesData,
  };
};
