import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, MapPin, Calendar, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// Sample data - replace with real data from Supabase later
const SAMPLE_LEADS = [
  {
    id: 1,
    title: "Property Investment Lead",
    category: "Real Estate",
    price: 450,
    description: "Qualified lead interested in luxury properties in downtown area. Budget range: $500k-$1M.",
    addedDays: 2,
    location: "New York",
    status: "New"
  },
  {
    id: 2,
    title: "Software Development Project",
    category: "Technology",
    price: 750,
    description: "Startup looking for a development team to build their MVP. 6-month project timeline.",
    addedDays: 1,
    location: "Remote",
    status: "Hot"
  },
  {
    id: 3,
    title: "Financial Advisory Services",
    category: "Finance",
    price: 300,
    description: "High-net-worth individual seeking investment advice for portfolio diversification.",
    addedDays: 3,
    location: "Chicago",
    status: "New"
  },
  // Add more sample leads as needed
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<typeof SAMPLE_LEADS[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter leads based on search and filter criteria
  const filteredLeads = SAMPLE_LEADS.filter((lead) => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || lead.category === selectedCategory;
    const matchesLocation = !selectedLocation || lead.location === selectedLocation;
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    const matchesPriceRange = !priceRange || 
      (priceRange === "0-250" && lead.price <= 250) ||
      (priceRange === "251-500" && lead.price > 250 && lead.price <= 500) ||
      (priceRange === "501+" && lead.price > 500);

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesPriceRange;
  });

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-market-900">Marketplace</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-market-500" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-market-200 bg-white px-4 py-2 text-sm font-medium text-market-600 hover:bg-market-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid gap-4 rounded-lg border border-market-200 bg-white p-4 md:grid-cols-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                <SelectItem value="0-250">$0 - $250</SelectItem>
                <SelectItem value="251-500">$251 - $500</SelectItem>
                <SelectItem value="501+">$501+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="animated-border card-hover">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                  {lead.category}
                </span>
                <span className="text-lg font-semibold text-market-900">
                  ${lead.price}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-market-900">
                {lead.title}
              </h3>
              <p className="mt-2 text-sm text-market-600">
                {lead.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-market-500">
                  Added {lead.addedDays} days ago
                </span>
                <button 
                  className="rounded-lg bg-market-900 px-4 py-2 text-sm font-medium text-white hover:bg-market-800"
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsSheetOpen(true);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          {selectedLead && (
            <div className="h-full overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">
                  {selectedLead.title}
                </SheetTitle>
                <SheetDescription>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                        {selectedLead.category}
                      </span>
                      <span className="text-2xl font-bold text-market-900">
                        ${selectedLead.price}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-market-600">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedLead.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-market-600">
                        <Calendar className="h-4 w-4" />
                        <span>Added {selectedLead.addedDays} days ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-market-600">
                        <Tag className="h-4 w-4" />
                        <span>{selectedLead.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-market-900">Description</h4>
                      <p className="text-market-600">
                        {selectedLead.description}
                      </p>
                    </div>

                    <button className="w-full rounded-lg bg-market-900 px-4 py-3 text-sm font-medium text-white hover:bg-market-800">
                      Purchase Lead
                    </button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Marketplace;
