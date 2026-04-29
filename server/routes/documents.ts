import { Router, type Request, type Response } from "express";
import multer from "multer";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { documents, analysisResults } from "../schema";
import { runAnalysis } from "../services/ai";

export const documentsRouter = Router();

const MAX_BYTES = 1_000_000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
});

function getUserId(req: Request): string {
  const userId = res_locals_userId(req);
  if (!userId) {
    throw new Error("Anonymous user id missing");
  }
  return userId;
}

function res_locals_userId(req: Request): string | undefined {
  return (req as Request & { userId?: string }).userId;
}

function uploadSingleFile(req: Request, res: Response, next: (err?: unknown) => void) {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      const code = (err as { code?: string }).code;
      if (code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "File is too large. The maximum size is 1 MB.",
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
  async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);

      let title = "";
      let contentText = "";
      let source: "file" | "paste" = "paste";

      if (req.file) {
        source = "file";
        const buffer = req.file.buffer;
        contentText = buffer.toString("utf8").trim();
        title =
          (typeof req.body?.title === "string" && req.body.title.trim()) ||
          req.file.originalname ||
          "Untitled contract";
      } else if (
        typeof req.body?.text === "string" &&
        req.body.text.trim().length > 0
      ) {
        source = "paste";
        contentText = req.body.text.trim();
        title =
          (typeof req.body?.title === "string" && req.body.title.trim()) ||
          "Pasted contract";
      } else {
        return res
          .status(400)
          .json({ error: "Provide a 'file' upload or 'text' field." });
      }

      if (contentText.length < 50) {
        return res
          .status(400)
          .json({
            error:
              "Contract text is too short to analyze. Paste at least a few sentences.",
          });
      }
      if (contentText.length > MAX_BYTES) {
        return res
          .status(413)
          .json({ error: "Contract text exceeds the 1 MB limit." });
      }

      const [doc] = await db
        .insert(documents)
        .values({
          userId,
          title,
          source,
          contentText,
          charCount: contentText.length,
          status: "pending",
        })
        .returning();

      // Fire-and-forget AI analysis
      void runAnalysis(doc.id).catch((err) => {
        console.error("[ai] background analysis crashed:", err);
      });

      return res.status(201).json({
        id: doc.id,
        status: doc.status,
        title: doc.title,
        charCount: doc.charCount,
      });
    } catch (err) {
      console.error("[documents] create failed:", err);
      return res.status(500).json({ error: "Failed to create document." });
    }
  }
);

documentsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const [doc] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, req.params.id), eq(documents.userId, userId)))
      .limit(1);

    if (!doc) return res.status(404).json({ error: "Document not found." });

    return res.json({
      id: doc.id,
      title: doc.title,
      source: doc.source,
      charCount: doc.charCount,
      status: doc.status,
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    console.error("[documents] get failed:", err);
    return res.status(500).json({ error: "Failed to load document." });
  }
});

documentsRouter.get("/:id/analysis", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const [doc] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, req.params.id), eq(documents.userId, userId)))
      .limit(1);

    if (!doc) return res.status(404).json({ error: "Document not found." });

    if (doc.status === "failed") {
      return res
        .status(409)
        .json({ status: "failed", errorMessage: doc.errorMessage });
    }
    if (doc.status !== "ready") {
      return res.status(202).json({ status: doc.status });
    }

    const [analysis] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.documentId, doc.id))
      .orderBy(analysisResults.createdAt)
      .limit(1);

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
        createdAt: doc.createdAt,
      },
      analysis: {
        id: analysis.id,
        summary: analysis.summary,
        risks: analysis.risks,
        translations: analysis.translations,
        modelUsed: analysis.modelUsed,
        createdAt: analysis.createdAt,
      },
    });
  } catch (err) {
    console.error("[documents] analysis fetch failed:", err);
    return res.status(500).json({ error: "Failed to load analysis." });
  }
});
