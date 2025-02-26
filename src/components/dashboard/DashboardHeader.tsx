
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default DashboardHeader;
