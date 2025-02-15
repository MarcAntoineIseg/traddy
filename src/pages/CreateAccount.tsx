
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstname,
            last_name: formData.lastname
          }
        }
      });

      if (error) {
        if (error.message === "User already registered") {
          toast.error("Un compte existe déjà avec cet email. Veuillez vous connecter.");
          navigate("/");
          return;
        }
        throw error;
      }

      if (data.user) {
        toast.success("Compte créé avec succès !");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Erreur lors de la connexion avec Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-market-50 p-4">
      <Card className="w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-market-900 mb-8">
            traddy
          </h1>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start py-6 text-base font-normal"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <User className="h-5 w-5 mr-3" />
              Google
            </Button>
          </div>

          <div className="relative flex items-center my-8">
            <div className="w-full border-t border-gray-200" />
            <div className="absolute left-1/2 -translate-x-1/2 bg-white px-4">
              <span className="text-market-600">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input
                  id="firstname"
                  placeholder="Votre prénom"
                  required
                  value={formData.firstname}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  placeholder="Votre nom"
                  required
                  value={formData.lastname}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                  disabled={isLoading}
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
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
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
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-market-400 hover:text-market-500"
                  disabled={isLoading}
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

            <Button 
              type="submit" 
              className="w-full bg-market-600 hover:bg-market-700 text-white py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer un compte"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-market-600">
              Vous avez déjà un compte ?{" "}
              <Button 
                variant="link" 
                className="text-market-600 hover:text-market-800" 
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
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
