import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[rgba(249,250,251,0.9)] border-b border-[rgba(29,78,216,0.1)]">
      <div className="mx-auto w-full max-w-[1440px] h-[100px] px-6 sm:px-12 lg:px-20 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-2xl font-bold text-brand-primary tracking-tight no-underline"
        >
          LexiGuard
        </Link>
        <nav>
          <ul className="flex items-center gap-6 sm:gap-12 list-none m-0 p-0">
            <li className="hidden sm:block">
              <a
                href="/#features"
                className="text-sm font-medium uppercase tracking-wider text-brand-text hover:text-brand-primary transition-colors no-underline"
              >
                Intelligence
              </a>
            </li>
            <li className="hidden sm:block">
              <a
                href="/#solutions"
                className="text-sm font-medium uppercase tracking-wider text-brand-text hover:text-brand-primary transition-colors no-underline"
              >
                For Freelancers
              </a>
            </li>
            <li className="hidden sm:block">
              <a
                href="/#pricing"
                className="text-sm font-medium uppercase tracking-wider text-brand-text hover:text-brand-primary transition-colors no-underline"
              >
                Pricing
              </a>
            </li>
            <li>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 font-semibold text-xs uppercase tracking-wider bg-brand-primary text-white no-underline transition-transform hover:-translate-y-0.5"
              >
                Secure Access
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
