
import { Card } from "@/components/ui/card";
import StatsCard from "./StatsCard";

interface DashboardStatsProps {
  stats: Array<{
    name: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
  }>;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats?.map((stat) => (
        <StatsCard key={stat.name} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
