import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  plan: text("plan").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const barbershops = pgTable("barbershops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  bookingLink: text("booking_link").notNull(),
  plan: text("plan").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBarbershopSchema = createInsertSchema(barbershops).omit({
  id: true,
  createdAt: true,
  bookingLink: true,
});

export type InsertBarbershop = z.infer<typeof insertBarbershopSchema>;
export type Barbershop = typeof barbershops.$inferSelect;
