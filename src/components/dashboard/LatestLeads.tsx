
import { Card } from "@/components/ui/card";

const LatestLeads = () => {
  return (
    <Card className="animated-border card-hover">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-market-900">
          Latest Leads
        </h2>
        <div className="mt-4 space-y-4">
          <p className="text-market-600">No leads available</p>
        </div>
      </div>
    </Card>
  );
};

export default LatestLeads;
