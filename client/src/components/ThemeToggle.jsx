import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextMode = !darkMode;
    root.classList.toggle('dark', nextMode);
    setDarkMode(nextMode);
  };

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={darkMode}
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] text-lg text-[var(--color-text)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(234,88,12,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] dark:bg-[var(--color-surface-strong)] dark:text-[var(--color-text)]"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
