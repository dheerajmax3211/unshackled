"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserPlus, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend, LeaderboardEntry, Challenge } from "@/lib/api/types";
import { getFriends, getPendingRequests, removeFriend } from "@/lib/api/friends";
import { getFriendLeaderboard } from "@/lib/api/leaderboard";
import { getChallenges } from "@/lib/api/challenges";
import FriendCard from "@/components/friends/FriendCard";
import PendingRequestCard from "@/components/friends/PendingRequestCard";
import AddFriendSearch from "@/components/friends/AddFriendSearch";
import FriendLeaderboard from "@/components/friends/FriendLeaderboard";
import ChallengeHistoryList from "@/components/friends/ChallengeHistoryList";

type TabValue = "friends" | "requests" | "add" | "leaderboard" | "challenges";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("friends");
  const [friends, setFriends] = useState<(Friend & { currentStreak?: number; habits?: { name: string; icon: string; streak: number }[] })[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    try {
      const data = await getFriends();
      setFriends(data as (Friend & { currentStreak?: number; habits?: { name: string; icon: string; streak: number }[] })[]);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      const data = await getPendingRequests();
      setPendingRequests(data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await getFriendLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  }, []);

  const fetchChallenges = useCallback(async () => {
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchFriends(), fetchPending(), fetchLeaderboard(), fetchChallenges()]);
    setLoading(false);
  }, [fetchFriends, fetchPending, fetchLeaderboard, fetchChallenges]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleFriendRemoved = (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.friendId !== friendId));
  };

  const handleRequestResponded = (status: "ACCEPTED" | "REJECTED", requestId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (status === "ACCEPTED") {
      fetchFriends();
    }
  };

  const handleChallengeSent = () => {
    fetchChallenges();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded-lg w-48" />
          <div className="h-[400px] bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-brand-blue" />
          Your Squad
        </h1>
        <p className="text-slate-400 mt-1">
          {friends.length} friend{friends.length !== 1 ? "s" : ""} in your accountability network. Stronger together.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabValue)}>
        <TabsList className="bg-white/5 border border-white/10 w-full justify-start mb-6">
          <TabsTrigger value="friends" className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-1.5 relative">
            <UserPlus className="w-3.5 h-3.5" />
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="add">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Rankings
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-4">
          {friends.length === 0 ? (
            <Card className="p-8 border border-white/10 bg-white/[0.03] text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 font-medium">Your squad is empty.</p>
              <p className="text-slate-500 text-sm mt-2">
                Add friends to build your accountability network and send challenges.
              </p>
            </Card>
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend.friendId}
                friend={friend}
                onChallengeSent={handleChallengeSent}
              />
            ))
          )}
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="p-8 border border-white/10 bg-white/[0.03] text-center">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 font-medium">No pending requests.</p>
              <p className="text-slate-500 text-sm mt-2">
                When someone sends you a friend request, it will appear here.
              </p>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
                onRespond={(status) => handleRequestResponded(status, request.id)}
              />
            ))
          )}
        </TabsContent>

        {/* Add Friend Tab */}
        <TabsContent value="add" className="space-y-4">
          <AddFriendSearch onFriendRequestSent={() => fetchPending()} />
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <FriendLeaderboard entries={leaderboard} />
        </TabsContent>

        {/* Challenge History Tab */}
        <TabsContent value="challenges">
          <ChallengeHistoryList challenges={challenges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}