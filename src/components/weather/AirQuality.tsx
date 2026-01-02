import { Wind, Leaf } from "lucide-react";
import { WeatherData, AQI_LABELS } from "@/types/weather";

interface AirQualityProps {
  airQuality: NonNullable<WeatherData['airQuality']>;
}

export function AirQuality({ airQuality }: AirQualityProps) {
  const aqiInfo = AQI_LABELS[airQuality.aqi] || { label: 'Unknown', color: 'text-muted-foreground' };
  
  const pollutants = [
    { name: 'PM2.5', value: airQuality.components.pm2_5, unit: 'μg/m³' },
    { name: 'PM10', value: airQuality.components.pm10, unit: 'μg/m³' },
    { name: 'O₃', value: airQuality.components.o3, unit: 'μg/m³' },
    { name: 'NO₂', value: airQuality.components.no2, unit: 'μg/m³' },
    { name: 'SO₂', value: airQuality.components.so2, unit: 'μg/m³' },
    { name: 'CO', value: airQuality.components.co, unit: 'μg/m³' },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Air Quality
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${aqiInfo.color}`}>{airQuality.aqi}</span>
          <span className={`text-sm font-medium ${aqiInfo.color}`}>{aqiInfo.label}</span>
        </div>
      </div>
      
      {/* AQI Scale indicator */}
      <div className="mb-6">
        <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 to-purple-400 relative">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-2 border-background shadow-lg"
            style={{ left: `${((airQuality.aqi - 1) / 4) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Good</span>
          <span>Fair</span>
          <span>Moderate</span>
          <span>Poor</span>
          <span>Very Poor</span>
        </div>
      </div>

      {/* Pollutant breakdown */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="glass-card-hover p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{pollutant.name}</p>
            <p className="text-sm font-semibold text-foreground">{pollutant.value.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">{pollutant.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
