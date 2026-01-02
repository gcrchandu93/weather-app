import { TemperatureUnit } from "@/types/weather";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-glass-border backdrop-blur-sm">
      <button
        onClick={() => onToggle('metric')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          unit === 'metric'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('imperial')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          unit === 'imperial'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        °F
      </button>
    </div>
  );
}
