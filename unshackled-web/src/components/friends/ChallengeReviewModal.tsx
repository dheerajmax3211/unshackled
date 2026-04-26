"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { reviewChallenge } from "@/lib/api/challenges";

interface ChallengeReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  exifVerified?: boolean | null;
  photoUrl?: string;
  onSuccess?: () => void;
}

export default function ChallengeReviewModal({
  open,
  onOpenChange,
  challengeId,
  exifVerified,
  photoUrl,
  onSuccess,
}: ChallengeReviewModalProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  const handleReview = async (approve: boolean) => {
    setActionLoading(approve ? "approve" : "reject");
    setLoading(true);
    try {
      await reviewChallenge(challengeId, approve, note);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to review challenge:", error);
    } finally {
      setLoading(false);
      setActionLoading(null);
    }
  };

  const exifStatus =
    exifVerified === true
      ? {
          label: "Timestamp Verified",
          icon: <CheckCircle className="w-4 h-4 text-green-400" />,
          variant: "bg-green-500/10 text-green-400 border-green-500/20",
        }
      : exifVerified === false
        ? {
            label: "Timestamp Too Old",
            icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
            variant: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          }
        : {
            label: "No Timestamp (Browser — Normal)",
            icon: <Shield className="w-4 h-4 text-blue-400" />,
            variant: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-blue" />
            Review Challenge Response
          </DialogTitle>
          <DialogDescription>
            Your friend responded to the accountability challenge. Was their proof valid?
          </DialogDescription>
        </DialogHeader>

        {/* Photo Preview */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Challenge proof"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No photo available</p>
              </div>
            </div>
          )}
        </div>

        {/* EXIF Verification Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs font-medium px-3 py-1.5", exifStatus.variant)}
          >
            {exifStatus.icon}
            <span className="ml-1.5">{exifStatus.label}</span>
          </Badge>
        </div>

        {/* Note input */}
        <div className="space-y-2">
          <Label htmlFor="review-note">Note (optional)</Label>
          <Textarea
            id="review-note"
            placeholder="e.g., Great job staying strong! 💪"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            className="resize-none"
          />
          <p className="text-xs text-slate-500 text-right">
            {note.length}/200
          </p>
        </div>

        <DialogFooter className="flex items-center gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => handleReview(false)}
            disabled={loading}
            className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
          >
            {actionLoading === "reject" ? (
              <>
                <XCircle className="w-4 h-4 mr-1 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-1" />
                Reject (Reset Streak)
              </>
            )}
          </Button>
          <Button
            onClick={() => handleReview(true)}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-600/90 text-white"
          >
            {actionLoading === "approve" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}