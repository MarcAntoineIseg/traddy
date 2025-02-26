
import { useState, useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DashboardOnboarding = () => {
  const [runTour, setRunTour] = useState(true); // On démarre directement avec true

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      disableBeacon: true,
      content: (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Bienvenue sur Traddy! 👋</h2>
          <p>Suivez ce guide pour commencer à vendre vos leads en quelques étapes simples.</p>
        </div>
      ),
    },
    {
      target: "a[href='/settings']",
      content: (
        <div>
          <h3 className="font-semibold mb-2">1. Configurez votre compte Stripe</h3>
          <p>Pour recevoir vos paiements, commencez par configurer votre compte Stripe dans les paramètres.</p>
        </div>
      ),
    },
    {
      target: "a[href='/upload-leads']",
      content: (
        <div>
          <h3 className="font-semibold mb-2">2. Mettez en vente vos leads</h3>
          <p>Une fois votre compte Stripe configuré, vous pourrez télécharger vos premiers leads à vendre.</p>
        </div>
      ),
    },
    {
      target: "a[href='/my-leads']",
      content: (
        <div>
          <h3 className="font-semibold mb-2">3. Suivi de vos imports</h3>
          <p>Retrouvez ici tous vos fichiers importés. Notre équipe les analysera et mettra en vente les leads qui correspondent à nos critères de qualité.</p>
        </div>
      ),
    },
    {
      target: ".dashboard-stats",
      content: (
        <div>
          <h3 className="font-semibold mb-2">4. Suivez vos performances</h3>
          <p>Une fois vos leads validés et mis en vente, vous pourrez suivre vos statistiques de vente en temps réel ici.</p>
        </div>
      ),
    },
    {
      target: "a[href='/settings']",
      content: (
        <div>
          <h3 className="font-semibold mb-2">5. Gérez vos revenus</h3>
          <p>Retrouvez à tout moment vos informations financières détaillées dans votre compte Stripe, accessible depuis les paramètres.</p>
        </div>
      ),
    }
  ];

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const hasSeenTutorial = localStorage.getItem(`dashboard_onboarding_completed_${user.id}`);
        
        if (hasSeenTutorial) {
          setRunTour(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleTourEnd = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        localStorage.setItem(`dashboard_onboarding_completed_${user.id}`, "true");
      }
      setRunTour(false);
      toast.success("Guide terminé ! N'hésitez pas à contacter notre support si vous avez des questions.");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      styles={{
        options: {
          primaryColor: "#89abe3",
          textColor: "#4a4a4a",
          zIndex: 1000,
        },
      }}
      callback={({ status }) => {
        if (["finished", "skipped"].includes(status)) {
          handleTourEnd();
        }
      }}
      locale={{
        back: "Précédent",
        close: "Fermer",
        last: "Terminer",
        next: "Suivant",
        skip: "Passer",
      }}
    />
  );
};
