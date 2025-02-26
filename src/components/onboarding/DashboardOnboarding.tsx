
import { useState, useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DashboardOnboarding = () => {
  const [runTour, setRunTour] = useState(false);

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      disableBeacon: true,
      content: (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Bienvenue sur Traddy! 👋</h2>
          <p>Nous allons vous guider pour vendre vos premiers leads en quelques étapes simples.</p>
        </div>
      ),
    },
    {
      target: ".upload-leads-button",
      content: (
        <div>
          <h3 className="font-semibold mb-2">Commencez par vendre vos leads</h3>
          <p>Cliquez ici pour télécharger votre premier fichier de leads à vendre.</p>
        </div>
      ),
    },
    {
      target: ".dashboard-stats",
      content: (
        <div>
          <h3 className="font-semibold mb-2">Suivez vos performances</h3>
          <p>Visualisez ici vos statistiques de vente en temps réel.</p>
        </div>
      ),
    },
    {
      target: ".recent-activity",
      content: (
        <div>
          <h3 className="font-semibold mb-2">Activité récente</h3>
          <p>Retrouvez ici toutes vos dernières transactions et mises à jour.</p>
        </div>
      ),
    },
    {
      target: ".latest-leads",
      content: (
        <div>
          <h3 className="font-semibold mb-2">Vos derniers leads</h3>
          <p>Consultez et gérez vos leads les plus récents directement depuis votre tableau de bord.</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Vérifions d'abord si l'utilisateur a déjà vu le tutoriel
        const hasSeenTutorial = localStorage.getItem("dashboard_onboarding_completed");
        
        if (!hasSeenTutorial) {
          setRunTour(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleTourEnd = () => {
    localStorage.setItem("dashboard_onboarding_completed", "true");
    setRunTour(false);
    toast.success("Guide terminé ! Vous pouvez le retrouver dans les paramètres si besoin.");
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
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

