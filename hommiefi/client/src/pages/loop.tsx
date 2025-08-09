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
import { ArrowLeft, Plus, Filter, Search, Handshake, ArrowRightLeft, Calendar } from "lucide-react";

export default function Loop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/loop/items", selectedCategory === 'all' ? undefined : selectedCategory],
    queryFn: () => {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      return fetch(`/api/loop/items${params}`, { credentials: 'include' }).then(res => res.json());
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (itemData: any) => apiRequest("POST", "/api/loop/items", itemData),
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/loop/items"] });
      toast({
        title: "Item shared!",
        description: "Your item has been added to the Loop",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: 'all', label: 'All Items', icon: 'fas fa-th-large' },
    { id: 'tools', label: 'Tools', icon: 'fas fa-tools' },
    { id: 'books', label: 'Books', icon: 'fas fa-book' },
    { id: 'baby_gear', label: 'Baby Gear', icon: 'fas fa-baby' },
    { id: 'furniture', label: 'Furniture', icon: 'fas fa-couch' },
    { id: 'electronics', label: 'Electronics', icon: 'fas fa-laptop' },
    { id: 'sports', label: 'Sports', icon: 'fas fa-football-ball' },
  ];

  const handleCreateItem = (formData: FormData) => {
    const itemData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      type: formData.get('type'),
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    };

    createItemMutation.mutate(itemData);
  };

  const filteredItems = items.filter((item: any) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer': return 'bg-green-100 text-green-700';
      case 'request': return 'bg-orange-100 text-orange-700';
      case 'swap': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'offer': return 'fas fa-gift';
      case 'request': return 'fas fa-hand-holding-heart';
      case 'swap': return 'fas fa-exchange-alt';
      default: return 'fas fa-tag';
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
                <i className="fas fa-recycle text-coral mr-3"></i>Hommiefi Loop
              </h2>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-coral text-white hover:bg-coral/90" data-testid="button-share-item">
                  <Plus className="mr-2 h-4 w-4" />
                  Share Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share an Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateItem(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Item Title</Label>
                    <Input id="title" name="title" placeholder="What are you sharing?" required data-testid="input-item-title" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Describe your item..." 
                      rows={3}
                      data-testid="textarea-item-description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" required>
                        <SelectTrigger data-testid="select-item-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select name="type" required>
                        <SelectTrigger data-testid="select-item-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offer">Offering (Free)</SelectItem>
                          <SelectItem value="request">Requesting</SelectItem>
                          <SelectItem value="swap">Want to Swap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      data-testid="input-item-price"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-coral hover:bg-coral/90" disabled={createItemMutation.isPending} data-testid="button-create-item">
                      {createItemMutation.isPending ? 'Sharing...' : 'Share Item'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-gray-600 mb-6">Community sharing circle • Borrow, lend, swap with neighbors</p>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <Card className="morphic-card p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search Items</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                        className="pl-10"
                        data-testid="input-search-items"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Categories</Label>
                    <div className="space-y-2 mt-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.id 
                              ? 'bg-coral text-white' 
                              : 'hover:bg-gray-100'
                          }`}
                          data-testid={`filter-${category.id}`}
                        >
                          <i className={`${category.icon} mr-2`}></i>
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Items Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="morphic-card animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card className="morphic-card p-12 text-center">
                  <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-recycle text-coral text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share something with your neighbors!'}
                  </p>
                  <Button onClick={() => setShowCreateModal(true)} className="bg-coral hover:bg-coral/90" data-testid="button-share-first-item">
                    <Plus className="mr-2 h-4 w-4" />
                    Share Item
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <Card key={item.id} className="morphic-card overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="h-48 bg-gradient-to-br from-coral/10 to-teal/10 flex items-center justify-center">
                        <i className={`${getTypeIcon(item.type)} text-4xl text-gray-400`}></i>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 truncate flex-1" data-testid={`item-title-${item.id}`}>
                            {item.title}
                          </h3>
                          <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type === 'offer' ? 'Free' : item.type === 'request' ? 'Wanted' : 'Swap'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {item.user.firstName?.[0] || 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.user.firstName}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-location-dot mr-1"></i>
                            {item.location || 'Nearby'}
                          </span>
                        </div>
                        
                        <Button 
                          className={`w-full py-2 rounded-lg font-medium transition-all ${
                            item.type === 'offer' 
                              ? 'bg-coral text-white hover:bg-coral/90'
                              : item.type === 'request'
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          data-testid={`button-${item.type}-${item.id}`}
                        >
                          {item.type === 'offer' && <><Handshake className="mr-2 h-4 w-4" />Request to Borrow</>}
                          {item.type === 'request' && <><Calendar className="mr-2 h-4 w-4" />I Can Help</>}
                          {item.type === 'swap' && <><ArrowRightLeft className="mr-2 h-4 w-4" />Propose Swap</>}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
