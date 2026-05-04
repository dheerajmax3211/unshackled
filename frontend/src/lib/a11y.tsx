"use client";

import { useCallback, type KeyboardEvent, type RefObject } from "react";

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatches = !!shortcut.shift === e.shiftKey;
        const altMatches = !!shortcut.alt === e.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  return { handleKeyDown };
}

export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!active || !ref.current) return;

      if (e.key === "Tab") {
        const focusableElements = ref.current.querySelectorAll<HTMLElement>(
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
    [ref, active]
  );

  return { handleKeyDown };
}

export function useArrowNavigation<T>(
  items: T[],
  selectedIndex: number,
  onSelect: (index: number) => void,
  options: {
    loop?: boolean;
    vertical?: boolean;
    pageSize?: number;
  } = {}
) {
  const { loop = true, vertical = true, pageSize = 5 } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let newIndex = selectedIndex;

      switch (e.key) {
        case vertical ? "ArrowUp" : "ArrowLeft":
          e.preventDefault();
          newIndex = selectedIndex > 0 ? selectedIndex - 1 : loop ? items.length - 1 : selectedIndex;
          break;
        case vertical ? "ArrowDown" : "ArrowRight":
          e.preventDefault();
          newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : loop ? 0 : selectedIndex;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        case "PageUp":
          e.preventDefault();
          newIndex = Math.max(0, selectedIndex - pageSize);
          break;
        case "PageDown":
          e.preventDefault();
          newIndex = Math.min(items.length - 1, selectedIndex + pageSize);
          break;
        default:
          return;
      }

      onSelect(newIndex);
    },
    [items.length, selectedIndex, onSelect, loop, vertical, pageSize]
  );

  return { handleKeyDown };
}

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ targetId, children, className }: SkipLinkProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetId]);

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-amber focus:text-surface-darkest focus:font-medium focus:outline-none focus:ring-2 focus:ring-brand-amber ${className || ""}`}
    >
      {children}
    </a>
  );
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
  className?: string;
}

export function LiveRegion({ message, politeness = "polite", className }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={className}
    >
      {message}
    </div>
  );
}

export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite") {
  if (typeof document === "undefined") return;

  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", politeness);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}