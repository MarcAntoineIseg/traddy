import { useState, useMemo } from "react";
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
import { Filter, ArrowUpDown } from "lucide-react";
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

type RangeFilter = {
  min: number | null;
  max: number | null;
};

type DateRangeFilter = {
  start: string | null;
  end: string | null;
};

const Listing = () => {
  const [filters, setFilters] = useState({
    ville: "all",
    pays: "all",
    entreprise: "all",
    intention: "all",
    source: "all",
    age: { min: null, max: null } as RangeFilter,
    prix: { min: null, max: null } as RangeFilter,
    dateContact: { start: null, end: null } as DateRangeFilter,
    sortByDate: false,
  });

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .eq("status", "available");

      if (filters.sortByDate) {
        query = query.order('date_de_contact', { ascending: false, nullsFirst: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (filters.ville !== "all") {
        query = query.eq("Ville", filters.ville);
      }
      if (filters.pays !== "all") {
        query = query.eq("Pays", filters.pays);
      }
      if (filters.entreprise !== "all") {
        query = query.eq("Entreprise", filters.entreprise);
      }
      if (filters.intention !== "all") {
        query = query.eq("Intention", filters.intention);
      }
      if (filters.source !== "all") {
        query = query.eq("source_du_lead", filters.source);
      }
      
      if (filters.age.min !== null) {
        query = query.gte("Age", filters.age.min);
      }
      if (filters.age.max !== null) {
        query = query.lte("Age", filters.age.max);
      }
      if (filters.prix.min !== null) {
        query = query.gte("Prix", filters.prix.min);
      }
      if (filters.prix.max !== null) {
        query = query.lte("Prix", filters.prix.max);
      }
      if (filters.dateContact.start) {
        query = query.gte("date_de_contact", filters.dateContact.start);
      }
      if (filters.dateContact.end) {
        query = query.lte("date_de_contact", filters.dateContact.end);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Error loading leads");
        throw error;
      }

      return data;
    },
  });

  const uniqueValues = useMemo(() => {
    if (!leads) return {
      villes: [],
      pays: [],
      entreprises: [],
      intentions: [],
      sources: []
    };

    return {
      villes: Array.from(new Set(leads.map(lead => lead.Ville).filter(Boolean))),
      pays: Array.from(new Set(leads.map(lead => lead.Pays).filter(Boolean))),
      entreprises: Array.from(new Set(leads.map(lead => lead.Entreprise).filter(Boolean))),
      intentions: Array.from(new Set(leads.map(lead => lead.Intention).filter(Boolean))),
      sources: Array.from(new Set(leads.map(lead => lead.source_du_lead).filter(Boolean)))
    };
  }, [leads]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <Select
                value={filters.pays}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, pays: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {uniqueValues.pays.map((pays) => (
                    <SelectItem key={pays} value={pays}>{pays}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <Select
                value={filters.ville}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, ville: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {uniqueValues.villes.map((ville) => (
                    <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <Select
                value={filters.entreprise}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, entreprise: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les entreprises</SelectItem>
                  {uniqueValues.entreprises.map((entreprise) => (
                    <SelectItem key={entreprise} value={entreprise}>{entreprise}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
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
                  {uniqueValues.intentions.map((intention) => (
                    <SelectItem key={intention} value={intention}>{intention}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <Select
                value={filters.source}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, source: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  {uniqueValues.sources.map((source) => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.age.min ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      age: { ...prev.age, min: e.target.value ? Number(e.target.value) : null }
                    }))
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.age.max ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      age: { ...prev.age, max: e.target.value ? Number(e.target.value) : null }
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.prix.min ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      prix: { ...prev.prix, min: e.target.value ? Number(e.target.value) : null }
                    }))
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.prix.max ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      prix: { ...prev.prix, max: e.target.value ? Number(e.target.value) : null }
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de contact
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateContact.start ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateContact: { ...prev.dateContact, start: e.target.value || null }
                    }))
                  }
                  className="w-full"
                />
                <Input
                  type="date"
                  value={filters.dateContact.end ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateContact: { ...prev.dateContact, end: e.target.value || null }
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    ville: "all",
                    pays: "all",
                    entreprise: "all",
                    intention: "all",
                    source: "all",
                    age: { min: null, max: null },
                    prix: { min: null, max: null },
                    dateContact: { start: null, end: null },
                    sortByDate: false,
                  })
                }
                className="w-full"
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
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, sortByDate: !prev.sortByDate }))}
                  >
                    Date de contact 
                    <ArrowUpDown className={`ml-2 h-4 w-4 transition-colors ${filters.sortByDate ? "text-primary" : "text-gray-400"}`} />
                  </div>
                </TableHead>
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
                  <TableCell>{`${lead.Prix.toFixed(2)} €`}</TableCell>
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
