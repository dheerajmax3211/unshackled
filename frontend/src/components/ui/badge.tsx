import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-amber/15 text-brand-amber-light border border-brand-amber/20",
        secondary: "bg-white/[0.06] text-text-secondary border border-white/[0.08]",
        success: "bg-brand-green/15 text-brand-green-light border border-brand-green/20",
        danger: "bg-brand-rose/15 text-brand-rose-light border border-brand-rose/20",
        info: "bg-brand-blue/15 text-brand-blue-light border border-brand-blue/20",
        premium: "bg-gradient-to-r from-brand-amber/20 to-brand-amber-dark/20 text-brand-amber-light border border-brand-amber/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
