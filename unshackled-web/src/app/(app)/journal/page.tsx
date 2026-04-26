"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Users, Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEntries, getSharedEntries } from "@/lib/api/journal";
import { getFriends } from "@/lib/api/friends";
import { JournalEntry, Friend } from "@/lib/api/types";
import { format } from "date-fns";

import JournalEditor from "@/components/journal/JournalEditor";
import JournalEntryCard from "@/components/journal/JournalEntryCard";
import SharedEntriesView from "@/components/journal/SharedEntriesView";

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<"mine" | "shared">("mine");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [sharedEntries, setSharedEntries] = useState<JournalEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [mine, shared, friendsList] = await Promise.all([
        getEntries(50),
        getSharedEntries(),
        getFriends()
      ]);
      setEntries(mine);
      setSharedEntries(shared);
      setFriends(friendsList.filter(f => f.status === "ACCEPTED"));
    } catch (error) {
      console.error("Failed to fetch journal data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-blue" />
            Daily Journal
          </h1>
          <p className="text-slate-400 mt-1">
            Track your thoughts, moods, and triggers on your journey to freedom.
          </p>
        </div>
        {!showEditor && (
          <Button 
            onClick={() => setShowEditor(true)}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        )}
      </div>

      {showEditor ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">How are you feeling today?</h2>
            <Button variant="ghost" onClick={() => setShowEditor(false)} className="text-slate-500">
              Cancel
            </Button>
          </div>
          <JournalEditor 
            onSuccess={() => {
              setShowEditor(false);
              refreshData();
            }}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="mine" className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              My Journey
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Community Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <Card className="p-12 border border-white/10 bg-white/[0.03] text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-6 text-slate-700" />
                <h3 className="text-lg font-bold text-white mb-2">Your journal is empty</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  Writing down your struggles and wins makes them easier to manage. Start your first entry today.
                </p>
                <Button 
                  onClick={() => setShowEditor(true)}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                >
                  Create First Entry
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map(entry => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared">
            <SharedEntriesView entries={sharedEntries} friends={friends} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
