"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, MapPin, PackageOpen, Trash2, Warehouse } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatPrice, plural } from "@/lib/utils";
import { QtyControls } from "../Cards";

export interface CartLine {
  product: Product;
  qty: number;
}

export function CartView({
  lines,
  qtyOf,
  onInc,
  onDec,
  onRemove,
  subtotal,
  onCheckout,
  goCatalog,
  inlineCta,
}: {
  lines: CartLine[];
  qtyOf: (id: string) => number;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  subtotal: number;
  onCheckout: () => void;
  goCatalog: () => void;
  inlineCta: boolean;
}) {
  const count = lines.reduce((n, l) => n + l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="px-5 pt-4">
        <header className="safe-top" />
        <h1 className="font-display text-[26px] font-black tracking-tight text-zinc-50">
          Корзина
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-6 flex flex-col items-center rounded-[28px] px-6 py-14 text-center"
        >
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white/[0.045] ring-1 ring-white/10">
            <PackageOpen className="h-7 w-7 text-zinc-500" strokeWidth={1.8} />
          </span>
          <p className="mt-4 font-display text-[14px] font-bold text-zinc-200">
            Пока тихо и темно
          </p>
          <p className="mt-1.5 max-w-[230px] text-[12px] leading-relaxed text-zinc-500">
            Добавьте пару батарей салютов — и небо станет заметно ярче.
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={goCatalog}
            className="btn-fire mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-display text-[11px] font-extrabold uppercase tracking-[0.16em]"
          >
            К каталогу
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4">
      <header className="safe-top" />
      <h1 className="font-display text-[26px] font-black tracking-tight text-zinc-50">Корзина</h1>
      <p className="mt-1 text-[12px] font-semibold text-zinc-500">
        {count} {plural(count, "товар", "товара", "товаров")} · только самовывоз
      </p>

      {/* строки */}
      <div className="mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {lines.map(({ product, qty }) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: -60,
                height: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="glass flex items-center gap-3 overflow-hidden rounded-3xl p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[12px] font-bold tracking-wide text-zinc-100">
                  {product.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  {formatPrice(product.price)} / шт
                </p>
                <p className="mt-0.5 font-display text-[13px] font-bold text-ember-300">
                  {formatPrice(product.price * qty)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => onRemove(product.id)}
                  aria-label="Удалить"
                  className="grid h-7 w-7 place-items-center rounded-lg text-zinc-600 transition-colors hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
                <QtyControls
                  qty={qtyOf(product.id)}
                  onAdd={() => onInc(product.id)}
                  onInc={() => onInc(product.id)}
                  onDec={() => onDec(product.id)}
                  size="sm"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* точка самовывоза */}
      <div className="glass mt-5 rounded-3xl p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ember-500/12 ring-1 ring-ember-500/30">
            <Warehouse className="h-5.5 w-5.5 text-ember-300" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[12.5px] font-bold tracking-wide text-zinc-50">
              Самовывоз из точки выдачи
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-snug text-zinc-400">
              <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-ember-400" strokeWidth={2.4} />
              г. Москва, ТЦ «Искра», 2-й этаж
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-snug text-zinc-400">
              <Clock3 className="mt-px h-3.5 w-3.5 shrink-0 text-ember-400" strokeWidth={2.4} />
              Ежедневно 10:00–22:00 · готовим за ~2 часа
            </p>
          </div>
          <span className="rounded-full bg-ember-500/12 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ember-200 ring-1 ring-ember-500/25">
            0 ₽
          </span>
        </div>
      </div>

      {/* итоги */}
      <div className="glass mt-3 space-y-2 rounded-3xl p-4">
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="font-semibold text-zinc-400">Товары</span>
          <span className="font-bold text-zinc-200">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="font-semibold text-zinc-400">Самовывоз</span>
          <span className="font-bold text-ember-300">бесплатно</span>
        </div>
        <div className="h-px bg-white/[0.07]" />
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">
            Итого
          </span>
          <span className="font-display text-[20px] font-black text-ember-300">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      {/* CTA — показываем только вне Telegram (там MainButton) */}
      {inlineCta && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onCheckout}
          className="btn-fire mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-display text-[13px] font-extrabold uppercase tracking-[0.16em]"
        >
          Оформить заказ
          <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
        </motion.button>
      )}
      <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-600">
        Менеджер свяжется для подтверждения готовности. Выдача — по паспорту, старше 18 лет.
      </p>
    </div>
  );
}
