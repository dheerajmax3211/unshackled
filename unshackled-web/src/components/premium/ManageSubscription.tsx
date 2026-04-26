"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, ShieldCheck, Calendar } from "lucide-react";
import { createPortal } from "@/lib/api/payments";
import { SubscriptionStatus } from "@/lib/api/types";
import { format } from "date-fns";
import { toast } from "sonner";

interface ManageSubscriptionProps {
  status: SubscriptionStatus;
}

export default function ManageSubscription({ status }: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
      const returnUrl = window.location.href;
      const { url } = await createPortal(returnUrl);
      window.location.href = url;
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border border-brand-blue/30 bg-brand-blue/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <ShieldCheck className="w-24 h-24 text-brand-blue" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-blue/20">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sovereign Plan Active</h3>
              <p className="text-xs text-brand-blue font-medium uppercase tracking-widest">Premium Member</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Renews: {format(new Date(status.currentPeriodEnd), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Status: <span className="text-emerald-500 font-bold capitalize">{status.status}</span></span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleManage} 
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold"
        >
          {loading ? "Opening..." : "Manage Subscription"}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
