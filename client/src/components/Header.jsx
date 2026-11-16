import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color:rgba(255,250,245,0.72)] backdrop-blur-xl dark:border-[var(--color-border)] dark:bg-[color:rgba(15,17,21,0.78)]">
      <div className="mx-auto flex max-w-[var(--content-width)] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Little Fox home">
          <img
            src="/logo/little-fox-logo.jpeg"
            alt="Little Fox"
            className="h-11 w-auto rounded-xl object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--color-text-muted)] md:flex" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
            end
          >
            Books
          </NavLink>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
