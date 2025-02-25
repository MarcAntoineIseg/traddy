
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // Fetch all necessary data
      const [leadsResult, transactionsResult] = await Promise.all([
        supabase
          .from("lead_files")
          .select("lead_count, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("transactions")
          .select("amount, created_at")
          .order("created_at", { ascending: false })
      ]);

      if (leadsResult.error) throw leadsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      // Calculate total leads
      const totalLeads = leadsResult.data.reduce((sum, file) => sum + file.lead_count, 0);
      
      // Calculate total revenue
      const totalRevenue = transactionsResult.data.reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      // Calculate conversion rate (if we have leads)
      const successfulTransactions = transactionsResult.data.length;
      const conversionRate = totalLeads ? (successfulTransactions / totalLeads) * 100 : 0;
      
      // Calculate trends (comparing to previous period)
      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

      const recentLeads = leadsResult.data
        .filter(file => new Date(file.created_at) > oneMonthAgo)
        .reduce((sum, file) => sum + file.lead_count, 0);

      const previousLeads = leadsResult.data
        .filter(file => new Date(file.created_at) <= oneMonthAgo)
        .reduce((sum, file) => sum + file.lead_count, 0);

      const recentRevenue = transactionsResult.data
        .filter(tx => new Date(tx.created_at) > oneMonthAgo)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      const previousRevenue = transactionsResult.data
        .filter(tx => new Date(tx.created_at) <= oneMonthAgo)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      // Calculate percentage changes
      const leadsChange = previousLeads ? ((recentLeads - previousLeads) / previousLeads) * 100 : 0;
      const revenueChange = previousRevenue ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      
      // Format data for display
      return [
        {
          name: "Total Leads",
          value: totalLeads.toString(),
          change: `${Math.abs(leadsChange).toFixed(1)}%`,
          trend: leadsChange >= 0 ? "up" : "down",
          icon: Users,
        },
        {
          name: "Revenue",
          value: `${totalRevenue.toFixed(2)}€`,
          change: `${Math.abs(revenueChange).toFixed(1)}%`,
          trend: revenueChange >= 0 ? "up" : "down",
          icon: DollarSign,
        },
        {
          name: "Conversion Rate",
          value: `${conversionRate.toFixed(1)}%`,
          change: "N/A",
          trend: "up",
          icon: TrendingUp,
        },
        {
          name: "Active Listings",
          value: leadsResult.data.length.toString(),
          change: "N/A",
          trend: "up",
          icon: BarChart3,
        },
      ];
    },
  });

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-market-900">Seller Dashboard</h1>
          <p className="text-market-600">Manage your leads and track your performance</p>
        </div>
        <Button 
          className="bg-market-600 hover:bg-market-700 text-white"
          onClick={() => navigate("/upload-leads")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Sell Leads
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats?.map((stat) => (
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
                  {stat.change !== "N/A" && (
                    stat.trend === "up" ? (
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="ml-1 h-4 w-4" />
                    )
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
