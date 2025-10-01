'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Search,
  Send,
  MoreHorizontal,
  User,
  Phone,
  Mail
} from 'lucide-react';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    participants: ['You', 'Sarah Johnson', 'John Smith'],
    lastMessage: 'Thanks for the update on the venue!',
    lastMessageTime: new Date(2024, 11, 1, 14, 30),
    unread: 0,
    isGroup: true
  },
  {
    id: '2',
    weddingId: '2',
    weddingTitle: "Emma & Michael's Wedding",
    participants: ['You', 'Emma Wilson'],
    lastMessage: 'Can we schedule a call for tomorrow?',
    lastMessageTime: new Date(2024, 11, 1, 12, 15),
    unread: 2,
    isGroup: false
  },
  {
    id: '3',
    weddingId: '3',
    weddingTitle: "Lisa & David's Wedding",
    participants: ['You', 'Lisa Chen', 'David Wilson'],
    lastMessage: 'The catering menu looks perfect!',
    lastMessageTime: new Date(2024, 10, 30, 18, 45),
    unread: 0,
    isGroup: true
  },
  {
    id: '4',
    weddingId: '1',
    weddingTitle: "Sarah & John's Wedding",
    participants: ['You', 'Michael Brown'], // Vendor contact
    lastMessage: 'Finalizing the floral arrangements',
    lastMessageTime: new Date(2024, 10, 29, 10, 20),
    unread: 1,
    isGroup: false
  }
];

// Mock data for messages in the current conversation
const mockMessages = [
  {
    id: '1',
    sender: 'You',
    content: 'Hi Sarah! Just wanted to confirm the venue details for your wedding.',
    timestamp: new Date(2024, 10, 25, 9, 30),
    isOwn: true
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    content: 'Hi! Yes, I\'m looking forward to seeing the beach resort. Can you send me the address?',
    timestamp: new Date(2024, 10, 25, 9, 35),
    isOwn: false
  },
  {
    id: '3',
    sender: 'You',
    content: 'Absolutely! The venue is located at Beach Resort, Maldives. I\'ll send you the exact coordinates.',
    timestamp: new Date(2024, 10, 25, 9, 40),
    isOwn: true
  },
  {
    id: '4',
    sender: 'Sarah Johnson',
    content: 'Thank you! Also, could you check if we can have a backup plan in case of rain?',
    timestamp: new Date(2024, 10, 25, 9, 42),
    isOwn: false
  },
  {
    id: '5',
    sender: 'You',
    content: 'Definitely! The resort has an indoor space available as well. I\'ll get you the details.',
    timestamp: new Date(2024, 10, 25, 9, 45),
    isOwn: true
  }
];

const InternalMessaging = () => {
  const [conversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversation, setActiveConversation] = useState(conversations[0]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: (messages.length + 1).toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv => 
    conv.weddingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <WeddingLayout>
      <Header 
        title="Internal Messaging" 
        subtitle="Communicate with clients and team members"
      >
        <Button>
          <MessageCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <Card className="lg:col-span-1 h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversations
              </div>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-80px)]">
            <div className="p-2">
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {filteredConversations.map(conv => (
                <div 
                  key={conv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    activeConversation.id === conv.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate max-w-[70%]">{conv.weddingTitle}</h3>
                    <span className="text-xs text-muted-foreground">
                      {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate max-w-[70%]">
                      {conv.participants.length > 2 ? `Group: ${conv.participants.length} members` : conv.participants.filter(p => p !== 'You')[0]}
                    </p>
                    {conv.unread > 0 && (
                      <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {activeConversation.weddingTitle}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isOwn 
                        ? 'bg-blue-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {!msg.isOwn && (
                      <div className="font-medium text-sm mb-1">{msg.sender}</div>
                    )}
                    <div>{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WeddingLayout>
  );
};

export default InternalMessaging;