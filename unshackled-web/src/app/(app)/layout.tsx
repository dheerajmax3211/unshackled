"use client";

import React, { useEffect } from "react";
import AppNav from "@/components/ui/AppNav";
import BottomNav from "@/components/ui/BottomNav";
import { RealtimeProvider } from "@/providers/RealtimeProvider";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { permissionStatus, requestPermission, autoSetup, isSupported } = usePushNotifications();
  const { user } = useUserStore();

  // Auto-setup push if already granted
  useEffect(() => {
    if (user) {
      autoSetup();
    }
  }, [user, autoSetup]);

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-brand-blue/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <AppNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-10 relative z-10">
          
          {/* Notification Nudge Banner (Task F-16.4) */}
          {isSupported && permissionStatus === "default" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
              <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue/20 to-cyan-500/10 border border-brand-blue/30 p-1">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 bg-[#020617]/40 backdrop-blur-xl rounded-[14px]">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-blue">
                      <Bell className="w-6 h-6 animate-ring" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Enable Mission Control</h3>
                      <p className="text-xs text-slate-400 mt-1">Get real-time accountability alerts and streak reminders.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                      onClick={requestPermission}
                      className="flex-1 md:flex-none bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-11 px-8 rounded-xl"
                    >
                      Enable Notifications
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomNav />
    </div>
    </RealtimeProvider>
  );
}
