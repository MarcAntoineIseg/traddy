
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, MapPin, Calendar, Tag } from "lucide-react";
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
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    description: "Qualified lead interested in luxury properties in downtown area. Budget range: $500k-$1M.",
    addedDays: 2,
    location: "New York",
    status: "New",
    budget: "500k-1M",
    age: "35-44"
  },
  {
    id: 2,
    title: "Software Development Project",
    category: "Technology",
    price: 750,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 987-6543",
    description: "Startup looking for a development team to build their MVP. 6-month project timeline.",
    addedDays: 1,
    location: "Remote",
    status: "Hot",
    budget: "100k-500k",
    age: "25-34"
  },
  {
    id: 3,
    title: "Financial Advisory Services",
    category: "Finance",
    price: 300,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    description: "High-net-worth individual seeking investment advice for portfolio diversification.",
    addedDays: 3,
    location: "Chicago",
    status: "New",
    budget: "1M+",
    age: "45-54"
  },
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<typeof SAMPLE_LEADS[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter leads based on search and filter criteria
  const filteredLeads = SAMPLE_LEADS.filter((lead) => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || lead.category === selectedCategory;
    const matchesLocation = !selectedLocation || lead.location === selectedLocation;
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    const matchesBudget = !selectedBudget || lead.budget === selectedBudget;
    const matchesAge = !selectedAge || lead.age === selectedAge;

    return matchesSearch && matchesCategory && matchesLocation && 
           matchesStatus && matchesBudget && matchesAge;
  });

  // Function to blur sensitive information
  const blurText = (text: string) => {
    return text.replace(/./g, '•');
  };

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
          <div className="grid gap-4 rounded-lg border border-market-200 bg-white p-4 md:grid-cols-5">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
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

            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger>
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ages</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45-54">45-54</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Budgets</SelectItem>
                <SelectItem value="100k-500k">$100k-$500k</SelectItem>
                <SelectItem value="500k-1M">$500k-$1M</SelectItem>
                <SelectItem value="1M+">$1M+</SelectItem>
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
          </div>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Age Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.title}</TableCell>
                <TableCell>{lead.category}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-market-900">{blurText(lead.name)}</div>
                    <div className="text-market-500">{blurText(lead.email)}</div>
                    <div className="text-market-500">{blurText(lead.phone)}</div>
                  </div>
                </TableCell>
                <TableCell>{lead.location}</TableCell>
                <TableCell>{lead.budget}</TableCell>
                <TableCell>{lead.age}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    lead.status === "Hot" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {lead.status}
                  </span>
                </TableCell>
                <TableCell className="font-medium">${lead.price}</TableCell>
                <TableCell>
                  <button
                    className="rounded-lg bg-market-900 px-3 py-1 text-sm font-medium text-white hover:bg-market-800"
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsSheetOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
