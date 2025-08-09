import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  activeUserCount: number;
}

export function NeighborhoodSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  const { data: neighborhoods = [], isLoading } = useQuery({
    queryKey: ["/api/neighborhoods", searchQuery],
    queryFn: () => {
      const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
      return fetch(`/api/neighborhoods${params}`, { 
        credentials: 'include' 
      }).then(res => res.json());
    },
    enabled: searchQuery.length > 2,
  });

  return (
    <div>
      <Label htmlFor="neighborhood" className="text-sm font-medium text-gray-700 mb-2">
        Select Your Neighborhood
      </Label>
      
      {/* Map Placeholder */}
      <div className="border-2 border-gray-200 rounded-xl p-4 h-64 bg-gray-50 relative overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-coral/10 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-map-marker-alt text-coral text-4xl mb-2"></i>
            <p className="text-gray-600 font-medium">Interactive Map</p>
            <p className="text-gray-500 text-sm">Click to select your neighborhood</p>
          </div>
        </div>
        
        {selectedNeighborhood && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="glassmorphism rounded-lg p-3 text-gray-800">
              <div className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-coral"></i>
                <span className="font-medium">
                  {selectedNeighborhood.name}, {selectedNeighborhood.city}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {selectedNeighborhood.activeUserCount} active neighbors
              </p>
            </Card>
          </div>
        )}
      </div>
      
      {/* Search Input */}
      <div className="mb-4">
        <Input
          id="neighborhood"
          placeholder="Search city or neighborhood"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {searchQuery.length > 2 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <i className="fas fa-spinner fa-spin text-gray-400"></i>
              <p className="text-gray-500 text-sm mt-2">Searching neighborhoods...</p>
            </div>
          ) : neighborhoods.length > 0 ? (
            neighborhoods.map((neighborhood: Neighborhood) => (
              <Button
                key={neighborhood.id}
                variant="outline"
                className="w-full p-3 text-left justify-start hover:border-coral hover:bg-coral/5"
                onClick={() => setSelectedNeighborhood(neighborhood)}
              >
                <div>
                  <div className="font-medium">{neighborhood.name}</div>
                  <div className="text-sm text-gray-600">
                    {neighborhood.city}, {neighborhood.state} • {neighborhood.activeUserCount} active neighbors
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No neighborhoods found</p>
              <p className="text-gray-400 text-xs mt-1">Try searching for a city or area name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
