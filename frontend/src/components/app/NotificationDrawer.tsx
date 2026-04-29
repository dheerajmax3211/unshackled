"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Trophy, Users, Calendar, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

type NotificationType = "BADGE_EARNED" | "MILESTONE" | "FRIEND_REQUEST" | "WITHDRAWAL";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDrawerProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

const typeIcons: Record<NotificationType, React.ElementType> = {
  BADGE_EARNED: Trophy,
  MILESTONE: Activity,
  FRIEND_REQUEST: Users,
  WITHDRAWAL: Calendar,
};

const typeColors: Record<NotificationType, string> = {
  BADGE_EARNED: "bg-brand-amber/10 border-brand-amber/20 text-brand-amber",
  MILESTONE: "bg-brand-green/10 border-brand-green/20 text-brand-green",
  FRIEND_REQUEST: "bg-brand-blue/10 border-brand-blue/20 text-brand-blue",
  WITHDRAWAL: "bg-brand-rose/10 border-brand-rose/20 text-brand-rose",
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationDrawer({
  notifications,
  onMarkAllRead,
  onDismiss,
  className,
}: NotificationDrawerProps) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.isRead).length;

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onMarkAllRead?.();
  };

  return (
    <GlassCard padding="lg" className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-rose text-[10px] font-bold flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-heading-sm text-text-primary">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-caption text-brand-amber-light hover:text-brand-amber transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </motion.button>
        )}
      </div>

      <div className="flex flex-col gap-1 max-h-[480px] overflow-y-auto pr-1">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Bell className="w-10 h-10 text-text-subtle opacity-40 mb-3" />
              <p className="text-body-sm text-text-muted">No notifications yet</p>
              <p className="text-caption text-text-subtle">We&apos;ll notify you when something happens.</p>
            </motion.div>
          ) : (
            items.map((notification) => {
              const Icon = typeIcons[notification.type];
              const colorClasses = typeColors[notification.type];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  className={cn(
                    "relative flex gap-3 p-3 rounded-glass-sm transition-all group",
                    notification.isRead
                      ? "bg-white/[0.02]"
                      : "bg-white/[0.04] border border-white/[0.04]"
                  )}
                >
                  {!notification.isRead && (
                    <div className="absolute top-3.5 left-1.5 w-2 h-2 rounded-full bg-brand-rose" />
                  )}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border",
                      colorClasses
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={cn(
                          "text-body-sm font-semibold",
                          notification.isRead ? "text-text-muted" : "text-text-primary"
                        )}
                      >
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-caption text-text-subtle">
                          {formatTime(notification.createdAt)}
                        </span>
                        <button
                          onClick={() => handleDismiss(notification.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/[0.06]"
                        >
                          <X className="w-3 h-3 text-text-subtle" />
                        </button>
                      </div>
                    </div>
                    <p className="text-body-sm text-text-muted mt-0.5">{notification.body}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
