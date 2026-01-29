import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'rent' | 'tenant' | 'property';
  createdAt: Date;
  read: boolean;
  link?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev].slice(0, 20)); // Keep last 20
    
    // Show toast notification
    toast(notification.title, {
      description: notification.message,
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Subscribe to real-time maintenance request changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('maintenance-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'maintenance_requests',
        },
        (payload) => {
          const newRequest = payload.new as {
            id: string;
            title: string;
            priority: string;
            status: string;
          };
          
          addNotification({
            title: 'New Maintenance Request',
            message: `"${newRequest.title}" - Priority: ${newRequest.priority}`,
            type: 'maintenance',
            link: '/maintenance',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'maintenance_requests',
        },
        (payload) => {
          const updatedRequest = payload.new as {
            id: string;
            title: string;
            status: string;
          };
          const oldRequest = payload.old as {
            status: string;
          };
          
          // Only notify on status changes
          if (updatedRequest.status !== oldRequest.status) {
            addNotification({
              title: 'Maintenance Status Updated',
              message: `"${updatedRequest.title}" is now ${updatedRequest.status}`,
              type: 'maintenance',
              link: '/maintenance',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
