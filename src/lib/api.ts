export interface RiskFinding {
  title: string;
  category: string;
  severity: "low" | "medium" | "high";
  explanation: string;
  clauseExcerpt?: string;
}

export interface TranslationFinding {
  clauseTitle: string;
  original: string;
  plainLanguage: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  source: "file" | "paste";
  charCount: number;
  status: "pending" | "processing" | "ready" | "failed";
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisPayload {
  status: "ready";
  document: {
    id: string;
    title: string;
    source: "file" | "paste";
    charCount: number;
    createdAt: string;
  };
  analysis: {
    id: string;
    summary: string | null;
    risks: RiskFinding[];
    translations: TranslationFinding[];
    modelUsed: string | null;
    createdAt: string;
  };
}

export interface PendingPayload {
  status: "pending" | "processing";
}

export interface FailedPayload {
  status: "failed";
  errorMessage: string | null;
}

export type AnalysisFetchResult =
  | AnalysisPayload
  | PendingPayload
  | FailedPayload;

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {}
  return `Request failed (${res.status})`;
}

export async function createDocument(input: {
  file?: File;
  text?: string;
  title?: string;
}): Promise<{ id: string; status: string; title: string; charCount: number }> {
  let body: BodyInit;
  let headers: HeadersInit | undefined;

  if (input.file) {
    const fd = new FormData();
    fd.append("file", input.file);
    if (input.title) fd.append("title", input.title);
    body = fd;
  } else {
    body = JSON.stringify({ text: input.text ?? "", title: input.title ?? "" });
    headers = { "Content-Type": "application/json" };
  }

  const res = await fetch("/api/documents", {
    method: "POST",
    body,
    headers,
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as {
    id: string;
    status: string;
    title: string;
    charCount: number;
  };
}

export async function getDocument(id: string): Promise<DocumentSummary> {
  const res = await fetch(`/api/documents/${id}`, {
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as DocumentSummary;
}

export async function getAnalysis(id: string): Promise<AnalysisFetchResult> {
  const res = await fetch(`/api/documents/${id}/analysis`, {
    credentials: "same-origin",
  });
  if (res.status === 202) {
    return (await res.json()) as PendingPayload;
  }
  if (res.status === 409) {
    return (await res.json()) as FailedPayload;
  }
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as AnalysisPayload;
}
