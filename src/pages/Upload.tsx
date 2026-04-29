import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../lib/api";

type Mode = "file" | "paste";

const ACCEPTED_EXTENSIONS = [".txt", ".md", ".markdown"];
const MAX_BYTES = 1_000_000;

export default function Upload() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0] ?? null;
    if (f) {
      const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`);
        setFile(null);
        return;
      }
      if (f.size > MAX_BYTES) {
        setError("File is larger than 1 MB.");
        setFile(null);
        return;
      }
    }
    setFile(f);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "file" && !file) {
      setError("Choose a contract file to analyze.");
      return;
    }
    if (mode === "paste" && text.trim().length < 50) {
      setError("Paste at least a few sentences of the contract.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createDocument(
        mode === "file"
          ? { file: file!, title: title || undefined }
          : { text, title: title || undefined }
      );
      navigate(`/documents/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 max-w-3xl mx-auto">
      <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
        Step 1 of 2
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-brand-primary leading-tight mb-4">
        Analyze your contract.
      </h1>
      <p className="text-base sm:text-lg text-brand-text mb-12">
        Upload a plain-text contract or paste it below. We'll flag IP, scope,
        and payment risks and translate the legalese into plain English.
      </p>

      <div className="bg-white border border-brand-primary/10 p-10">
        <div className="flex gap-2 mb-8">
          <ModeButton active={mode === "file"} onClick={() => setMode("file")}>
            Upload file
          </ModeButton>
          <ModeButton
            active={mode === "paste"}
            onClick={() => setMode("paste")}
          >
            Paste text
          </ModeButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-brand-text mb-2">
              Contract title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Corp MSA"
              className="w-full px-4 py-3 border border-brand-primary/20 bg-brand-bg focus:outline-none focus:border-brand-primary"
            />
          </div>

          {mode === "file" ? (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-brand-text mb-2">
                Contract file
              </label>
              <input
                type="file"
                accept=".txt,.md,.markdown,text/plain,text/markdown"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:px-6 file:py-3 file:border-0 file:bg-brand-primary file:text-white file:font-semibold file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-brand-primary/90"
              />
              <p className="mt-2 text-xs text-brand-text/70">
                Accepted: .txt, .md (up to 1 MB). PDF/DOCX coming soon — for
                now, paste the text instead.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-brand-text mb-2">
                Contract text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={14}
                placeholder="Paste the full contract text here..."
                className="w-full px-4 py-3 border border-brand-primary/20 bg-brand-bg focus:outline-none focus:border-brand-primary font-mono text-sm"
              />
              <p className="mt-2 text-xs text-brand-text/70">
                {text.length.toLocaleString()} characters
              </p>
            </div>
          )}

          {error && (
            <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center bg-brand-primary text-white font-semibold px-12 py-4 no-underline transition-transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? "Uploading…" : "Analyze Contract Free"}
          </button>
        </form>
      </div>
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors " +
        (active
          ? "bg-brand-primary text-white"
          : "bg-brand-bg text-brand-text hover:bg-brand-primary/10")
      }
    >
      {children}
    </button>
  );
}
