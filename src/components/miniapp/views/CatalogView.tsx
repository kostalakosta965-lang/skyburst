"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX } from "lucide-react";
import { products, type Product } from "@/lib/catalog";
import { ProductRow } from "../Cards";
import { plural } from "@/lib/utils";

export function CatalogView({
  qtyOf,
  onOpenProduct,
  onAdd,
  onInc,
  onDec,
}: {
  qtyOf: (id: string) => number;
  onOpenProduct: (p: Product) => void;
  onAdd: (id: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.effects.some((e) => e.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="px-5 pt-4">
      <header className="safe-top" />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-[26px] font-black tracking-tight text-zinc-50"
      >
        Каталог
      </motion.h1>
      <p className="mt-1 text-[12px] font-semibold text-zinc-500">
        {products.length} {plural(products.length, "позиция", "позиции", "позиций")} · всё с
        паспортами изделий
      </p>

      {/* поиск */}
      <div className="glass mt-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-3">
        <Search className="h-4 w-4 shrink-0 text-ember-400" strokeWidth={2.2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти: пион, веерный, петарды…"
          className="w-full bg-transparent text-[13px] font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      {/* список */}
      <div className="mt-4 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              qty={qtyOf(p.id)}
              onOpen={() => onOpenProduct(p)}
              onAdd={() => onAdd(p.id)}
              onInc={() => onInc(p.id)}
              onDec={() => onDec(p.id)}
            />
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass flex flex-col items-center rounded-3xl px-6 py-12 text-center"
          >
            <SearchX className="h-8 w-8 text-zinc-600" strokeWidth={1.8} />
            <p className="mt-3 font-display text-[13px] font-bold text-zinc-300">
              Ничего не нашлось
            </p>
            <p className="mt-1 text-[11.5px] text-zinc-500">
              Попробуйте «пион», «петарды» или «фонтан»
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-ember-300"
            >
              Сбросить поиск
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
