import { format } from "date-fns";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIconUrl, formatTemperature } from "@/lib/weather";

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
            className="flex-shrink-0 glass-card-hover p-4 min-w-[100px] text-center"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <p className="text-sm text-muted-foreground">
              {index === 0 ? 'Now' : format(new Date(hour.time * 1000), 'ha')}
            </p>
            <img
              src={getWeatherIconUrl(hour.icon)}
              alt={hour.description}
              className="w-12 h-12 mx-auto my-2"
            />
            <p className="font-mono text-lg font-semibold text-foreground">
              {formatTemperature(hour.temp, unit)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
