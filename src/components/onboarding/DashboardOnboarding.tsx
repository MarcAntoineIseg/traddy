import { useState, useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardOnboardingProps {
  open: boolean;
  onClose: () => void;
}

const DashboardOnboarding: React.FC<DashboardOnboardingProps> = ({
  open,
  onClose,
}) => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      target: ".dashboard-header",
      content: "Welcome to your dashboard! Let's take a quick tour.",
    },
    {
      target: ".dashboard-stats",
      content: "Here you can see an overview of your lead data.",
    },
    {
      target: ".recent-activity",
      content: "Check out your recent activity here.",
    },
    {
      target: ".latest-leads",
      content: "See your latest leads and their status.",
    },
  ]);

  useEffect(() => {
    if (open) {
      setRun(true);
    } else {
      setRun(false);
    }
  }, [open]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;

    if ([ "finished", "skipped" ].includes(status)) {
      setRun(false);
      onClose();
      toast.success("Onboarding complete!");

      // You might want to store that the user has completed onboarding
      // For example, in local storage or in your database
      localStorage.setItem("dashboard_onboarding_completed", "true");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#fff",
          backgroundColor: "#fff",
          primaryColor: "#007bff",
          textColor: "#333",
          width: 300,
          zIndex: 1000,
        },
      }}
    />
  );
};

export default DashboardOnboarding;
