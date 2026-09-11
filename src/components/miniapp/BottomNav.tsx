"use client";

import { motion } from "framer-motion";
import { Flame, LayoutGrid, ShoppingBag, CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab = "home" | "catalog" | "cart" | "profile";

const TABS: Array<{ id: NavTab; label: string; icon: typeof Flame }> = [
  { id: "home", label: "Главная", icon: Flame },
  { id: "catalog", label: "Каталог", icon: LayoutGrid },
  { id: "cart", label: "Корзина", icon: ShoppingBag },
  { id: "profile", label: "Профиль", icon: CircleUserRound },
];

export function BottomNav({
  tab,
  cartCount,
  onChange,
}: {
  tab: NavTab;
  cartCount: number;
  onChange: (t: NavTab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-4 pb-[max(env(safe-area-inset-bottom,0px),10px)] pt-2">
      <div className="glass flex items-center justify-around rounded-[26px] px-1.5 py-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-2"
              aria-label={label}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", damping: 26, stiffness: 320 }}
                  className="absolute inset-0 rounded-[20px] bg-ember-500/[0.13] ring-1 ring-ember-500/25"
                />
              )}
              <span className="relative">
                <Icon
                  className={cn(
                    "h-[21px] w-[21px] transition-colors duration-200",
                    active ? "text-ember-300" : "text-zinc-500",
                  )}
                  strokeWidth={active ? 2.3 : 1.9}
                />
                {id === "cart" && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 500 }}
                    className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ember-500 px-1 text-[9px] font-extrabold text-night-950"
                  >
                    {cartCount > 99 ? "99" : cartCount}
                  </motion.span>
                )}
              </span>
              <span
                className={cn(
                  "relative text-[9.5px] font-bold tracking-wide transition-colors duration-200",
                  active ? "text-ember-200" : "text-zinc-500",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
