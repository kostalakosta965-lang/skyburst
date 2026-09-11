"use client";

import { motion } from "framer-motion";
import {
  Ban,
  Droplets,
  FileCheck2,
  Glasses,
  ShieldAlert,
  Trees,
  Wind,
  X,
} from "lucide-react";

const RULES = [
  {
    icon: Trees,
    title: "Только открытая площадка",
    text: "Вдали от зданий, деревьев, проводов и парковки. Ни на балконах, ни из окон.",
  },
  {
    icon: Wind,
    title: "Ветер — в спину",
    text: "Зрители всегда с подветренной линии. Дистанция зрителей — от 30 метров.",
  },
  {
    icon: Glasses,
    title: "Защитите глаза",
    text: "Очки и плотная одежда с капюшоном. Наклонять голову над изделием запрещено.",
  },
  {
    icon: Ban,
    title: "Не перезажигайте",
    text: "Изделие не сработало — ждите 15 минут, затем замочите в воде. Второго огня нет.",
  },
  {
    icon: Droplets,
    title: "Вода рядом",
    text: "Ведро воды или огнетушитель всегда под рукой до окончания программы.",
  },
  {
    icon: ShieldAlert,
    title: "Трезвая запускалка",
    text: "Только совершеннолетний и трезвый человек. Дети — на дистанции со взрослыми.",
  },
  {
    icon: FileCheck2,
    title: "Проверяйте сертификат",
    text: "У каждого нашего изделия есть паспорт и сертификат соответствия ГОСТ Р.",
  },
];

export function SafetySheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-end justify-center bg-night-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[30px] border-t border-white/10 bg-night-900"
      >
        <div className="relative shrink-0 overflow-hidden px-5 pb-4 pt-5">
          <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-ember-500/15 blur-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-ember-300">
                Прочитать до запуска
              </p>
              <h2 className="mt-1.5 font-display text-[20px] font-black tracking-tight text-zinc-50">
                7 правил ночи
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
            >
              <X className="h-4 w-4 text-zinc-300" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom,0px),20px)]">
          {RULES.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.05 }}
              className="glass flex gap-3.5 rounded-2xl p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ember-500/10 ring-1 ring-ember-500/25">
                <rule.icon className="h-5 w-5 text-ember-300" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13px] font-extrabold text-zinc-100">
                  <span className="mr-1.5 font-display text-ember-400">{i + 1}.</span>
                  {rule.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-400">{rule.text}</p>
              </div>
            </motion.div>
          ))}
          <p className="px-1 pt-2 text-center text-[10px] leading-relaxed text-zinc-600">
            Нарушение техники безопасности приводит к травмам. Ответственность за запуск несёт
            организатор праздника.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
