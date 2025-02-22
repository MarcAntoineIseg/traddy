
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://zjbdgjfvjmhwflzauvki.lovable.dev",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

serve(async (req) => {
  // Gérer les requêtes CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Récupération sécurisée de la clé Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is missing");
    }

    // Initialisation de Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Lire le body de la requête
    const { userId } = await req.json();
    if (!userId) throw new Error("Missing user ID");

    console.log("Creating Stripe account for user:", userId);

    // Créer le compte Stripe Connect
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    console.log("Stripe account created:", account.id);

    // Création du lien d'onboarding Stripe avec les URLs complètes
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?retry=true',
      return_url: 'https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?success=true',
      type: "account_onboarding",
    });

    console.log("Account link created:", accountLink.url);

    // Sauvegarder l'ID du compte Stripe dans la base de données
    const supabaseAdminUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAdminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseAdminUrl || !supabaseAdminKey) {
      throw new Error("Missing Supabase admin credentials");
    }

    const supabaseAdmin = createClient(supabaseAdminUrl, supabaseAdminKey);
    
    await supabaseAdmin
      .from('profiles')
      .update({ stripe_account_id: account.id })
      .eq('id', userId);

    console.log("Stripe account ID saved to database");

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
