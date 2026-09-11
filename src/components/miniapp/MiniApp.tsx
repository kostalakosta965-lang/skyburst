"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import {
  AUTH_KEY,
  CART_KEY,
  getStableUserId,
  getTelegramUser,
  getTg,
  impact,
  isTelegramEnv,
  NIGHT,
  notify,
  selectionHaptic,
  type TgWebAppUser,
} from "@/lib/telegram";
import { BottomNav, type NavTab } from "./BottomNav";
import { AgeGate } from "./AgeGate";
import { HomeView } from "./views/HomeView";
import { CatalogView } from "./views/CatalogView";
import { CartView, type CartLine } from "./views/CartView";
import { ProfileView } from "./views/ProfileView";
import { ProductSheet } from "./sheets/ProductSheet";
import { CheckoutSheet } from "./sheets/CheckoutSheet";
import { SafetySheet } from "./sheets/SafetySheet";

const viewMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
};

export function MiniApp() {
  /* ————— системное состояние ————— */
  const [booted, setBooted] = useState(false);
  const [ageOk, setAgeOk] = useState<boolean | null>(null);
  const [ageDeclined, setAgeDeclined] = useState(false);
  const [tgUser, setTgUser] = useState<TgWebAppUser | null>(null);
  const [inTg, setInTg] = useState(false);
  const [uidApi, setUidApi] = useState("web_anon");

  /* ————— навигация и оверлеи ————— */
  const [tab, setTabState] = useState<NavTab>("home");
  const [product, setProduct] = useState<Product | null>(null);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersRefresh, setOrdersRefresh] = useState(0);

  /* ————— корзина ————— */
  const [cart, setCartState] = useState<Record<string, number>>({});

  const setCart = (updater: (prev: Record<string, number>) => Record<string, number>) =>
    setCartState((prev) => updater(prev));

  const qtyOf = (id: string) => cart[id] ?? 0;

  const addToCart = (id: string) => {
    impact("light");
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const inc = (id: string) => {
    impact("light");
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const dec = (id: string) => {
    impact("light");
    setCart((c) => {
      const next = { ...c };
      const n = (next[id] ?? 0) - 1;
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  };
  const remove = (id: string) => {
    impact("medium");
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  };

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = getProduct(id);
          return p ? { product: p, qty } : null;
        })
        .filter((l): l is CartLine => Boolean(l)),
    [cart],
  );
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const grand = subtotal;
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);

  /* ————— инициализация ————— */
  useEffect(() => {
    const tg = getTg();
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        tg.setHeaderColor(NIGHT);
        tg.setBackgroundColor(NIGHT);
        tg.disableVerticalSwipes?.();
      } catch {
        /* noop */
      }
    }
    setTgUser(getTelegramUser());
    setInTg(isTelegramEnv());
    setUidApi(getStableUserId());
    setAgeOk(window.localStorage.getItem(AUTH_KEY) === "1");
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        const clean: Record<string, number> = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (getProduct(key) && Number.isFinite(value) && value > 0) {
            clean[key] = Math.min(99, Math.floor(value));
          }
        }
        setCartState(clean);
      }
    } catch {
      /* noop */
    }
    const t = setTimeout(() => setBooted(true), 1250);
    return () => clearTimeout(t);
  }, []);

  /* персист корзины */
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* noop */
    }
  }, [cart]);

  /* скролл вверх при смене вкладки */
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  /* блокировка фонового скролла под шторками */
  const overlayOpen = Boolean(product) || safetyOpen || checkoutOpen;
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  const setTab = (t: NavTab) => {
    if (t !== tab) {
      selectionHaptic();
      setTabState(t);
    }
  };

  const goCatalog = () => setTab("catalog");

  /* ————— Telegram MainButton ————— */
  const mainAvailable = tab === "cart" && lines.length > 0 && !checkoutOpen;
  useEffect(() => {
    const tg = getTg();
    if (!tg?.MainButton) return;
    try {
      if (mainAvailable) {
        tg.MainButton.setText(`ОФОРМИТЬ · ${formatPrice(grand)}`);
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    } catch {
      /* noop */
    }
  }, [mainAvailable, grand]);

  useEffect(() => {
    const tg = getTg();
    if (!tg?.MainButton) return;
    const handler = () => {
      impact("medium");
      setCheckoutOpen(true);
    };
    try {
      tg.MainButton.onClick(handler);
    } catch {
      /* noop */
    }
    return () => {
      try {
        tg.MainButton?.offClick(handler);
        tg.MainButton?.hide();
      } catch {
        /* noop */
      }
    };
  }, []);

  /* ————— Telegram BackButton ————— */
  const stateRef = useRef({ tab, product, safetyOpen, checkoutOpen });
  stateRef.current = { tab, product, safetyOpen, checkoutOpen };

  useEffect(() => {
    const tg = getTg();
    if (!tg?.BackButton) return;
    try {
      if (overlayOpen || tab !== "home") tg.BackButton.show();
      else tg.BackButton.hide();
    } catch {
      /* noop */
    }
  }, [overlayOpen, tab]);

  useEffect(() => {
    const tg = getTg();
    if (!tg?.BackButton) return;
    const handler = () => {
      const s = stateRef.current;
      impact("light");
      if (s.checkoutOpen) setCheckoutOpen(false);
      else if (s.product) setProduct(null);
      else if (s.safetyOpen) setSafetyOpen(false);
      else if (s.tab !== "home") setTabState("home");
    };
    try {
      tg.BackButton.onClick(handler);
    } catch {
      /* noop */
    }
    return () => {
      try {
        tg.BackButton?.offClick(handler);
      } catch {
        /* noop */
      }
    };
  }, []);

  /* подтверждение закрытия, когда есть корзина */
  useEffect(() => {
    const tg = getTg();
    try {
      if (cartCount > 0) tg?.enableClosingConfirmation?.();
      else tg?.disableClosingConfirmation?.();
    } catch {
      /* noop */
    }
  }, [cartCount]);

  const repeatOrder = (items: { id: string; qty: number }[]) => {
    setCart((c) => {
      const next = { ...c };
      for (const item of items) {
        if (getProduct(item.id)) next[item.id] = Math.min(99, (next[item.id] ?? 0) + item.qty);
      }
      return next;
    });
    notify("success");
    setTab("cart");
  };

  const confirmAge = () => {
    window.localStorage.setItem(AUTH_KEY, "1");
    setAgeOk(true);
    setAgeDeclined(false);
    notify("success");
  };

  const resetAge = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setAgeOk(false);
    setAgeDeclined(false);
    impact("medium");
  };

  const showGate = booted && ageOk === false;

  return (
    <div className="grain relative mx-auto min-h-dvh w-full max-w-[480px] sm:border-x sm:border-white/[0.05]">
      <main className="pb-[118px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} {...viewMotion}>
            {tab === "home" && (
              <HomeView
                qtyOf={qtyOf}
                onOpenProduct={setProduct}
                onAdd={addToCart}
                onInc={inc}
                onDec={dec}
                goCatalog={goCatalog}
                openSafety={() => {
                  impact("light");
                  setSafetyOpen(true);
                }}
              />
            )}
            {tab === "catalog" && (
              <CatalogView
                qtyOf={qtyOf}
                onOpenProduct={setProduct}
                onAdd={addToCart}
                onInc={inc}
                onDec={dec}
              />
            )}
            {tab === "cart" && (
              <CartView
                lines={lines}
                qtyOf={qtyOf}
                onInc={inc}
                onDec={dec}
                onRemove={remove}
                subtotal={subtotal}
                onCheckout={() => {
                  impact("medium");
                  setCheckoutOpen(true);
                }}
                goCatalog={() => setTab("catalog")}
                inlineCta={!inTg}
              />
            )}
            {tab === "profile" && (
              <ProfileView
                user={tgUser}
                uidForApi={uidApi}
                refreshKey={ordersRefresh}
                onRepeat={repeatOrder}
                openSafety={() => setSafetyOpen(true)}
                goCatalog={() => setTab("catalog")}
                resetAge={resetAge}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav tab={tab} cartCount={cartCount} onChange={setTab} />

      <AnimatePresence>
        {product && (
          <ProductSheet
            key="product-sheet"
            product={product}
            qty={qtyOf(product.id)}
            onClose={() => setProduct(null)}
            onAdd={() => addToCart(product.id)}
            onInc={() => inc(product.id)}
            onDec={() => dec(product.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {safetyOpen && <SafetySheet key="safety-sheet" onClose={() => setSafetyOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutSheet
            key="checkout-sheet"
            lines={lines}
            user={tgUser}
            onClose={() => setCheckoutOpen(false)}
            onPlaced={() => {
              setCartState({});
              setOrdersRefresh((k) => k + 1);
            }}
            onGoOrders={() => {
              setCheckoutOpen(false);
              setTab("profile");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGate && (
          <AgeGate
            key="age-gate"
            declined={ageDeclined}
            onConfirm={confirmAge}
            onBack={() => setAgeDeclined(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{!booted && <Splash key="splash" />}</AnimatePresence>
    </div>
  );
}

function Splash() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.45, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] grid place-items-center bg-night-950"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 180 }}
          className="grid h-24 w-24 place-items-center rounded-[30px] bg-ember-500/10 ring-1 ring-ember-500/35"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="PYRO·LAB" className="h-16 w-16 object-contain" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-glow mt-5 font-display text-[15px] font-extrabold tracking-[0.34em] text-zinc-100"
        >
          PYRO·LAB
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-[3px] w-24 origin-left rounded-full bg-gradient-to-r from-ember-300 to-ember-600"
        />
      </div>
    </motion.div>
  );
}
