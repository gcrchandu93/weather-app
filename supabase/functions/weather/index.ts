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
      console.log('API Key present:', !!openWeatherApiKey);
      
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${openWeatherApiKey}`;
      console.log('Geocoding URL:', geoUrl.replace(openWeatherApiKey || '', '***'));
      
      const geoResponse = await fetch(geoUrl);
      const geoText = await geoResponse.text();
      console.log('Geocoding raw response:', geoText);
      
      let geoData;
      try {
        geoData = JSON.parse(geoText);
      } catch (e) {
        console.error('Failed to parse geocoding response:', geoText);
        return new Response(
          JSON.stringify({ error: 'Invalid API key or API not activated yet. New keys take ~10 minutes to activate.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check for API error response
      if (geoData.cod && geoData.cod !== 200) {
        console.log('API error:', geoData.message);
        return new Response(
          JSON.stringify({ error: geoData.message || 'API error occurred' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!Array.isArray(geoData) || geoData.length === 0) {
        console.log('City not found:', city);
        return new Response(
          JSON.stringify({ error: `City "${city}" not found. Try a different spelling or add country code (e.g., "London, UK")` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      latitude = geoData[0].lat;
      longitude = geoData[0].lon;
      cityName = geoData[0].name;
      console.log('Geocoding result:', { cityName, latitude, longitude });
    }

    // If we have lat/lon but no city name, do reverse geocoding
    if (latitude && longitude && !cityName) {
      console.log('Reverse geocoding coordinates:', { latitude, longitude });
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${openWeatherApiKey}`;
      const reverseGeoResponse = await fetch(reverseGeoUrl);
      const reverseGeoData = await reverseGeoResponse.json();
      if (Array.isArray(reverseGeoData) && reverseGeoData.length > 0) {
        cityName = reverseGeoData[0].name;
      } else {
        cityName = 'Unknown Location';
      }
    }

    // Fetch all data in parallel for better performance
    console.log('Fetching weather data for:', { cityName, latitude, longitude });
    
    const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${openWeatherApiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${openWeatherApiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}`)
    ]);

    const [currentData, forecastData, airQualityData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
      airQualityResponse.json()
    ]);

    console.log('Air quality response:', JSON.stringify(airQualityData));

    // Process hourly forecast (all available 3-hour intervals)
    const hourlyForecast = forecastData.list.slice(0, 8).map((item: any) => ({
      time: item.dt,
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      pop: Math.round((item.pop || 0) * 100), // Probability of precipitation
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
          pop: item.pop || 0,
        });
      }
      const dayData = dailyMap.get(date);
      dayData.temps.push(item.main.temp);
      dayData.pop = Math.max(dayData.pop, item.pop || 0);
    });

    const dailyForecast = Array.from(dailyMap.values()).slice(0, 6).map((day: any) => ({
      date: day.date,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      icon: day.icon,
      description: day.description,
      pop: Math.round(day.pop * 100),
    }));

    // Process air quality data
    const aqiData = airQualityData.list?.[0];
    const airQuality = aqiData ? {
      aqi: aqiData.main.aqi, // 1-5 scale (1=Good, 5=Very Poor)
      components: {
        co: aqiData.components.co,
        no2: aqiData.components.no2,
        o3: aqiData.components.o3,
        pm2_5: aqiData.components.pm2_5,
        pm10: aqiData.components.pm10,
        so2: aqiData.components.so2,
      }
    } : null;

    const weatherResponse = {
      city: cityName,
      country: currentData.sys?.country || '',
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
      airQuality,
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
