"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Share2, Save, Sparkles, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import MoodPicker, { MOODS } from "./MoodPicker";
import { saveEntry } from "@/lib/api/journal";
import { getFriends } from "@/lib/api/friends";
import { Friend } from "@/lib/api/types";
import { toast } from "sonner";

const TRIGGER_OPTIONS = [
  "Stress", "Boredom", "Social Pressure", "Craving", "Anxiety", "Loneliness", "Celebration", "Tiredness"
];

interface JournalEditorProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialDate?: string;
}

export default function JournalEditor({ onSuccess, onCancel, initialDate }: JournalEditorProps) {
  const date = initialDate || new Date().toISOString().split("T")[0];
  
  const [content, setContent] = useState("");
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [whatHelped, setWhatHelped] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [customTrigger, setCustomTrigger] = useState("");

  // Load friends for sharing
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data.filter(f => f.status === "ACCEPTED"));
      } catch (error) {
        console.error("Failed to fetch friends for sharing:", error);
      }
    };
    fetchFriends();
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = `journal_draft_${date}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setContent(parsed.content || "");
        setMoodScore(parsed.moodScore || null);
        setTriggers(parsed.triggers || []);
        setWhatHelped(parsed.whatHelped || "");
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }

    const interval = setInterval(() => {
      const draft = { content, moodScore, triggers, whatHelped };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }, 30000);

    return () => clearInterval(interval);
  }, [date, content, moodScore, triggers, whatHelped]);

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const addCustomTrigger = () => {
    if (customTrigger && !triggers.includes(customTrigger)) {
      setTriggers(prev => [...prev, customTrigger]);
      setCustomTrigger("");
    }
  };

  const toggleFriend = (friendId: string) => {
    setSharedWith(prev => 
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const handleSave = async () => {
    if (!moodScore) {
      toast.error("Please pick a mood before saving.");
      return;
    }
    if (!content.trim()) {
      toast.error("Journal content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const selectedMood = MOODS.find(m => m.value === moodScore);
      
      await saveEntry({
        entryDate: date,
        content,
        moodScore,
        moodEmoji: selectedMood?.emoji || "😐",
        triggers,
        whatHelped,
        isShared,
        sharedWith
      });
      
      localStorage.removeItem(`journal_draft_${date}`);
      toast.success("Journal entry saved successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to save journal entry.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 border border-white/10 bg-white/[0.03] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mood Section */}
      <MoodPicker selected={moodScore} onChange={setMoodScore} />

      <Separator className="bg-white/5" />

      {/* Content Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-400">Your Reflection</Label>
        <Textarea 
          placeholder="What's on your mind today? Be raw, be honest..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] bg-white/5 border-white/10 text-white focus:border-brand-blue/50 transition-colors resize-none text-base leading-relaxed"
        />
      </div>

      {/* Triggers Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-400">Triggers Experienced</Label>
        <div className="flex flex-wrap gap-2">
          {TRIGGER_OPTIONS.map(trigger => (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
                triggers.includes(trigger)
                  ? "bg-brand-blue/20 border-brand-blue text-brand-blue"
                  : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
              )}
            >
              {trigger}
            </button>
          ))}
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Custom..."
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              className="h-8 w-24 bg-white/5 border-white/10 text-xs"
              onKeyDown={(e) => e.key === "Enter" && addCustomTrigger()}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500" onClick={addCustomTrigger}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* What Helped Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-400">What helped you stay clean? (Optional)</Label>
        <Input 
          placeholder="e.g., Deep breathing, called a friend, worked out..."
          value={whatHelped}
          onChange={(e) => setWhatHelped(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <Separator className="bg-white/5" />

      {/* Sharing Section */}
      <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-blue/10">
              <Share2 className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Share with your Squad</p>
              <p className="text-xs text-slate-500">Allow trusted friends to read this entry.</p>
            </div>
          </div>
          <Switch checked={isShared} onCheckedChange={setIsShared} />
        </div>

        {isShared && friends.length > 0 && (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Select Friends</p>
            <div className="flex flex-wrap gap-2">
              {friends.map(friend => (
                <button
                  key={friend.friendId}
                  onClick={() => toggleFriend(friend.friendId)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                    sharedWith.includes(friend.friendId)
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-white/5 border-white/10 text-slate-500"
                  )}
                >
                  <span className="text-xs font-medium">{friend.displayName}</span>
                  {sharedWith.includes(friend.friendId) ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Save className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium italic">Draft auto-saves every 30s</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 font-bold"
          >
            {loading ? "Saving..." : "Save Entry"}
            {!loading && <Sparkles className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
