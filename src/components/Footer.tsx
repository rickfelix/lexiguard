export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(29,78,216,0.1)]">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 py-16 grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <span className="font-serif text-3xl font-bold text-brand-primary block mb-6">
            LexiGuard
          </span>
          <p className="max-w-xs text-sm text-brand-text/80 leading-relaxed">
            Accessible legal empowerment for the modern independent
            professional.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold text-brand-primary">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            <FooterItem>Risk Analysis</FooterItem>
            <FooterItem>Plain-Language Translation</FooterItem>
            <FooterItem>Secure Storage</FooterItem>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold text-brand-primary">
            Company
          </h4>
          <ul className="space-y-3 text-sm">
            <FooterItem>Mission</FooterItem>
            <FooterItem>Privacy</FooterItem>
            <FooterItem>Terms</FooterItem>
          </ul>
        </div>
      </div>
      <div className="border-t border-[rgba(29,78,216,0.08)]">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-text/60">
          <span>© {new Date().getFullYear()} LexiGuard. Built for those who build.</span>
          <span className="uppercase tracking-widest">
            Drafted with care · Reviewed by AI
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-brand-text/80 hover:text-brand-primary transition-colors cursor-default">
      {children}
    </li>
  );
}
