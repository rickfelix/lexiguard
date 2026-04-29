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
            "LexiGuard turned a 40-page Master Services Agreement into a
            5-minute read. I knew exactly what I was signing."
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
            title="AI-Powered Analysis"
            body="Upload your SOWs, MSAs, and client agreements to get an instant breakdown of key terms and potential risks."
          />
          <FeatureCard
            title="Plain-Language Translation"
            body="We demystify complex legal jargon, explaining what each clause actually means for you and your business."
          />
          <FeatureCard
            title="Developer-Specific Clause Suggestions"
            body="AI-powered recommendations for clauses covering Intellectual Property, acceptance criteria, payment schedules, and liability limitations."
          />
          <FeatureCard
            title="Risk Scoring"
            body="Every contract gets a simple risk score so you can see at a glance how much exposure you might have."
          />
          <FeatureCard
            title="Secure Document Management"
            body="Keep all your contracts organized and accessible in one secure, centralized place."
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
        className="py-20 border-t border-brand-primary/10"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold block mb-6">
            Pricing
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-6 text-brand-primary">
            Start free. Upgrade when you need more.
          </h2>
          <p className="text-base sm:text-lg">
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
            className="inline-flex items-center bg-brand-primary text-white font-semibold px-12 py-5 no-underline transition-transform hover:-translate-y-1"
          >
            Analyze Contract Free
          </Link>
          <p className="mt-4 text-sm text-brand-text/70">
            No credit card required to try the Starter plan.
          </p>
        </div>
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
      <div className="w-12 h-0.5 mb-8 bg-brand-accent" />
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
        (highlighted
          ? "bg-brand-primary text-white"
          : "bg-white text-brand-text") +
        " p-10 flex flex-col"
      }
    >
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
      <div className="mb-8">
        <span
          className={
            "font-serif text-4xl " +
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
              "flex items-start gap-2 " +
              (highlighted ? "text-white/90" : "text-brand-text")
            }
          >
            <span
              aria-hidden="true"
              className={
                "mt-1 inline-block w-2 h-2 flex-shrink-0 " +
                (highlighted ? "bg-brand-accent" : "bg-brand-primary")
              }
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
