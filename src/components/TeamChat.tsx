import { useState, useEffect, useRef } from "react";
import { 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Users,
  Hash,
  Search,
  Plus,
  Settings,
} from "lucide-react";

interface TeamChatProps {
  projectId: string;
  client: any;
  currentUserId: string;
}

interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  mentions: string[];
  attachments: any[];
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'video' | 'voice';
  isPrivate: boolean;
  members: string[];
}

const TeamChat: React.FC<TeamChatProps> = ({ projectId, client, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [_showChannelSettings, _setShowChannelSettings] = useState(false);
  const [_isTyping, setIsTyping] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string, avatar?: string}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChannels();
    loadTeamMembers();
  }, [projectId]);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChannels = async () => {
    try {
      // Load project channels (would be from database)
      const defaultChannels: Channel[] = [
        { id: 'general', name: 'general', type: 'text', isPrivate: false, members: [] },
        { id: 'random', name: 'random', type: 'text', isPrivate: false, members: [] },
        { id: 'development', name: 'development', type: 'text', isPrivate: false, members: [] },
      ];
      setChannels(defaultChannels);
      setActiveChannel(defaultChannels[0]);
    } catch (error) {
      console.error("Error loading channels:", error);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // Load team members (would be from database)
      const members = [
        { id: '1', name: 'John Doe', avatar: '' },
        { id: '2', name: 'Jane Smith', avatar: '' },
        { id: '3', name: 'Bob Johnson', avatar: '' },
      ];
      setTeamMembers(members);
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const loadMessages = async (_channelId: string) => {
    try {
      // Load messages for channel (would be from database)
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hey team! How is the project going?',
          authorId: '1',
          authorName: 'John Doe',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          mentions: [],
          attachments: []
        },
        {
          id: '2',
          content: 'Great! We just finished the kanban board implementation.',
          authorId: '2',
          authorName: 'Jane Smith',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          mentions: [],
          attachments: []
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;

    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage,
        authorId: currentUserId,
        authorName: 'Current User',
        createdAt: new Date().toISOString(),
        mentions: extractMentions(newMessage),
        attachments: []
      };

      // Send message to database
      await client.models.ChatMessage.create({
        content: message.content,
        authorId: message.authorId,
        projectId,
        channelId: activeChannel.id,
        mentions: message.mentions,
        messageType: 'text',
        createdAt: message.createdAt,
      });

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@(\w+)/g);
    return mentions ? mentions.map(m => m.substring(1)) : [];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Check for @mentions
    const lastWord = value.split(' ').pop();
    if (lastWord?.startsWith('@')) {
      setMentionQuery(lastWord.substring(1));
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const insertMention = (member: {id: string, name: string}) => {
    const words = newMessage.split(' ');
    words[words.length - 1] = `@${member.name}`;
    setNewMessage(words.join(' ') + ' ');
    setShowMentions(false);
    setMentionQuery("");
    inputRef.current?.focus();
  };

  const startVideoCall = async () => {
    try {
      const call = await client.models.VideoCall.create({
        title: `${activeChannel?.name} Video Call`,
        projectId,
        hostId: currentUserId,
        participants: teamMembers.map(m => m.id),
        scheduledTime: new Date().toISOString(),
        duration: 60,
        status: 'ongoing',
        createdAt: new Date().toISOString(),
      });
      
      // Open video call interface
      console.log("Starting video call:", call.id);
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Team Chat</h2>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Channels</span>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-colors ${
                    activeChannel?.id === channel.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {channel.type === 'text' ? (
                    <Hash className="w-4 h-4" />
                  ) : channel.type === 'video' ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Team Members</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{teamMembers.length}</span>
            </div>
            
            <div className="space-y-1">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 px-2 py-1">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {activeChannel?.type === 'text' ? (
              <Hash className="w-5 h-5 text-gray-500" />
            ) : activeChannel?.type === 'video' ? (
              <Video className="w-5 h-5 text-gray-500" />
            ) : (
              <Phone className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{activeChannel?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teamMembers.length} members
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Phone className="w-4 h-4" />
            </button>
            <button 
              onClick={startVideoCall}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {message.authorName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Mentions Dropdown */}
          {showMentions && filteredMembers.length > 0 && (
            <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => insertMention(member)}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-gray-900 dark:text-white">{member.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${activeChannel?.name || 'channel'}`}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
