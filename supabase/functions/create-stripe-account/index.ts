
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Charger les clés API depuis Supabase
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is missing");
if (!supabaseUrl || !supabaseServiceKey) throw new Error("Supabase credentials are missing");

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, origin } = await req.json();
    if (!userId || !origin) throw new Error("User ID and origin are required");

    console.log(`Processing Stripe Connect for user: ${userId}`);
    console.log(`Origin URL: ${origin}`);

    // Vérifier si l'utilisateur a déjà un compte Stripe
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", userId)
      .single();

    let stripeAccountId = profile?.stripe_account_id;

    // Si l'utilisateur a déjà un compte Stripe
    if (stripeAccountId) {
      console.log(`User already has a Stripe account: ${stripeAccountId}`);
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      return new Response(JSON.stringify({ url: loginLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Créer un nouveau compte Stripe Connect
    console.log("Creating new Stripe account...");
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    stripeAccountId = account.id;
    console.log(`New Stripe account created: ${stripeAccountId}`);

    // Mettre à jour le profil utilisateur avec l'ID du compte Stripe
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_account_id: stripeAccountId })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update user profile:", updateError);
      throw new Error("Failed to update user profile");
    }

    // Générer le lien d'onboarding
    console.log("Generating onboarding link...");
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/settings?retry=true`,
      return_url: `${origin}/settings?success=true`,
      type: "account_onboarding",
    });

    console.log(`Onboarding URL generated: ${accountLink.url}`);

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in create-stripe-account function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
