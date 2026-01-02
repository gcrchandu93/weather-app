export interface WeatherData {
  city: string;
  country: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
    visibility: number;
    pressure: number;
    sunrise: number;
    sunset: number;
  };
  hourly: {
    time: number;
    temp: number;
    feels_like: number;
    icon: string;
    description: string;
    humidity: number;
    wind_speed: number;
    pop: number; // Probability of precipitation
  }[];
  daily: {
    date: number;
    high: number;
    low: number;
    icon: string;
    description: string;
    pop: number;
  }[];
  airQuality: {
    aqi: number; // 1-5 scale
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
      so2: number;
    };
  } | null;
}

export type TemperatureUnit = 'metric' | 'imperial';

export const AQI_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Good', color: 'text-green-400' },
  2: { label: 'Fair', color: 'text-yellow-400' },
  3: { label: 'Moderate', color: 'text-orange-400' },
  4: { label: 'Poor', color: 'text-red-400' },
  5: { label: 'Very Poor', color: 'text-purple-400' },
};
