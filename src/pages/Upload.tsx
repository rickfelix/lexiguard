import { useRef, useState } from "react";
import type { DragEvent, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../lib/api";

type Mode = "file" | "paste";

const ACCEPTED_EXTENSIONS = [".txt", ".md", ".markdown"];
const MAX_BYTES = 1_000_000;

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<Mode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function validateAndSetFile(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
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
    setFile(f);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <section className="py-16 max-w-3xl mx-auto lg-fade-up">
      <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
        Step 1 of 2
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-brand-primary leading-tight mb-4">
        Analyze your contract.
      </h1>
      <p className="text-base sm:text-lg text-brand-text mb-12 leading-relaxed max-w-2xl">
        Upload a plain-text contract or paste it below. We'll flag IP, scope,
        and payment risks and translate the legalese into plain English.
      </p>

      <div className="bg-white border border-brand-primary/10 p-8 sm:p-10 shadow-[0_24px_60px_-40px_rgba(29,78,216,0.35)]">
        {/* Segmented mode toggle */}
        <div
          role="tablist"
          aria-label="Choose input method"
          className="inline-flex p-1 bg-brand-bg border border-brand-primary/10 mb-8"
        >
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
            <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-text/70 mb-2">
              Contract title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Corp MSA"
              className="w-full px-4 py-3 border border-brand-primary/15 bg-brand-bg text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
            />
          </div>

          {mode === "file" ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-text/70 mb-2">
                Contract file
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.markdown,text/plain,text/markdown"
                onChange={handleFileChange}
                className="sr-only"
                id="contract-file-input"
              />

              {file ? (
                <div className="flex items-center justify-between gap-4 border border-brand-primary/15 bg-brand-bg px-5 py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <FileGlyph />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-text truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-brand-text/60 mt-0.5">
                        {formatBytes(file.size)} · ready to analyze
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-xs uppercase tracking-wider font-semibold text-brand-primary hover:text-brand-primary/70 transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="contract-file-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={
                    "block cursor-pointer border-2 border-dashed transition-all duration-200 px-6 py-12 text-center " +
                    (dragOver
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-primary/25 bg-brand-bg hover:border-brand-primary/50 hover:bg-brand-primary/5")
                  }
                >
                  <UploadGlyph />
                  <p className="font-semibold text-brand-primary mt-4">
                    {dragOver
                      ? "Drop your contract here"
                      : "Drag a contract here, or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-brand-text/60">
                    .txt or .md, up to 1 MB
                  </p>
                </label>
              )}

              <p className="mt-3 text-xs text-brand-text/60">
                PDF and DOCX coming soon — for now, paste the text instead.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-text/70 mb-2">
                Contract text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={14}
                placeholder="Paste the full contract text here..."
                className="w-full px-4 py-3 border border-brand-primary/15 bg-brand-bg focus:outline-none focus:border-brand-primary focus:bg-white font-mono text-sm leading-relaxed transition-colors"
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-brand-text/60">
                  {text.length.toLocaleString()} characters
                </span>
                {text.trim().length > 0 && text.trim().length < 50 && (
                  <span className="text-amber-700">
                    Add a few more sentences to analyze
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-900 lg-fade-up"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-10 sm:px-12 py-4 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(29,78,216,0.6)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
          >
            {submitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                Analyze Contract Free
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 " +
        (active
          ? "bg-brand-primary text-white shadow-[0_8px_20px_-10px_rgba(29,78,216,0.55)]"
          : "bg-transparent text-brand-text/70 hover:text-brand-primary")
      }
    >
      {children}
    </button>
  );
}

function UploadGlyph() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="mx-auto text-brand-primary/70"
    >
      <path
        d="M20 26V8M20 8L12 16M20 8L28 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M6 28V32C6 32.5 6.5 33 7 33H33C33.5 33 34 32.5 34 32V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="text-brand-primary flex-shrink-0"
    >
      <path
        d="M8 4H20L26 10V28H8V4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 4V10H26" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 18H22M12 22H22M12 14H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
