
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
    // Vérifier les paramètres de l'URL pour afficher des messages
    if (searchParams.get("success") === "true") {
      toast({
        title: "Configuration Stripe réussie",
        description: "Votre compte vendeur est maintenant actif",
      });
    } else if (searchParams.get("retry") === "true") {
      toast({
        variant: "destructive",
        title: "Configuration interrompue",
        description: "Vous pouvez reprendre la configuration à tout moment",
      });
    }

    // Récupérer l'état du compte Stripe
    const fetchStripeStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("stripe_account_id")
            .eq("id", user.id)
            .single();

          if (data?.stripe_account_id) {
            setStripeAccountId(data.stripe_account_id);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du statut Stripe:", error);
      }
    };

    fetchStripeStatus();
  }, [searchParams, toast]);

  const handleStripeSetup = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Utilisateur non authentifié");

      console.log("Initializing Stripe setup for user:", user.id);

      // Appel à l'Edge Function pour obtenir l'URL d'onboarding
      const { data, error } = await supabase.functions.invoke("create-stripe-account", {
        body: { userId: user.id },
      });

      if (error) throw error;
      console.log("Received response from Edge Function:", data);

      if (data.url) {
        window.location.href = data.url; // Rediriger vers Stripe
      } else {
        throw new Error("URL de Stripe non reçue");
      }
    } catch (error) {
      console.error("Erreur Stripe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de configurer Stripe. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-market-900">Paramètres</h1>
        <p className="text-market-600">Gérez votre compte et vos préférences</p>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Stripe Connect</h2>
          <p className="text-market-600 mb-4">
            {stripeAccountId
              ? "Votre compte Stripe est déjà configuré."
              : "Configurez votre compte pour recevoir des paiements via Stripe."}
          </p>
          {(!stripeAccountId || stripeAccountId === "") && (
            <Button onClick={handleStripeSetup} disabled={loading}>
              {loading ? "Redirection en cours..." : "Configurer Stripe Connect"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Settings;
