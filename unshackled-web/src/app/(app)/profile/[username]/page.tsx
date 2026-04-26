"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Flame, Users, Shield } from "lucide-react";
import { UserResponse } from "@/lib/api/types";
import { getUserByUsername } from "@/lib/api/users";
import { getBadges, getEarnedBadges } from "@/lib/api/badges";
import { getMyStreaks, getStreakForHabit } from "@/lib/api/streaks";
import { getFriends } from "@/lib/api/friends";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BadgeGrid from "@/components/profile/BadgeGrid";
import HabitStreakList from "@/components/profile/HabitStreakList";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserByUsername(username);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="h-48 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 max-w-4xl mx-auto">
        <Shield className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <h2 className="text-xl font-bold text-white">User not found</h2>
        <p className="text-slate-400 mt-2">
          This user may have changed their username or deleted their account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HabitStreakList userId={user.id} />
        <BadgeGrid userId={user.id} />
      </div>
    </div>
  );
}