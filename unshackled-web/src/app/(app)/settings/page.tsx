"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResponse } from "@/lib/api/types";
import { getMe, updateMe } from "@/lib/api/users";
import { cn } from "@/lib/utils";
import { Save, User, Bell, Shield, Trash2 } from "lucide-react";

type TabValue = "profile" | "notifications" | "security" | "danger";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);

  // Notification form state
  const [dailyReminder, setDailyReminder] = useState(true);
  const [milestones, setMilestones] = useState(true);
  const [challenges, setChallenges] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setLeaderboardOptIn(data.leaderboardOptIn ?? true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateMe({ displayName, bio, leaderboardOptIn });
      setUser(updated);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          checked ? "bg-brand-blue" : "bg-slate-600"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded-lg w-32" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const TABS: { id: TabValue; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "danger", label: "Danger Zone", icon: <Trash2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white">Settings</h1>

      {/* Tab navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-brand-blue text-white"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card className="p-6 border border-white/10 bg-white/[0.03] space-y-6">
          <h2 className="text-lg font-bold text-white">Profile Settings</h2>

          {/* Avatar section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-white/10">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback className="bg-brand-blue/20 text-brand-blue text-xl font-bold">
                {user?.displayName?.slice(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-white">Profile Photo</p>
              <p className="text-xs text-slate-500">Click to upload a new photo</p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-slate-300">
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              className="bg-white/5 border-white/10 text-white resize-none"
              rows={3}
            />
            <p className="text-xs text-slate-500 text-right">{bio.length}/200</p>
          </div>

          {/* Leaderboard opt-in */}
          <ToggleSwitch
            checked={leaderboardOptIn}
            onChange={setLeaderboardOptIn}
            label="Show me on the global leaderboard"
          />

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card className="p-6 border border-white/10 bg-white/[0.03] space-y-2">
          <h2 className="text-lg font-bold text-white mb-4">Notification Preferences</h2>
          <ToggleSwitch checked={dailyReminder} onChange={setDailyReminder} label="Daily reminders" />
          <Separator className="bg-white/10" />
          <ToggleSwitch checked={milestones} onChange={setMilestones} label="Milestone celebrations" />
          <Separator className="bg-white/10" />
          <ToggleSwitch checked={challenges} onChange={setChallenges} label="Challenge notifications" />
          <Separator className="bg-white/10" />
          <ToggleSwitch checked={weeklyReport} onChange={setWeeklyReport} label="Weekly reports" />
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card className="p-6 border border-white/10 bg-white/[0.03] space-y-4">
          <h2 className="text-lg font-bold text-white">Security</h2>
          <p className="text-sm text-slate-400">
            Manage your account security and authentication settings.
          </p>
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Change Email
          </Button>
        </Card>
      )}

      {/* Danger Zone Tab */}
      {activeTab === "danger" && (
        <Card className="p-6 border border-rose-500/20 bg-rose-500/[0.03] space-y-4">
          <h2 className="text-lg font-bold text-rose-400">Danger Zone</h2>
          <p className="text-sm text-slate-400">
            These actions are irreversible. Please proceed with caution.
          </p>
          <Button variant="outline" className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
            Delete My Account and All Data
          </Button>
        </Card>
      )}
    </div>
  );
}