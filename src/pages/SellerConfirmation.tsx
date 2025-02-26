
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SellerConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-market-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-xl text-market-900">
            Tout est bon ! Vous êtes maintenant prêt à rentabiliser vos efforts marketing 😎
          </p>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-market-600 hover:bg-market-700 text-white text-lg px-8 py-6 h-auto"
          >
            C'est parti ! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerConfirmation;
