"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: "" });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex items-center justify-center p-6"
          >
            <GlassCard padding="lg" className="max-w-lg w-full text-center relative overflow-hidden">
              {/* Animated background glow */}
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-brand-rose/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Error icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-brand-rose/20 border-2 border-brand-rose/30 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-brand-rose" />
                </div>
              </motion.div>

              {/* Error message */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-heading-md text-text-primary mb-2"
              >
                Something went wrong
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-body-sm text-text-muted mb-6"
              >
                We encountered an unexpected error. This has been logged and we&apos;re working on it.
              </motion.p>

              {/* Error ID for support */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 p-3 rounded-lg bg-surface-dark/50 border border-white/5"
              >
                <p className="text-caption text-text-subtle mb-1">Error reference</p>
                <code className="text-caption text-brand-amber font-mono">{this.state.errorId}</code>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-caption text-text-subtle">
                <ChevronRight className="w-3 h-3" />
                <span>Unshackled</span>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;