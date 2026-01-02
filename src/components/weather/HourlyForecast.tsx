import { format } from "date-fns";
import { Droplets, Wind } from "lucide-react";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIconUrl, formatTemperature, formatWindSpeed } from "@/lib/weather";

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];
  unit: TemperatureUnit;
}

export function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {hourly.map((hour, index) => (
          <div
            key={hour.time}
            className="flex-shrink-0 glass-card-hover p-4 min-w-[120px] text-center"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <p className="text-sm text-muted-foreground font-medium">
              {index === 0 ? 'Now' : format(new Date(hour.time * 1000), 'ha')}
            </p>
            <img
              src={getWeatherIconUrl(hour.icon)}
              alt={hour.description}
              className="w-12 h-12 mx-auto my-2"
            />
            <p className="font-mono text-xl font-semibold text-foreground">
              {formatTemperature(hour.temp, unit)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Feels {formatTemperature(hour.feels_like, unit)}
            </p>
            
            {/* Additional details */}
            <div className="mt-3 pt-3 border-t border-glass-border space-y-1">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Droplets className="h-3 w-3" />
                <span>{hour.humidity}%</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Wind className="h-3 w-3" />
                <span>{formatWindSpeed(hour.wind_speed, unit)}</span>
              </div>
              {hour.pop > 0 && (
                <div className="text-xs text-primary">
                  {hour.pop}% rain
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
