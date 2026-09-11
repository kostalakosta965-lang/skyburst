"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Undo2 } from "lucide-react";

export function AgeGate({
  declined,
  onConfirm,
  onBack,
}: {
  declined: boolean;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="agegate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-night-950/72 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_360px_at_50%_110%,rgba(255,138,60,0.16),transparent_65%)]" />
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 240 }}
        className="glass relative mx-4 mb-10 w-full max-w-[400px] rounded-[30px] p-7 text-center safe-bottom"
      >
        {!declined ? (
          <>
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-[26px] bg-ember-500/10 ring-1 ring-ember-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.png" alt="PYRO·LAB" className="h-14 w-14 object-contain" />
            </div>
            <p className="font-display text-[28px] font-extrabold tracking-tight text-zinc-50">
              18<span className="text-ember-400">+</span>
            </p>
            <h2 className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
              Подтвердите возраст
            </h2>
            <p className="mx-auto mt-3 max-w-[270px] text-[13px] leading-relaxed text-zinc-400">
              Бытовая пиротехника продаётся только совершеннолетним. Продолжая, вы подтверждаете,
              что вам исполнилось 18 лет.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className="btn-fire mt-6 w-full rounded-2xl py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.16em]"
            >
              Мне есть 18 лет
            </motion.button>
            <button
              onClick={onBack}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-[13px] font-bold text-zinc-400"
            >
              Мне нет 18 лет
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-[26px] bg-rose-500/10 ring-1 ring-rose-500/30">
              <ShieldAlert className="h-9 w-9 text-rose-300" strokeWidth={1.8} />
            </div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-zinc-100">
              Вход ограничен
            </h2>
            <p className="mx-auto mt-3 max-w-[260px] text-[13px] leading-relaxed text-zinc-400">
              К сожалению, мы не можем показать вам каталог пиротехники. Возвращайтесь позже —
              салют подождёт.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className="btn-fire mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.16em]"
            >
              <Undo2 className="h-4 w-4" strokeWidth={2.6} />
              Я ошибся, мне есть 18
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
