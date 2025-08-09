import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, Plus, DollarSign, Clock, MapPin, User, HandMetal } from "lucide-react";

export default function Gigs() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ["/api/gigs", selectedCategory === 'all' ? undefined : selectedCategory],
    queryFn: () => {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      return fetch(`/api/gigs${params}`, { credentials: 'include' }).then(res => res.json());
    },
  });

  const createGigMutation = useMutation({
    mutationFn: (gigData: any) => apiRequest("POST", "/api/gigs", gigData),
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/gigs"] });
      toast({
        title: "Gig posted!",
        description: "Your gig has been posted to the community",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating gig",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyToGigMutation = useMutation({
    mutationFn: ({ gigId, message }: { gigId: string; message: string }) => 
      apiRequest("POST", `/api/gigs/${gigId}/apply`, { message }),
    onSuccess: () => {
      toast({
        title: "Application sent!",
        description: "Your application has been sent to the gig poster",
      });
    },
    onError: (error) => {
      toast({
        title: "Error applying to gig",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: 'all', label: 'All Gigs', icon: 'fas fa-th-large' },
    { id: 'home_help', label: 'Home Help', icon: 'fas fa-home' },
    { id: 'pet_care', label: 'Pet Care', icon: 'fas fa-dog' },
    { id: 'childcare', label: 'Childcare', icon: 'fas fa-baby' },
    { id: 'tutoring', label: 'Tutoring', icon: 'fas fa-graduation-cap' },
    { id: 'handyman', label: 'Handyman', icon: 'fas fa-tools' },
    { id: 'delivery', label: 'Delivery', icon: 'fas fa-truck' },
  ];

  const handleCreateGig = (formData: FormData) => {
    const gigData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      hourlyRate: formData.get('hourlyRate') ? parseFloat(formData.get('hourlyRate') as string) : null,
      fixedPrice: formData.get('fixedPrice') ? parseFloat(formData.get('fixedPrice') as string) : null,
      duration: formData.get('duration') ? parseInt(formData.get('duration') as string) : null,
      isUrgent: formData.get('isUrgent') === 'on',
    };

    createGigMutation.mutate(gigData);
  };

  const handleApplyToGig = (gigId: string) => {
    const message = prompt("Why are you interested in this gig?");
    if (message) {
      applyToGigMutation.mutate({ gigId, message });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'home_help': return 'bg-green-100 text-green-700';
      case 'pet_care': return 'bg-purple-100 text-purple-700';
      case 'childcare': return 'bg-pink-100 text-pink-700';
      case 'tutoring': return 'bg-blue-100 text-blue-700';
      case 'handyman': return 'bg-orange-100 text-orange-700';
      case 'delivery': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (hourlyRate: number | null, fixedPrice: number | null) => {
    if (hourlyRate) return `$${hourlyRate}/hour`;
    if (fixedPrice) return `$${fixedPrice}`;
    return 'Negotiable';
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
                <i className="fas fa-briefcase text-teal mr-3"></i>Hommiefi Gigs
              </h2>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-teal text-white hover:bg-teal/90" data-testid="button-post-gig">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Gig
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post a Gig</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateGig(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Gig Title</Label>
                    <Input id="title" name="title" placeholder="What do you need help with?" required data-testid="input-gig-title" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Describe the task in detail..." 
                      rows={3}
                      required
                      data-testid="textarea-gig-description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger data-testid="select-gig-category">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input 
                        id="hourlyRate" 
                        name="hourlyRate" 
                        type="number" 
                        step="0.01" 
                        placeholder="25.00" 
                        data-testid="input-hourly-rate"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fixedPrice">Fixed Price ($)</Label>
                      <Input 
                        id="fixedPrice" 
                        name="fixedPrice" 
                        type="number" 
                        step="0.01" 
                        placeholder="100.00" 
                        data-testid="input-fixed-price"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input 
                      id="duration" 
                      name="duration" 
                      type="number" 
                      placeholder="2" 
                      data-testid="input-duration"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isUrgent" 
                      name="isUrgent" 
                      className="rounded border-gray-300 text-coral focus:ring-coral"
                      data-testid="checkbox-urgent"
                    />
                    <Label htmlFor="isUrgent" className="text-sm">Mark as urgent</Label>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-teal hover:bg-teal/90" disabled={createGigMutation.isPending} data-testid="button-create-gig">
                      {createGigMutation.isPending ? 'Posting...' : 'Post Gig'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-gray-600 mb-6">Local micro-jobs • Earn or get help from neighbors</p>

          {/* Filter Categories */}
          <div className="flex overflow-x-auto space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl mb-6 border border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id 
                    ? "bg-teal text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                data-testid={`filter-${category.id}`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.label}
              </button>
            ))}
          </div>

          {/* Gigs List */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="morphic-card p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-24 h-10 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <Card className="morphic-card p-12 text-center">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-briefcase text-teal text-2xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No gigs available</h3>
              <p className="text-gray-600 mb-4">Be the first to post a gig in your neighborhood!</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-teal hover:bg-teal/90" data-testid="button-post-first-gig">
                <Plus className="mr-2 h-4 w-4" />
                Post Gig
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {gigs.map((gig: any) => (
                <Card key={gig.id} className="morphic-card p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                          {gig.user.firstName?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800 text-lg" data-testid={`gig-title-${gig.id}`}>
                              {gig.title}
                            </h3>
                            {gig.isUrgent && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{gig.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {gig.user.firstName} {gig.user.lastName?.[0] || ''}.
                            </span>
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              {gig.location || 'Nearby'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {new Date(gig.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {formatPrice(gig.hourlyRate, gig.fixedPrice)}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-sm ${getCategoryColor(gig.category)}`}>
                          {categories.find(c => c.id === gig.category)?.label || gig.category}
                        </span>
                        {gig.duration && (
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {gig.duration} hours
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Button 
                        onClick={() => handleApplyToGig(gig.id)}
                        disabled={applyToGigMutation.isPending}
                        className="w-full lg:w-auto bg-teal text-white hover:bg-teal/90 transition-all"
                        data-testid={`apply-gig-${gig.id}`}
                      >
                        <HandMetal className="mr-2 h-4 w-4" />
                        {applyToGigMutation.isPending ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
