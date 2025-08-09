import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Heart, MessageCircle, Shield, Users, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Haven() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('toddler');
  const [selectedRoom, setSelectedRoom] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: groups = [] } = useQuery({
    queryKey: ["/api/haven/groups"],
  });

  const joinGroupMutation = useMutation({
    mutationFn: (groupId: string) => apiRequest("POST", `/api/haven/groups/${groupId}/join`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/haven/groups"] });
      toast({
        title: "Joined group!",
        description: "You can now participate in this community",
      });
    },
  });

  const ageGroups = [
    { id: 'newborn', label: 'Newborn (0-6 months)', description: 'Sleep schedules, feeding, and early development support', members: 24, online: 3 },
    { id: 'toddler', label: 'Toddler (1-3 years)', description: 'Tantrums, potty training, and toddler activities', members: 18, online: 5 },
    { id: 'preschool', label: 'Preschool (3-5 years)', description: 'School readiness, social skills, and learning activities', members: 31, online: 7 },
    { id: 'school', label: 'School Age (6-12 years)', description: 'Homework help, extracurriculars, and friendship issues', members: 42, online: 9 },
    { id: 'teen', label: 'Teen (13+ years)', description: 'Adolescence, independence, and high school challenges', members: 28, online: 4 },
    { id: 'general', label: 'General Support', description: 'All ages welcome - general parenting and life support', members: 67, online: 12 },
  ];

  const chatRooms = [
    { id: 'general', name: 'General Chat', members: 45, unread: 5, active: true },
    { id: 'sleep', name: 'Sleep Support', members: 23, unread: 2, active: false },
    { id: 'playdate', name: 'Playdate Planning', members: 31, unread: 8, active: false },
    { id: 'anonymous', name: 'Anonymous Support', members: 12, unread: 3, active: false },
  ];

  const sampleMessages = [
    {
      id: 1,
      user: { firstName: 'Emma', lastName: 'M.' },
      message: "Just wanted to thank everyone for the sleep advice last week! Lily finally slept through the night 🙌",
      time: '2 min ago',
      isAnonymous: false,
      isVerified: true
    },
    {
      id: 2,
      user: { firstName: 'Sarah', lastName: 'J.' },
      message: "That's amazing Emma! ❤️ So happy for you. Sleep is everything with toddlers.",
      time: '5 min ago',
      isAnonymous: false,
      isVerified: true
    },
    {
      id: 3,
      user: null,
      message: "Having a really tough day with tantrums. Any tips for dealing with the terrible twos? 😩",
      time: '8 min ago',
      isAnonymous: true,
      isVerified: false
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send to the API
    toast({
      title: "Message sent!",
      description: "Your message has been shared with the community",
    });
    setMessage('');
  };

  const handleJoinGroup = (groupId: string) => {
    joinGroupMutation.mutate(groupId);
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
                <Heart className="inline text-pink-600 mr-2" />
                Hommiefi Haven
              </h2>
            </div>
            <Button className="bg-pink-500 text-white hover:bg-pink-600" data-testid="button-join-group">
              <Users className="mr-2 h-4 w-4" />
              Join Group
            </Button>
          </div>

          <p className="text-gray-600 mb-6">Private mother communities • Safe spaces for support and connection</p>

          {/* Welcome Message */}
          <Card className="morphic-card p-6 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Welcome to Haven</h3>
            <p className="text-gray-600 mb-4">A safe, private space for mothers to connect, share, and support each other. All conversations are moderated and anonymous options are available.</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Shield className="text-pink-600 mr-1 h-4 w-4" />
                Verified members only
              </span>
              <span className="flex items-center">
                <i className="fas fa-eye-slash text-pink-600 mr-1"></i>
                Anonymous posting available
              </span>
              <span className="flex items-center">
                <i className="fas fa-user-check text-pink-600 mr-1"></i>
                24/7 moderation
              </span>
            </div>
          </Card>

          {/* Age Group Selection */}
          <div className="flex overflow-x-auto space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl mb-6 border border-gray-200">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedAgeGroup(group.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedAgeGroup === group.id 
                    ? "bg-pink-500 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                data-testid={`age-group-${group.id}`}
              >
                {group.label.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Room List */}
            <div className="lg:col-span-1">
              <Card className="morphic-card p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Active Rooms
                </h3>
                <div className="space-y-3">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom === room.id 
                          ? 'border-l-4 border-pink-500 bg-pink-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      data-testid={`chat-room-${room.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">{room.name}</h4>
                        {room.unread > 0 && (
                          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            {room.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{room.members} members online</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2">
              <Card className="morphic-card h-96 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-pink-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">
                      General Chat - {ageGroups.find(g => g.id === selectedAgeGroup)?.label}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">45 online</span>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-cog"></i>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Moderated by verified moms • Be kind and supportive</p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {sampleMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                      {msg.isAnonymous ? (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user-secret text-purple-600 text-sm"></i>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {msg.user?.firstName?.[0] || 'A'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {msg.isAnonymous ? 'Anonymous Mom' : `${msg.user?.firstName} ${msg.user?.lastName}`}
                          </span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            msg.isAnonymous 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {msg.isAnonymous ? 'Anonymous' : 'Verified Mom'}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts with fellow moms..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        data-testid="input-chat-message"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-pink-500 text-white hover:bg-pink-600"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          data-testid="checkbox-anonymous"
                        />
                        <span className="ml-2 text-sm text-gray-600">Post anonymously</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">This is a safe, moderated space</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Resource Sharing */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Share & Trade</h3>
            <Card className="morphic-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Available Items</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-baby text-pink-600"></i>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Baby carrier</p>
                        <p className="text-sm text-gray-600">Ergobaby, excellent condition</p>
                      </div>
                      <span className="text-xs text-gray-500">Free</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-book text-pink-600"></i>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Pregnancy books</p>
                        <p className="text-sm text-gray-600">What to Expect series</p>
                      </div>
                      <span className="text-xs text-gray-500">Free</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Requested Items</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-car text-pink-600"></i>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Car seat base</p>
                        <p className="text-sm text-gray-600">Chicco KeyFit 30</p>
                      </div>
                      <span className="text-xs text-gray-500">Looking</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fas fa-tshirt text-pink-600"></i>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Maternity clothes</p>
                        <p className="text-sm text-gray-600">Size M, work appropriate</p>
                      </div>
                      <span className="text-xs text-gray-500">Looking</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
