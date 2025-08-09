import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin, Clock, Star, Heart, User } from "lucide-react";
import type { Vibe } from "@shared/schema";

interface NeighborCardProps {
  vibe: Vibe;
}

export default function NeighborCard({ vibe }: NeighborCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'coffee': return '☕';
      case 'walk': return '🚶';
      case 'games': return '🎮';
      case 'food': return '🍽️';
      default: return '✨';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'coffee': return 'bg-yellow-100 text-yellow-700';
      case 'walk': return 'bg-green-100 text-green-700';
      case 'games': return 'bg-blue-100 text-blue-700';
      case 'food': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    // TODO: Implement actual connection logic
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getAvailableTime = (availableUntil: Date | null) => {
    if (!availableUntil) return 'Available now';
    const now = new Date();
    const diffMs = new Date(availableUntil).getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) return 'Availability expired';
    if (diffMins < 60) return `Free for ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    return `Free for ${diffHours}h`;
  };

  return (
    <Card className="morphic-card hover:shadow-lg transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            {/* Profile placeholder */}
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <User className="text-gray-500" size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs">{getMoodIcon(vibe.mood || '')}</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800" data-testid={`neighbor-name-${vibe.id}`}>
              Neighbor
            </h4>
            <p className="text-sm text-gray-600">{getAvailableTime(vibe.availableUntil)}</p>
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
              </div>
              <span className="text-xs text-gray-500">4.9</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={10} className="mr-1" />
                0.3 mi
              </div>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          {vibe.mood && (
            <Badge className={getMoodColor(vibe.mood)} data-testid={`mood-badge-${vibe.id}`}>
              {getMoodIcon(vibe.mood)} {vibe.mood.replace('_', ' ')}
            </Badge>
          )}
          <span className="text-xs text-gray-500">
            <Clock size={10} className="inline mr-1" />
            {getTimeAgo(vibe.createdAt)}
          </span>
        </div>
        
        {vibe.message && (
          <p className="text-gray-600 text-sm mb-4" data-testid={`vibe-message-${vibe.id}`}>
            "{vibe.message}"
          </p>
        )}
        
        <div className="flex space-x-2">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-all"
            data-testid={`button-connect-${vibe.id}`}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Connecting...
              </div>
            ) : (
              <>
                <Heart className="mr-2" size={16} />
                Let's Vibe
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            data-testid={`button-message-${vibe.id}`}
          >
            <MessageCircle size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
