import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Handshake, Calendar, User } from "lucide-react";
import type { LoopItem } from "@shared/schema";

interface ItemCardProps {
  item: LoopItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-green-100 text-green-700';
      case 'swap': return 'bg-blue-100 text-blue-700';
      case 'rent': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'free': return 'Free';
      case 'swap': return 'Swap';
      case 'rent': return item.price ? `$${item.price}/day` : 'Rent';
      default: return type;
    }
  };

  const handleRequest = () => {
    setIsRequesting(true);
    // TODO: Implement actual request logic
    setTimeout(() => {
      setIsRequesting(false);
    }, 1000);
  };

  return (
    <Card className="morphic-card overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Item Image */}
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📦</span>
        </div>
      )}
      
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-1" data-testid={`item-title-${item.id}`}>
            {item.title}
          </h3>
          <Badge className={getTypeColor(item.type)} data-testid={`item-type-${item.id}`}>
            {getTypeLabel(item.type)}
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`item-description-${item.id}`}>
          {item.description}
        </p>
        
        {/* Owner Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={12} />
            </div>
            <span className="text-sm font-medium text-gray-700">Owner</span>
            <div className="flex items-center space-x-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">4.9</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin size={12} className="mr-1" />
              0.3 mi
            </div>
            <div className="text-xs text-green-600 font-medium">Available Now</div>
          </div>
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={handleRequest}
          disabled={isRequesting}
          className="w-full bg-coral hover:bg-coral/90 text-white py-3 rounded-lg font-medium transition-all"
          data-testid={`button-request-${item.id}`}
        >
          {isRequesting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Requesting...
            </div>
          ) : (
            <>
              <Handshake className="mr-2" size={16} />
              {item.type === 'swap' ? 'Propose Swap' : 
               item.type === 'rent' ? 'Rent Now' : 
               'Request to Borrow'}
            </>
          )}
        </Button>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
