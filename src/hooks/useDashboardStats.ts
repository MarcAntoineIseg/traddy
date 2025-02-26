
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";

type Trend = "up" | "down";

interface DashboardStat {
  name: string;
  value: string;
  change: string;
  trend: Trend;
  icon: any;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async (): Promise<DashboardStat[]> => {
      const [leadsResult, purchasedLeadsResult, transactionsResult] = await Promise.all([
        supabase
          .from("lead_files")
          .select("lead_count, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("leads")
          .select("id")
          .eq("status", "purchased"),
        supabase
          .from("transactions")
          .select("amount, created_at")
          .order("created_at", { ascending: false })
      ]);

      if (leadsResult.error) throw leadsResult.error;
      if (purchasedLeadsResult.error) throw purchasedLeadsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      const totalLeads = leadsResult.data.reduce((sum, file) => sum + file.lead_count, 0);
      const purchasedLeads = purchasedLeadsResult.data.length;
      const totalRevenue = transactionsResult.data.reduce((sum, tx) => sum + Number(tx.amount), 0);

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

      const leadsChange = previousLeads ? ((recentLeads - previousLeads) / previousLeads) * 100 : 0;
      const revenueChange = previousRevenue ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      
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
          name: "Leads Achetés",
          value: purchasedLeads.toString(),
          change: "N/A",
          trend: "up" as const,
          icon: TrendingUp,
        },
        {
          name: "Active Listings",
          value: leadsResult.data.length.toString(),
          change: "N/A",
          trend: "up" as const,
          icon: BarChart3,
        },
      ];
    },
  });
};
