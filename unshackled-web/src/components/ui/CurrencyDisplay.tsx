"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  showSymbol?: boolean;
}

export default function CurrencyDisplay({ 
  amount, 
  currency = "INR", 
  className,
  showSymbol = true 
}: CurrencyDisplayProps) {
  // Use Intl.NumberFormat for robust local formatting
  const formatter = new Intl.NumberFormat("en-IN", {
    style: showSymbol ? "currency" : "decimal",
    currency: currency,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(amount);

  return (
    <span className={cn("font-black tabular-nums tracking-tight", className)}>
      {formatted}
    </span>
  );
}
