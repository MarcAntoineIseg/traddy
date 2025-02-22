
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    });

    console.log("Stripe account created:", account.id);

    // Création du lien d'onboarding Stripe
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get("origin")}/settings?retry=true`,
      return_url: `${req.headers.get("origin")}/settings?success=true`,
      type: "account_onboarding",
    });

    console.log("Account link created");

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
