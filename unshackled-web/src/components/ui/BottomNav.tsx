"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  BookOpen, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

const NAV_ITEMS = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Friends", icon: Users, href: "/friends" },
  { label: "Stats", icon: BarChart3, href: "/analytics" },
  { label: "Journal", icon: BookOpen, href: "/journal" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          // Profile link needs the username
          const href = item.href === "/profile" 
            ? (user?.username ? `/profile/${user.username}` : "#") 
            : item.href;
            
          const isActive = pathname.startsWith(item.href);
          const isDisabled = item.href === "/profile" && !user?.username;
          
          return (
            <Link 
              key={item.label} 
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-brand-blue" : "text-slate-500",
                isDisabled && "pointer-events-none opacity-30"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-blue" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
