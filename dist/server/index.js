var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

// server/middleware/anonymousUser.ts
import { eq } from "drizzle-orm";

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// server/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analysisResults: () => analysisResults,
  documents: () => documents,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  jsonb,
  integer
} from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  source: varchar("source", { length: 20 }).notNull(),
  contentText: text("content_text").notNull(),
  charCount: integer("char_count").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
var analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  summary: text("summary"),
  risks: jsonb("risks").notNull().$type().default([]),
  translations: jsonb("translations").notNull().$type().default([]),
  rawResponse: jsonb("raw_response"),
  modelUsed: varchar("model_used", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
var queryClient = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  prepare: false
});
var db = drizzle(queryClient, { schema: schema_exports });

// server/middleware/anonymousUser.ts
var COOKIE_NAME = "lg_uid";
var ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1e3;
async function anonymousUser(req, res, next) {
  try {
    const existing = req.cookies?.[COOKIE_NAME];
    if (existing) {
      const [row] = await db.select({ id: users.id }).from(users).where(eq(users.id, existing)).limit(1);
      if (row) {
        req.userId = row.id;
        return next();
      }
    }
    const [created] = await db.insert(users).values({}).returning();
    req.userId = created.id;
    res.cookie(COOKIE_NAME, created.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_MS,
      path: "/"
    });
    next();
  } catch (err) {
    console.error("[anonymousUser] failed:", err);
    next(err);
  }
}

// server/routes/documents.ts
import { Router } from "express";
import multer from "multer";
import { eq as eq3, and } from "drizzle-orm";

// server/services/ai.ts
import OpenAI from "openai";
import { eq as eq2 } from "drizzle-orm";
var apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
var baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
if (!apiKey) {
  throw new Error("AI_INTEGRATIONS_OPENAI_API_KEY is not set");
}
var openai = new OpenAI({ apiKey, baseURL });
var MODEL = "gpt-4o-mini";
var SYSTEM_PROMPT = `You are LexiGuard, a legal AI assistant that reviews software development contracts for freelance developers (target persona: "Devan the Developer"). Your job is to:

1. Identify risks the freelancer should be aware of, focusing on Intellectual Property (IP), scope of work / scope creep, payment terms, acceptance criteria, liability/indemnification, and termination.
2. Translate dense or ambiguous legal clauses into plain English a developer can quickly understand.
3. Write a one-paragraph executive summary of the contract from the freelancer's point of view.

Always respond with STRICT JSON matching this schema (no extra prose):
{
  "summary": string,
  "risks": [
    {
      "title": string,           // short headline of the risk (5-10 words)
      "category": "IP" | "Scope" | "Payment" | "Liability" | "Termination" | "Acceptance" | "Other",
      "severity": "low" | "medium" | "high",
      "explanation": string,     // 1-3 sentences for a non-lawyer
      "clauseExcerpt": string    // a short verbatim excerpt from the contract (optional but preferred)
    }
  ],
  "translations": [
    {
      "clauseTitle": string,     // short label e.g. "Indemnification clause"
      "original": string,        // verbatim or near-verbatim excerpt from the contract
      "plainLanguage": string    // a plain-English rewrite
    }
  ]
}

Rules:
- Return at least 1 risk and at least 1 translation if the document looks like any kind of contract.
- If the document is clearly NOT a contract or is empty/garbage, set summary to "This does not appear to be a contract." and return empty arrays.
- Be concrete. Reference the freelancer ("you") in explanations.
- Cap risks at 8 and translations at 6.`;
var MAX_INPUT_CHARS = 6e4;
async function runAnalysis(documentId) {
  const [doc] = await db.select().from(documents).where(eq2(documents.id, documentId)).limit(1);
  if (!doc) {
    return;
  }
  await db.update(documents).set({ status: "processing", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(documents.id, documentId));
  try {
    const truncated = doc.contentText.slice(0, MAX_INPUT_CHARS);
    const wasTruncated = doc.contentText.length > MAX_INPUT_CHARS;
    const userPrompt = `Contract title: ${doc.title}${wasTruncated ? "\n[Note: contract truncated to first " + MAX_INPUT_CHARS + " characters for analysis]" : ""}

CONTRACT TEXT:
"""
${truncated}
"""`;
    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ]
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from AI");
    }
    const parsed = parseAiOutput(raw);
    await db.insert(analysisResults).values({
      documentId: doc.id,
      userId: doc.userId,
      summary: parsed.summary,
      risks: parsed.risks,
      translations: parsed.translations,
      rawResponse: completion,
      modelUsed: MODEL
    });
    await db.update(documents).set({ status: "ready", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(documents.id, doc.id));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[ai] analysis failed for document ${doc.id}:`, detail);
    let userMessage = "We could not analyze this contract. Please try again in a moment.";
    if (detail === "AI returned invalid JSON" || detail === "AI returned non-object JSON") {
      userMessage = "The analysis came back in an unexpected format. Please try again.";
    } else if (detail === "Empty response from AI") {
      userMessage = "The analysis service returned an empty response. Please try again.";
    }
    await db.update(documents).set({
      status: "failed",
      errorMessage: userMessage,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(documents.id, doc.id));
  }
}
function parseAiOutput(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("AI returned non-object JSON");
  }
  const obj = parsed;
  const summary = typeof obj.summary === "string" ? obj.summary : "(no summary provided)";
  const risks = Array.isArray(obj.risks) ? obj.risks.map((r) => normalizeRisk(r)).filter((r) => r !== null).slice(0, 8) : [];
  const translations = Array.isArray(obj.translations) ? obj.translations.map((t) => normalizeTranslation(t)).filter((t) => t !== null).slice(0, 6) : [];
  return { summary, risks, translations };
}
function normalizeRisk(raw) {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw;
  if (typeof r.title !== "string" || typeof r.explanation !== "string") {
    return null;
  }
  const severity = r.severity === "low" || r.severity === "medium" || r.severity === "high" ? r.severity : "medium";
  return {
    title: r.title,
    category: typeof r.category === "string" ? r.category : "Other",
    severity,
    explanation: r.explanation,
    clauseExcerpt: typeof r.clauseExcerpt === "string" && r.clauseExcerpt.length > 0 ? r.clauseExcerpt : void 0
  };
}
function normalizeTranslation(raw) {
  if (typeof raw !== "object" || raw === null) return null;
  const t = raw;
  if (typeof t.clauseTitle !== "string" || typeof t.original !== "string" || typeof t.plainLanguage !== "string") {
    return null;
  }
  return {
    clauseTitle: t.clauseTitle,
    original: t.original,
    plainLanguage: t.plainLanguage
  };
}

// server/routes/documents.ts
var documentsRouter = Router();
var MAX_BYTES = 1e6;
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES }
});
function getUserId(req) {
  const userId = res_locals_userId(req);
  if (!userId) {
    throw new Error("Anonymous user id missing");
  }
  return userId;
}
function res_locals_userId(req) {
  return req.userId;
}
function uploadSingleFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const code = err.code;
      if (code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "File is too large. The maximum size is 1 MB."
        });
      }
      console.error("[documents] upload failed:", err);
      return res.status(400).json({ error: "Could not read uploaded file." });
    }
    next();
  });
}
documentsRouter.post(
  "/",
  uploadSingleFile,
  async (req, res) => {
    try {
      const userId = getUserId(req);
      let title = "";
      let contentText = "";
      let source = "paste";
      if (req.file) {
        source = "file";
        const buffer = req.file.buffer;
        contentText = buffer.toString("utf8").trim();
        title = typeof req.body?.title === "string" && req.body.title.trim() || req.file.originalname || "Untitled contract";
      } else if (typeof req.body?.text === "string" && req.body.text.trim().length > 0) {
        source = "paste";
        contentText = req.body.text.trim();
        title = typeof req.body?.title === "string" && req.body.title.trim() || "Pasted contract";
      } else {
        return res.status(400).json({ error: "Provide a 'file' upload or 'text' field." });
      }
      if (contentText.length < 50) {
        return res.status(400).json({
          error: "Contract text is too short to analyze. Paste at least a few sentences."
        });
      }
      if (contentText.length > MAX_BYTES) {
        return res.status(413).json({ error: "Contract text exceeds the 1 MB limit." });
      }
      const [doc] = await db.insert(documents).values({
        userId,
        title,
        source,
        contentText,
        charCount: contentText.length,
        status: "pending"
      }).returning();
      void runAnalysis(doc.id).catch((err) => {
        console.error("[ai] background analysis crashed:", err);
      });
      return res.status(201).json({
        id: doc.id,
        status: doc.status,
        title: doc.title,
        charCount: doc.charCount
      });
    } catch (err) {
      console.error("[documents] create failed:", err);
      return res.status(500).json({ error: "Failed to create document." });
    }
  }
);
documentsRouter.get("/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const [doc] = await db.select().from(documents).where(and(eq3(documents.id, req.params.id), eq3(documents.userId, userId))).limit(1);
    if (!doc) return res.status(404).json({ error: "Document not found." });
    return res.json({
      id: doc.id,
      title: doc.title,
      source: doc.source,
      charCount: doc.charCount,
      status: doc.status,
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  } catch (err) {
    console.error("[documents] get failed:", err);
    return res.status(500).json({ error: "Failed to load document." });
  }
});
documentsRouter.get("/:id/analysis", async (req, res) => {
  try {
    const userId = getUserId(req);
    const [doc] = await db.select().from(documents).where(and(eq3(documents.id, req.params.id), eq3(documents.userId, userId))).limit(1);
    if (!doc) return res.status(404).json({ error: "Document not found." });
    if (doc.status === "failed") {
      return res.status(409).json({ status: "failed", errorMessage: doc.errorMessage });
    }
    if (doc.status !== "ready") {
      return res.status(202).json({ status: doc.status });
    }
    const [analysis] = await db.select().from(analysisResults).where(eq3(analysisResults.documentId, doc.id)).orderBy(analysisResults.createdAt).limit(1);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis missing for document." });
    }
    return res.json({
      status: "ready",
      document: {
        id: doc.id,
        title: doc.title,
        source: doc.source,
        charCount: doc.charCount,
        createdAt: doc.createdAt
      },
      analysis: {
        id: analysis.id,
        summary: analysis.summary,
        risks: analysis.risks,
        translations: analysis.translations,
        modelUsed: analysis.modelUsed,
        createdAt: analysis.createdAt
      }
    });
  } catch (err) {
    console.error("[documents] analysis fetch failed:", err);
    return res.status(500).json({ error: "Failed to load analysis." });
  }
});

// server/index.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var PORT = Number(process.env.PORT ?? 5e3);
var isProd = process.env.NODE_ENV === "production";
async function main() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/documents", anonymousUser, documentsRouter);
  if (isProd) {
    const clientDist = path.resolve(__dirname, "../client");
    if (!fs.existsSync(clientDist)) {
      throw new Error(
        `Client build not found at ${clientDist}. Run \`npm run build\` first.`
      );
    }
    app.use(
      express.static(clientDist, {
        index: false,
        maxAge: "1h",
        setHeaders: (res, p) => {
          if (p.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        }
      })
    );
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: process.cwd(),
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        allowedHosts: true,
        hmr: { port: 5051 }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[server] LexiGuard listening on http://0.0.0.0:${PORT} (${isProd ? "production" : "development"})`
    );
  });
}
main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
