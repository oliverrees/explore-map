interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
}

export const processMapData = (
  mapData: any,
  activitiesData: any,
  withoutActivities?: boolean
) => {
  const polyLines = activitiesData.map((activity: Activity) => {
    return activity.activity_data.map?.summary_polyline || "";
  });

  // Calculate total distance (you can implement this if needed)
  const totalDistance = activitiesData.reduce(
    (total: any, activity: Activity) =>
      total + (activity.activity_data.distance || 0),
    0
  );

  const activityIds = activitiesData.map(
    (activity: Activity) => activity.activity_id
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
  const finalMapData = {
    totalActivities: activityIds.length,
    mapData,
    polyLines,
    totalDistance,
    totalTime,
    totalElevationGain,
  };
  if (withoutActivities) {
    return finalMapData;
  }
  return {
    ...finalMapData,
    activitiesData,
    activityIds,
  };
};
