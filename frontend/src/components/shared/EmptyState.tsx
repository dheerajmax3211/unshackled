"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, Users, Trophy, Calendar, MessageCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: "default" | "journal" | "friends" | "badges" | "calendar" | "messages";
  size?: "sm" | "md" | "lg";
}

const variantIcons = {
  default: null,
  journal: <BookOpen className="w-8 h-8" />,
  friends: <Users className="w-8 h-8" />,
  badges: <Trophy className="w-8 h-8" />,
  calendar: <Calendar className="w-8 h-8" />,
  messages: <MessageCircle className="w-8 h-8" />,
};

const variantGradients = {
  default: "from-brand-amber/10 to-brand-blue/10",
  journal: "from-brand-green/10 to-brand-amber/10",
  friends: "from-brand-blue/10 to-brand-rose/10",
  badges: "from-brand-amber/10 to-brand-amber/5",
  calendar: "from-brand-green/10 to-brand-blue/10",
  messages: "from-brand-rose/10 to-brand-amber/10",
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className,
  variant = "default",
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-8 px-4",
    md: "py-12 px-6",
    lg: "py-16 px-8",
  };

  const iconSizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-col items-center justify-center text-center", sizeClasses[size], className)}
    >
      <GlassCard
        padding="lg"
        className={cn(
          "relative overflow-hidden mb-6",
          iconSizeClasses[size],
          "rounded-full flex items-center justify-center"
        )}
      >
        {/* Animated background gradient */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-20",
            variantGradients[variant]
          )}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Icon */}
        <div className="relative z-10 text-text-muted">
          {icon || variantIcons[variant] || <Compass className="w-8 h-8" />}
        </div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-brand-amber/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </GlassCard>

      {/* Title with gradient effect */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-heading-sm md:text-heading-md text-text-primary mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-body-sm text-text-muted max-w-sm mb-6 leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Action */}
      {(action || (actionLabel && onAction)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {action || (
            <Button onClick={onAction} variant="premium">
              {actionLabel}
            </Button>
          )}
        </motion.div>
      )}

      {/* Decorative dots */}
      <div className="absolute top-1/2 left-4 flex flex-col gap-2 opacity-20">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-brand-amber"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface EmptyJournalProps {
  onCreateEntry?: () => void;
  className?: string;
}

export function EmptyJournalState({ onCreateEntry, className }: EmptyJournalProps) {
  return (
    <EmptyState
      variant="journal"
      title="Your journal is waiting"
      description="No pressure. Just you and the page. Write about your day, your feelings, or whatever's on your mind."
      actionLabel="Write your first entry"
      onAction={onCreateEntry}
      className={className}
    />
  );
}

interface EmptyFriendsProps {
  onFindFriends?: () => void;
  className?: string;
}

export function EmptyFriendsState({ onFindFriends, className }: EmptyFriendsProps) {
  return (
    <EmptyState
      variant="friends"
      title="Your squad is waiting"
      description="Add friends to challenge each other, share progress, and stay accountable on your journey."
      actionLabel="Find friends"
      onAction={onFindFriends}
      className={className}
    />
  );
}

interface EmptyBadgesProps {
  className?: string;
}

export function EmptyBadgesState({ className }: EmptyBadgesProps) {
  return (
    <EmptyState
      variant="badges"
      title="Badges waiting to be earned"
      description="Keep going. Every day clean is a step closer to unlocking something special."
      className={className}
    />
  );
}

interface EmptyNotificationsProps {
  className?: string;
}

export function EmptyNotificationsState({ className }: EmptyNotificationsProps) {
  return (
    <EmptyState
      variant="messages"
      title="All caught up"
      description="No notifications right now. We'll let you know when something important happens."
      className={className}
    />
  );
}
