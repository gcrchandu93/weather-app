import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIconUrl, formatTemperature, formatWindSpeed } from "@/lib/weather";

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function CurrentWeather({ weather, unit }: CurrentWeatherProps) {
  const { current, city, country } = weather;

  return (
    <div className="glass-card p-8 text-center animate-fade-in relative">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Location */}
      <div className="relative">
        <h2 className="text-2xl font-semibold text-foreground">
          {city}{country && <span className="text-muted-foreground">, {country}</span>}
        </h2>
        <p className="text-muted-foreground capitalize mt-1">{current.description}</p>
      </div>

      {/* Main temperature display */}
      <div className="relative flex items-center justify-center gap-4 my-6">
        <img
          src={getWeatherIconUrl(current.icon)}
          alt={current.description}
          className="w-32 h-32 weather-icon"
        />
        <div className="text-left">
          <p className="temp-display text-8xl text-foreground glow-text">
            {formatTemperature(current.temp, unit)}
          </p>
          <p className="text-muted-foreground text-lg mt-1">
            Feels like {formatTemperature(current.feels_like, unit)}
          </p>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        <div className="glass-card-hover p-4">
          <Droplets className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Humidity</p>
          <p className="text-xl font-semibold text-foreground">{current.humidity}%</p>
        </div>
        <div className="glass-card-hover p-4">
          <Wind className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Wind</p>
          <p className="text-xl font-semibold text-foreground">{formatWindSpeed(current.wind_speed, unit)}</p>
        </div>
        <div className="glass-card-hover p-4">
          <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Visibility</p>
          <p className="text-xl font-semibold text-foreground">{(current.visibility / 1000).toFixed(1)} km</p>
        </div>
        <div className="glass-card-hover p-4">
          <Gauge className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Pressure</p>
          <p className="text-xl font-semibold text-foreground">{current.pressure} hPa</p>
        </div>
        <div className="glass-card-hover p-4">
          <Sunrise className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Sunrise</p>
          <p className="text-xl font-semibold text-foreground">
            {format(new Date(current.sunrise * 1000), 'h:mm a')}
          </p>
        </div>
        <div className="glass-card-hover p-4">
          <Sunset className="h-6 w-6 text-orange-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Sunset</p>
          <p className="text-xl font-semibold text-foreground">
            {format(new Date(current.sunset * 1000), 'h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
}
