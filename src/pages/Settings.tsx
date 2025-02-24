
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStripeSetup = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: {}
      });

      if (error) throw error;
      
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
            Configurez votre compte pour recevoir des paiements via Stripe.
          </p>
          <Button onClick={handleStripeSetup} disabled={loading}>
            {loading ? "Redirection en cours..." : "Configurer Stripe Connect"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
