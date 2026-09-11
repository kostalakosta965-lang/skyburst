"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  History,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  TicketX,
} from "lucide-react";
import type { TgWebAppUser } from "@/lib/telegram";
import { impact, openChannel } from "@/lib/telegram";
import { formatPrice } from "@/lib/utils";
import type { StoredOrderItem } from "@/db/schema";

interface OrderRow {
  id: number;
  customerName: string;
  delivery: string;
  items: StoredOrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export function orderCode(id: number) {
  return `PY-${String(id).padStart(5, "0")}`;
}

export function ProfileView({
  user,
  uidForApi,
  refreshKey,
  onRepeat,
  openSafety,
  goCatalog,
  resetAge,
}: {
  user: TgWebAppUser | null;
  uidForApi: string;
  refreshKey: number;
  onRepeat: (items: { id: string; qty: number }[]) => void;
  openSafety: () => void;
  goCatalog: () => void;
  resetAge: () => void;
}) {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const res = await fetch(`/api/orders?uid=${encodeURIComponent(uidForApi)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { ok: boolean; orders?: OrderRow[] };
      if (data.ok && data.orders) setOrders(data.orders);
      else setFailed(true);
    } catch {
      setFailed(true);
    }
  }, [uidForApi]);

  useEffect(() => {
    setOrders(null);
    void load();
  }, [load, refreshKey]);

  const displayName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
    : "Гость";
  const initial = displayName.trim().charAt(0).toUpperCase() || "П";

  return (
    <div className="px-5 pt-4">
      <header className="safe-top" />
      <h1 className="font-display text-[26px] font-black tracking-tight text-zinc-50">Профиль</h1>

      {/* карточка пользователя */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass mt-4 flex items-center gap-4 rounded-[26px] p-4"
      >
        <div className="btn-fire grid h-14 w-14 shrink-0 place-items-center rounded-2xl">
          <span className="font-display text-xl font-black text-night-950">{initial}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-bold text-zinc-50">{displayName}</p>
          <p className="mt-0.5 truncate text-[11.5px] font-semibold text-zinc-500">
            {user?.username ? `@${user.username}` : "открыто в браузере — телеметрия выкл."}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-ember-500/30 bg-ember-500/10 px-2.5 py-1 text-[10px] font-extrabold text-ember-300">
          <ShieldCheck className="h-3 w-3" strokeWidth={2.6} />
          18+
        </span>
      </motion.div>

      {/* история заказов */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-zinc-300">
          <History className="h-4 w-4 text-ember-400" strokeWidth={2.2} />
          Мои заказы
        </h2>
        <button
          onClick={() => {
            impact("light");
            setOrders(null);
            void load();
          }}
          aria-label="Обновить"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
        >
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {orders === null && !failed && (
          <>
            {[0, 1].map((i) => (
              <div key={i} className="glass h-[118px] animate-pulse rounded-3xl" />
            ))}
          </>
        )}

        {failed && (
          <div className="glass rounded-3xl p-5 text-center">
            <p className="text-[12px] font-semibold text-zinc-400">
              Не удалось загрузить заказы
            </p>
            <button
              onClick={() => {
                setOrders(null);
                void load();
              }}
              className="mt-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-ember-300"
            >
              Повторить
            </button>
          </div>
        )}

        {orders?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center"
          >
            <TicketX className="h-8 w-8 text-zinc-600" strokeWidth={1.7} />
            <p className="mt-3 font-display text-[13px] font-bold text-zinc-300">
              Заказов пока нет
            </p>
            <p className="mt-1 max-w-[230px] text-[11.5px] leading-relaxed text-zinc-500">
              Первый салют — как первый шаг: всегда в небо.
            </p>
            <button
              onClick={goCatalog}
              className="btn-fire mt-5 rounded-2xl px-5 py-3 font-display text-[11px] font-extrabold uppercase tracking-[0.16em]"
            >
              Выбрать салют
            </button>
          </motion.div>
        )}

        {orders?.map((o, idx) => (
          <motion.article
            key={o.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-3xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[12.5px] font-extrabold tracking-wider text-ember-300">
                {orderCode(o.id)}
              </span>
              <span className="rounded-full bg-ember-500/12 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-widest text-ember-200 ring-1 ring-ember-500/25">
                {o.status === "new" ? "Новый" : o.status}
              </span>
            </div>
            <p className="mt-1 text-[10.5px] font-semibold text-zinc-500">
              {new Date(o.createdAt).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" · "}
              самовывоз · ТЦ «Искра»
            </p>
            <ul className="mt-2.5 space-y-1">
              {o.items.map((item) => (
                <li
                  key={`${o.id}-${item.id}`}
                  className="flex items-center justify-between text-[11.5px]"
                >
                  <span className="truncate pr-3 font-semibold text-zinc-300">
                    {item.name}
                    <span className="text-zinc-600"> ×{item.qty}</span>
                  </span>
                  <span className="shrink-0 font-bold text-zinc-400">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3">
              <span className="font-display text-[15px] font-black text-zinc-100">
                {formatPrice(o.total)}
              </span>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onRepeat(o.items.map(({ id, qty }) => ({ id, qty })))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ember-500/30 bg-ember-500/10 px-3.5 py-2 text-[10.5px] font-extrabold uppercase tracking-widest text-ember-200"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.6} />
                Повторить
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* сервисные ссылки */}
      <div className="mt-7 space-y-2">
        <button
          onClick={openSafety}
          className="glass flex w-full items-center gap-3 rounded-2xl p-4 text-left"
        >
          <ShieldCheck className="h-5 w-5 text-ember-300" strokeWidth={2} />
          <span className="flex-1 text-[12.5px] font-bold text-zinc-200">
            Правила безопасного запуска
          </span>
          <ArrowUpRight className="h-4 w-4 text-zinc-500" strokeWidth={2.4} />
        </button>
        <button
          onClick={() => openChannel("https://t.me/pyrolab_show")}
          className="glass flex w-full items-center gap-3 rounded-2xl p-4 text-left"
        >
          <Send className="h-5 w-5 text-ember-300" strokeWidth={2} />
          <span className="flex-1 text-[12.5px] font-bold text-zinc-200">
            Канал с запусками и скидками
          </span>
          <ArrowUpRight className="h-4 w-4 text-zinc-500" strokeWidth={2.4} />
        </button>
        <button
          onClick={resetAge}
          className="w-full rounded-2xl px-4 py-3 text-center text-[10.5px] font-semibold text-zinc-600 underline decoration-zinc-800 underline-offset-4"
        >
          Сбросить подтверждение возраста
        </button>
      </div>
    </div>
  );
}
