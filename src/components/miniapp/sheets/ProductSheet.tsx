"use client";

import { motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { QtyControls, Specs } from "../Cards";

export function ProductSheet({
  product,
  qty,
  onClose,
  onAdd,
  onInc,
  onDec,
}: {
  product: Product;
  qty: number;
  onClose: () => void;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-night-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[30px] border-t border-white/10 bg-night-900"
      >
        <div className="no-scrollbar overflow-y-auto overscroll-contain">
          {/* обложка */}
          <div className="relative h-60 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent" />
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-night-950/70 ring-1 ring-white/15 backdrop-blur"
            >
              <X className="h-4.5 w-4.5 text-zinc-200" strokeWidth={2.4} />
            </button>
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-night-950/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ember-300 ring-1 ring-ember-500/30 backdrop-blur">
                {product.badge}
              </span>
            )}
            <div className="absolute bottom-3 left-5 right-5">
              <h2 className="font-display text-[24px] font-black tracking-tight text-zinc-50">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="px-5 pb-6 pt-4">
            <Specs product={product} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.effects.map((effect) => (
                <span
                  key={effect}
                  className="rounded-full bg-ember-500/[0.09] px-3 py-1 text-[10.5px] font-bold text-ember-200 ring-1 ring-ember-500/20"
                >
                  {effect}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-300">{product.description}</p>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" strokeWidth={2.2} />
              <p className="text-[11.5px] leading-relaxed text-zinc-400">
                Запуск на открытой площадке от 30 м. Ветер — в спину, зрители — за линией
                ограждения.
              </p>
            </div>
          </div>
        </div>

        {/* футер */}
        <div className="shrink-0 border-t border-white/[0.08] bg-night-900/95 px-5 pb-[max(env(safe-area-inset-bottom,0px),14px)] pt-3.5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Цена</p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="font-display text-[22px] font-black text-ember-300">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-[12px] font-bold text-zinc-600 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
            {qty > 0 ? (
              <div className="text-right">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ember-300">
                  в корзине: {qty}
                </p>
                <QtyControls qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAdd}
                className="btn-fire rounded-2xl px-7 py-3.5 font-display text-[12px] font-extrabold uppercase tracking-[0.14em]"
              >
                В корзину
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
