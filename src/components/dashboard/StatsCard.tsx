
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatsCardProps {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

const StatsCard = ({ name, value, change, trend, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="animated-border card-hover">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-market-500" />
          <div
            className={cn(
              "flex items-center text-sm",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}
          >
            {change}
            {change !== "N/A" && (
              trend === "up" ? (
                <ArrowUpRight className="ml-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="ml-1 h-4 w-4" />
              )
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-market-600">
            {name}
          </p>
          <p className="mt-2 text-3xl font-semibold text-market-900">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
