import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[rgba(249,250,251,0.85)] border-b border-[rgba(29,78,216,0.1)]">
      <div className="mx-auto w-full max-w-[1440px] h-[88px] px-6 sm:px-12 lg:px-20 flex items-center justify-between">
        <Link
          to="/"
          className="no-underline flex items-center group"
          aria-label="LexiGuard home"
        >
          <img
            src="/logo.svg"
            alt="LexiGuard"
            width={160}
            height={30}
            className="block h-8 w-auto transition-opacity group-hover:opacity-80"
          />
        </Link>
        <nav>
          <ul className="flex items-center gap-6 sm:gap-10 list-none m-0 p-0">
            <li className="hidden sm:block">
              <NavLinkLike href="/#features">Intelligence</NavLinkLike>
            </li>
            <li className="hidden sm:block">
              <NavLinkLike href="/#solutions">For Freelancers</NavLinkLike>
            </li>
            <li className="hidden sm:block">
              <NavLinkLike href="/#pricing">Pricing</NavLinkLike>
            </li>
            <li>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  "inline-flex items-center px-5 sm:px-6 py-3 font-semibold text-xs uppercase tracking-wider no-underline transition-all duration-200 " +
                  (isActive
                    ? "bg-brand-primary text-white shadow-[0_8px_20px_-8px_rgba(29,78,216,0.6)]"
                    : "bg-brand-primary text-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(29,78,216,0.7)]")
                }
              >
                Secure Access
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function NavLinkLike({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="relative text-sm font-medium uppercase tracking-wider text-brand-text hover:text-brand-primary transition-colors no-underline after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-brand-primary after:transition-all hover:after:w-full"
    >
      {children}
    </a>
  );
}
