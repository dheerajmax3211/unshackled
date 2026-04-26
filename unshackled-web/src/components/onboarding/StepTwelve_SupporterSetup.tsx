"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, ShieldCheck, Camera, Search, UserPlus } from "lucide-react";

export default function StepTwelve_SupporterSetup() {
  const router = useRouter();
  const { isSupporter } = useOnboardingStore();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleNext = () => {
    router.push("/onboarding/complete");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-indigo-500/20">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Supporter Profile
        </h1>
        <p className="text-slate-400 text-lg">
          Your friends will see this when you review their proof or send encouragement.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-2 border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-2xl font-bold">
                {displayName.slice(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-dark-bg hover:bg-indigo-500 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="w-full space-y-4">
            <Label htmlFor="display-name" className="text-lg font-bold text-white">
              Display Name
            </Label>
            <Input
              id="display-name"
              placeholder="e.g., Coach Alex"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white/5 border-white/10 h-14 text-lg"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <Label className="text-lg font-bold text-white">Find friends to support</Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search by username or email..."
              className="pl-12 bg-white/5 border-white/10 h-14"
            />
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center py-8">
            <UserPlus className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">
              Search for your friends to start your accountability partnership.
            </p>
          </div>
        </div>
      </Card>

      <Button 
        size="lg" 
        onClick={handleNext}
        disabled={!displayName}
        className="w-full sm:w-64 bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-14 rounded-2xl group disabled:opacity-50"
      >
        Complete Setup
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
