import OpenAI from "openai";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { documents, analysisResults } from "../schema";
import type { RiskFinding, TranslationFinding } from "../schema";

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!apiKey) {
  throw new Error("AI_INTEGRATIONS_OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey, baseURL });

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are LexiGuard, a legal AI assistant that reviews software development contracts for freelance developers (target persona: "Devan the Developer"). Your job is to:

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

interface AiOutput {
  summary: string;
  risks: RiskFinding[];
  translations: TranslationFinding[];
}

const MAX_INPUT_CHARS = 60_000;

export async function runAnalysis(documentId: string): Promise<void> {
  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!doc) {
    return;
  }

  await db
    .update(documents)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(documents.id, documentId));

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
        { role: "user", content: userPrompt },
      ],
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
      rawResponse: completion as unknown as object,
      modelUsed: MODEL,
    });

    await db
      .update(documents)
      .set({ status: "ready", updatedAt: new Date() })
      .where(eq(documents.id, doc.id));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[ai] analysis failed for document ${doc.id}:`, detail);

    // Map known internal errors to safe user-facing messages.
    let userMessage = "We could not analyze this contract. Please try again in a moment.";
    if (detail === "AI returned invalid JSON" || detail === "AI returned non-object JSON") {
      userMessage = "The analysis came back in an unexpected format. Please try again.";
    } else if (detail === "Empty response from AI") {
      userMessage = "The analysis service returned an empty response. Please try again.";
    }

    await db
      .update(documents)
      .set({
        status: "failed",
        errorMessage: userMessage,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, doc.id));
  }
}

function parseAiOutput(raw: string): AiOutput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("AI returned non-object JSON");
  }

  const obj = parsed as Record<string, unknown>;

  const summary =
    typeof obj.summary === "string" ? obj.summary : "(no summary provided)";

  const risks = Array.isArray(obj.risks)
    ? obj.risks
        .map((r) => normalizeRisk(r))
        .filter((r): r is RiskFinding => r !== null)
        .slice(0, 8)
    : [];

  const translations = Array.isArray(obj.translations)
    ? obj.translations
        .map((t) => normalizeTranslation(t))
        .filter((t): t is TranslationFinding => t !== null)
        .slice(0, 6)
    : [];

  return { summary, risks, translations };
}

function normalizeRisk(raw: unknown): RiskFinding | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.title !== "string" || typeof r.explanation !== "string") {
    return null;
  }
  const severity =
    r.severity === "low" || r.severity === "medium" || r.severity === "high"
      ? r.severity
      : "medium";
  return {
    title: r.title,
    category: typeof r.category === "string" ? r.category : "Other",
    severity,
    explanation: r.explanation,
    clauseExcerpt:
      typeof r.clauseExcerpt === "string" && r.clauseExcerpt.length > 0
        ? r.clauseExcerpt
        : undefined,
  };
}

function normalizeTranslation(raw: unknown): TranslationFinding | null {
  if (typeof raw !== "object" || raw === null) return null;
  const t = raw as Record<string, unknown>;
  if (
    typeof t.clauseTitle !== "string" ||
    typeof t.original !== "string" ||
    typeof t.plainLanguage !== "string"
  ) {
    return null;
  }
  return {
    clauseTitle: t.clauseTitle,
    original: t.original,
    plainLanguage: t.plainLanguage,
  };
}
