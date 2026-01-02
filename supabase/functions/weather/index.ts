import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lon, units = 'metric' } = await req.json();
    
    console.log('Weather request received:', { city, lat, lon, units });

    let latitude = lat;
    let longitude = lon;
    let cityName = city;

    // If city name provided, get coordinates first
    if (city && !lat && !lon) {
      console.log('Geocoding city:', city);
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${openWeatherApiKey}`
      );
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        console.log('City not found:', city);
        return new Response(
          JSON.stringify({ error: 'City not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      latitude = geoData[0].lat;
      longitude = geoData[0].lon;
      cityName = geoData[0].name;
      console.log('Geocoding result:', { cityName, latitude, longitude });
    }

    // Get current weather
    console.log('Fetching current weather...');
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${openWeatherApiKey}`
    );
    const currentData = await currentResponse.json();

    // Get 5-day forecast (free tier)
    console.log('Fetching forecast...');
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${openWeatherApiKey}`
    );
    const forecastData = await forecastResponse.json();

    // Process hourly forecast (next 24 hours from 3-hour intervals)
    const hourlyForecast = forecastData.list.slice(0, 8).map((item: any) => ({
      time: item.dt,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }));

    // Process daily forecast (group by day and get daily highs/lows)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date: item.dt,
          temps: [],
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        });
      }
      dailyMap.get(date).temps.push(item.main.temp);
    });

    const dailyForecast = Array.from(dailyMap.values()).slice(0, 6).map((day: any) => ({
      date: day.date,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      icon: day.icon,
      description: day.description,
    }));

    const weatherResponse = {
      city: cityName,
      country: currentData.sys.country,
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
    };

    console.log('Weather data fetched successfully for:', cityName);

    return new Response(JSON.stringify(weatherResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
