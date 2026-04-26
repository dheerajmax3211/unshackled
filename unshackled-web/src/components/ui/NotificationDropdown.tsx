"use client";

import React from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Zap, Flame, UserPlus, CheckCircle2, MoreHorizontal, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { markRead, markAllRead } from "@/lib/api/notifications";

const ICON_MAP: Record<string, any> = {
  streak_milestone: Flame,
  challenge_received: Zap,
  friend_request: UserPlus,
  achievement: CheckCircle2,
  system: Shield,
};

const COLOR_MAP: Record<string, string> = {
  streak_milestone: "text-orange-500 bg-orange-500/10",
  challenge_received: "text-brand-blue bg-brand-blue/10",
  friend_request: "text-cyan-500 bg-cyan-500/10",
  achievement: "text-emerald-500 bg-emerald-500/10",
  system: "text-slate-400 bg-white/5",
};

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, setNotifications } = useNotificationStore();

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleRead = async (id: string) => {
    try {
      await markRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMarkAll}
          className="text-[10px] font-bold text-brand-blue hover:bg-brand-blue/10 uppercase tracking-widest h-8"
        >
          Mark all read
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <BellOff className="w-10 h-10 text-slate-700 mb-4" />
              <p className="text-sm font-bold text-white mb-1">Silence is Golden</p>
              <p className="text-xs text-slate-500">No new alerts. Keep focus on the mission.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = ICON_MAP[notification.type] || ICON_MAP.system;
              const colorClass = COLOR_MAP[notification.type] || COLOR_MAP.system;

              return (
                <button
                  key={notification.id}
                  onClick={() => handleRead(notification.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden",
                    notification.isRead 
                      ? "opacity-60 hover:opacity-100" 
                      : "bg-white/[0.03] hover:bg-white/[0.05]"
                  )}
                >
                  {!notification.isRead && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-blue" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className={cn(
                        "text-xs leading-relaxed",
                        notification.isRead ? "text-slate-400" : "text-white font-medium"
                      )}>
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-slate-600 font-medium">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/5">
        <Button 
          variant="ghost" 
          className="w-full text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest h-10"
          onClick={onClose}
        >
          Close Panel
        </Button>
      </div>
    </div>
  );
}
