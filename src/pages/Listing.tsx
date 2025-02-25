
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

type Lead = {
  id: string;
  industry: string;
  company_name: string;
  contact_name: string;
  city: string | null;
  country: string | null;
  intention: string | null;
  price: number;
  created_at: string;
};

const Listing = () => {
  const [filters, setFilters] = useState({
    industry: "",
    city: "",
    country: "",
    intention: "",
  });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (filters.industry) {
        query = query.eq("industry", filters.industry);
      }
      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters.country) {
        query = query.ilike("country", `%${filters.country}%`);
      }
      if (filters.intention) {
        query = query.eq("intention", filters.intention);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Error loading leads");
        throw error;
      }

      return data as Lead[];
    },
  });

  const handleBuyLead = async (leadId: string) => {
    toast.success("Lead purchase coming soon!");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Available Leads</h1>
        
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Select
                value={filters.industry}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, industry: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                placeholder="Filter by city"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Input
                placeholder="Filter by country"
                value={filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, country: e.target.value }))
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
                  <SelectValue placeholder="Select intention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Intentions</SelectItem>
                  <SelectItem value="buy">Ready to Buy</SelectItem>
                  <SelectItem value="explore">Exploring Options</SelectItem>
                  <SelectItem value="information">Seeking Information</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setFilters({ industry: "", city: "", country: "", intention: "" })
              }
              className="flex-none"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">Loading leads...</div>
        ) : !leads?.length ? (
          <div className="p-8 text-center text-gray-500">
            No leads found matching your criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Intention</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.company_name}</TableCell>
                  <TableCell>{lead.contact_name}</TableCell>
                  <TableCell>{lead.industry}</TableCell>
                  <TableCell>
                    {lead.city}
                    {lead.city && lead.country ? ", " : ""}
                    {lead.country}
                  </TableCell>
                  <TableCell>{lead.intention}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                      {lead.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleBuyLead(lead.id)}
                      className="bg-market-600 hover:bg-market-700 text-white"
                    >
                      Buy Lead
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
