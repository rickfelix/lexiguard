import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  source: varchar("source", { length: 20 }).notNull(),
  contentText: text("content_text").notNull(),
  charCount: integer("char_count").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  summary: text("summary"),
  risks: jsonb("risks").notNull().$type<RiskFinding[]>().default([]),
  translations: jsonb("translations")
    .notNull()
    .$type<TranslationFinding[]>()
    .default([]),
  rawResponse: jsonb("raw_response"),
  modelUsed: varchar("model_used", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type RiskSeverity = "low" | "medium" | "high";

export interface RiskFinding {
  title: string;
  category: string;
  severity: RiskSeverity;
  explanation: string;
  clauseExcerpt?: string;
}

export interface TranslationFinding {
  clauseTitle: string;
  original: string;
  plainLanguage: string;
}

export type DocumentStatus = "pending" | "processing" | "ready" | "failed";

export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type AnalysisResult = typeof analysisResults.$inferSelect;
