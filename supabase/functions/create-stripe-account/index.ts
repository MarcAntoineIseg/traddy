import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// 🔑 Charger les clés API depuis Supabase
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAdminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is missing");
if (!supabaseUrl || !supabaseAdminKey) throw new Error("Supabase credentials are missing");

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
const supabase = createClient(supabaseUrl, supabaseAdminKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST" }, status: 200 });
  }

  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("User ID is required");

    console.log(`Processing Stripe Connect for user: ${userId}`);

    // 🔎 Vérifier si l'utilisateur a déjà un compte Stripe
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", userId)
      .single();

    if (fetchError) throw new Error("Failed to fetch user profile");

    let stripeAccountId = profile?.stripe_account_id;

    // 🔹 1️⃣ Si l'utilisateur a déjà un compte Stripe, on génère un lien de connexion
    if (stripeAccountId) {
      console.log(`User already has a Stripe account: ${stripeAccountId}`);
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      return Response.json({ url: loginLink.url });
    }

    // 🔹 2️⃣ Sinon, on crée un compte Stripe Express pour lui
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email: `user_${userId}@traddy.fr`, // Adaptable selon ton projet
      business_type: "individual",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    stripeAccountId = account.id;

    // 🔄 Mettre à jour Supabase avec l'ID du compte Stripe
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_account_id: stripeAccountId })
      .eq("id", userId);

    if (updateError) throw new Error("Failed to update user profile with Stripe Account ID");

    console.log(`New Stripe account created: ${stripeAccountId}`);

    // 🔗 Générer un lien d'onboarding Stripe
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      return_url: "https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?success=true",
      refresh_url: "https://zjbdgjfvjmhwflzauvki.lovable.dev/settings?retry=true",
      type: "account_onboarding",
    });

    console.log(`Onboarding URL: ${accountLink.url}`);

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
