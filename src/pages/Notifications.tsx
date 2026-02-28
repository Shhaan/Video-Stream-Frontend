import { motion } from 'motion/react';
import { Bell, Heart, MessageSquare, UserPlus, Play } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'like',
      icon: Heart,
      message: 'John Doe liked your video "Amazing Sunset"',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageSquare,
      message: 'Sarah commented on your video "City Tour"',
      time: '4 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      icon: UserPlus,
      message: 'Mike started following you',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'like',
      icon: Heart,
      message: 'Emma liked your video "Cooking Tutorial"',
      time: '2 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'play',
      icon: Play,
      message: 'Your video "Travel Vlog" reached 10K views!',
      time: '3 days ago',
      read: true,
    },
  ];

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
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-colors ${
                notification.read
                  ? 'bg-card border-border'
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  notification.read ? 'bg-muted' : 'bg-primary/10'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    notification.read ? 'text-muted-foreground' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    notification.read ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {notifications.length === 0 && (
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
    </div>
  );
}