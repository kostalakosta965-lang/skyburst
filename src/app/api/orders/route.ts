import { db } from "@/db";
import { orders } from "@/db/schema";
import { computeTotal, getProduct } from "@/lib/catalog";
import { notifyAboutOrder } from "@/lib/telegram-notify";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface IncomingItem {
  id: string;
  qty: number;
}

function sanitizeItems(raw: unknown): IncomingItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: String((item as IncomingItem)?.id ?? ""),
      qty: Math.max(0, Math.min(99, Math.floor(Number((item as IncomingItem)?.qty) || 0))),
    }))
    .filter((item) => item.id && getProduct(item.id) && item.qty > 0)
    .slice(0, 50);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = (searchParams.get("uid") ?? "").slice(0, 64);
  if (!uid) {
    return Response.json({ ok: false, error: "uid_required" }, { status: 400 });
  }
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, uid))
      .orderBy(desc(orders.createdAt))
      .limit(25);
    return Response.json({ ok: true, orders: rows });
  } catch {
    return Response.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const userId = String(body.userId ?? "").slice(0, 64);
  const customerName = String(body.customerName ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 32);
  const comment = String(body.comment ?? "").trim().slice(0, 500);
  // курьерской доставки нет — только самовывоз из точки выдачи
  const delivery = "pickup";
  const username = String(body.username ?? "").slice(0, 64) || null;

  const items = sanitizeItems(body.items);

  if (!userId || !customerName || !phone || items.length === 0) {
    return Response.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const total = computeTotal(items); // цены считаем только на сервере
  if (total <= 0) {
    return Response.json({ ok: false, error: "empty_total" }, { status: 422 });
  }

  const stored = items.map((item) => {
    const product = getProduct(item.id)!;
    return { id: product.id, name: product.name, price: product.price, qty: item.qty };
  });

  try {
    const [row] = await db
      .insert(orders)
      .values({
        userId,
        username,
        customerName,
        phone,
        comment: comment || null,
        delivery,
        items: stored,
        total,
      })
      .returning({ id: orders.id, createdAt: orders.createdAt, total: orders.total });

    // уведомляем в Telegram; ждём максимум 2.5с, чтобы не задерживать клиента
    await Promise.race([
      notifyAboutOrder({
        id: row.id,
        customerName,
        phone,
        comment: comment || null,
        username,
        items: stored,
        total,
        userId,
      }).catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);

    return Response.json({ ok: true, order: row }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}
