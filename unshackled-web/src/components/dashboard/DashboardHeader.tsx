"use client";

import React from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHeader() {
  const { user } = useAuth();
  const today = new Date();

  return (
    <div className="space-y-1">
      <p className="text-slate-500 font-medium">
        {format(today, "EEEE, MMMM do")}
      </p>
      <h2 className="text-3xl md:text-4xl font-display font-black text-white">
        Welcome back, <span className="text-brand-blue">{user?.user_metadata?.display_name || user?.user_metadata?.username}</span>.
      </h2>
      <p className="text-slate-400 max-w-lg">
        You&apos;re making incredible progress. Stay focused on your goals today.
      </p>
    </div>
  );
}
