"use client";

import { type ReactNode, useEffect, useState } from "react";
import { worker } from "./browser";

interface MSWProviderProps {
  children: ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
        await worker.start({
          onUnhandledRequest: "bypass",
          quiet: true,
        });
        setIsReady(true);
      } else {
        setIsReady(true);
      }
    }

    initMSW();

    return () => {
      worker.stop();
    };
  }, []);

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-darkest">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
          <p className="text-body-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}