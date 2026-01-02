import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${openWeatherApiKey}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!Array.isArray(geoData)) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const suggestions = geoData.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state || '',
      lat: item.lat,
      lon: item.lon,
    }));

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in geocode function:', error);
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
