
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      name: "Total Leads",
      value: "2,345",
      change: "+12.3%",
      trend: "up",
      icon: Users,
    },
    {
      name: "Revenue",
      value: "$12,345",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      name: "Active Listings",
      value: "145",
      change: "+5.4%",
      trend: "up",
      icon: BarChart3,
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="mb-8 text-2xl font-semibold text-market-900">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="animated-border card-hover">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-market-500" />
                <div
                  className={cn(
                    "flex items-center text-sm",
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="ml-1 h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-market-600">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-market-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="animated-border card-hover">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-market-900">
              Recent Activity
            </h2>
            <div className="mt-4 space-y-4">
              {/* Activity items would go here */}
              <p className="text-market-600">No recent activity</p>
            </div>
          </div>
        </Card>

        <Card className="animated-border card-hover">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-market-900">
              Latest Leads
            </h2>
            <div className="mt-4 space-y-4">
              {/* Lead items would go here */}
              <p className="text-market-600">No leads available</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
