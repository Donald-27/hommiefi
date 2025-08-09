import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Share, User, Clock, Megaphone, Lightbulb, Search, Star } from "lucide-react";
import type { ThreadPost } from "@shared/schema";

interface PostCardProps {
  post: ThreadPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement': return Megaphone;
      case 'tip': return Lightbulb;
      case 'lost_found': return Search;
      case 'recommendation': return Star;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-700';
      case 'tip': return 'bg-green-100 text-green-700';
      case 'lost_found': return 'bg-red-100 text-red-700';
      case 'recommendation': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: Implement actual like functionality
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / 60000);
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const CategoryIcon = getCategoryIcon(post.category);

  return (
    <Card className="morphic-card hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Profile placeholder */}
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-500" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-800">Neighbor</h3>
              <Badge className={getCategoryColor(post.category)} data-testid={`post-category-${post.id}`}>
                <CategoryIcon size={12} className="mr-1" />
                {post.category.replace('_', ' ')}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-gray-800 mb-3" data-testid={`post-title-${post.id}`}>
              {post.title}
            </h4>
            
            <p className="text-gray-700 mb-4" data-testid={`post-content-${post.id}`}>
              {post.content}
            </p>
            
            {/* Post Image */}
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="Post image"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 hover:text-orange-500 ${
                  isLiked ? 'text-orange-500' : 'text-gray-600'
                }`}
                data-testid={`button-like-${post.id}`}
              >
                <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{likeCount} likes</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:text-orange-500"
                data-testid={`button-comment-${post.id}`}
              >
                <MessageCircle size={16} />
                <span>{post.commentCount || 0} comments</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:text-orange-500"
                data-testid={`button-share-${post.id}`}
              >
                <Share size={16} />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
