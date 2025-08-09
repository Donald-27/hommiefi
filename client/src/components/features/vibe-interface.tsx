import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Coffee, Users, Gamepad2, UtensilsCrossed, ArrowLeft } from "lucide-react";

const moodOptions = [
  { value: 'coffee', label: 'Coffee Chat', icon: Coffee, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'walk', label: 'Walk & Talk', icon: Users, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'games', label: 'Play Games', icon: Gamepad2, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'food', label: 'Grab Food', icon: UtensilsCrossed, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
];

interface VibeInterfaceProps {
  onBack: () => void;
}

export function VibeInterface({ onBack }: VibeInterfaceProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch available neighbors
  const { data: availableNeighbors = [], isLoading } = useQuery({
    queryKey: ['/api/vibe/available'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create or update vibe session
  const vibeSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isAvailable) {
        return apiRequest('POST', '/api/vibe/session', data);
      } else {
        return apiRequest('DELETE', '/api/vibe/session', {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vibe/available'] });
      toast({
        title: isAvailable ? "You're now available!" : "Status updated",
        description: isAvailable ? "Neighbors can now see you're free to hang out" : "You're no longer available",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleAvailability = () => {
    if (!isAvailable && !selectedMood) {
      toast({
        title: "Select your vibe",
        description: "Please choose what you'd like to do",
        variant: "destructive",
      });
      return;
    }

    const sessionData = {
      status: isAvailable ? 'offline' : 'available',
      mood: selectedMood,
      message,
      availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    };

    vibeSessionMutation.mutate(sessionData);
    setIsAvailable(!isAvailable);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 font-poppins">
            <Users className="inline text-purple-600 mr-2" />
            Hommiefi Vibe
          </h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">Real-time social connections • Find neighbors to hang out with right now</p>

      {/* Status Toggle Card */}
      <Card className="morphic-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Are you free now?</h3>
              <p className="text-gray-600">Let neighbors know you're available to hang out</p>
            </div>
            <Button
              onClick={handleToggleAvailability}
              disabled={vibeSessionMutation.isPending}
              className={`px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                isAvailable 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              data-testid={isAvailable ? "button-go-offline" : "button-go-available"}
            >
              <i className="fas fa-broadcast-tower mr-2"></i>
              {vibeSessionMutation.isPending 
                ? 'Updating...' 
                : isAvailable 
                  ? "I'm Busy Now" 
                  : "I'm Free Now!"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      {!isAvailable && (
        <Card className="morphic-card mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">What's your vibe?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-xl transition-all text-center ${
                      selectedMood === mood.value 
                        ? `${mood.color} ring-2 ring-purple-300` 
                        : mood.color
                    }`}
                    data-testid={`mood-${mood.value}`}
                  >
                    <Icon className="mx-auto text-2xl mb-2" />
                    <p className="text-sm font-medium">{mood.label}</p>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to do?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                data-testid="textarea-vibe-message"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Neighbors */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Neighbors Free Now ({availableNeighbors.length})
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="morphic-card animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : availableNeighbors.length === 0 ? (
          <Card className="morphic-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No neighbors available right now</h3>
              <p className="text-gray-600 mb-4">Be the first to set your vibe and let others know you're free!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableNeighbors.map((neighbor: any) => (
              <Card key={neighbor.id} className="morphic-card hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                        {neighbor.user.firstName?.[0] || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800" data-testid={`neighbor-${neighbor.id}`}>
                        {neighbor.user.firstName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {neighbor.location || '0.2 miles away'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {neighbor.mood && (
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        moodOptions.find(m => m.value === neighbor.mood)?.color || 'bg-gray-100 text-gray-700'
                      }`}>
                        {moodOptions.find(m => m.value === neighbor.mood)?.label || neighbor.mood}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Free for {Math.floor(Math.random() * 3) + 1} hours
                    </span>
                  </div>
                  
                  {neighbor.message && (
                    <p className="text-gray-600 text-sm mb-3">"{neighbor.message}"</p>
                  )}
                  
                  <Button 
                    className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    data-testid={`connect-${neighbor.id}`}
                  >
                    <i className="fas fa-comment mr-2"></i>Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
