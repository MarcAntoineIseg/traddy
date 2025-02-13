
import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-market-900">Settings</h1>
        <p className="text-market-600">Manage your account settings and preferences</p>
      </div>

      <Card>
        <div className="p-6">
          <p className="text-market-600">Settings page content will go here</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
