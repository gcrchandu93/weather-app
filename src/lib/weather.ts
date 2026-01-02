import { supabase } from "@/integrations/supabase/client";
import { WeatherData, TemperatureUnit } from "@/types/weather";

export async function fetchWeather(city: string, units: TemperatureUnit): Promise<WeatherData> {
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

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  return `${temp}°${unit === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  return unit === 'metric' ? `${speed} m/s` : `${speed} mph`;
}
