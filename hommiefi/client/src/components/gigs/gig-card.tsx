import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, DollarSign, User, Calendar } from "lucide-react";
import type { Gig } from "@shared/schema";

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  const [isApplying, setIsApplying] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pet_care': return 'bg-purple-100 text-purple-700';
      case 'handyman': return 'bg-orange-100 text-orange-700';
      case 'tutoring': return 'bg-blue-100 text-blue-700';
      case 'childcare': return 'bg-pink-100 text-pink-700';
      case 'cleaning': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    // TODO: Implement actual application logic
    setTimeout(() => {
      setIsApplying(false);
    }, 1000);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="morphic-card hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4 mb-4">
              {/* Profile placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg" data-testid={`gig-title-${gig.id}`}>
                    {gig.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={getStatusColor(gig.status)} data-testid={`gig-status-${gig.id}`}>
                      {gig.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getCategoryColor(gig.category)} data-testid={`gig-category-${gig.id}`}>
                      {gig.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3" data-testid={`gig-description-${gig.id}`}>
                  {gig.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>Poster</span>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>0.5 miles</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatDate(gig.createdAt) || 'Just posted'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {gig.hourlyRate && (
                <div className="flex items-center space-x-1">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold">
                    ${gig.hourlyRate}/hour
                  </span>
                </div>
              )}
              {gig.scheduledFor && (
                <div className="flex items-center space-x-1">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {formatDate(gig.scheduledFor)}
                  </span>
                </div>
              )}
              {gig.estimatedHours && (
                <span className="text-sm text-gray-600">
                  Est. {gig.estimatedHours}h
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 lg:ml-6">
            <Button
              onClick={handleApply}
              disabled={isApplying || gig.status !== 'open'}
              className="w-full lg:w-auto bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              data-testid={`button-apply-${gig.id}`}
            >
              {isApplying ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Applying...
                </div>
              ) : gig.status === 'open' ? (
                'Apply for Gig'
              ) : (
                'Not Available'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
