
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { leadId } = await req.json()

    // Récupérer les informations du lead
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*, user_id:lead_file_id(user_id)')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      throw new Error('Lead not found')
    }

    // Récupérer le Stripe account ID du vendeur
    const { data: sellerProfile, error: sellerError } = await supabaseClient
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', lead.user_id.user_id)
      .single()

    if (sellerError || !sellerProfile?.stripe_account_id) {
      throw new Error('Seller Stripe account not found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Calculer les montants
    const amount = lead.Prix * 100 // Conversion en centimes
    const platformFee = Math.round(amount * 0.15) // 15% de commission

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: amount,
            product_data: {
              name: `Lead - ${lead.Intention || 'Sans intention'}`,
              description: `Lead de ${lead.Ville || 'Non spécifié'}, ${lead.Pays || 'Non spécifié'}`,
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

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
