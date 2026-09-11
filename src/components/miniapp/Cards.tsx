"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Ruler, Timer, Zap } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

export function SpecChip({
  icon,
  label,
}: {
  icon: "shots" | "duration" | "caliber";
  label: string;
}) {
  const Icon = icon === "shots" ? Zap : icon === "duration" ? Timer : Ruler;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-300">
      <Icon className="h-3 w-3 text-ember-400" strokeWidth={2.4} />
      {label}
    </span>
  );
}

export function Specs({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {product.shots != null && <SpecChip icon="shots" label={`${product.shots} залпов`} />}
      {product.duration != null && <SpecChip icon="duration" label={`${product.duration} сек`} />}
      {product.caliber && <SpecChip icon="caliber" label={product.caliber} />}
    </div>
  );
}

export function QtyControls({
  qty,
  onAdd,
  onInc,
  onDec,
  size = "md",
}: {
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-9";
  if (qty === 0) {
    return (
      <motion.button
        whileTap={{ scale: 0.86 }}
        onClick={onAdd}
        aria-label="В корзину"
        className={cn(
          h,
          "btn-fire grid w-12 place-items-center rounded-xl text-sm font-extrabold",
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={3} />
      </motion.button>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        h,
        "flex items-center rounded-xl border border-ember-500/35 bg-ember-500/10 text-ember-200",
      )}
    >
      <motion.button
        whileTap={{ scale: 0.82 }}
        onClick={onDec}
        aria-label="Убрать"
        className="grid h-full w-8 place-items-center"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      </motion.button>
      <span className="w-5 text-center text-sm font-extrabold tabular-nums">{qty}</span>
      <motion.button
        whileTap={{ scale: 0.82 }}
        onClick={onInc}
        aria-label="Добавить"
        className="grid h-full w-8 place-items-center"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
      </motion.button>
    </motion.div>
  );
}

export function ProductRow({
  product,
  qty,
  onOpen,
  onAdd,
  onInc,
  onDec,
}: {
  product: Product;
  qty: number;
  onOpen: () => void;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative flex gap-3 rounded-3xl p-3"
    >
      <button onClick={onOpen} className="relative shrink-0" aria-label={product.name}>
        <span className="pointer-events-none absolute -inset-1 rounded-[22px] bg-ember-500/10 blur-lg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="relative h-24 w-24 rounded-[18px] border border-white/10 object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-1 top-1 rounded-full bg-night-950/85 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ember-300 backdrop-blur">
            {product.badge}
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <button onClick={onOpen} className="text-left">
          <h3 className="truncate font-display text-[12.5px] font-semibold tracking-wide text-zinc-50">
            {product.name}
          </h3>
        </button>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-400">
          {product.effects.join(" · ")}
        </p>
        <Specs product={product} className="mt-1.5" />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[15px] font-bold text-ember-300">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] font-semibold text-zinc-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
          <QtyControls qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedCard({
  product,
  qty,
  onOpen,
  onAdd,
  onInc,
  onDec,
}: {
  product: Product;
  qty: number;
  onOpen: () => void;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <motion.article
      whileTap={{ scale: 0.97 }}
      className="group relative w-[218px] shrink-0 snap-start overflow-hidden rounded-[26px] border border-white/10 bg-night-900"
    >
      <button onClick={onOpen} className="relative block h-40 w-full" aria-label={product.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/25 to-transparent" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-night-950/80 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-ember-300 ring-1 ring-ember-500/30 backdrop-blur">
            {product.badge}
          </span>
        )}
      </button>
      <div className="relative space-y-2 p-3.5">
        <h3 className="font-display text-[13px] font-semibold tracking-wide text-zinc-50">
          {product.name}
        </h3>
        <Specs product={product} />
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="font-display text-[15px] font-bold text-ember-300">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ml-1.5 text-[10px] font-semibold text-zinc-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <QtyControls qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}
