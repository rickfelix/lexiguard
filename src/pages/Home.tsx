import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="grid gap-16 py-16 lg:py-24 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="lg:col-span-2 -mb-4">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-primary/70 font-semibold block mb-6">
            Legal Clarity. On Your Terms.
          </span>
          <h1 className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-tight text-brand-primary -ml-1">
            LexiGuard.
          </h1>
        </div>
        <div className="max-w-[55ch] lg-fade-up">
          <p className="font-serif text-3xl sm:text-4xl text-brand-primary mb-6 leading-tight">
            Finally, Legal Contracts Built for Developers.
          </p>
          <p className="text-base sm:text-lg text-brand-text mb-10 leading-relaxed">
            LexiGuard's AI analyzes your SOWs, protects your IP, and helps you
            stop wasting billable hours on confusing legalese.
          </p>
          <Link
            to="/upload"
            className="group inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-10 sm:px-12 py-5 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(29,78,216,0.6)]"
          >
            Analyze Contract Free
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="mt-4 text-sm text-brand-text/70 flex items-center gap-2">
            <CheckGlyph />
            No signup required · Plain-text contracts (.txt, .md) or pasted text
          </p>
        </div>
        <div className="hidden lg:flex translate-y-20 aspect-[4/5] bg-brand-primary/5 border border-brand-primary/10 items-end p-10 relative overflow-hidden">
          <div className="absolute top-8 right-8 w-16 h-1 bg-brand-accent" />
          <div className="absolute top-12 right-8 w-8 h-1 bg-brand-accent/60" />
          <div className="text-brand-primary font-serif text-2xl leading-snug relative">
            <span className="text-brand-accent text-5xl absolute -top-6 -left-2 leading-none select-none">
              &ldquo;
            </span>
            <span className="relative">
              LexiGuard turned a 40-page Master Services Agreement into a
              5-minute read. I knew exactly what I was signing.
            </span>
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
          <p className="mt-6 text-sm text-brand-text/70 leading-relaxed">
            Every clause read, every risk surfaced, every translation written
            for the people doing the building.
          </p>
        </aside>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-brand-primary/10 border border-brand-primary/10">
          <FeatureCard
            number="01"
            title="AI-Powered Analysis"
            body="Upload your SOWs, MSAs, and client agreements to get an instant breakdown of key terms and potential risks."
          />
          <FeatureCard
            number="02"
            title="Plain-Language Translation"
            body="We demystify complex legal jargon, explaining what each clause actually means for you and your business."
          />
          <FeatureCard
            number="03"
            title="Developer-Specific Clause Suggestions"
            body="AI-powered recommendations for clauses covering Intellectual Property, acceptance criteria, payment schedules, and liability limitations."
          />
          <FeatureCard
            number="04"
            title="Risk Scoring"
            body="Every contract gets a simple risk score so you can see at a glance how much exposure you might have."
          />
          <FeatureCard
            number="05"
            title="Secure Document Management"
            body="Keep all your contracts organized and accessible in one secure, centralized place."
          />
          <FeatureCard
            number="06"
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
        <div className="aspect-[4/5] bg-brand-primary/5 border border-brand-primary/10 flex items-end p-10 relative overflow-hidden">
          <div className="absolute top-10 left-10 grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-brand-primary/15"
                style={{
                  opacity: i === 4 ? 1 : undefined,
                  background:
                    i === 4 ? "var(--brand-highlighting-key-insights)" : undefined,
                }}
              />
            ))}
          </div>
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
          <p className="text-base sm:text-lg text-brand-text mb-10 leading-relaxed">
            Freelancing shouldn't feel like a legal gamble. LexiGuard gives you
            the expertise of a personal counsel at a fraction of the cost,
            built specifically for the needs of independent creators.
          </p>
          <div className="bg-brand-accent p-10 sm:p-12 relative">
            <span className="absolute -top-3 left-10 text-[10px] uppercase tracking-[0.25em] font-bold bg-brand-primary text-white px-3 py-1">
              The cost of vague terms
            </span>
            <p className="font-semibold text-brand-primary text-lg leading-relaxed">
              Vague scope clauses lead to endless revisions. Weak IP terms put
              your code at risk. LexiGuard flags both before you sign.
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-20 border-t border-brand-primary/10"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
            Pricing
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-6 text-brand-primary">
            Start free. Upgrade when you need more.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            Analyze your first contracts on the free Starter plan. Pro adds the
            clause suggestion engine. Business unlocks unlimited analyses for
            growing teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-primary/10 border border-brand-primary/10 mb-16">
          <PricingTier
            name="Starter"
            price="Free"
            cadence=""
            tagline="For your first few contracts."
            features={[
              "Plain-language analysis",
              "Risk scoring",
              "A few documents per month",
            ]}
          />
          <PricingTier
            name="Pro"
            price="$45"
            cadence="/month"
            tagline="For working freelancers."
            features={[
              "Everything in Starter",
              "More analyses each month",
              "Clause suggestion engine",
            ]}
            highlighted
          />
          <PricingTier
            name="Business"
            price="Let's talk"
            cadence=""
            tagline="For growing teams."
            features={[
              "Everything in Pro",
              "Unlimited analyses",
              "Team collaboration",
            ]}
          />
        </div>

        <div className="text-center">
          <Link
            to="/upload"
            className="group inline-flex items-center gap-3 bg-brand-primary text-white font-semibold px-12 py-5 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(29,78,216,0.6)]"
          >
            Analyze Contract Free
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="mt-4 text-sm text-brand-text/70">
            No credit card required to try the Starter plan.
          </p>
        </div>
      </section>
    </>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="text-brand-primary flex-shrink-0"
    >
      <path
        d="M2 7.5L5.5 11L12 3.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

function FeatureCard({
  number,
  title,
  body,
  invert,
}: {
  number: string;
  title: string;
  body: string;
  invert?: boolean;
}) {
  return (
    <article
      className={
        "p-10 sm:p-12 transition-all duration-300 group relative " +
        (invert
          ? "bg-brand-primary text-white hover:bg-brand-primary/95"
          : "bg-white hover:bg-brand-bg")
      }
    >
      <div className="flex items-center justify-between mb-8">
        <span
          className={
            "text-xs font-mono tracking-widest " +
            (invert ? "text-white/50" : "text-brand-primary/40")
          }
        >
          {number}
        </span>
        <div
          className={
            "h-0.5 w-12 transition-all duration-300 group-hover:w-20 " +
            (invert ? "bg-brand-accent" : "bg-brand-accent")
          }
        />
      </div>
      <h3
        className={
          "font-serif text-2xl mb-5 leading-snug " +
          (invert ? "text-white" : "text-brand-primary")
        }
      >
        {title}
      </h3>
      <p
        className={
          "max-w-[35ch] text-sm sm:text-base leading-relaxed " +
          (invert ? "text-white/85" : "text-brand-text")
        }
      >
        {body}
      </p>
    </article>
  );
}

function PricingTier({
  name,
  price,
  cadence,
  tagline,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={
        "p-10 flex flex-col relative transition-all duration-300 " +
        (highlighted
          ? "bg-brand-primary text-white shadow-[0_20px_60px_-30px_rgba(29,78,216,0.55)]"
          : "bg-white text-brand-text hover:bg-brand-bg")
      }
    >
      {highlighted && (
        <span className="absolute -top-3 left-10 text-[10px] uppercase tracking-[0.25em] font-bold bg-brand-accent text-brand-primary px-3 py-1">
          Most popular
        </span>
      )}
      <div className="w-12 h-0.5 mb-6 bg-brand-accent" />
      <h3
        className={
          "font-serif text-2xl mb-2 " +
          (highlighted ? "text-white" : "text-brand-primary")
        }
      >
        {name}
      </h3>
      <p
        className={
          "text-sm mb-6 " +
          (highlighted ? "text-white/80" : "text-brand-text/70")
        }
      >
        {tagline}
      </p>
      <div className="mb-8 flex items-baseline">
        <span
          className={
            "font-serif text-4xl sm:text-5xl leading-none " +
            (highlighted ? "text-white" : "text-brand-primary")
          }
        >
          {price}
        </span>
        {cadence && (
          <span
            className={
              "ml-1 text-sm " +
              (highlighted ? "text-white/70" : "text-brand-text/70")
            }
          >
            {cadence}
          </span>
        )}
      </div>
      <ul className="list-none m-0 p-0 space-y-3 text-sm">
        {features.map((f) => (
          <li
            key={f}
            className={
              "flex items-start gap-3 " +
              (highlighted ? "text-white/90" : "text-brand-text")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden="true"
              className={
                "flex-shrink-0 mt-1 " +
                (highlighted ? "text-brand-accent" : "text-brand-primary")
              }
            >
              <path
                d="M2 7.5L5.5 11L12 3.5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="square"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
