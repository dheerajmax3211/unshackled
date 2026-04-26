"use client";

import React, { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Clock, Upload } from "lucide-react";
import { getUploadUrl, confirmUpload } from "@/lib/api/challenges";
import { cn } from "@/lib/utils";

interface ChallengeResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  deadline: string;
  onSuccess?: () => void;
}

export default function ChallengeResponseModal({
  open,
  onOpenChange,
  challengeId,
  deadline,
  onSuccess,
}: ChallengeResponseModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate time remaining
  React.useEffect(() => {
    if (!open || !deadline) return;

    const updateTimeRemaining = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diff = deadlineDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expired!");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [deadline, open]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Could not access camera. Please grant camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleUpload = useCallback(async () => {
    if (!capturedImage) return;

    setLoading(true);
    setError(null);
    try {
      // Convert base64 to blob
      const base64Data = capturedImage.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: "image/jpeg",
      });

      // Get signed upload URL
      const { uploadUrl } = await getUploadUrl(challengeId);

      // Upload to Supabase
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // Extract storage path from upload URL
      const storagePath = uploadUrl.split("?")[0];
      const pathParts = storagePath.split("/");
      const path = pathParts.slice(pathParts.indexOf("challenges") > -1 ? pathParts.indexOf("challenges") : 0).join("/");

      // Confirm with backend
      await confirmUpload(challengeId, path);
      onSuccess?.();
    } catch (err) {
      setError("Failed to upload proof. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  }, [capturedImage, challengeId, onSuccess]);

  React.useEffect(() => {
    if (!open) {
      stopCamera();
      setCapturedImage(null);
      setError(null);
    } else {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, startCamera, stopCamera]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-blue" />
            Respond to Challenge
          </DialogTitle>
          <DialogDescription>
            Take a live photo to prove you're still on track. You have{" "}
            <span className="text-amber-400 font-bold">{timeRemaining}</span>{" "}
            remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          {!cameraActive && !capturedImage && (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Camera not available</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn("w-full h-full object-cover", capturedImage && "hidden")}
          />

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <p className="text-sm text-rose-400 text-center">{error}</p>
        )}

        {/* Timer Badge */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-mono font-bold">
            {timeRemaining}
          </span>
        </div>

        <DialogFooter>
          {!capturedImage ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                disabled={!cameraActive || loading}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
              >
                <Camera className="w-4 h-4 mr-1" />
                Take Photo
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={retakePhoto}
                disabled={loading}
              >
                Retake
              </Button>
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="bg-green-600 hover:bg-green-600/90 text-white"
              >
                {loading ? (
                  <>
                    <Upload className="w-4 h-4 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Submit Proof
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
