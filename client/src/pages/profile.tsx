import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { 
  ArrowLeft, 
  Camera, 
  Star, 
  Home, 
  Users, 
  Calendar,
  Edit,
  Coffee,
  Heart,
  Briefcase,
  MessageCircle
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    neighborhood: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => apiRequest("PUT", "/api/profile", profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sample user stats - in real app these would come from API
  const userStats = {
    itemsShared: 27,
    gigsCompleted: 15,
    vibeConnections: 8,
    communityPoints: 47,
    trustScore: 4.9,
    reviewCount: 47,
    joinedDate: "March 2023",
  };

  // Sample recent activity - in real app these would come from API
  const recentActivity = [
    {
      id: 1,
      type: "loop",
      description: "Shared children's books on Loop",
      date: "2 days ago",
      points: 5,
      icon: Coffee,
    },
    {
      id: 2,
      type: "vibe",
      description: "Had coffee with Alex via Vibe",
      date: "1 week ago",
      points: 3,
      icon: Heart,
    },
    {
      id: 3,
      type: "gig",
      description: "Completed dog walking gig",
      date: "2 weeks ago",
      points: 10,
      icon: Briefcase,
    },
  ];

  const skills = ["Childcare", "Tutoring", "Pet Sitting", "Baking"];
  const interests = ["Book Club", "Gardening", "Cooking", "Hiking"];

  const handleSaveProfile = () => {
    const profileData = {
      firstName: formData.firstName || (user as any)?.firstName,
      lastName: formData.lastName || (user as any)?.lastName,
      bio: formData.bio,
      neighborhood: formData.neighborhood || (user as any)?.neighborhood,
    };

    updateProfileMutation.mutate(profileData);
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
              <Button variant="ghost" size="sm" asChild className="lg:hidden">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 font-poppins">Profile</h2>
            </div>
            <Button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
              disabled={isEditing && updateProfileMutation.isPending}
              className={isEditing ? "bg-coral text-white hover:bg-coral/90" : ""}
              data-testid={isEditing ? "button-save-profile" : "button-edit-profile"}
            >
              {isEditing ? (
                updateProfileMutation.isPending ? "Saving..." : "Save Changes"
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="morphic-card overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-coral to-teal p-8 text-white relative">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-3xl font-bold">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-coral w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                      <Camera className="text-sm h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2 font-poppins" data-testid="text-user-full-name">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-white/90 mb-1" data-testid="text-user-neighborhood">
                      {user?.neighborhood || "Neighborhood not set"}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-300">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">{userStats.trustScore}</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        Verified Neighbor
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coral mb-1" data-testid="stat-items-shared">{userStats.itemsShared}</div>
                    <div className="text-sm text-gray-600">Items Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal mb-1" data-testid="stat-gigs-completed">{userStats.gigsCompleted}</div>
                    <div className="text-sm text-gray-600">Gigs Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1" data-testid="stat-vibe-connections">{userStats.vibeConnections}</div>
                    <div className="text-sm text-gray-600">Vibe Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-1" data-testid="stat-community-points">{userStats.communityPoints}</div>
                    <div className="text-sm text-gray-600">Community Points</div>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder={user?.firstName || "First name"}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder={user?.lastName || "Last name"}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell your neighbors about yourself..."
                        rows={3}
                        data-testid="textarea-bio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Neighborhood</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        placeholder={user?.neighborhood || "Your neighborhood"}
                        data-testid="input-neighborhood"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="bg-coral text-white hover:bg-coral/90"
                      data-testid="button-save-changes"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* About Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">About Me</h3>
                      <p className="text-gray-600 mb-4" data-testid="text-user-bio">
                        {user?.bio || "Mom of two, avid reader, and community enthusiast! I love connecting with neighbors and helping out whenever I can. Always happy to share tools, books, or just have a good conversation over coffee."}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="text-coral h-4 w-4" />
                          <span className="text-gray-600">Joined {userStats.joinedDate}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Home className="text-coral h-4 w-4" />
                          <span className="text-gray-600">Homeowner</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="text-coral h-4 w-4" />
                          <span className="text-gray-600">Family with kids</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills & Interests */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">Skills & Interests</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Can Help With</h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-green-100 text-green-700" data-testid={`skill-${skill.toLowerCase().replace(' ', '-')}`}>
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Interested In</h4>
                          <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                              <Badge key={interest} variant="secondary" className="bg-blue-100 text-blue-700" data-testid={`interest-${interest.toLowerCase().replace(' ', '-')}`}>
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              {!isEditing && (
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 font-poppins">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon className="text-green-600 h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium" data-testid={`activity-${activity.id}`}>{activity.description}</p>
                            <p className="text-sm text-gray-600">{activity.date}</p>
                          </div>
                          <span className="text-green-600 font-medium">+{activity.points} points</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
