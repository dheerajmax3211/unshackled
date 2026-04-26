"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserResponse } from "@/lib/api/types";
import { searchUsers, sendFriendRequest } from "@/lib/api/friends";

interface AddFriendSearchProps {
  onFriendRequestSent?: () => void;
  className?: string;
}

export default function AddFriendSearch({
  onFriendRequestSent,
  className,
}: AddFriendSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestingUserId, setRequestingUserId] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const data = await searchUsers(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSendRequest = useCallback(async (targetUserId: string) => {
    setRequestingUserId(targetUserId);
    try {
      // We use the username from the results
      const user = results.find((r) => r.id === targetUserId);
      if (user) {
        await sendFriendRequest(user.username);
        onFriendRequestSent?.();
        // Remove from results to avoid duplicate sends
        setResults((prev) => prev.filter((r) => r.id !== targetUserId));
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
    } finally {
      setRequestingUserId(null);
    }
  }, [results, onFriendRequestSent]);

  return (
    <Card
      className={cn(
        "p-4 border border-white/10 bg-white/[0.03]",
        className
      )}
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search by username or name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus:border-brand-blue/50"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading && (
          <div className="text-center text-sm text-slate-500 py-4">
            Searching users...
          </div>
        )}

        {!loading && results.length === 0 && debouncedQuery && (
          <div className="text-center text-sm text-slate-500 py-4">
            No users found
          </div>
        )}

        {!loading &&
          results.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
            >
              <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-bold text-xs">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  @{user.username}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-brand-blue hover:text-brand-blue hover:bg-brand-blue/10"
                onClick={() => handleSendRequest(user.id)}
                disabled={requestingUserId === user.id}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {requestingUserId === user.id ? "Sending..." : "Add"}
              </Button>
            </div>
          ))}
      </div>
    </Card>
  );
}