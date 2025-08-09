import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  HandHeart, 
  Star,
  Recycle,
  Briefcase,
  Users,
  Heart,
  MessageSquareDashed,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // Sample activity data - in real app this would come from API
  const recentActivity = [
    {
      id: 1,
      type: 'loop',
      user: { firstName: 'Mike', lastName: 'Rodriguez' },
      description: 'Shared a power drill in Loop',
      time: '2 minutes ago',
      distance: '0.2 mi',
      icon: Recycle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'gig',
      user: { firstName: 'Emma', lastName: 'Wilson' },
      description: 'Posted a dog walking gig',
      time: '15 minutes ago',
      distance: '0.4 mi',
      icon: Briefcase,
      color: 'text-teal'
    },
    {
      id: 3,
      type: 'vibe',
      user: { firstName: 'Alex', lastName: 'Chen' },
      description: 'Is free now for coffee',
      time: '5 minutes ago',
      distance: '0.3 mi',
      icon: Users,
      color: 'text-purple-600'
    },
  ];

  const featureCards = [
    {
      title: 'Hommiefi Loop',
      subtitle: 'Borrow & Lend',
      description: 'Share tools, books, and household items with neighbors',
      stats: '8 items nearby',
      href: '/loop',
      icon: Recycle,
      color: 'bg-coral/10 text-coral',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
    {
      title: 'Hommiefi Gigs',
      subtitle: 'Local Tasks',
      description: 'Quick jobs and errands from neighbors',
      stats: '5 jobs posted',
      href: '/gigs',
      icon: Briefcase,
      color: 'bg-teal/10 text-teal',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
    {
      title: 'Hommiefi Vibe',
      subtitle: 'Social Connect',
      description: 'Meet neighbors and make friends instantly',
      stats: '3 neighbors free now',
      href: '/vibe',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
    {
      title: 'Hommiefi Haven',
      subtitle: "Mothers' Community",
      description: 'Private support groups for moms',
      stats: '12 active groups',
      href: '/haven',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
    {
      title: 'Hommiefi Thread',
      subtitle: 'Community Feed',
      description: 'Neighborhood updates and discussions',
      stats: '15 new posts',
      href: '/thread',
      icon: MessageSquareDashed,
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
    {
      title: 'Chat',
      subtitle: 'Messages',
      description: 'Direct messages with neighbors',
      stats: '3 unread messages',
      href: '/chat',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:shadow-lg hover:-translate-y-1'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <section className="mb-8">
            <Card className="morphic-card p-6 bg-gradient-to-r from-coral/10 to-teal/10 border border-coral/20 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
                    Your neighborhood is active today!
                  </h3>
                  <p className="text-gray-600">12 new requests • 8 items available • 5 neighbors online now</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-coral text-white px-6 py-3 rounded-xl font-medium hover:bg-coral/90 transition-all transform hover:scale-105"
                    data-testid="button-post-item"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Post Item
                  </Button>
                  <Button 
                    className="bg-teal text-white px-6 py-3 rounded-xl font-medium hover:bg-teal/90 transition-all transform hover:scale-105"
                    data-testid="button-find-help"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Help
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Quick Actions Grid */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* HelpOut Emergency */}
              <Card className="morphic-card p-4 border border-red-200 hover:shadow-lg transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="text-red-600 h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">HelpOut</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Emergency help from neighbors</p>
                <Button 
                  className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  data-testid="button-helpout-emergency"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Need Help Now
                </Button>
              </Card>

              {/* Active Requests */}
              <Card className="morphic-card p-4 border border-coral/20 hover:shadow-lg transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-coral/20 rounded-lg flex items-center justify-center mr-3">
                    <HandHeart className="text-coral h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Active Requests</h3>
                </div>
                <p className="text-2xl font-bold text-coral mb-1">5</p>
                <p className="text-gray-600 text-sm">People need your help</p>
              </Card>

              {/* Vibe Status */}
              <Card className="morphic-card p-4 border border-teal/20 hover:shadow-lg transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="text-teal h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Vibe Status</h3>
                </div>
                <p className="text-teal font-medium mb-1">Available</p>
                <button className="text-gray-600 text-sm hover:text-teal">Toggle availability</button>
              </Card>

              {/* Community Score */}
              <Card className="morphic-card p-4 border border-purple-200 hover:shadow-lg transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Star className="text-purple-600 h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Your Rating</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-1">4.9</p>
                <p className="text-gray-600 text-sm">From 47 neighbors</p>
              </Card>
            </div>
          </section>

          {/* Feature Grid */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 font-poppins">Explore Your Community</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.href} href={feature.href}>
                    <Card className={`morphic-card p-6 transition-all duration-300 transform cursor-pointer ${feature.hoverColor}`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mr-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800" data-testid={`feature-${feature.href.slice(1)}`}>
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600">{feature.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{feature.stats}</span>
                        <i className={`fas fa-arrow-right ${feature.color.split(' ')[1]}`}></i>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recent Activity Feed */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 font-poppins">Recent Activity</h3>
              <Button variant="ghost" className="text-coral hover:text-coral/80 font-medium">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <Card key={activity.id} className="morphic-card p-4 hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                        {activity.user.firstName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium" data-testid={`activity-${activity.id}`}>
                          <span className="font-semibold">{activity.user.firstName}</span> {activity.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {activity.distance} away • {activity.time}
                        </p>
                      </div>
                      <div className={activity.color}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
