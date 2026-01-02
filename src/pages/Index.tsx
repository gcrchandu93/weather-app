import { useState, useEffect } from "react";
import { CloudSun, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeatherData, TemperatureUnit } from "@/types/weather";
import { fetchWeatherByCity, fetchWeatherByCoords, getUserLocation } from "@/lib/weather";
import { SearchBar } from "@/components/weather/SearchBar";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { AirQuality } from "@/components/weather/AirQuality";

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('metric');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<{ type: 'city' | 'coords'; city?: string; lat?: number; lon?: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const { toast } = useToast();

  // Auto-detect location on load
  useEffect(() => {
    const loadUserLocation = async () => {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        setLastSearch({ type: 'coords', lat: latitude, lon: longitude });
        const data = await fetchWeatherByCoords(latitude, longitude, unit);
        setWeather(data);
      } catch (error) {
        console.log('Could not get user location:', error);
        // Silently fail - user can search manually
      } finally {
        setLocationLoading(false);
      }
    };

    loadUserLocation();
  }, []);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setLastSearch({ type: 'city', city });
    try {
      const data = await fetchWeatherByCity(city, unit);
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

  const handleUseMyLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      setLastSearch({ type: 'coords', lat: latitude, lon: longitude });
      const data = await fetchWeatherByCoords(latitude, longitude, unit);
      setWeather(data);
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get your location. Please allow location access or search for a city.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitToggle = async (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    if (lastSearch) {
      setIsLoading(true);
      try {
        let data: WeatherData;
        if (lastSearch.type === 'city' && lastSearch.city) {
          data = await fetchWeatherByCity(lastSearch.city, newUnit);
        } else if (lastSearch.lat && lastSearch.lon) {
          data = await fetchWeatherByCoords(lastSearch.lat, lastSearch.lon, newUnit);
        } else {
          return;
        }
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
        <div className="space-y-3">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <MapPin className="h-4 w-4" />
            Use my location
          </button>
        </div>

        {/* Weather Content */}
        {locationLoading ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Detecting your location...</p>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            <CurrentWeather weather={weather} unit={unit} />
            <HourlyForecast hourly={weather.hourly} unit={unit} />
            {weather.airQuality && <AirQuality airQuality={weather.airQuality} />}
            <DailyForecast daily={weather.daily} unit={unit} />
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <CloudSun className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to Weather
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for a city or allow location access to see current conditions, hourly updates, air quality, and a 6-day forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
