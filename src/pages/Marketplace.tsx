
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const Marketplace = () => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-market-900">Marketplace</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-market-500" />
            <Input
              placeholder="Search leads..."
              className="pl-10"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-market-200 bg-white px-4 py-2 text-sm font-medium text-market-600 hover:bg-market-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample lead cards - we'll replace these with real data later */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animated-border card-hover">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                  Real Estate
                </span>
                <span className="text-lg font-semibold text-market-900">
                  ${Math.floor(Math.random() * 900 + 100)}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-market-900">
                Property Investment Lead
              </h3>
              <p className="mt-2 text-sm text-market-600">
                Qualified lead interested in luxury properties in downtown area.
                Budget range: $500k-$1M.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-market-500">
                  Added 2 days ago
                </span>
                <button className="rounded-lg bg-market-900 px-4 py-2 text-sm font-medium text-white hover:bg-market-800">
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
