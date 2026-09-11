"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Loader2, X } from "lucide-react";
import type { TgWebAppUser } from "@/lib/telegram";
import { getStableUserId, impact, notify } from "@/lib/telegram";
import { cn, formatPrice, plural } from "@/lib/utils";
import { FireworksCanvas, type FireworksHandle } from "../FireworksCanvas";
import type { CartLine } from "../views/CartView";
import { orderCode } from "../views/ProfileView";

type Phase = "form" | "placing" | "done" | "error";

export function CheckoutSheet({
  lines,
  user,
  onClose,
  onPlaced,
  onGoOrders,
}: {
  lines: CartLine[];
  user: TgWebAppUser | null;
  onClose: () => void;
  onPlaced: () => void;
  onGoOrders: () => void;
}) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const grand = subtotal;

  const [name, setName] = useState(
    user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}` : "",
  );
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [orderId, setOrderId] = useState<number | null>(null);
  const finaleRef = useRef<FireworksHandle | null>(null);
  const [errorText, setErrorText] = useState("");

  const valid =
    name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10 && lines.length > 0;

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => finaleRef.current?.finale(), 350);
      return () => clearTimeout(t);
    }
  }, [phase]);

  async function submit() {
    if (!valid || phase === "placing") return;
    setPhase("placing");
    impact("medium");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getStableUserId(),
          username: user?.username ?? null,
          customerName: name.trim(),
          phone: phone.trim(),
          comment: comment.trim(),
          delivery: "pickup",
          items: lines.map((l) => ({ id: l.product.id, qty: l.qty })),
        }),
      });
      const data = (await res.json()) as { ok: boolean; order?: { id: number } };
      if (res.ok && data.ok && data.order) {
        setOrderId(data.order.id);
        setPhase("done");
        notify("success");
        onPlaced();
      } else {
        setErrorText("Сервер отклонил заказ. Проверьте поля и попробуйте ещё раз.");
        setPhase("error");
        notify("error");
      }
    } catch {
      setErrorText("Нет связи со складом. Проверьте интернет и повторите.");
      setPhase("error");
      notify("error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-night-950/72 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[30px] border-t border-white/10 bg-night-900"
      >
        {phase === "done" ? (
          /* ————— успех ————— */
          <div className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden px-6 pb-[max(env(safe-area-inset-bottom,0px),22px)]">
            <FireworksCanvas
              ref={finaleRef}
              auto
              interactive={false}
              density={1.4}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 via-transparent to-night-900/40" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 13, stiffness: 220, delay: 0.1 }}
              className="relative grid h-20 w-20 place-items-center rounded-[26px] bg-ember-500/15 ring-1 ring-ember-500/40"
            >
              <BadgeCheck className="h-10 w-10 text-ember-300" strokeWidth={1.9} />
            </motion.div>
            <motion.div
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-5 text-center"
            >
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.3em] text-ember-300">
                Заказ принят
              </p>
              <h2 className="mt-2 font-display text-[32px] font-black text-zinc-50">
                {orderId ? orderCode(orderId) : "PY-00000"}
              </h2>
              <p className="mx-auto mt-3 max-w-[270px] text-[12.5px] leading-relaxed text-zinc-300">
                Итого <span className="font-extrabold text-ember-300">{formatPrice(grand)}</span>.
                Менеджер напишет в Telegram в течение 15 минут и подтвердит, когда заказ будет готов к выдаче.
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative mt-7 w-full max-w-[320px] space-y-2.5"
            >
              <button
                onClick={onGoOrders}
                className="btn-fire flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-[12px] font-extrabold uppercase tracking-[0.14em]"
              >
                Мои заказы
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-2xl border border-white/12 bg-night-950/50 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-200 backdrop-blur"
              >
                Продолжить шопинг
              </button>
            </motion.div>
          </div>
        ) : (
          /* ————— форма ————— */
          <>
            <div className="flex items-center justify-between px-5 pb-1 pt-5">
              <div>
                <h2 className="font-display text-[19px] font-black tracking-tight text-zinc-50">
                  Оформление
                </h2>
                <p className="mt-0.5 text-[11px] font-semibold text-zinc-500">
                  {lines.length} {plural(lines.length, "позиция", "позиции", "позиций")} ·{" "}
                  {formatPrice(grand)} · самовывоз
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
              >
                <X className="h-4 w-4 text-zinc-300" strokeWidth={2.4} />
              </button>
            </div>

            <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <Field
                label="Имя"
                value={name}
                onChange={setName}
                placeholder="Как к вам обращаться"
              />
              <Field
                label="Телефон"
                value={phone}
                onChange={setPhone}
                placeholder="+7 (___) ___-__-__"
                type="tel"
              />
              <div>
                <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-zinc-500">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дата праздника, адрес, пожелания…"
                  rows={3}
                  className="glass w-full resize-none rounded-2xl px-4 py-3 text-[13px] font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-ember-500/40"
                />
              </div>

              {(phase === "error") && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[11.5px] font-semibold leading-relaxed text-rose-200"
                >
                  {errorText}
                </motion.p>
              )}

              <p className="pt-1 text-[10px] leading-relaxed text-zinc-600">
                Нажимая «Подтвердить», вы соглашаетесь с правилами продажи пиротехники лицам
                старше 18 лет.
              </p>
            </div>

            <div className="border-t border-white/[0.08] bg-night-900/95 px-5 pb-[max(env(safe-area-inset-bottom,0px),14px)] pt-3.5">
              <motion.button
                whileTap={{ scale: valid ? 0.97 : 1 }}
                onClick={submit}
                disabled={!valid || phase === "placing"}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-display text-[13px] font-extrabold uppercase tracking-[0.14em] transition-opacity",
                  valid ? "btn-fire" : "bg-white/[0.06] text-zinc-500",
                )}
              >
                {phase === "placing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.6} />
                    Отправляем…
                  </>
                ) : (
                  <>Подтвердить · {formatPrice(grand)}</>
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        className="glass w-full rounded-2xl px-4 py-3 text-[13px] font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-ember-500/40"
      />
    </div>
  );
}
