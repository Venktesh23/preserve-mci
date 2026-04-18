import { useState, useEffect, useCallback } from 'react';
import { messageAPI, Conversation, Message, Attachment } from '../utils/messageAPI';
import { useAuth } from '../contexts/useAuth';

export function useMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await messageAPI.getConversations();
      setConversations(data.conversations);
      
      // Calculate total unread count
      const total = data.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(total);
    } catch (err: any) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch conversations:', err);
      }
      setError(err.message);
      // Don't show error in UI for empty conversations
      setConversations([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await messageAPI.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (
    recipientId: string,
    content: string,
    subject?: string,
    attachments?: Attachment[],
    replyToId?: string
  ) => {
    try {
      const result = await messageAPI.sendMessage({
        recipientId,
        subject,
        content,
        attachments,
        replyToId,
      });
      
      // Refresh conversations after sending
      await fetchConversations();
      
      return result.message;
    } catch (err: any) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [fetchConversations]);

  // Mark a message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messageAPI.markAsRead(messageId);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          ),
          unreadCount: conv.messages.filter(msg => 
            !msg.read && msg.id !== messageId && msg.recipientId === user?.id
          ).length,
        }))
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark message as read:', err);
    }
  }, [user]);

  // Mark all messages from a partner as read
  const markAllAsRead = useCallback(async (partnerId: string) => {
    try {
      const result = await messageAPI.markAllAsRead(partnerId);
      
      // Update local state
      setConversations(prev =>
        prev.map(conv => 
          conv.partnerId === partnerId
            ? {
                ...conv,
                messages: conv.messages.map(msg => ({ ...msg, read: true })),
                unreadCount: 0,
              }
            : conv
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - result.markedCount));
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageAPI.deleteMessage(messageId);
      
      // Refresh conversations after deleting
      await fetchConversations();
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }, [fetchConversations]);

  // Get a specific conversation
  const getConversation = useCallback((partnerId: string) => {
    return conversations.find(conv => conv.partnerId === partnerId);
  }, [conversations]);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Poll for new messages every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  return {
    conversations,
    loading,
    error,
    unreadCount,
    sendMessage,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    getConversation,
    refreshConversations: fetchConversations,
  };
}