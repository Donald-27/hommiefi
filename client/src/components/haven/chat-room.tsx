import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Send, Shield, KeyRound, User } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { HavenMessage } from "@shared/schema";

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
}

export default function ChatRoom({ roomId, onBack }: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();

  const { data: messages = [], isLoading } = useQuery<HavenMessage[]>({
    queryKey: [`/api/haven/rooms/${roomId}/messages`],
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage({
      type: 'haven_message',
      roomId,
      content: message,
      isAnonymous,
    });

    setMessage("");
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-pink-50/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
              data-testid="button-back-to-haven"
            >
              <ArrowLeft size={20} />
            </Button>
            <h3 className="font-semibold text-lg text-gray-800">General Chat - Toddlers (1-3)</h3>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">45 online</span>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-500">
              <Shield size={16} />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Moderated by verified moms • Be kind and supportive</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3" data-testid={`message-${msg.id}`}>
              {msg.isAnonymous ? (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <KeyRound className="text-purple-600" size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="text-gray-500" size={16} />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-800">
                    {msg.isAnonymous ? 'Anonymous Mom' : 'Neighbor'}
                  </span>
                  <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    msg.isAnonymous ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {msg.isAnonymous ? 'Anonymous' : 'Verified Mom'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500" size={16} />
            </div>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts with fellow moms..."
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              data-testid="input-haven-message"
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors"
              data-testid="button-send-message"
            >
              <Send size={16} />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  data-testid="checkbox-anonymous"
                />
                <span className="text-sm text-gray-600">Post anonymously</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">This is a safe, moderated space</p>
          </div>
        </form>
      </div>
    </div>
  );
}
