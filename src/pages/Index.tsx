import "../index.css";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-market-50 p-4">
      <Card className="w-full max-w-md animate-fadeIn">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-market-900">
              traddy
            </h1>
            <p className="mt-2 text-market-600">
              Connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-market-900"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="vous@example.com"
                className="w-full"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-market-900"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-market-900 hover:bg-market-800"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/create-account")}
              className="text-sm text-market-600 hover:text-market-900"
              disabled={isLoading}
            >
              Pas encore de compte ? Inscrivez-vous
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
