import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération sécurisée de la clé Stripe depuis les variables d'environnement
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is missing");
    }

    // Initialisation de Stripe avec la clé sécurisée
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Récupération de l'utilisateur authentifié
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header is missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Récupération des informations du profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_account_id, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) throw new Error("Profile not found");

    // Vérifie si l'utilisateur a déjà un compte Stripe
    if (profile.stripe_account_id) {
      return new Response(
        JSON.stringify({ message: "Stripe account already exists", stripe_account_id: profile.stripe_account_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Création d'un compte Stripe Express pour le vendeur
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email: profile.email, // Utilisation de l'email du profil
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Mise à jour du profil utilisateur avec l'ID Stripe
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_account_id: account.id })
      .eq("id", user.id);

    if (updateError) throw new Error("Failed to update profile with Stripe account ID");

    // Génération du lien d'onboarding Stripe
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get("origin")}/settings?refresh=true`,
      return_url: `${req.headers.get("origin")}/settings?success=true`,
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
