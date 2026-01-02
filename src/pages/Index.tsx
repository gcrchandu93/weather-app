import { useState, useEffect } from "react";
import { CloudSun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { fetchWeather } from "@/lib/weather";
import { SearchBar } from "@/components/weather/SearchBar";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('metric');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCity, setLastCity] = useState<string>('');
  const { toast } = useToast();

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setLastCity(city);
    try {
      const data = await fetchWeather(city, unit);
      setWeather(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitToggle = async (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    if (lastCity) {
      setIsLoading(true);
      try {
        const data = await fetchWeather(lastCity, newUnit);
        setWeather(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update temperature unit",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            <CloudSun className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Weather</h1>
          </div>
          <UnitToggle unit={unit} onToggle={handleUnitToggle} />
        </header>

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Weather Content */}
        {weather ? (
          <div className="space-y-6">
            <CurrentWeather weather={weather} unit={unit} />
            <HourlyForecast hourly={weather.hourly} unit={unit} />
            <DailyForecast daily={weather.daily} unit={unit} />
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <CloudSun className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to Weather
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for a city to see current conditions, hourly updates, and a 6-day forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
