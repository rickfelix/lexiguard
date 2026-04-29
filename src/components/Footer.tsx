export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(29,78,216,0.1)]">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 py-16 grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <span className="font-serif text-3xl font-bold text-brand-primary block mb-6">
            LexiGuard
          </span>
          <p className="max-w-xs text-sm text-brand-text/80">
            Accessible legal empowerment for the modern independent professional.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            <li>Risk Analysis</li>
            <li>Plain-Language Translation</li>
            <li>Secure Storage</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold">
            Company
          </h4>
          <ul className="space-y-3 text-sm">
            <li>Mission</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-10 text-xs opacity-60">
        © {new Date().getFullYear()} LexiGuard. Built for those who build.
      </div>
    </footer>
  );
}
