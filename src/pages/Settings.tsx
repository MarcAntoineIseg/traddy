
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for Stripe onboarding status
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Configuration Stripe réussie",
        description: "Votre compte vendeur est maintenant configuré",
      });
    } else if (searchParams.get('refresh') === 'true') {
      toast({
        variant: "destructive",
        title: "Configuration interrompue",
        description: "Vous pouvez reprendre la configuration à tout moment",
      });
    }

    // Fetch user's Stripe account status
    const fetchStripeStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('stripe_account_id')
          .eq('id', user.id)
          .single();
        
        if (data?.stripe_account_id) {
          setStripeAccountId(data.stripe_account_id);
        }
      }
    };

    fetchStripeStatus();
  }, [searchParams, toast]);

  const handleStripeSetup = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-stripe-account');
      
      if (error) {
        throw error;
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url;
    } catch (error) {
      console.error('Error setting up Stripe:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de configurer le compte Stripe. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-market-900">Settings</h1>
        <p className="text-market-600">Manage your account settings and preferences</p>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Stripe Connect</h2>
          <p className="text-market-600 mb-4">
            {stripeAccountId && stripeAccountId !== '' 
              ? "Votre compte Stripe est configuré."
              : "Configurez votre compte vendeur pour recevoir des paiements via Stripe."}
          </p>
          {(!stripeAccountId || stripeAccountId === '') && (
            <Button 
              onClick={handleStripeSetup}
              disabled={loading}
            >
              {loading ? "Configuration en cours..." : "Configurer Stripe Connect"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Settings;
