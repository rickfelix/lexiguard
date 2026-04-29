import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAnalysis,
  type AnalysisFetchResult,
  type AnalysisPayload,
  type RiskFinding,
  type TranslationFinding,
} from "../lib/api";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 90; // ~3 minutes

export default function Document() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<AnalysisFetchResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pollsRef = useRef(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    pollsRef.current = 0;

    async function poll() {
      while (!cancelled) {
        try {
          const result = await getAnalysis(id!);
          if (cancelled) return;
          setState(result);
          if (result.status === "ready" || result.status === "failed") {
            return;
          }
        } catch (err) {
          if (cancelled) return;
          setLoadError(
            err instanceof Error ? err.message : "Failed to load analysis."
          );
          return;
        }
        pollsRef.current += 1;
        if (pollsRef.current >= MAX_POLLS) {
          if (!cancelled)
            setLoadError("Analysis is taking longer than expected. Please try again.");
          return;
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return <Centered>Missing document id.</Centered>;
  }

  if (loadError) {
    return (
      <Centered>
        <h1 className="font-serif text-3xl text-brand-primary mb-4">
          Something went wrong.
        </h1>
        <p className="mb-8 text-brand-text">{loadError}</p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-8 py-4 no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(29,78,216,0.6)]"
        >
          Try another contract
          <span aria-hidden="true">→</span>
        </Link>
      </Centered>
    );
  }

  if (!state) return <Processing />;
  if (state.status === "pending") return <Processing />;
  if (state.status === "processing") return <Processing />;

  if (state.status === "failed") {
    return (
      <Centered>
        <span className="text-xs uppercase tracking-[0.2em] text-red-700 font-semibold block mb-6">
          Analysis failed
        </span>
        <h1 className="font-serif text-3xl text-brand-primary mb-4">
          We couldn't analyze that contract.
        </h1>
        <p className="mb-8 text-brand-text">
          {state.errorMessage ?? "An unknown error occurred."}
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-8 py-4 no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(29,78,216,0.6)]"
        >
          Try another contract
          <span aria-hidden="true">→</span>
        </Link>
      </Centered>
    );
  }

  if (state.status === "ready") {
    return <Results data={state} />;
  }

  return <Processing />;
}

function Processing() {
  return (
    <section className="py-32 max-w-2xl mx-auto text-center lg-fade-up">
      <div className="inline-flex items-center justify-center gap-2 mb-10">
        <span
          className="w-3 h-3 bg-brand-primary lg-pulse-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="w-3 h-3 bg-brand-primary lg-pulse-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-3 h-3 bg-brand-primary lg-pulse-dot"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-4">
        Step 2 of 2
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl text-brand-primary mb-4">
        Analyzing your contract…
      </h1>
      <p className="text-brand-text leading-relaxed max-w-md mx-auto">
        LexiGuard's AI is reading your contract, flagging risks, and
        translating the legalese. This usually takes 15–60 seconds.
      </p>

      <ul className="mt-12 inline-flex flex-col gap-3 text-left text-sm text-brand-text/70">
        <ProcessingStep label="Parsing contract structure" />
        <ProcessingStep label="Identifying clauses by category" />
        <ProcessingStep label="Translating legalese into plain English" />
      </ul>
    </section>
  );
}

function ProcessingStep({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 bg-brand-accent flex-shrink-0" />
      <span>{label}</span>
    </li>
  );
}

function Results({ data }: { data: AnalysisPayload }) {
  const { document: doc, analysis } = data;

  const counts = {
    high: analysis.risks.filter((r) => r.severity === "high").length,
    medium: analysis.risks.filter((r) => r.severity === "medium").length,
    low: analysis.risks.filter((r) => r.severity === "low").length,
  };

  return (
    <section className="py-12 max-w-5xl mx-auto lg-fade-up">
      <div className="mb-12">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold mb-4">
          <span className="w-1.5 h-1.5 bg-brand-accent" />
          Analysis complete
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-primary leading-tight mb-3 break-words">
          {doc.title}
        </h1>
        <p className="text-sm text-brand-text/60 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{doc.charCount.toLocaleString()} characters</span>
          <span aria-hidden="true">·</span>
          <span>analyzed {new Date(analysis.createdAt).toLocaleString()}</span>
        </p>
      </div>

      {analysis.summary && (
        <div className="bg-brand-accent p-8 sm:p-10 mb-16 relative">
          <span className="absolute -top-3 left-8 text-[10px] uppercase tracking-[0.25em] font-bold bg-brand-primary text-white px-3 py-1">
            Executive summary
          </span>
          <p className="text-brand-primary text-lg sm:text-xl font-serif leading-snug">
            {analysis.summary}
          </p>
        </div>
      )}

      <section className="mb-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-brand-primary/10">
          <div>
            <h2 className="font-serif text-3xl text-brand-primary mb-2">
              Flagged risks
            </h2>
            <p className="text-brand-text/60 text-sm">
              {analysis.risks.length === 0
                ? "No specific risks were flagged."
                : `${analysis.risks.length} risk${analysis.risks.length === 1 ? "" : "s"} identified.`}
            </p>
          </div>
          {analysis.risks.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {counts.high > 0 && (
                <SeverityChip severity="high" count={counts.high} />
              )}
              {counts.medium > 0 && (
                <SeverityChip severity="medium" count={counts.medium} />
              )}
              {counts.low > 0 && (
                <SeverityChip severity="low" count={counts.low} />
              )}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {analysis.risks.length === 0 ? (
            <EmptyState message="No risks were flagged in this contract." />
          ) : (
            analysis.risks.map((risk, i) => <RiskCard key={i} risk={risk} />)
          )}
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-brand-primary/10">
          <div>
            <h2 className="font-serif text-3xl text-brand-primary mb-2">
              Plain-language translations
            </h2>
            <p className="text-brand-text/60 text-sm">
              {analysis.translations.length === 0
                ? "No translations were generated."
                : `${analysis.translations.length} clause${analysis.translations.length === 1 ? "" : "s"} translated.`}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {analysis.translations.length === 0 ? (
            <EmptyState message="No clauses required translation." />
          ) : (
            analysis.translations.map((t, i) => (
              <TranslationCard key={i} translation={t} />
            ))
          )}
        </div>
      </section>

      <div className="border-t border-brand-primary/10 pt-12 flex flex-wrap gap-4">
        <Link
          to="/upload"
          className="group inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-8 py-4 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(29,78,216,0.6)]"
        >
          Analyze another contract
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center text-brand-primary font-semibold px-8 py-4 no-underline border border-brand-primary/30 hover:bg-brand-primary/5 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

const SEVERITY_STYLES: Record<RiskFinding["severity"], string> = {
  high: "bg-red-100 text-red-900 border-red-300",
  medium: "bg-amber-100 text-amber-900 border-amber-300",
  low: "bg-emerald-100 text-emerald-900 border-emerald-300",
};

const SEVERITY_DOT: Record<RiskFinding["severity"], string> = {
  high: "bg-red-600",
  medium: "bg-amber-500",
  low: "bg-emerald-600",
};

const SEVERITY_BORDER: Record<RiskFinding["severity"], string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-emerald-500",
};

function SeverityChip({
  severity,
  count,
}: {
  severity: RiskFinding["severity"];
  count: number;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 border " +
        SEVERITY_STYLES[severity]
      }
    >
      <span className={"w-1.5 h-1.5 " + SEVERITY_DOT[severity]} />
      <span className="uppercase font-semibold tracking-wider">
        {count} {severity}
      </span>
    </span>
  );
}

function RiskCard({ risk }: { risk: RiskFinding }) {
  return (
    <article
      className={
        "bg-white border border-brand-primary/10 border-l-4 p-7 sm:p-8 transition-all duration-200 hover:shadow-[0_12px_30px_-18px_rgba(29,78,216,0.4)] " +
        SEVERITY_BORDER[risk.severity]
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
            {risk.category}
          </span>
          <h3 className="font-serif text-2xl text-brand-text mt-1 leading-snug break-words">
            {risk.title}
          </h3>
        </div>
        <span
          className={
            "inline-flex items-center gap-2 uppercase text-xs font-semibold px-3 py-1.5 border flex-shrink-0 " +
            SEVERITY_STYLES[risk.severity]
          }
        >
          <span className={"w-1.5 h-1.5 " + SEVERITY_DOT[risk.severity]} />
          {risk.severity} risk
        </span>
      </div>
      <p className="text-brand-text leading-relaxed">{risk.explanation}</p>
      {risk.clauseExcerpt && (
        <blockquote className="mt-6 border-l-4 border-brand-accent pl-4 text-sm italic text-brand-text/80 leading-relaxed">
          &ldquo;{risk.clauseExcerpt}&rdquo;
        </blockquote>
      )}
    </article>
  );
}

function TranslationCard({ translation }: { translation: TranslationFinding }) {
  return (
    <article className="bg-white border border-brand-primary/10 p-7 sm:p-8 transition-all duration-200 hover:shadow-[0_12px_30px_-18px_rgba(29,78,216,0.4)]">
      <h3 className="font-serif text-xl text-brand-primary mb-6 break-words">
        {translation.clauseTitle}
      </h3>
      <div className="grid gap-6 md:grid-cols-2 md:divide-x md:divide-brand-primary/10">
        <div className="md:pr-6">
          <span className="text-xs uppercase tracking-wider text-brand-text/60 font-semibold block mb-3">
            Original
          </span>
          <p className="text-sm text-brand-text/80 leading-relaxed font-mono">
            {translation.original}
          </p>
        </div>
        <div className="md:pl-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-brand-primary font-semibold mb-3">
            <span className="w-1.5 h-1.5 bg-brand-accent" />
            Plain language
          </span>
          <p className="text-sm text-brand-text leading-relaxed">
            {translation.plainLanguage}
          </p>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-dashed border-brand-primary/20 p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/5 mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="text-brand-primary/60"
        >
          <path
            d="M5 12L10 17L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </div>
      <p className="text-sm text-brand-text/70">{message}</p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-32 max-w-2xl mx-auto text-center lg-fade-up">
      {children}
    </section>
  );
}
