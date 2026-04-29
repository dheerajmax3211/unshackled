"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="text-text-subtle mb-4 opacity-60">{icon}</div>
      <h3 className="text-heading-sm text-text-secondary mb-2">{title}</h3>
      <p className="text-body-sm text-text-muted max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
