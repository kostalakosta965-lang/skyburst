"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { categories, featuredIds, getProduct, type Product } from "@/lib/catalog";
import { FireworksCanvas } from "../FireworksCanvas";
import { FeaturedCard } from "../Cards";
import { impact, openChannel } from "@/lib/telegram";

const MARQUEE = [
  "БАТАРЕИ САЛЮТОВ",
  "ПЕТАРДЫ",
  "РАКЕТЫ",
  "РИМСКИЕ СВЕЧИ",
  "БЕНГАЛЬСКИЕ ОГНИ",
  "ФОНТАНЫ",
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function HomeView({
  qtyOf,
  onOpenProduct,
  onAdd,
  onInc,
  onDec,
  goCatalog,
  openSafety,
}: {
  qtyOf: (id: string) => number;
  onOpenProduct: (p: Product) => void;
  onAdd: (id: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  goCatalog: () => void;
  openSafety: () => void;
}) {
  const featured = featuredIds.map((id) => getProduct(id)!).filter(Boolean);

  return (
    <div>
      {/* шапка */}
      <header className="flex items-center gap-3 px-5 pt-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -18 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 200 }}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-ember-500/10 ring-1 ring-ember-500/35"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="PYRO·LAB" className="h-8 w-8 object-contain" />
        </motion.div>
        <div className="leading-tight">
          <p className="font-display text-[13px] font-extrabold tracking-[0.22em] text-zinc-50">
            PYRO·LAB
          </p>
          <p className="text-[10.5px] font-semibold text-zinc-500">
            лаборатория салютов · ГОСТ Р
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full border border-ember-500/35 bg-ember-500/10 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-ember-300">
            18+
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
            <BadgeCheck className="h-4 w-4 text-zinc-400" strokeWidth={2} />
          </span>
        </div>
      </header>

      {/* hero */}
      <section className="relative mt-4 h-[470px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/55 via-night-950/20 to-night-950" />
        <FireworksCanvas
          auto
          interactive
          className="absolute inset-0 h-full w-full cursor-pointer"
          onInteract={() => impact("light")}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-night-950/60 px-3 py-1.5 text-[10.5px] font-bold tracking-wide text-zinc-300 backdrop-blur">
              <Sparkles className="h-3 w-3 text-ember-400" strokeWidth={2.4} />
              Коснитесь неба — запустите залп ·
              <span className="inline-flex items-center gap-1 text-ember-300">
                <MapPin className="h-3 w-3" strokeWidth={2.4} /> Москва
              </span>
            </p>
            <h1 className="mt-3 font-display text-[42px] font-black leading-[0.98] tracking-tight text-zinc-50">
              ВЗОРВИ
              <br />
              ЭТУ{" "}
              <span className="text-glow bg-gradient-to-br from-ember-200 via-ember-400 to-ember-600 bg-clip-text text-transparent">
                НОЧЬ
              </span>
            </h1>
            <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-zinc-400">
              Салюты, ракеты и петарды. Заказ готовим за 2 часа — забирайте со склада.
              финал гарантируем.
            </p>
            <div className="pointer-events-auto mt-5 flex items-center gap-2.5">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={goCatalog}
                className="btn-fire inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 font-display text-[12px] font-extrabold uppercase tracking-[0.14em]"
              >
                Выбрать салют
                <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={goCatalog}
                className="rounded-2xl border border-white/12 bg-white/[0.045] px-5 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-200 backdrop-blur"
              >
                Каталог
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* бегущая строка */}
      <div className="mask-fade-x -mt-1 overflow-hidden border-y border-white/[0.06] bg-night-900/40 py-2.5">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span
              key={i}
              className="flex items-center gap-6 font-display text-[10px] font-semibold tracking-[0.3em] text-zinc-500"
            >
              {word}
              <span className="h-1 w-1 rotate-45 bg-ember-500/70" />
            </span>
          ))}
        </div>
      </div>

      {/* статистика */}
      <motion.section {...fadeUp} className="grid grid-cols-3 gap-2 px-5 pt-5">
        {[
          ["500+", "запусков за сезон"],
          ["3 года", "опыта в пиротехнике"],
          ["100%", "сертификация"],
        ].map(([big, small]) => (
          <div key={small} className="glass rounded-2xl px-3 py-3.5 text-center">
            <p className="font-display text-[17px] font-extrabold text-ember-300">{big}</p>
            <p className="mt-1 text-[10px] font-semibold leading-tight text-zinc-500">{small}</p>
          </div>
        ))}
      </motion.section>

      {/* категории */}
      <section className="px-5 pt-8">
        <motion.div {...fadeUp} className="flex items-end justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-zinc-50">Категории</h2>
            <button
              onClick={goCatalog}
              className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-ember-300"
            >
            Все
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </button>
        </motion.div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 2) * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.965 }}
              onClick={goCatalog}
              className="group relative h-[118px] overflow-hidden rounded-[22px] border border-white/10 text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/35 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-[12px] font-bold leading-tight tracking-wide text-zinc-50">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-zinc-400">{cat.tagline}</p>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* хиты */}
      <section className="pt-9">
        <motion.h2
          {...fadeUp}
          className="px-5 font-display text-lg font-bold tracking-tight text-zinc-50"
        >
          Хиты витрины
        </motion.h2>
        <div className="no-scrollbar -mx-0 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          {featured.map((p) => (
            <FeaturedCard
              key={p.id}
              product={p}
              qty={qtyOf(p.id)}
              onOpen={() => onOpenProduct(p)}
              onAdd={() => onAdd(p.id)}
              onInc={() => onInc(p.id)}
              onDec={() => onDec(p.id)}
            />
          ))}
        </div>
      </section>

      {/* безопасность */}
      <motion.section {...fadeUp} className="px-5 pt-8">
        <button
          onClick={openSafety}
          className="glass flex w-full items-center gap-3.5 rounded-[24px] p-4 text-left"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember-500/12 ring-1 ring-ember-500/30">
            <ShieldCheck className="h-6 w-6 text-ember-300" strokeWidth={2} />
          </span>
          <span className="flex-1">
            <span className="block font-display text-[13px] font-bold tracking-wide text-zinc-50">
              Безопасность — прежде всего
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-zinc-400">
              7 железных правил запуска. Прочитайте до первого поджига.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2.4} />
        </button>
      </motion.section>

      {/* подвал */}
      <footer className="px-5 pt-10">
        <div className="glass rounded-[28px] p-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt=""
            className="animate-drift mx-auto h-14 w-14 object-contain opacity-90"
          />
          <p className="mt-2 font-display text-[12px] font-extrabold tracking-[0.24em] text-zinc-200">
            PYRO·LAB
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Сделано с искрой. Буквально.</p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => openChannel("https://t.me/pyrolab_show")}
            className="btn-fire mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-display text-[11px] font-extrabold uppercase tracking-[0.16em]"
          >
            Наш Telegram-канал
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
          </motion.button>
        </div>
        <p className="pt-5 text-center text-[10px] leading-relaxed text-zinc-600">
          Продажа пиротехники лицам старше 18 лет. Соблюдайте правила пожарной безопасности.
        </p>
      </footer>
    </div>
  );
}
