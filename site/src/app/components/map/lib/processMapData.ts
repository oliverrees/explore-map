interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
  weather: any;
}

export const processMapData = (
  mapData: any,
  activitiesData: any,
  isOwner?: boolean
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

  // Array of avg speeds
  const avgSpeeds = activitiesData.map((activity: Activity) => {
    return activity.activity_data.average_speed || 0;
  });

  // Array of avg heartrates
  const avgHeartrates = activitiesData.map((activity: Activity) => {
    return activity.activity_data.average_heartrate || 0;
  });

  // Array of total_elevation_gain
  const totalElevationGains = activitiesData.map((activity: Activity) => {
    return activity.activity_data.total_elevation_gain || 0;
  });

  const startDate = new Date(
    Math.min(
      ...activitiesData.map(
        (activity: Activity) => new Date(activity.activity_data.start_date)
      )
    )
  );
  const endDate = new Date(
    Math.max(
      ...activitiesData.map(
        (activity: Activity) => new Date(activity.activity_data.start_date)
      )
    )
  );

  // Array of avg temperatures
  const avgTemp = activitiesData.map(
    (activity: Activity) => activity.weather?.temperature_2m_mean || 0
  );

  // Array of rain sum
  const rainSum = activitiesData.map(
    (activity: Activity) => activity.weather?.rain_sum || 0
  );

  // Array of wind speed
  const windSpeed = activitiesData.map(
    (activity: Activity) => activity.weather?.wind_speed_10m_max || 0
  );

  // Array of max heart rates
  const maxHeartRates = activitiesData.map(
    (activity: Activity) => activity.activity_data.max_heartrate || 0
  );

  // Calculate center point
  const centerPoint = mapData.center_lat_lng || null;

  // Most recent activity Id
  const mostRecentActivityId = activitiesData.reduce(
    (mostRecent: any, activity: Activity) => {
      if (new Date(activity.activity_data.start_date) > mostRecent.date) {
        return {
          date: new Date(activity.activity_data.start_date),
          id: activity.activity_id,
        };
      }
      return mostRecent;
    },
    { date: new Date(0), id: 0 }
  );
  const standardObject = {
    totalActivities: activityIds.length,
    activityIds,
    mapId: mapData.map_id,
    mapName: mapData.map_name,
    polyLines,
    totalDistance,
    totalTime,
    totalElevationGain,
    startDate,
    endDate,
    zoomLevel: mapData.zoom_level,
    slug: mapData.slug,
    createdAt: mapData.created_at,
    mostRecentActivityId: mostRecentActivityId.id,
    avgSpeeds,
    avgHeartrates,
    avgTemp,
    rainSum,
    windSpeed,
    totalElevationGains,
    centerPoint,
    maxHeartRates,
  };

  if (isOwner) {
    return {
      ...standardObject,
      mapData,
      activitiesData,
    };
  }
  return standardObject;
};
