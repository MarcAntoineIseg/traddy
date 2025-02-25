
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting create-stripe-login function');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    console.log('Checking user authentication...');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error('Authentication failed');
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('User not authenticated');
    }

    console.log('Fetching user profile...');
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    console.log('Profile data:', profile);

    if (!profile?.stripe_account_id) {
      console.error('No Stripe account ID found for user');
      throw new Error('No Stripe account found for this user');
    }

    console.log('Creating Stripe login link...');
    const loginLink = await stripe.accounts.createLoginLink(
      profile.stripe_account_id,
      { redirect_url: 'https://app.traddy.fr/settings' }
    );

    if (!loginLink?.url) {
      console.error('No login link URL returned from Stripe');
      throw new Error('Failed to create Stripe login link');
    }

    console.log('Login link created successfully:', loginLink.url);

    return new Response(
      JSON.stringify({ url: loginLink.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-stripe-login:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
