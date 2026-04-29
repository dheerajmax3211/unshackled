import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-glass-sm border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-body-md text-text-primary placeholder:text-text-subtle backdrop-blur-sm transition-colors duration-200 file:border-0 file:bg-transparent file:text-body-sm file:font-medium hover:border-white/[0.15] focus:border-brand-amber/50 focus:outline-none focus:ring-2 focus:ring-brand-amber/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
