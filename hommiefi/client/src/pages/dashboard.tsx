import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { 
  Coffee, 
  Briefcase, 
  Users, 
  Heart, 
  MessageCircle, 
  Plus, 
  Search,
  TriangleAlert,
  Sparkles,
  Clock,
  MapPin,
  Star
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch recent activity
  const { data: loopItems } = useQuery({
    queryKey: ["/api/loop/items"],
  });

  const { data: gigs } = useQuery({
    queryKey: ["/api/gigs"],
  });

  const { data: vibes } = useQuery({
    queryKey: ["/api/vibes"],
  });

  const { data: threadPosts } = useQuery({
    queryKey: ["/api/thread/posts"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <section className="mb-8">
            <Card className="morphic-card p-6 bg-gradient-to-r from-coral/10 to-teal/10 border border-coral/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.firstName}! 👋
                  </h3>
                  <p className="text-gray-600">
                    Your neighborhood is active today! Stay connected with your community.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    asChild
                    className="bg-coral text-white hover:bg-coral/90 transition-all transform hover:scale-105"
                    data-testid="button-post-item"
                  >
                    <Link href="/loop">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Item
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    className="bg-teal text-white hover:bg-teal/90 transition-all transform hover:scale-105"
                    data-testid="button-find-help"
                  >
                    <Link href="/gigs">
                      <Search className="mr-2 h-4 w-4" />
                      Find Help
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Quick Actions Grid */}
          <section className="mb-8">
            {/* HelpOut Emergency Button */}
            <Card className="morphic-card p-4 border-red-200 hover:shadow-lg transition-all mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <TriangleAlert className="text-red-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-poppins">Emergency Help</h3>
                    <p className="text-gray-600 text-sm">Get immediate assistance from neighbors</p>
                  </div>
                </div>
                <Button 
                  className="bg-red-500 text-white hover:bg-red-600 transition-colors"
                  data-testid="button-helpout"
                >
                  <TriangleAlert className="mr-2 h-4 w-4" />
                  HelpOut
                </Button>
              </div>
            </Card>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Loop Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/loop">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mr-4">
                        <Coffee className="text-coral h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Hommiefi Loop</h4>
                        <p className="text-sm text-gray-600">Borrow & Lend</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Share tools, books, and household items with neighbors</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-loop-count">
                        {loopItems?.length || 0} items nearby
                      </span>
                      <span className="text-coral">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Gigs Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/gigs">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mr-4">
                        <Briefcase className="text-teal h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Hommiefi Gigs</h4>
                        <p className="text-sm text-gray-600">Local Tasks</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Quick jobs and errands from neighbors</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-gigs-count">
                        {gigs?.length || 0} jobs posted
                      </span>
                      <span className="text-teal">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Vibe Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/vibe">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <Users className="text-purple-600 h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Hommiefi Vibe</h4>
                        <p className="text-sm text-gray-600">Social Connect</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Meet neighbors and make friends instantly</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-vibe-count">
                        {vibes?.length || 0} neighbors free now
                      </span>
                      <span className="text-purple-600">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Haven Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/haven">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-4">
                        <Heart className="text-pink-600 h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Hommiefi Haven</h4>
                        <p className="text-sm text-gray-600">Mothers' Community</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Private support groups for moms</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-haven-count">
                        Active groups
                      </span>
                      <span className="text-pink-600">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Thread Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/thread">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                        <MessageCircle className="text-orange-600 h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Hommiefi Thread</h4>
                        <p className="text-sm text-gray-600">Community Feed</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Neighborhood updates and discussions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-thread-count">
                        {threadPosts?.length || 0} new posts
                      </span>
                      <span className="text-orange-600">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Chat Feature Card */}
              <Card className="morphic-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <Link href="/chat">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <MessageCircle className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-poppins">Chat</h4>
                        <p className="text-sm text-gray-600">Messages</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Direct messages with neighbors</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" data-testid="text-chat-count">
                        Conversations
                      </span>
                      <span className="text-blue-600">→</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 font-poppins">Recent Activity</h3>
              <Button variant="ghost" className="text-coral hover:text-coral/80 font-medium">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Show actual recent activity when available, otherwise empty state */}
              {!loopItems?.length && !gigs?.length && !vibes?.length ? (
                <Card className="morphic-card p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="text-gray-400 h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 font-poppins">No recent activity</h4>
                  <p className="text-gray-600 mb-4">Be the first to share something with your neighborhood!</p>
                  <Button asChild className="bg-coral text-white hover:bg-coral/90">
                    <Link href="/loop">
                      <Plus className="mr-2 h-4 w-4" />
                      Share an Item
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Sample activity items - in real app these would come from API */}
                  <Card className="morphic-card p-4 hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
                        <Coffee className="text-coral h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">New item shared in Loop</p>
                        <p className="text-gray-600 text-sm">Someone shared a power drill nearby</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            2 minutes ago
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            0.2 miles away
                          </span>
                        </div>
                      </div>
                      <div className="text-coral">
                        <Coffee className="h-5 w-5" />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Community Stats */}
          <section>
            <Card className="morphic-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">Your Community Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-coral mb-1">0</div>
                  <div className="text-sm text-gray-600">Items Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal mb-1">0</div>
                  <div className="text-sm text-gray-600">Gigs Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <div className="text-sm text-gray-600">Vibe Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">0</div>
                  <div className="text-sm text-gray-600">Community Points</div>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
