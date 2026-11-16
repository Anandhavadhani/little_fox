function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface-strong)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[var(--content-width)] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo/little-fox-logo.jpeg"
            alt="Little Fox"
            className="h-11 w-auto rounded-xl object-contain"
          />
          <div>
            <p className="text-base font-semibold text-[var(--color-text)]">Little Fox</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Creative books</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--color-text-muted)]">
          <a href="/" className="nav-link">Home</a>
          <a href="#book-collection" className="nav-link">Books</a>
          <a href="https://www.instagram.com/little_fox_publishers?psln=ZnJwNm9vYnF2b24z" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <p className="text-sm text-[var(--color-text-muted)]">© Little Fox</p>
      </div>
    </footer>
  );
}

export default Footer;
