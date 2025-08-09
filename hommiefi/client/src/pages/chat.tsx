import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import { Link } from "wouter";
import { ArrowLeft, Search, Phone, Video, Info, Send, Paperclip } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendMessage: sendWebSocketMessage } = useWebSocket();

  // Fetch real conversations from API
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/chat/conversations"],
    queryFn: () => fetch("/api/chat/conversations", { credentials: 'include' }).then(res => res.json()),
  });

  // Fetch messages for selected conversation
  const { data: messagesData = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/conversations", selectedConversation, "messages"],
    queryFn: () => fetch(`/api/chat/conversations/${selectedConversation}/messages`, { credentials: 'include' }).then(res => res.json()),
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageContent: string) => 
      apiRequest("POST", `/api/chat/conversations/${selectedConversation}/messages`, {
        content: messageContent,
        messageType: 'text',
      }),
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations", selectedConversation, "messages"] });
      sendWebSocketMessage({
        type: 'new_message',
        conversationId: selectedConversation,
        message: newMessage,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sample fallback conversations for demo
  const sampleConversations = [
    {
      id: '1',
      type: 'direct',
      name: 'Mike Rodriguez',
      avatar: 'M',
      lastMessage: 'Thanks for letting me borrow the drill!',
      lastMessageTime: '2m',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      type: 'direct',
      name: 'Emma Wilson',
      avatar: 'E',
      lastMessage: 'Are you free for that coffee chat today?',
      lastMessageTime: '1h',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      type: 'direct',
      name: 'Lisa Chen',
      avatar: 'L',
      lastMessage: 'Great job on the tutoring session!',
      lastMessageTime: '3h',
      unreadCount: 0,
      isOnline: true,
    },
  ];

  // Sample fallback messages for demo
  const sampleMessages = [
    {
      id: '1',
      senderId: selectedConversation,
      senderName: 'Mike Rodriguez',
      content: 'Hey! Thanks for letting me borrow the drill set. The furniture assembly went great!',
      timestamp: '2 minutes ago',
      isOwn: false,
    },
    {
      id: '2',
      senderId: user?.id || 'me',
      senderName: user?.firstName || 'You',
      content: 'No problem! Glad it worked out well. Feel free to borrow it anytime you need it 👍',
      timestamp: '1 minute ago',
      isOwn: true,
    },
    {
      id: '3',
      senderId: selectedConversation,
      senderName: 'Mike Rodriguez',
      content: "You're awesome! I left a 5-star review for you. This community is amazing 🌟",
      timestamp: 'Just now',
      isOwn: false,
    },
  ];

  // Use real data if available, fallback to sample data
  const displayConversations = conversations.length > 0 ? conversations : sampleConversations;
  const displayMessages = messagesData.length > 0 ? messagesData : sampleMessages;
  
  const selectedConv = displayConversations.find((c: any) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
    setMessage('');
  };

  const filteredConversations = displayConversations.filter((conv: any) =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 font-poppins">
              <i className="fas fa-comment-dots text-blue-600 mr-3"></i>Messages
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[calc(100vh-8rem)]">
            {/* Chat List */}
            <div className="lg:col-span-1">
              <Card className="morphic-card h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    <i className="fas fa-message text-teal mr-2"></i>Conversations
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search conversations..."
                      className="pl-10"
                      data-testid="input-search-conversations"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-teal/5 border-l-4 border-l-teal' : ''
                      }`}
                      data-testid={`conversation-${conversation.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                            {conversation.avatar}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800 truncate">{conversation.name}</p>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-teal text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Active Chat */}
            <div className="lg:col-span-2">
              <Card className="morphic-card h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-teal/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConv?.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800" data-testid="chat-contact-name">
                          {selectedConv?.name}
                        </h3>
                        <p className={`text-sm ${selectedConv?.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          <i className="fas fa-circle text-xs mr-1"></i>
                          {selectedConv?.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal" data-testid="button-voice-call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal" data-testid="button-video-call">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal" data-testid="button-chat-info">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
                    </div>
                  ) : displayMessages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${msg.userId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {msg.userId !== user?.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {msg.user?.firstName?.[0] || msg.senderName?.[0] || 'U'}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className={`rounded-lg p-3 ${msg.userId === user?.id ? 'bg-teal text-white' : 'bg-gray-100'}`}>
                            <p className="text-sm" data-testid={`message-${msg.id}`}>{msg.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {msg.userId === user?.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {user?.firstName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal" data-testid="button-attach">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        data-testid="input-message"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sendMessageMutation.isPending}
                      className="bg-teal text-white hover:bg-teal/90"
                      data-testid="button-send"
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
