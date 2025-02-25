
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Récupérer le profil avec l'ID du compte Stripe
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single();

    console.log('Profile data:', profile);

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    if (!profile?.stripe_account_id) {
      throw new Error('No Stripe account found for this user');
    }

    // Créer le lien de connexion au dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      profile.stripe_account_id,
      { redirect_url: 'https://app.traddy.fr/settings' }
    );

    if (!loginLink?.url) {
      throw new Error('Failed to create Stripe login link');
    }

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
