"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "./NotificationDropdown"; // To be created in F-15.6
import { useNotificationStore } from "@/store/useNotificationStore"; // Assuming it exists or will be refined
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
          <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-ring")} />
          
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-blue text-[10px] font-black text-white items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 md:w-96 p-0 mt-4 bg-slate-900/95 backdrop-blur-xl border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
