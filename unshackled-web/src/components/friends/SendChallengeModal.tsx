"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { sendChallenge } from "@/lib/api/challenges";

interface SendChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendId: string;
  friendName: string;
  userHabitId?: string;
  onSuccess?: () => void;
}

export default function SendChallengeModal({
  open,
  onOpenChange,
  friendId,
  friendName,
  userHabitId,
  onSuccess,
}: SendChallengeModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await sendChallenge({
        receiverId: friendId,
        userHabitId: userHabitId || "",
        type: "PHOTO",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to send challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-blue" />
            Send a Challenge
          </DialogTitle>
          <DialogDescription>
            Ask {friendName} to prove they're still on track. They'll have 10 minutes to respond with proof.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="challenge-message">Message (optional)</Label>
            <Textarea
              id="challenge-message"
              placeholder="e.g., Still clean? Show me your smile 😊"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              className="resize-none"
            />
            <p className="text-xs text-slate-500 text-right">
              {message.length}/200
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white"
          >
            {loading ? "Sending..." : "Send Challenge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}