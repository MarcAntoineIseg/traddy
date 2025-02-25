
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { DollarSign, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Lead = {
  id: string;
  Entreprise: string | null;
  Nom: string | null;
  Prénom: string | null;
  Ville: string | null;
  Pays: string | null;
  Intention: string | null;
  Prix: number;
  created_at: string;
  Email: string | null;
  Phone: string | null;
  Age: number | null;
  date_de_contact: string | null;
  source_du_lead: string | null;
  status: string | null;
  lead_file_id: string | null;
};

const Listing = () => {
  const [filters, setFilters] = useState({
    ville: "",
    pays: "",
    intention: "all",
    sortByDate: false,
  });

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .eq("status", "available");

      // Appliquer le tri par date de contact si activé
      if (filters.sortByDate) {
        query = query.order('date_de_contact', { ascending: false, nullsLast: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (filters.ville) {
        query = query.ilike("Ville", `%${filters.ville}%`);
      }
      if (filters.pays) {
        query = query.ilike("Pays", `%${filters.pays}%`);
      }
      if (filters.intention && filters.intention !== "all") {
        query = query.eq("Intention", filters.intention);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Error loading leads");
        throw error;
      }

      return data;
    },
  });

  const handleBuyLead = async (leadId: string) => {
    toast.success("Lead purchase coming soon!");
  };

  const blurText = (text: string | null) => {
    if (!text) return "❌";
    return "•".repeat(text.length);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Leads Disponibles</h1>
        
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <Input
                placeholder="Filtrer par ville"
                value={filters.ville}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, ville: e.target.value }))
                }
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <Input
                placeholder="Filtrer par pays"
                value={filters.pays}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, pays: e.target.value }))
                }
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intention
              </label>
              <Select
                value={filters.intention}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, intention: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'intention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les intentions</SelectItem>
                  <SelectItem value="buy">Prêt à acheter</SelectItem>
                  <SelectItem value="explore">En exploration</SelectItem>
                  <SelectItem value="information">Recherche d'information</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filters.sortByDate ? "default" : "outline"}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, sortByDate: !prev.sortByDate }))
                }
                className="whitespace-nowrap"
              >
                Trier par date de contact
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setFilters({ ville: "", pays: "", intention: "all", sortByDate: false })
                }
                className="flex-none"
              >
                <Filter className="mr-2 h-4 w-4" />
                Effacer les filtres
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">Chargement des leads...</div>
        ) : !leads?.length ? (
          <div className="p-8 text-center text-gray-500">
            Aucun lead trouvé avec ces critères
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Intention</TableHead>
                <TableHead>Date de contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{blurText(lead.Prénom)}</TableCell>
                  <TableCell>{blurText(lead.Nom)}</TableCell>
                  <TableCell>{blurText(lead.Email)}</TableCell>
                  <TableCell>{blurText(lead.Phone)}</TableCell>
                  <TableCell>{lead.Pays || "❌"}</TableCell>
                  <TableCell>{lead.Ville || "❌"}</TableCell>
                  <TableCell>{lead.Age?.toString() || "❌"}</TableCell>
                  <TableCell>{lead.Entreprise || "❌"}</TableCell>
                  <TableCell>{lead.Intention || "❌"}</TableCell>
                  <TableCell>
                    {lead.date_de_contact ? format(new Date(lead.date_de_contact), 'dd/MM/yyyy') : '❌'}
                  </TableCell>
                  <TableCell>{lead.source_du_lead || "❌"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                      {lead.Prix.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleBuyLead(lead.id)}
                      className="bg-market-600 hover:bg-market-700 text-white"
                    >
                      Acheter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Listing;
