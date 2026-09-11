/**
 * Серверные уведомления о заказах через Telegram Bot API.
 * Работает «мягко»: если не заданы TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID —
 * просто пропускает отправку и никогда не роняет оформление заказа.
 */

const TELEGRAM_API = "https://api.telegram.org";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  html: string,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export interface NotifyOrderPayload {
  id: number;
  customerName: string;
  phone: string;
  comment: string | null;
  username: string | null;
  items: { name: string; qty: number; price: number }[];
  total: number;
  userId: string;
}

export async function notifyAboutOrder(payload: NotifyOrderPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const code = `PY-${String(payload.id).padStart(5, "0")}`;
  const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

  const lines = payload.items
    .map((i) => `• ${esc(i.name)} ×${i.qty} — ${rub(i.price * i.qty)}`)
    .join("\n");

  /* ————— сообщение владельцу магазина ————— */
  if (adminChatId) {
    const who = [
      `👤 <b>${esc(payload.customerName)}</b>`,
      payload.username ? `(@${esc(payload.username)})` : "",
      `\n📞 ${esc(payload.phone)}`,
      payload.comment ? `\n💬 ${esc(payload.comment)}` : "",
    ].join("");

    const text =
      `🎆 <b>НОВЫЙ ЗАКАЗ ${code}</b>\n` +
      `──────────────────\n` +
      `${lines}\n` +
      `──────────────────\n` +
      `💰 Итого: <b>${rub(payload.total)}</b>\n` +
      `📦 Получение: самовывоз, ТЦ «Искра»\n` +
      who;

    await sendTelegramMessage(token, adminChatId, text);
  }

  /* ————— подтверждение клиенту (если пришёл из Telegram) ————— */
  if (payload.userId.startsWith("tg_")) {
    const chatId = payload.userId.slice(3);
    if (!/^\d+$/.test(chatId)) return;
    const text =
      `✅ <b>Заказ ${code} принят!</b>\n\n` +
      `${lines}\n` +
      `──────────────────\n` +
      `💰 ${rub(payload.total)} · самовывоз, ТЦ «Искра»\n\n` +
      `Мы напишем, когда заказ будет готов (~2 часа). ` +
      `Возьмите с собой паспорт — выдаём с 18 лет.`;
    await sendTelegramMessage(token, chatId, text);
  }
}
