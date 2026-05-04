"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastVariants = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-brand-green" />,
    border: "border-brand-green/30",
    bg: "bg-brand-green/10",
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-brand-rose" />,
    border: "border-brand-rose/30",
    bg: "bg-brand-rose/10",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-brand-amber" />,
    border: "border-brand-amber/30",
    bg: "bg-brand-amber/10",
  },
  info: {
    icon: <Info className="w-5 h-5 text-brand-blue" />,
    border: "border-brand-blue/30",
    bg: "bg-brand-blue/10",
  },
  loading: {
    icon: <Loader2 className="w-5 h-5 text-brand-amber animate-spin" />,
    border: "border-brand-amber/30",
    bg: "bg-brand-amber/10",
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const variant = toastVariants[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl",
        "bg-surface-dark/95 backdrop-blur-xl",
        "border",
        variant.border,
        "shadow-2xl shadow-black/20",
        "overflow-hidden"
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Animated background accent */}
      <motion.div
        className={cn("absolute left-0 top-0 bottom-0 w-1", variant.bg)}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 relative z-10">
        {variant.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-body-sm font-medium text-text-primary">{toast.title}</p>
        {toast.description && (
          <p className="text-caption text-text-muted mt-0.5">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-caption font-medium text-brand-amber hover:text-brand-amber-light transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar for auto-dismiss */}
      {toast.variant !== "loading" && toast.duration !== 0 && (
        <motion.div
          className={cn("absolute bottom-0 left-0 h-0.5", variant.bg.replace("/10", ""))}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration || 5000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { ...toast, id };

      setToasts((prev) => {
        const updated = [newToast, ...prev].slice(0, maxToasts);
        return updated;
      });

      if (toast.duration !== 0 && toast.variant !== "loading") {
        setTimeout(() => removeToast(id), toast.duration || 5000);
      }

      return id;
    },
    [maxToasts, removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => addToast({ title, description, variant: "success" }),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "error", duration: 8000 }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "warning", duration: 6000 }),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => addToast({ title, description, variant: "info" }),
    [addToast]
  );

  const loading = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "loading", duration: 0 }),
    [addToast]
  );

  const dismiss = removeToast;

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info, loading, dismiss }}
    >
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onDismiss={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider as default };