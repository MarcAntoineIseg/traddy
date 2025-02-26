
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const Packs = () => {
  const { data: packs, isLoading } = useQuery({
    queryKey: ["lead-packs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_packs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleBuyPack = async (packId: string) => {
    console.log("Buying pack:", packId);
    // TODO: Implement pack purchase logic
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement des packs...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Packs de Leads</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packs?.map((pack) => (
          <Card key={pack.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>{pack.name}</CardTitle>
              </div>
              <CardDescription>Intention : {pack.intention}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{pack.description}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nombre de leads :</span>
                  <span className="text-sm">{pack.lead_count}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-2xl font-bold">{pack.price}€</span>
              <Button
                onClick={() => handleBuyPack(pack.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Acheter
              </Button>
            </CardFooter>
          </Card>
        ))}

        {(!packs || packs.length === 0) && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              Aucun pack disponible
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Les packs seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packs;
