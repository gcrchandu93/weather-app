import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      // Get recent searches (last 10 unique cities)
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('searched_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching search history:', error);
        throw error;
      }

      // Remove duplicates by city_name, keeping most recent
      const uniqueCities = data.reduce((acc: any[], curr: any) => {
        if (!acc.find(item => item.city_name === curr.city_name)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      console.log('Fetched search history:', uniqueCities.length, 'unique cities');
      return new Response(JSON.stringify(uniqueCities.slice(0, 5)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { city_name, search_query, lat, lon } = await req.json();
      
      if (!city_name || !search_query) {
        return new Response(JSON.stringify({ error: 'city_name and search_query are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('search_history')
        .insert({ city_name, search_query, lat, lon })
        .select()
        .single();

      if (error) {
        console.error('Error saving search:', error);
        throw error;
      }

      console.log('Saved search:', city_name);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error clearing history:', error);
        throw error;
      }

      console.log('Cleared search history');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search history error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
