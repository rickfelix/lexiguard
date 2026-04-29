import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="grid gap-16 py-16 lg:py-24 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="lg:col-span-2 -mb-4">
          <h1 className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-tight text-brand-primary -ml-1">
            LexiGuard.
          </h1>
        </div>
        <div className="max-w-[55ch]">
          <p className="font-serif text-3xl sm:text-4xl text-brand-primary mb-6">
            Finally, Legal Contracts Built for Developers.
          </p>
          <p className="text-base sm:text-lg text-brand-text mb-10">
            LexiGuard's AI analyzes your SOWs, protects your IP, and helps you
            stop wasting billable hours on confusing legalese.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center bg-brand-primary text-white font-semibold px-12 py-5 no-underline transition-transform hover:-translate-y-1"
          >
            Analyze Contract Free
          </Link>
          <p className="mt-4 text-sm text-brand-text/70">
            No signup required. Plain-text contracts (.txt, .md) or pasted text.
          </p>
        </div>
        <div className="hidden lg:block translate-y-20 aspect-[4/5] bg-brand-primary/5 border border-brand-primary/10 flex items-end p-10">
          <div className="text-brand-primary font-serif text-2xl leading-snug">
            "LexiGuard turned a 40-page Master Services Agreement into a 5-minute
            read. I knew exactly what I was signing."
            <p className="mt-6 text-sm font-sans not-italic text-brand-text/70">
              — Devan, Lead Developer
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="grid gap-16 lg:grid-cols-[300px_1fr] py-20 border-t border-brand-primary/10"
      >
        <aside>
          <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
            Core Capabilities
          </span>
          <h2 className="font-serif text-4xl text-brand-primary leading-tight">
            Intelligence for the builder economy.
          </h2>
        </aside>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-brand-primary/10 border border-brand-primary/10">
          <FeatureCard
            title="Plain Language AI"
            body="Our specialized AI translates dense MSAs, SOWs, and client agreements into clear English so you understand every clause before you sign."
          />
          <FeatureCard
            title="Risk Forensics"
            body="Specialized analysis for software contracts. We flag predatory IP clauses, vague scope, and weak payment terms instantly."
          />
          <FeatureCard
            title="Built for Devs"
            body="Engineered around the contracts freelance developers actually sign — IP, acceptance criteria, scope, and liability."
          />
          <FeatureCard
            title="Free to Try"
            body="Analyze your first software contract free. No signup, no credit card. Just upload and see the results."
            invert
          />
        </div>
      </section>

      <section
        id="solutions"
        className="grid gap-20 lg:grid-cols-2 items-center py-20 border-t border-brand-primary/10"
      >
        <div className="aspect-[4/5] bg-brand-primary/5 border border-brand-primary/10 flex items-end p-10">
          <p className="font-serif text-3xl text-brand-primary leading-snug">
            Stop signing contracts with your fingers crossed.
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
            Empowerment
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-10">
            You code with precision. Now sign with it.
          </h2>
          <p className="text-base sm:text-lg text-brand-text mb-10">
            Freelancing shouldn't feel like a legal gamble. LexiGuard gives you
            the expertise of a personal counsel at a fraction of the cost,
            built specifically for the needs of independent creators.
          </p>
          <div className="bg-brand-accent p-12">
            <p className="font-semibold text-brand-primary text-lg">
              Vague scope clauses lead to endless revisions. Weak IP terms put
              your code at risk. LexiGuard flags both before you sign.
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-20 border-t border-brand-primary/10 text-center"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
          Get started
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-6 text-brand-primary">
          Analyze your first contract free.
        </h2>
        <p className="max-w-2xl mx-auto text-base sm:text-lg mb-12">
          Upload a .txt or .md file, or paste contract text. We'll flag IP,
          scope, and payment risks and translate the legalese into plain
          English in under a minute.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center bg-brand-primary text-white font-semibold px-12 py-5 no-underline transition-transform hover:-translate-y-1"
        >
          Analyze Contract Free
        </Link>
      </section>
    </>
  );
}

function FeatureCard({
  title,
  body,
  invert,
}: {
  title: string;
  body: string;
  invert?: boolean;
}) {
  return (
    <article
      className={
        invert
          ? "bg-brand-primary text-white p-12"
          : "bg-white p-12 transition-colors hover:bg-brand-bg"
      }
    >
      <div
        className="w-12 h-0.5 mb-8"
        style={{
          background: invert ? "#FBBF24" : "#FBBF24",
        }}
      />
      <h3
        className={
          "font-serif text-2xl mb-6 " +
          (invert ? "text-white" : "text-brand-primary")
        }
      >
        {title}
      </h3>
      <p
        className={
          "max-w-[35ch] text-sm sm:text-base " +
          (invert ? "text-white/80" : "text-brand-text")
        }
      >
        {body}
      </p>
    </article>
  );
}
