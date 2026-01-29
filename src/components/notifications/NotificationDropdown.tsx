import { Bell, Wrench, DollarSign, Users, Building2, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Notification } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

const typeIcons = {
  maintenance: Wrench,
  rent: DollarSign,
  tenant: Users,
  property: Building2,
};

const typeColors = {
  maintenance: 'text-orange-500',
  rent: 'text-green-500',
  tenant: 'text-blue-500',
  property: 'text-purple-500',
};

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
}: NotificationDropdownProps) {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  onMarkAllAsRead();
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  onClear();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs mt-1">You'll see updates here when they arrive</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-3 cursor-pointer',
                    !notification.read && 'bg-muted/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={cn('mt-0.5', typeColors[notification.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm', !notification.read && 'font-medium')}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
