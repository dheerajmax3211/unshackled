"use client";

import React from "react";
import Link from "next/link";
import { Shield, Settings, LogOut, User } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NotificationBell from "./NotificationBell";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function AppNav() {
  const { user } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 h-16">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-brand-blue group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-white tracking-tighter hidden md:block">UNSHACKLED</span>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="flex items-center gap-4">
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors group">
                <Avatar className="h-8 w-8 border border-white/10 group-hover:border-brand-blue/50 transition-colors">
                  <AvatarImage src={user?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-bold text-[10px]">
                    {user?.displayName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">
                    {user?.displayName || "Warrior"}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-tight">
                    {user?.onboardingCompleted ? "Active Member" : "New Soul"}
                  </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/10 shadow-2xl">
              <DropdownMenuLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                onClick={() => user?.username && router.push(`/profile/${user.username}`)}
                className={cn("hover:bg-white/5 cursor-pointer flex items-center", !user?.username && "pointer-events-none opacity-50")}
              >
                  <User className="w-4 h-4 mr-2" />
                  <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push("/settings")}
                className="hover:bg-white/5 cursor-pointer flex items-center"
              >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-rose-500 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
