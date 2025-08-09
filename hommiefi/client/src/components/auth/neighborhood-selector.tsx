import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface NeighborhoodSelectorProps {
  onBack: () => void;
}

export default function NeighborhoodSelector({ onBack }: NeighborhoodSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: neighborhoods } = useQuery({
    queryKey: ["/api/neighborhoods/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const handleSignup = () => {
    // Redirect to Replit auth with signup context
    window.location.href = "/api/login";
  };

  return (
    <Card className="morphic-card w-full max-w-2xl shadow-2xl border-white/30">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft size={20} />
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Your Neighborhood
          </CardTitle>
        </div>
        <p className="text-warm-gray">
          Find and connect with your local community
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Search & Map Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Your Neighborhood
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="Enter city or neighborhood name"
                  data-testid="input-neighborhood-search"
                />
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="border-2 border-gray-200 rounded-xl p-4 h-64 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-coral text-4xl mb-2 mx-auto" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-gray-500 text-sm">Select your neighborhood on the map</p>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {neighborhoods && neighborhoods.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Search Results</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {neighborhoods.map((neighborhood: any) => (
                    <button
                      key={neighborhood.id}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-coral hover:bg-coral/5 transition-colors"
                      data-testid={`button-neighborhood-${neighborhood.id}`}
                    >
                      <div className="font-medium">{neighborhood.name}</div>
                      <div className="text-sm text-gray-600">
                        {neighborhood.city}, {neighborhood.state} • {neighborhood.memberCount} active neighbors
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Section */}
          <div className="space-y-6">
            <div className="glassmorphic rounded-xl p-6 border border-white/30">
              <h3 className="font-semibold text-gray-800 mb-4">Why Hommiefi?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-coral/20 rounded-lg flex items-center justify-center">
                    <MapPin className="text-coral" size={16} />
                  </div>
                  <span>Hyper-local community connections</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal/20 rounded-lg flex items-center justify-center">
                    <Users className="text-teal" size={16} />
                  </div>
                  <span>Verified neighbors you can trust</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="text-purple-600" size={16} />
                  </div>
                  <span>Real-time help when you need it</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-coral to-teal hover:from-coral/90 hover:to-teal/90 text-white py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              data-testid="button-join-community"
            >
              Join Community
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
