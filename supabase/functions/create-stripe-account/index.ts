import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://zjbdgjfvjmhwflzauvki.lovable.dev",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    // 🔐 Vérification et chargement des clés API
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseAdminUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAdminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is missing");
    if (!supabaseAdminUrl || !supabaseAdminKey) throw new Error("Supabase admin credentials are missing");

    // 🏦 Initialisation des clients
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16", httpClient: Stripe.createFetchHttpClient() });
    const supabase = createClient(supabaseAdminUrl, supabaseAdminKey);

    // 📥 Récupération de l'utilisateur
    const { userId } = await req.json();
    if (!userId) throw new Error("User ID is required");

    console.log(`Processing Stripe account for user: ${userId}`);

    // 🔎 Vérification si un compte Stripe existe déjà
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", userId)
      .single();

    if (profileError) throw new Error("Failed to retrieve user profile");
    
    let stripeAccountId = profile?.stripe_account_id;

    // 🎯 Si le compte Stripe existe, générer un lien de connexion Stripe
    if (stripeAccountId) {
      console.log(`User already has a Stripe account: ${stripeAccountId}`);
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      return new Response(JSON.stringify({ url: loginLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 🏗️ Création d'un nouveau compte Stripe si l'utilisateur n'en a pas
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      business_type: "individual",
    });

    console.log(`New Stripe account created: ${account.id}`);

    // 🔄 Mise à jour du profil utilisateur avec le compte Stripe
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_account_id: account.id })
      .eq("id", userId);

    if (updateError) throw new Error("Failed to update Supabase profile with Stripe account ID");

    console.log(`Stripe account ID saved for user: ${userId}`);

    // 🔗 Génération du lien d'onboarding Stripe
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?retry=true",
      return_url: "https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?success=true",
      type: "account_onboarding",
    });

    console.log(`Onboarding link generated: ${accountLink.url}`);

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
