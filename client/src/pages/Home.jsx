import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getSettings } from '../api/client';
import CoverImage from '../components/CoverImage';
import Seo from '../components/Seo';

const emptySettings = {
  logoName: 'Little Fox',
  amazonProfileUrl: '[AMAZON PROFILE URL]',
  pinterestProfileUrl: '[PINTEREST PROFILE URL]',
};

const filterOptions = ['All', 'Coloring', 'Dot to Dot', 'Halloween'];

function Home() {
  const collectionRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState(emptySettings);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [booksData, settingsData] = await Promise.all([getBooks(), getSettings()]);
        setBooks(booksData || []);
        setSettings(settingsData || emptySettings);
      } catch (error) {
        console.error('Failed to load Home page data', error);
        setBooks([]);
        setSettings(emptySettings);
      }
    }

    loadHomeData();
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [books.length]);

  const handleBrowseClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroBooks = books.slice(0, 3);

  const normalizeCategory = (title) => title.toLowerCase();

  const filteredBooks = books.filter((book) => {
    if (activeFilter === 'All') return true;

    const categoryText = normalizeCategory(book.category || '');
    const titleText = normalizeCategory(book.title || '');

    if (activeFilter === 'Coloring') {
      return categoryText.includes('coloring') || titleText.includes('coloring');
    }

    if (activeFilter === 'Dot to Dot') {
      return categoryText.includes('dot') || titleText.includes('dot');
    }

    if (activeFilter === 'Halloween') {
      return categoryText.includes('halloween') || titleText.includes('halloween') || titleText.includes('activity');
    }

    return true;
  });

  return (
    <>
      <Seo
        title="Little Fox | Book Recommendations"
        description="Little Fox book recommendations and reading picks."
        path="/"
      />

      <main className="site-shell mx-auto flex w-full max-w-[var(--content-width)] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="reveal hero-shell rounded-[32px] p-6 shadow-[0_24px_70px_rgba(239,68,68,0.2)] sm:p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">Little Fox Picks</p>
              <h1 className="max-w-xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--color-text)] sm:text-6xl lg:text-[64px]">
                My Book Recommendations
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
                Hand-picked coloring, puzzle and activity books that turn screen time into creative time.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-text)] shadow-[0_18px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5"
                >
                  Browse Books
                </button>
                <a
                  href="https://www.instagram.com/little_fox_publishers?psln=ZnJwNm9vYnF2b24z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex h-[360px] w-full max-w-[440px] items-center justify-center lg:h-[420px]">
              {heroBooks.length ? (
                heroBooks.map((book, index) => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    aria-label={`Open ${book.title}`}
                    className={`hero-cover absolute block w-[220px] sm:w-[240px] ${index === 0 ? 'left-2 rotate-[-8deg]' : index === 1 ? 'left-1/2 -translate-x-1/2 rotate-0' : 'right-2 rotate-[8deg]'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CoverImage
                      src={book.coverImage}
                      alt={book.title}
                      className="h-[300px] w-full rounded-[18px] border border-white/30 object-cover shadow-[0_28px_40px_rgba(15,23,42,0.26)]"
                    />
                  </Link>
                ))
              ) : (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute h-[300px] w-[220px] rounded-[18px] bg-white/15 shadow-[0_18px_30px_rgba(15,23,42,0.12)] ${index === 0 ? 'left-2 rotate-[-8deg]' : index === 1 ? 'left-1/2 -translate-x-1/2 rotate-0' : 'right-2 rotate-[8deg]'}`}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="reveal rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-6">
          <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-text)]">Find me on</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="https://www.instagram.com/little_fox_publishers?psln=ZnJwNm9vYnF2b24z"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card group"
            >
              <div className="social-icon instagram-gradient">
                <span aria-hidden="true">◎</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-[var(--color-text)]">Instagram</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">@little_fox_publishers</p>
              </div>
              <span className="text-lg font-semibold text-[var(--color-accent)] transition group-hover:translate-x-1">Follow →</span>
            </a>

            <a
              href={settings.pinterestProfileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card group"
            >
              <div className="social-icon pinterest-gradient">
                <span aria-hidden="true">P</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-[var(--color-text)]">Pinterest</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">@littlefoxbooks</p>
              </div>
              <span className="text-lg font-semibold text-[var(--color-accent)] transition group-hover:translate-x-1">Follow →</span>
            </a>
          </div>
        </section>

        <section ref={collectionRef} id="book-collection" className="reveal rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-text)]">Book collection</h2>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFilter(option)}
                  className={`chip ${activeFilter === option ? 'chip-active' : ''}`}
                  aria-pressed={activeFilter === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.length ? (
              filteredBooks.map((book) => (
                <article key={book.id} className="book-card group">
                  <Link to={`/book/${book.id}`} className="block" aria-label={`View ${book.title}`}>
                    <div className="book-cover-wrap">
                      <CoverImage
                        src={book.coverImage}
                        alt={book.title}
                        className="book-cover-image"
                      />
                    </div>
                  </Link>

                  <div className="space-y-4 p-4 pt-5">
                    <span className="inline-flex rounded-full bg-[rgba(234,88,12,0.12)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                      {book.category || 'Activity Book'}
                    </span>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[var(--color-text)]">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">{book.author}</p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">
                      {book.shortDescription || 'A playful pick for curious young readers.'}
                    </p>

                    <a
                      href={book.affiliateUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_32px_rgba(239,68,68,0.26)] transition hover:-translate-y-0.5"
                    >
                      View on Amazon
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[22px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-10 text-center text-[var(--color-text-muted)]">
                No books match this category yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
