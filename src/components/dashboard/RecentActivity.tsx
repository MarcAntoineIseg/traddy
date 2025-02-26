
import { Card } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <Card className="animated-border card-hover">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-market-900">
          Recent Activity
        </h2>
        <div className="mt-4 space-y-4">
          <p className="text-market-600">No recent activity</p>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;
