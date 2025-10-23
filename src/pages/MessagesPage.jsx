
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { 
  MessageSquare, Send, Loader2, User, Search, MoreVertical, 
  Paperclip, Image as ImageIcon, Smile, Check, CheckCheck, 
  ArrowLeft, Trash2, Pin, Archive, Phone, Video, Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at,
          buyer_id,
          seller_id,
          annonce_id,
          annonces ( title, images_urls ),
          buyer:profiles!buyer_id ( id, full_name, avatar_url ),
          seller:profiles!seller_id ( id, full_name, avatar_url )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger vos conversations.' });
      } else {
        setConversations(data || []);
        // Fetch unread counts and last messages for each conversation
        if (data) {
          fetchUnreadCountsAndLastMessages(data);
        }
      }
      setLoading(false);
    };
    fetchConversations();
  }, [user, toast]);

  const fetchUnreadCountsAndLastMessages = async (convs) => {
    const counts = {};
    const lastMsgs = {};
    
    for (const conv of convs) {
      // Get unread count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('is_read', false)
        .neq('sender_id', user.id);
      
      counts[conv.id] = count || 0;
      
      // Get last message
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      lastMsgs[conv.id] = lastMsg;
    }
    
    setUnreadCounts(counts);
    setLastMessages(lastMsgs);
  };

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          is_read
        `)
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', selectedConversation.id)
          .neq('sender_id', user.id);
        
        // Update unread count to 0 for this conversation
        setUnreadCounts(prev => ({ ...prev, [selectedConversation.id]: 0 }));
      }
    };

    fetchMessages();
    setShowMobileConversations(false);

    // Subscribe to new messages
    const subscription = supabase
      .channel(`conversation:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        // Update last message
        setLastMessages(prev => ({
          ...prev,
          [selectedConversation.id]: {
            content: payload.new.content,
            created_at: payload.new.created_at,
            sender_id: payload.new.sender_id
          }
        }));
        
        // Play notification sound if message from other user
        if (payload.new.sender_id !== user.id) {
          playNotificationSound();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => 
          prev.map(msg => msg.id === payload.new.id ? payload.new : msg)
        );
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedConversation, user]);

  // Notification sound
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77RgGwU7k9n0ynQpBSh+zPDekkAKEVm48/CnThwKQ6Hn9L5pGQc2jdTz0oIyBiZ6y/LdlUEKC1Sz6/GnUBsLPZjV8s14KwYpc8fv3ZRACRJWuvPxpVAdC0Gf5/S+aRgHMIvU89OCNQY=');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Could not play sound', e));
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedConversation) return;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing status
    setIsTyping(true);
    
    // Clear typing after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: newMessage.trim()
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'envoyer le message.' });
    } else {
      setNewMessage('');
      setShowEmojiPicker(false);
      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);
    }
    setSendingMessage(false);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) return;
    
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la conversation.' });
    } else {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
      toast({ title: 'Succès', description: 'Conversation supprimée.' });
    }
  };

  const getOtherUser = (conversation) => {
    if (!conversation) return null;
    return conversation.buyer_id === user.id ? conversation.seller : conversation.buyer;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / 1000 / 60 / 60;

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return messageDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatMessageDate = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return "Aujourd'hui";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    return messageDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = formatMessageDate(msg.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherUser = getOtherUser(conv);
    const userName = otherUser?.full_name?.toLowerCase() || '';
    const annonceName = conv.annonces?.title?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return userName.includes(query) || annonceName.includes(query);
  });

  const emojis = ['😀', '😂', '😍', '😊', '😉', '😎', '😭', '😘', '😋', '😜', '🙄', '😏', '❤️', '👍', '👎', '👏', '👌', '✨', '🎉', '🎈'];

  const messageGroups = groupMessagesByDate(messages);
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Helmet>
        <title>{totalUnread > 0 ? `(${totalUnread}) ` : ''}Messages - MBOA PLACE</title>
        <meta name="description" content="Consultez vos messages sur MBOA PLACE." />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto h-screen flex flex-col">
          {/* Header moderne */}
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!showMobileConversations && selectedConversation && (
                  <button 
                    onClick={() => {
                      setShowMobileConversations(true);
                      setSelectedConversation(null);
                    }}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h1 className="text-2xl font-bold flex items-center">
                  <MessageSquare size={28} className="mr-3 text-green-700" />
                  Messages
                  {totalUnread > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </h1>
              </div>
              
              {/* Search bar */}
              <div className="hidden md:flex items-center space-x-3 flex-1 max-w-md ml-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher dans les conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-700 mx-auto mb-4" />
                <p className="text-gray-600">Chargement de vos conversations...</p>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune conversation</h2>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore de messages. Contactez un vendeur depuis une annonce pour commencer à discuter !
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Découvrir les annonces
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white shadow-lg overflow-hidden flex">
              {/* Conversations List */}
              <div className={`${
                showMobileConversations ? 'w-full' : 'hidden'
              } md:block md:w-96 border-r border-gray-200 flex flex-col bg-white`}>
                {/* Mobile search */}
                <div className="md:hidden p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence>
                    {filteredConversations.map((conv, index) => {
                      const otherUser = getOtherUser(conv);
                      const lastMsg = lastMessages[conv.id];
                      const unreadCount = unreadCounts[conv.id] || 0;
                      
                      return (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedConversation(conv)}
                          className={`relative p-4 border-b cursor-pointer hover:bg-gray-50 transition group ${
                            selectedConversation?.id === conv.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Avatar with online indicator */}
                            <div className="relative flex-shrink-0">
                              {otherUser?.avatar_url ? (
                                <img 
                                  src={otherUser.avatar_url} 
                                  alt={otherUser.full_name} 
                                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white" 
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white">
                                  {otherUser?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                              {/* Online indicator - could be connected to real-time presence */}
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 border-2 border-white rounded-full" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`font-semibold truncate ${
                                  unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {otherUser?.full_name || 'Utilisateur'}
                                </p>
                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                  {formatTime(lastMsg?.created_at || conv.updated_at)}
                                </span>
                              </div>
                              
                              {/* Annonce info avec image */}
                              <div className="flex items-center space-x-2 mb-2">
                                {conv.annonces?.images_urls?.[0] && (
                                  <img 
                                    src={conv.annonces.images_urls[0]} 
                                    alt="" 
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <p className="text-xs text-green-600 truncate font-medium">
                                  {conv.annonces?.title || 'Annonce'}
                                </p>
                              </div>
                              
                              {/* Last message preview */}
                              <div className="flex items-center justify-between">
                                <p className={`text-sm truncate ${
                                  unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                                }`}>
                                  {lastMsg?.sender_id === user.id && 'Vous: '}
                                  {lastMsg?.content || 'Nouvelle conversation'}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Delete button (hidden by default, shown on hover) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conv.id);
                              }}
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded-full"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {filteredConversations.length === 0 && searchQuery && (
                    <div className="p-8 text-center text-gray-500">
                      <Search size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>Aucune conversation trouvée</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className={`${
                showMobileConversations ? 'hidden' : 'flex'
              } md:flex flex-1 flex-col bg-gray-50`}>
                {selectedConversation ? (
                  <>
                    {/* Enhanced Header */}
                    <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-3">
                        {getOtherUser(selectedConversation)?.avatar_url ? (
                          <img 
                            src={getOtherUser(selectedConversation).avatar_url} 
                            alt="Avatar" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-md">
                            {getOtherUser(selectedConversation)?.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {getOtherUser(selectedConversation)?.full_name || 'Utilisateur'}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-300 rounded-full" />
                            <span>{selectedConversation.annonces?.title}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block" title="Appel vocal">
                          <Phone size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block" title="Appel vidéo">
                          <Video size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Informations">
                          <Info size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Messages with date grouping */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
                      {Object.entries(messageGroups).map(([date, msgs]) => (
                        <div key={date} className="space-y-3">
                          {/* Date separator */}
                          <div className="flex items-center justify-center my-4">
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                              <span className="text-xs font-semibold text-gray-600">{date}</span>
                            </div>
                          </div>
                          
                          {/* Messages for this date */}
                          {msgs.map((message, index) => {
                            const isOwnMessage = message.sender_id === user.id;
                            const showAvatar = index === msgs.length - 1 || msgs[index + 1]?.sender_id !== message.sender_id;
                            
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-end space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                {/* Avatar for other user */}
                                {!isOwnMessage && (
                                  <div className="flex-shrink-0 w-8 h-8">
                                    {showAvatar && (
                                      getOtherUser(selectedConversation)?.avatar_url ? (
                                        <img 
                                          src={getOtherUser(selectedConversation).avatar_url} 
                                          alt="" 
                                          className="w-8 h-8 rounded-full object-cover" 
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold">
                                          {getOtherUser(selectedConversation)?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                                
                                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                  <div 
                                    className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                      isOwnMessage
                                        ? 'bg-green-600 text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                                    }`}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                      {message.content}
                                    </p>
                                  </div>
                                  
                                  <div className={`flex items-center space-x-1 mt-1 px-2 ${
                                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                                  }`}>
                                    <span className={`text-xs ${
                                      isOwnMessage ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      {formatTime(message.created_at)}
                                    </span>
                                    
                                    {/* Read indicators for own messages */}
                                    {isOwnMessage && (
                                      <span className="text-green-600">
                                        {message.is_read ? (
                                          <CheckCheck size={14} className="inline" />
                                        ) : (
                                          <Check size={14} className="inline" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Spacer for own messages */}
                                {isOwnMessage && <div className="w-8" />}
                              </motion.div>
                            );
                          })}
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-end space-x-2"
                          >
                            <div className="w-8 h-8">
                              {getOtherUser(selectedConversation)?.avatar_url ? (
                                <img 
                                  src={getOtherUser(selectedConversation).avatar_url} 
                                  alt="" 
                                  className="w-8 h-8 rounded-full object-cover" 
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold">
                                  {getOtherUser(selectedConversation)?.full_name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200">
                              <div className="flex space-x-1">
                                <motion.div 
                                  animate={{ y: [0, -5, 0] }} 
                                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full" 
                                />
                                <motion.div 
                                  animate={{ y: [0, -5, 0] }} 
                                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full" 
                                />
                                <motion.div 
                                  animate={{ y: [0, -5, 0] }} 
                                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full" 
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Enhanced Input Area */}
                    <div className="p-4 border-t bg-white">
                      {/* Emoji Picker */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 shadow-lg"
                          >
                            <div className="grid grid-cols-10 gap-2">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    inputRef.current?.focus();
                                  }}
                                  className="text-2xl hover:bg-gray-200 rounded-lg p-2 transition transform hover:scale-110"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                        {/* Action buttons */}
                        <div className="flex space-x-1 mb-2">
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition text-gray-600 hover:text-green-600"
                            title="Ajouter un emoji"
                          >
                            <Smile size={22} />
                          </button>
                          <button
                            type="button"
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition text-gray-600 hover:text-green-600"
                            title="Joindre un fichier"
                          >
                            <Paperclip size={22} />
                          </button>
                          <button
                            type="button"
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition text-gray-600 hover:text-green-600"
                            title="Envoyer une image"
                          >
                            <ImageIcon size={22} />
                          </button>
                        </div>
                        
                        {/* Message input */}
                        <div className="flex-1 relative">
                          <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value);
                              handleTyping();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                              }
                            }}
                            placeholder="Écrivez votre message..."
                            rows={1}
                            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
                            style={{ maxHeight: '120px' }}
                            disabled={sendingMessage}
                          />
                          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                            {newMessage.length > 0 && `${newMessage.length}`}
                          </div>
                        </div>
                        
                        {/* Send button */}
                        <button
                          type="submit"
                          disabled={sendingMessage || !newMessage.trim()}
                          className="bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-2xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                          title="Envoyer (Entrée)"
                        >
                          {sendingMessage ? (
                            <Loader2 size={24} className="animate-spin" />
                          ) : (
                            <Send size={24} />
                          )}
                        </button>
                      </form>
                      
                      {/* Keyboard shortcut hint */}
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Entrée</kbd> pour envoyer, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Maj + Entrée</kbd> pour une nouvelle ligne
                      </p>
                    </div>
                     </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center p-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                      >
                        <MessageSquare size={64} className="text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Choisissez une conversation dans la liste pour commencer à discuter avec un acheteur ou un vendeur.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
  