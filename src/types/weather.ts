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
  };
  hourly: {
    time: number;
    temp: number;
    icon: string;
    description: string;
  }[];
  daily: {
    date: number;
    high: number;
    low: number;
    icon: string;
    description: string;
  }[];
}

export type TemperatureUnit = 'metric' | 'imperial';
