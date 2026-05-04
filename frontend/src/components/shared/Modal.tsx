"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw]",
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (closeOnEscape && e.key === "Escape" && closable) {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [closeOnEscape, closable, onClose]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget && closable) {
        onClose();
      }
    },
    [closeOnOverlayClick, closable, onClose]
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[90]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 bg-surface-darkest/80 backdrop-blur-sm",
              overlayClassName
            )}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
              aria-describedby={description ? "modal-description" : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onKeyDown={handleKeyDown}
              className={cn(
                "relative w-full pointer-events-auto",
                sizeClasses[size],
                className
              )}
            >
              <div className="relative rounded-2xl glass-card overflow-hidden">
                {/* Gradient border glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none">
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, transparent 50%, rgba(59,130,246,0.1) 100%)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 pb-0">
                      <div>
                        {title && (
                          <h2
                            id="modal-title"
                            className="text-heading-sm md:text-heading-md text-text-primary"
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p id="modal-description" className="text-body-sm text-text-muted mt-1">
                            {description}
                          </p>
                        )}
                      </div>
                      {showCloseButton && closable && (
                        <button
                          onClick={onClose}
                          className={cn(
                            "flex-shrink-0 p-2 rounded-lg",
                            "hover:bg-white/10 transition-colors",
                            "text-text-muted hover:text-text-primary",
                            "focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                          )}
                          aria-label="Close dialog"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6">{children}</div>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="corner-accent absolute inset-0 pointer-events-none opacity-30" />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            "flex-1 sm:flex-none px-5 py-2.5 rounded-lg",
            "bg-white/[0.04] border border-white/[0.08]",
            "text-body-sm font-medium text-text-secondary",
            "hover:bg-white/[0.06] hover:border-white/[0.12]",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
          )}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            "flex-1 sm:flex-none px-5 py-2.5 rounded-lg",
            "text-body-sm font-semibold",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-darkest",
            variant === "danger"
              ? "bg-brand-rose hover:bg-brand-rose/90 text-white focus:ring-brand-rose"
              : "bg-brand-amber hover:bg-brand-amber/90 text-surface-darkest focus:ring-brand-amber"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </Modal>
  );
}