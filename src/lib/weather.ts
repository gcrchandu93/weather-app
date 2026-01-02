import { supabase } from "@/integrations/supabase/client";
import { WeatherData, TemperatureUnit } from "@/types/weather";

export async function fetchWeatherByCity(city: string, units: TemperatureUnit): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('weather', {
    body: { city, units }
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch weather data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as WeatherData;
}

export async function fetchWeatherByCoords(lat: number, lon: number, units: TemperatureUnit): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('weather', {
    body: { lat, lon, units }
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch weather data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as WeatherData;
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  return `${temp}°${unit === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  return unit === 'metric' ? `${speed.toFixed(1)} m/s` : `${speed.toFixed(1)} mph`;
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // Cache for 5 minutes
    });
  });
}
