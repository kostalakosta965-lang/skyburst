import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export interface StoredOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  comment: text("comment"),
  delivery: varchar("delivery", { length: 24 }).notNull().default("pickup"),
  items: jsonb("items").$type<StoredOrderItem[]>().notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
