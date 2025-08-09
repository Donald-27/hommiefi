import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Plus, ThumbsUp, MessageCircle, Share2, Megaphone, Lightbulb, Search, Star } from "lucide-react";

export default function Thread() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/thread/posts", selectedCategory],
    queryFn: () => {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      return fetch(`/api/thread/posts${params}`, { credentials: 'include' }).then(res => res.json());
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (postData: any) => apiRequest("POST", "/api/thread/posts", postData),
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/thread/posts"] });
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/thread/posts/${postId}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thread/posts"] });
    },
  });

  const categories = [
    { id: 'all', label: 'All Posts', icon: 'fas fa-th-large' },
    { id: 'announcement', label: 'Announcements', icon: 'fas fa-bullhorn' },
    { id: 'tip', label: 'Tips & Advice', icon: 'fas fa-lightbulb' },
    { id: 'lost_found', label: 'Lost & Found', icon: 'fas fa-search' },
    { id: 'recommendation', label: 'Recommendations', icon: 'fas fa-star' },
  ];

  const handleCreatePost = (formData: FormData) => {
    const postData = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
    };

    createPostMutation.mutate(postData);
  };

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement': return Megaphone;
      case 'tip': return Lightbulb;
      case 'lost_found': return Search;
      case 'recommendation': return Star;
      default: return MessageCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                <i className="fas fa-comments text-orange-500 mr-2"></i>Hommiefi Thread
              </h2>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 text-white hover:bg-orange-600" data-testid="button-new-post">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreatePost(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Post Title</Label>
                    <Input id="title" name="title" placeholder="What's happening in the neighborhood?" required data-testid="input-post-title" />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      placeholder="Share your thoughts with the community..." 
                      rows={4}
                      required 
                      data-testid="textarea-post-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger data-testid="select-post-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <i className={`${category.icon} mr-2`}></i>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={createPostMutation.isPending} data-testid="button-create-post">
                      {createPostMutation.isPending ? 'Posting...' : 'Create Post'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-gray-600 mb-6">Community discussions • Local tips, announcements, and conversations</p>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                data-testid={`filter-${category.id}`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.label}
              </Button>
            ))}
          </div>

          {/* Thread Posts */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="morphic-card rounded-xl p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="morphic-card rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-orange-500 text-2xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to start a conversation in your neighborhood!</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600" data-testid="button-create-first-post">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post: any) => {
                const CategoryIcon = getCategoryIcon(post.category);
                return (
                  <Card key={post.id} className="morphic-card rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                        {post.user.firstName?.[0] || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800" data-testid={`post-author-${post.id}`}>
                            {post.user.firstName} {post.user.lastName}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs ${getCategoryColor(post.category)}`}>
                            <CategoryIcon className="inline mr-1 h-3 w-3" />
                            {categories.find(c => c.id === post.category)?.label || post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mb-3" data-testid={`post-title-${post.id}`}>
                          {post.title}
                        </h4>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        
                        {post.imageUrls && post.imageUrls.length > 0 && (
                          <div className="mb-4">
                            <div className="grid grid-cols-2 gap-2">
                              {post.imageUrls.slice(0, 4).map((url: string, index: number) => (
                                <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                  <img src={url} alt={`Post image ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLikePost(post.id)}
                            className="hover:text-orange-500"
                            data-testid={`like-post-${post.id}`}
                          >
                            <ThumbsUp className="mr-2 h-3 w-3" />
                            {post.likesCount || 0} likes
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-orange-500">
                            <MessageCircle className="mr-2 h-3 w-3" />
                            {post.commentsCount || 0} comments
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-orange-500">
                            <Share2 className="mr-2 h-3 w-3" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
