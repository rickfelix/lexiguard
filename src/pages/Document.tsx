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
          className="inline-flex items-center bg-brand-primary text-white font-semibold px-8 py-4 no-underline"
        >
          Try another contract
        </Link>
      </Centered>
    );
  }

  if (!state || state.status === "pending" || state.status === "processing") {
    return <Processing />;
  }

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
          className="inline-flex items-center bg-brand-primary text-white font-semibold px-8 py-4 no-underline"
        >
          Try another contract
        </Link>
      </Centered>
    );
  }

  return <Results data={state} />;
}

function Processing() {
  return (
    <section className="py-32 max-w-2xl mx-auto text-center">
      <div className="inline-block w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-8" />
      <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-4">
        Step 2 of 2
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl text-brand-primary mb-4">
        Analyzing your contract…
      </h1>
      <p className="text-brand-text">
        LexiGuard's AI is reading your contract, flagging risks, and
        translating the legalese. This usually takes 15–60 seconds.
      </p>
    </section>
  );
}

function Results({ data }: { data: AnalysisPayload }) {
  const { document: doc, analysis } = data;

  return (
    <section className="py-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-4">
          Analysis complete
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-primary leading-tight mb-2">
          {doc.title}
        </h1>
        <p className="text-sm text-brand-text/70">
          {doc.charCount.toLocaleString()} characters · analyzed{" "}
          {new Date(analysis.createdAt).toLocaleString()}
        </p>
      </div>

      {analysis.summary && (
        <div className="bg-brand-accent p-10 mb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4 text-brand-primary">
            Executive summary
          </h2>
          <p className="text-brand-primary text-lg font-serif leading-snug">
            {analysis.summary}
          </p>
        </div>
      )}

      <section className="mb-20">
        <h2 className="font-serif text-3xl text-brand-primary mb-2">
          Flagged risks
        </h2>
        <p className="text-brand-text/70 text-sm mb-8">
          {analysis.risks.length === 0
            ? "No specific risks were flagged."
            : `${analysis.risks.length} risk${analysis.risks.length === 1 ? "" : "s"} identified.`}
        </p>
        <div className="space-y-4">
          {analysis.risks.map((risk, i) => (
            <RiskCard key={i} risk={risk} />
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-serif text-3xl text-brand-primary mb-2">
          Plain-language translations
        </h2>
        <p className="text-brand-text/70 text-sm mb-8">
          {analysis.translations.length === 0
            ? "No translations were generated."
            : `${analysis.translations.length} clause${analysis.translations.length === 1 ? "" : "s"} translated.`}
        </p>
        <div className="space-y-6">
          {analysis.translations.map((t, i) => (
            <TranslationCard key={i} translation={t} />
          ))}
        </div>
      </section>

      <div className="border-t border-brand-primary/10 pt-12 flex flex-wrap gap-4">
        <Link
          to="/upload"
          className="inline-flex items-center bg-brand-primary text-white font-semibold px-8 py-4 no-underline"
        >
          Analyze another contract
        </Link>
        <Link
          to="/"
          className="inline-flex items-center text-brand-primary font-semibold px-8 py-4 no-underline border border-brand-primary/30 hover:bg-brand-primary/5"
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

function RiskCard({ risk }: { risk: RiskFinding }) {
  return (
    <article className="bg-white border border-brand-primary/10 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
            {risk.category}
          </span>
          <h3 className="font-serif text-2xl text-brand-text mt-1">
            {risk.title}
          </h3>
        </div>
        <span
          className={
            "uppercase text-xs font-semibold px-3 py-1 border " +
            SEVERITY_STYLES[risk.severity]
          }
        >
          {risk.severity} risk
        </span>
      </div>
      <p className="text-brand-text leading-relaxed">{risk.explanation}</p>
      {risk.clauseExcerpt && (
        <blockquote className="mt-6 border-l-4 border-brand-accent pl-4 text-sm italic text-brand-text/80">
          "{risk.clauseExcerpt}"
        </blockquote>
      )}
    </article>
  );
}

function TranslationCard({ translation }: { translation: TranslationFinding }) {
  return (
    <article className="bg-white border border-brand-primary/10 p-8">
      <h3 className="font-serif text-xl text-brand-primary mb-6">
        {translation.clauseTitle}
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-text/60 font-semibold block mb-2">
            Original
          </span>
          <p className="text-sm text-brand-text/80 leading-relaxed font-mono">
            {translation.original}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold block mb-2">
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

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-32 max-w-2xl mx-auto text-center">{children}</section>
  );
}
