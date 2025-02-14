
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Google, Microsoft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une vraie application, ceci gérerait l'inscription
    toast.success("Compte créé avec succès !");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-market-50 p-4">
      <Card className="w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-market-900 mb-4">
            traddy
          </h1>
          <p className="text-xl text-market-900 mb-8">
            Essayez gratuitement
          </p>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start py-6 text-base font-normal"
              onClick={() => toast.info("Connexion avec Google")}
            >
              <Google className="h-5 w-5 mr-3" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start py-6 text-base font-normal"
              onClick={() => toast.info("Connexion avec Microsoft")}
            >
              <Microsoft className="h-5 w-5 mr-3" />
              Microsoft
            </Button>
          </div>

          <div className="flex items-center my-8">
            <Separator className="flex-grow" />
            <span className="px-4 text-market-600">ou</span>
            <Separator className="flex-grow" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input
                  id="firstname"
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="E-mail professionnel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-market-400 hover:text-market-500"
                >
                  {isPasswordVisible ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-xs text-market-600 px-2 py-1 bg-market-100 rounded">Majuscule</span>
                <span className="text-xs text-market-600 px-2 py-1 bg-market-100 rounded">Minuscule</span>
                <span className="text-xs text-market-600 px-2 py-1 bg-market-100 rounded">Numéro</span>
                <span className="text-xs text-market-600 px-2 py-1 bg-market-100 rounded">Symbole</span>
                <span className="text-xs text-market-600 px-2 py-1 bg-market-100 rounded">Min. 8 caract.</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recaptcha"
                  className="h-4 w-4 mr-2"
                  required
                />
                <Label htmlFor="recaptcha">Je ne suis pas un robot</Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-market-600 hover:bg-market-700 text-white py-6 text-lg">
              Créer un compte
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-market-600">
              Vous avez déjà un compte ?{" "}
              <Button variant="link" className="text-market-600 hover:text-market-800" onClick={() => navigate("/login")}>
                Se connecter
              </Button>
            </p>
            <p className="text-sm text-market-500 mt-4">
              En continuant, vous acceptez les{" "}
              <a href="#" className="underline hover:text-market-800">Conditions d'utilisation</a>
              {" "}et la{" "}
              <a href="#" className="underline hover:text-market-800">Politique de confidentialité</a>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateAccount;
