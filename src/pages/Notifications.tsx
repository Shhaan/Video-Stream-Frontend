import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Heart, MessageSquare, UserPlus, Play } from 'lucide-react';
import { api_auth } from '../lib/api';

interface NotificationType {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api_auth.get<NotificationType[]>('/api/v1/user/notification/');
      setNotifications(data);
    } catch (error) {
      console.error('failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api_auth.patch(`/api/v1/user/notification/${id}/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('failed to mark notification read', error);
    }
  };

  const pickIcon = (message: string) => {
    if (message.includes('liked')) return Heart;
    if (message.includes('commented')) return MessageSquare;
    if (message.includes('following') || message.includes('followed')) return UserPlus;
    if (message.includes('views')) return Play;
    return Bell;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated with your latest activity.</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {notifications.map((notification) => {
          const Icon = pickIcon(notification.message);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                notification.is_read
                  ? 'bg-card border-border'
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  notification.is_read ? 'bg-muted' : 'bg-primary/10'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    notification.is_read ? 'text-muted-foreground' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    notification.is_read ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted p-6 rounded-full mb-4">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No notifications yet</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            When you get likes, comments, or new followers, they'll appear here.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}