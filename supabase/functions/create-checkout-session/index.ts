
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Démarrage de la fonction create-checkout-session')
    
    // Vérifier la clé Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not found')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { leadId } = await req.json()
    console.log('LeadId reçu:', leadId)

    // Récupérer les informations du lead avec user_id via lead_file_id
    console.log('Récupération des informations du lead')
    const { data: leadData, error: leadError } = await supabaseClient
      .from('leads')
      .select(`
        *,
        lead_file:lead_file_id (
          user_id
        )
      `)
      .eq('id', leadId)
      .single()

    if (leadError || !leadData) {
      console.error('Erreur lors de la récupération du lead:', leadError)
      throw new Error('Lead not found')
    }

    console.log('Lead trouvé:', leadData)

    // Récupérer le Stripe account ID du vendeur
    console.log('Récupération du profil vendeur')
    const { data: sellerProfile, error: sellerError } = await supabaseClient
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', leadData.lead_file.user_id)
      .single()

    if (sellerError || !sellerProfile?.stripe_account_id) {
      console.error('Erreur lors de la récupération du profil vendeur:', sellerError)
      throw new Error('Seller Stripe account not found')
    }

    console.log('Profil vendeur trouvé:', sellerProfile)

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Calculer les montants
    const amount = Math.round(leadData.Prix * 100) // Conversion en centimes et arrondi
    const platformFee = Math.round(amount * 0.15) // 15% de commission

    console.log('Création de la session Stripe')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: amount,
            product_data: {
              name: `Lead - ${leadData.Intention || 'Sans intention'}`,
              description: `Lead de ${leadData.Ville || 'Non spécifié'}, ${leadData.Pays || 'Non spécifié'}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/listing?canceled=true`,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: sellerProfile.stripe_account_id,
        },
      },
    })

    console.log('Session Stripe créée avec succès')

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erreur dans la fonction:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
