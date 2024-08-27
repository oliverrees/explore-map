interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
  weather: any;
  activity_detail: {
    distances: number[];
    average_speeds: number[];
    max_heartrates: number[];
    average_heartrates: number[];
    total_elevation_gains: number[];
  };
}

export const processMapData = (
  mapData: any,
  activitiesData: any,
  isOwner?: boolean
) => {
  let lastCoords: any = [];

  const activities = activitiesData.map((activity: Activity) => {
    const polyline = activity.activity_data?.map?.summary_polyline || "";
    const distance = activity.activity_data?.distance;
    const elapsedTime = activity.activity_data?.elapsed_time;
    const elevationGain = activity.activity_data?.total_elevation_gain;
    const averageSpeed = activity.activity_data?.average_speed * 3.6; // Convert m/s to km/h
    const averageHeartrate = activity.activity_data?.average_heartrate;
    const maxHeartrate = activity.activity_data?.max_heartrate;
    const avgTemp = activity.weather?.temperature_2m_mean?.[0];
    const rainSum = activity.weather?.rain_sum?.[0];
    const windSpeed = activity.weather?.wind_speed_10m_max?.[0];
    // Extract last coordinates
    lastCoords = activity.activity_data?.end_latlng || [];

    const returnObject = {
      activityId: activity.activity_id,
      polyline,
      distance,
      elapsedTime,
      averageSpeed,
      elevationGain,
      averageHeartrate,
      maxHeartrate,
      avgTemp,
      rainSum,
      windSpeed,
      // segments: activity.activity_detail,
    };
    return returnObject;
  });

  const totalDistance = activities.reduce(
    (total: number, activity: any) => total + activity.distance,
    0
  );
  const totalTime = activities.reduce(
    (total: any, activity: any) => total + activity.elapsedTime,
    0
  );
  const totalElevationGain = activities.reduce(
    (total: any, activity: any) => total + activity.elevationGain,
    0
  );

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

  const mostRecentActivity = activitiesData.reduce(
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

  const centerCoords = mapData.center_lat_lng || lastCoords;

  // Calculate min and max values
  const minMaxValues = {
    averageSpeed: [
      Math.min(
        ...activities
          .flatMap((a: any) => a.averageSpeed ?? [])
          .filter((v: any) => v != null)
      ),
      Math.max(
        ...activities
          .flatMap((a: any) => a.averageSpeed ?? [])
          .filter((v: any) => v != null)
      ),
    ],
    elevationGain: [
      Math.min(
        ...activities
          .flatMap((a: any) => a.elevationGain ?? [])
          .filter((v: any) => v != null)
      ),
      Math.max(
        ...activities
          .flatMap((a: any) => a.elevationGain ?? [])
          .filter((v: any) => v != null)
      ),
    ],
    averageHeartrate: [
      Math.min(
        ...activities
          .flatMap((a: any) => a.averageHeartrate ?? [])
          .filter((v: any) => v != null)
      ),
      Math.max(
        ...activities
          .flatMap((a: any) => a.averageHeartrate ?? [])
          .filter((v: any) => v != null)
      ),
    ],
    maxHeartrate: [
      Math.min(
        ...activities
          .flatMap((a: any) => a.maxHeartrate ?? [])
          .filter((v: any) => v != null)
      ),
      Math.max(
        ...activities
          .flatMap((a: any) => a.maxHeartrate ?? [])
          .filter((v: any) => v != null)
      ),
    ],
    avgTemp: [
      Math.min(
        ...activities.map((a: any) => a.avgTemp).filter((v: any) => v != null)
      ),
      Math.max(
        ...activities.map((a: any) => a.avgTemp).filter((v: any) => v != null)
      ),
    ],
    rainSum: [
      Math.min(
        ...activities.map((a: any) => a.rainSum).filter((v: any) => v != null)
      ),
      Math.max(
        ...activities.map((a: any) => a.rainSum).filter((v: any) => v != null)
      ),
    ],
    windSpeed: [
      Math.min(
        ...activities.map((a: any) => a.windSpeed).filter((v: any) => v != null)
      ),
      Math.max(
        ...activities.map((a: any) => a.windSpeed).filter((v: any) => v != null)
      ),
    ],
  };

  const standardObject = {
    totalActivities: activities.length,
    totalDistance,
    totalTime,
    totalElevationGain,
    startDate,
    endDate,
    mostRecentActivityId: mostRecentActivity.id,
    mapId: mapData.map_id,
    mapName: mapData.map_name,
    zoomLevel: mapData.zoom_level,
    slug: mapData.slug,
    createdAt: mapData.created_at,
    centerCoords,
    activities,
    minMaxValues,
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
