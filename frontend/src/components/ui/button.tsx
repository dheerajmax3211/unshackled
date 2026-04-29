import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-glass-sm text-body-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber/50 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-brand-amber text-surface-darkest hover:bg-brand-amber-light shadow-lg",
        secondary:
          "glass border-white/10 text-text-primary hover:bg-white/[0.06] hover:border-white/[0.15]",
        outline:
          "border border-white/10 text-text-secondary hover:bg-white/[0.04] hover:border-white/[0.2] hover:text-text-primary",
        ghost: "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary",
        danger:
          "bg-brand-rose/20 text-brand-rose-light border border-brand-rose/20 hover:bg-brand-rose/30",
        premium:
          "bg-gradient-to-r from-brand-amber to-brand-amber-dark text-surface-darkest font-semibold shadow-lg",
        link: "text-brand-amber underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-glass-sm px-3 text-caption",
        lg: "h-12 rounded-glass px-7 text-body-md",
        xl: "h-14 rounded-glass px-9 text-body-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
