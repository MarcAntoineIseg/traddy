
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
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Erreur lors de la récupération de l'utilisateur:", userError);
          throw userError;
        }

        if (!user) {
          console.error("Aucun utilisateur trouvé");
          throw new Error("Utilisateur non authentifié");
        }

        console.log("Utilisateur récupéré:", user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("stripe_account_id")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          throw error;
        }

        if (data?.stripe_account_id) {
          console.log("Stripe account ID trouvé:", data.stripe_account_id);
          setStripeAccountId(data.stripe_account_id);
        } else {
          console.log("Aucun Stripe account ID trouvé pour l'utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du statut Stripe:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer votre statut Stripe",
        });
      }
    };

    fetchStripeStatus();
  }, [searchParams, toast]);

  const handleStripeSetup = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", userError);
        throw userError;
      }

      if (!user) {
        console.error("Aucun utilisateur trouvé");
        throw new Error("Utilisateur non authentifié");
      }

      console.log("User ID récupéré:", user.id);

      // Construction de l'origine pour les URLs de redirection
      const origin = window.location.origin;
      console.log("Current origin:", origin);

      // Appel à la fonction Edge avec l'origine
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: { 
          userId: user.id,
          origin: origin 
        }
      });

      if (error) {
        console.error("Erreur fonction Edge:", error);
        throw error;
      }
      
      console.log("Réponse de la fonction Edge:", data);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de redirection Stripe non reçue");
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
