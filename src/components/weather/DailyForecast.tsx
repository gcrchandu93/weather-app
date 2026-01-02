import { format } from "date-fns";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { getWeatherIconUrl, formatTemperature } from "@/lib/weather";

interface DailyForecastProps {
  daily: WeatherData['daily'];
  unit: TemperatureUnit;
}

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">6-Day Forecast</h3>
      <div className="space-y-2">
        {daily.map((day, index) => (
          <div
            key={day.date}
            className="glass-card-hover p-4 flex items-center justify-between"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-4 min-w-[140px]">
              <p className="text-foreground font-medium w-24">
                {index === 0 ? 'Today' : format(new Date(day.date * 1000), 'EEEE')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <img
                src={getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="w-10 h-10"
              />
              <p className="text-sm text-muted-foreground capitalize hidden sm:block w-24">
                {day.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-lg font-semibold text-foreground">
                {formatTemperature(day.high, unit)}
              </span>
              <span className="font-mono text-lg text-muted-foreground">
                {formatTemperature(day.low, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
