"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HeartHandshake } from "lucide-react";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto pt-20 text-center space-y-8">
      <div className="bg-white/5 border border-rose-500/20 p-6 rounded-3xl inline-block">
        <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white">Checkout Cancelled</h1>
        <p className="text-slate-400">
          No worries. We&apos;ve cancelled the transaction and no charges were made.
        </p>
      </div>

      <Card className="p-8 bg-white/[0.03] border-white/10 space-y-6">
        <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
          <HeartHandshake className="w-8 h-8 text-brand-blue shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">We&apos;re here when you&apos;re ready</p>
            <p className="text-xs text-slate-500">Your journey to freedom continues regardless of your plan.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => router.push("/premium")} 
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/dashboard")} 
            className="text-slate-500 hover:text-white"
          >
            Continue to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
