
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

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

  const handleStripeDashboard = async () => {
    try {
      setLoadingDashboard(true);
      
      const { data, error } = await supabase.functions.invoke('create-stripe-login', {
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
        description: "Impossible d'accéder au dashboard Stripe. Veuillez réessayer.",
      });
    } finally {
      setLoadingDashboard(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <p className="text-gray-600">Gérez votre compte et vos préférences</p>
      </div>

      <Card className="w-full bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Stripe Connect</h2>
          <p className="text-gray-600 mb-4">
            Configurez votre compte pour recevoir des paiements via Stripe.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={handleStripeSetup} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Redirection en cours..." : "Configurer Stripe Connect"}
            </Button>
            <Button 
              onClick={handleStripeDashboard} 
              disabled={loadingDashboard}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
            >
              {loadingDashboard ? "Redirection en cours..." : "Accéder au Dashboard Stripe"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
