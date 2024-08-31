export interface ActivityData {
  summary_polyline?: string;
  distance?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  average_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  timezone?: string;
  start_date?: string;
}

export interface WeatherData {
  temperature_2m_mean?: number[];
  rain_sum?: number[];
  wind_speed_10m_max?: number[];
}

export interface ActivityDetail {
  distances: number[];
  average_speeds: number[];
  max_heartrates: number[];
  average_heartrates: number[];
  total_elevation_gains: number[];
}

export interface Activity {
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

export interface ProcessedActivity {
  activityId: number;
  polyline: string;
  distance: number;
  elapsedTime: number;
  averageSpeed: number;
  elevationGain: number;
  averageHeartrate: number;
  maxHeartrate: number;
  avgTemp?: number;
  rainSum?: number;
  windSpeed?: number;
  weatherStatus: {
    shouldHaveWeatherData: boolean;
    doesHaveWeatherData: boolean;
  };
  segments: any;
}
