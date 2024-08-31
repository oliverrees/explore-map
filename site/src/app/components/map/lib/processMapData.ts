import { Activity } from "./types/types";

export const processMapData = (
  mapData: any,
  activitiesData: any,
  isOwner?: boolean
) => {
  let lastCoords: any = [];
  let weatherToGet: any = [];

  const useSegments =
    activitiesData.length < (process.env.NEXT_SEGMENT_LIMIT || 0);
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
    const shouldHaveWeatherData =
      activity.activity_data.start_latlng[0] &&
      activity.activity_data.start_latlng[1] &&
      activity.activity_data.timezone &&
      activity.activity_data.start_date
        ? true
        : false;
    // Extract last coordinates
    lastCoords = activity.activity_data?.end_latlng || [];

    if (!shouldHaveWeatherData) {
      // console.warn(
      //   `Activity ${activity.activity_id} does not have the required data to fetch weather`
      // );
    } else if (!activity.weather) {
      weatherToGet.push(activity.activity_id);
    }
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
      weatherStatus: {
        shouldHaveWeatherData,
        doesHaveWeatherData: activity.weather ? true : false,
      },
      segments:
        useSegments && activity.activity_detail
          ? activity.activity_detail
          : null,
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
  const minMaxActivities = {
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

  let minMaxSegments: any = {
    averageCadence: [Infinity, 0],
    averageSpeeds: [Infinity, 0],
    totalElevationGains: [Infinity, 0],
    averageHeartrates: [Infinity, 0],
    maxHeartrates: [Infinity, 0],
    distances: [Infinity, 0],
    averageWatts: [Infinity, 0],
    avgTemp: [minMaxActivities.avgTemp[0], minMaxActivities.avgTemp[1]],
    rainSum: [minMaxActivities.rainSum[0], minMaxActivities.rainSum[1]],
    windSpeed: [minMaxActivities.windSpeed[0], minMaxActivities.windSpeed[1]],
  };

  // Loop through all activity segments and find the minmax values
  activities.forEach((activity: any) => {
    if (activity.segments) {
      // For each segment, loop through all the values and find the minmax
      Object.keys(activity.segments).forEach((key) => {
        // Multiply speed by 3.6 to convert m/s to km/h
        activity.segments[key] = activity.segments[key].map((value: any) =>
          key === "averageSpeeds" ? value * 3.6 : value
        );
        const values = activity?.segments[key];
        if (values) {
          const min = Math.min(...values);
          const max = Math.max(...values);
          if (minMaxSegments[key][0] > min) {
            minMaxSegments[key][0] = min;
          }
          if (minMaxSegments[key][1] < max) {
            minMaxSegments[key][1] = max;
          }
        }
      });
    }
  });

  const activitiesWithSegmentsCount = activities.filter(
    (activity: any) => activity.segments
  ).length;

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
    minMaxActivities,
    minMaxSegments,
    activitiesWithSegmentsCount,
  };

  if (isOwner) {
    return {
      ...standardObject,
      mapData,
      activitiesData,
      weatherToGet,
      activityIds: activities.map((activity: any) => activity.activityId),
      activitiesWithSegmentsCount,
    };
  }

  return standardObject;
};
