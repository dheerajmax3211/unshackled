"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  TrendingUp,
  Users,
  Award,
  Settings,
  Plus,
  Flame,
  ChevronUp,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  badge?: number;
}

interface BottomNavProps {
  className?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: Users, label: "Friends", href: "/friends" },
  { icon: Award, label: "Badges", href: "/badges" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function BottomNav({ className }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalNotifications = 3;

  return (
    <>
      {/* Desktop Nav - Hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-card">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                isActive
                  ? "bg-brand-amber/20 text-brand-amber"
                  : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-body-sm font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-rose text-[10px] font-bold text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden",
          "bg-surface-dark/95 backdrop-blur-xl border-t border-white/[0.05]",
          "safe-area-bottom",
          className
        )}
      >
        {/* Main nav */}
        <div className="flex items-center justify-around py-2 px-2">
          {/* Home */}
          <NavButton
            icon={Home}
            label="Home"
            isActive={pathname === "/"}
            onClick={() => router.push("/")}
          />

          {/* Progress */}
          <NavButton
            icon={TrendingUp}
            label="Progress"
            isActive={pathname === "/progress"}
            onClick={() => router.push("/progress")}
          />

          {/* Quick Check-in FAB */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "relative -mt-6 w-14 h-14 rounded-full",
              "bg-gradient-to-br from-brand-amber to-brand-amber-dark",
              "flex items-center justify-center",
              "shadow-lg shadow-brand-amber/30",
              "active:scale-95 transition-transform"
            )}
          >
            <div className="absolute inset-0 rounded-full bg-brand-amber/30 animate-pulse" />
            <Plus className="w-6 h-6 text-surface-darkest" strokeWidth={2.5} />
          </motion.button>

          {/* Friends */}
          <NavButton
            icon={Users}
            label="Friends"
            isActive={pathname === "/friends"}
            onClick={() => router.push("/friends")}
            badge={totalNotifications}
          />

          {/* More */}
          <NavButton
            icon={Settings}
            label="More"
            isActive={pathname === "/settings"}
            onClick={() => router.push("/settings")}
          />
        </div>

        {/* Expanded Quick Actions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-full left-0 right-0 p-4 pb-2"
            >
              <div className="flex flex-col gap-2 p-4 rounded-2xl glass-card">
                <p className="text-caption text-text-muted text-center mb-2">Quick Check-in</p>

                <QuickActionButton
                  icon={Flame}
                  label="I stayed clean"
                  variant="success"
                  onClick={() => {
                    console.log("Check-in clean");
                    setIsExpanded(false);
                  }}
                />

                <QuickActionButton
                  icon={Bell}
                  label="I slipped"
                  variant="warning"
                  onClick={() => {
                    console.log("Check-in slipped");
                    setIsExpanded(false);
                  }}
                />
              </div>

              {/* Backdrop */}
              <div
                className="absolute inset-0 -z-10 -bottom-4"
                onClick={() => setIsExpanded(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom padding for mobile */}
      <div className="h-20 md:hidden" />
    </>
  );
}

interface NavButtonProps {
  icon: typeof Home;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

function NavButton({ icon: Icon, label, isActive, onClick, badge }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] py-2 rounded-lg transition-colors",
        isActive ? "text-brand-amber" : "text-text-muted active:text-text-primary"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-rose text-[9px] font-bold text-white flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-amber"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

interface QuickActionButtonProps {
  icon: typeof Flame;
  label: string;
  variant: "success" | "warning";
  onClick: () => void;
}

function QuickActionButton({ icon: Icon, label, variant, onClick }: QuickActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-colors",
        variant === "success"
          ? "bg-brand-green/10 border border-brand-green/20 text-brand-green hover:bg-brand-green/20"
          : "bg-brand-amber/10 border border-brand-amber/20 text-brand-amber hover:bg-brand-amber/20"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-body-sm font-medium">{label}</span>
    </motion.button>
  );
}