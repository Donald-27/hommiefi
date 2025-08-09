import { useEffect, useRef } from "react";
import { User } from "lucide-react";
import type { Message } from "@shared/schema";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex-1 p-4 overflow-y-auto space-y-4" data-testid="message-list">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="text-gray-400" size={24} />
          </div>
          <h3 className="font-semibold text-gray-600 mb-2">No messages yet</h3>
          <p className="text-gray-500 text-sm">Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.senderId === 'current-user' ? 'justify-end' : ''
            }`}
            data-testid={`message-${message.id}`}
          >
            {message.senderId !== 'current-user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={12} className="text-gray-500" />
              </div>
            )}
            
            <div className={`flex-1 max-w-xs lg:max-w-md ${
              message.senderId === 'current-user' ? 'flex justify-end' : ''
            }`}>
              <div className={`rounded-lg px-3 py-2 ${
                message.senderId === 'current-user'
                  ? 'bg-teal text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'current-user'
                    ? 'text-white/80'
                    : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
            
            {message.senderId === 'current-user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={12} className="text-gray-500" />
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
