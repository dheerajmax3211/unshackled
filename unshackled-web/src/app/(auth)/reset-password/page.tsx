"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = useSupabaseClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden text-center">
        <CardHeader>
          <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-brand-blue" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
          <CardDescription className="text-slate-400">
            We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Click the link in the email to securely reset your password. If you don&apos;t see it, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/5 bg-white/[0.02] py-6">
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setSubmitted(false)}>
            Didn&apos;t get the email? Try again
          </Button>
          <Link href="/login" className="text-sm text-brand-blue font-semibold hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border-white/10 focus:border-brand-blue/50 transition-colors"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold h-11"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-white/5 bg-white/[0.02] py-6">
        <Link 
          href="/login" 
          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
