
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LatestLeads from "@/components/dashboard/LatestLeads";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Card } from "@/components/ui/card";
import { DashboardOnboarding } from "@/components/onboarding/DashboardOnboarding";

const Dashboard = () => {
  const { data: dashboardStats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32"></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <DashboardOnboarding />
      <DashboardHeader />
      <div className="dashboard-stats">
        <DashboardStats stats={dashboardStats || []} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="recent-activity">
          <RecentActivity />
        </div>
        <div className="latest-leads">
          <LatestLeads />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
