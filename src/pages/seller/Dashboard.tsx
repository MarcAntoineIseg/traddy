
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  DollarSign,
  Users,
  Package,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-market-900">Seller Dashboard</h1>
        <p className="text-market-600">Manage your leads and track your performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-market-100 p-3">
              <DollarSign className="h-6 w-6 text-market-600" />
            </div>
            <div>
              <p className="text-sm text-market-600">Revenue</p>
              <p className="text-2xl font-semibold text-market-900">$12,840</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>12% up</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-market-100 p-3">
              <Package className="h-6 w-6 text-market-600" />
            </div>
            <div>
              <p className="text-sm text-market-600">Active Leads</p>
              <p className="text-2xl font-semibold text-market-900">45</p>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ArrowDown className="h-4 w-4" />
                <span>3% down</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-market-100 p-3">
              <Users className="h-6 w-6 text-market-600" />
            </div>
            <div>
              <p className="text-sm text-market-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-market-900">24%</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>5% up</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-market-100 p-3">
              <BarChart3 className="h-6 w-6 text-market-600" />
            </div>
            <div>
              <p className="text-sm text-market-600">Total Sales</p>
              <p className="text-2xl font-semibold text-market-900">284</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>8% up</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="border-b border-market-100 p-6">
          <h2 className="text-lg font-semibold text-market-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between border-b border-market-100 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-market-900">New Lead Purchase</p>
                  <p className="text-sm text-market-600">Software Development Project Lead</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-market-900">$450</p>
                  <p className="text-sm text-market-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
