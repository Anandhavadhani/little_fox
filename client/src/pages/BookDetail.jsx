import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookById, getRelatedBooks } from '../api/client';
import CoverImage from '../components/CoverImage';
import Seo from '../components/Seo';

function IconPages() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5v15A2.5 2.5 0 0 1 15.5 22h-7A2.5 2.5 0 0 1 6 19.5v-15Zm2.5-.5a.5.5 0 0 0-.5.5v15c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-7Zm1.5 3h4M9 12h6m-6 3h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function IconAge() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17Zm0 3.5v5l3 2.5m-4.5-8.5h.01M9.5 7.5h.01M14.5 7.5h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function IconPrint() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 5.5A2.5 2.5 0 0 1 9.5 3h5A2.5 2.5 0 0 1 17 5.5V7h1.5A2.5 2.5 0 0 1 21 9.5v4A2.5 2.5 0 0 1 18.5 16H17v3.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5V16H5.5A2.5 2.5 0 0 1 3 13.5v-4A2.5 2.5 0 0 1 5.5 7H7V5.5Zm2 1.5h6V5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V7Zm-1.5 6h9v6.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V13Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function parseDescription(fullDescription) {
  if (!fullDescription) {
    return { paragraphs: [], checklist: [] };
  }

  const lines = fullDescription
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const checklist = lines
    .filter((line) => /^[-*•]\s*/.test(line))
    .map((line) => line.replace(/^[-*•]\s*/, ''));

  const paragraphs = lines.filter((line) => !/^[-*•]\s*/.test(line));

  return { paragraphs, checklist };
}

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const touchStartXRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadBookDetails() {
      setLoading(true);
      setNotFound(false);
      setError('');
      setBook(null);
      setRelatedBooks([]);

      try {
        const [bookData, relatedData] = await Promise.all([getBookById(id), getRelatedBooks(id)]);

        if (!active) {
          return;
        }

        setBook(bookData);
        setRelatedBooks(relatedData || []);
      } catch (err) {
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Request failed';
        if (/not found/i.test(message)) {
          setNotFound(true);
        } else {
          setError('Could not load this book. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const galleryImages = Array.isArray(book?.images)
    ? book.images.filter(Boolean)
    : [book?.coverImage, book?.backCoverImage].filter(Boolean);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal');

    if (!revealItems.length) {
      return undefined;
    }

    const revealVisible = () => {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    };

    if (!('IntersectionObserver' in window)) {
      revealVisible();
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
      { threshold: 0.1 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const fallbackTimer = window.setTimeout(revealVisible, 600);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [book?.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!book || !event || !['ArrowRight', 'ArrowLeft'].includes(event.key)) {
        return;
      }

      if (event.key === 'ArrowRight') {
        setCurrentImageIndex((current) => (galleryImages.length ? (current + 1) % galleryImages.length : 0));
      }

      if (event.key === 'ArrowLeft') {
        setCurrentImageIndex((current) => (galleryImages.length ? (current - 1 + galleryImages.length) % galleryImages.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, galleryImages.length]);

  const decrementQuantity = () => setQuantity((current) => Math.max(1, current - 1));
  const incrementQuantity = () => setQuantity((current) => current + 1);

  const nextImage = () => setCurrentImageIndex((current) => (galleryImages.length ? (current + 1) % galleryImages.length : 0));
  const previousImage = () => setCurrentImageIndex((current) => (galleryImages.length ? (current - 1 + galleryImages.length) % galleryImages.length : 0));

  const displayImages = galleryImages.length ? galleryImages : [book?.coverImage].filter(Boolean);
  const title = book?.title ?? 'Book';
  const shortTitle = book?.shortTitle ?? (title.length > 78 ? `${title.slice(0, 78)}…` : title || 'Book');

  const featureBadges = [
    { key: 'pages', label: book?.pageCount ?? '50 pages', icon: <IconPages /> },
    { key: 'ages', label: book?.ageRange ?? 'Ages 4-8', icon: <IconAge /> },
    { key: 'print', label: book?.printType ?? 'Single-sided prints', icon: <IconPrint /> },
  ];

  const { paragraphs, checklist } = book ? parseDescription(book.fullDescription ?? '') : { paragraphs: [], checklist: [] };
  const hasToggle = paragraphs.length + checklist.length > 6;
  const visibleRelatedBooks = (relatedBooks || []).filter((relatedBook) => relatedBook?.id !== book?.id);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    touchStartXRef.current = null;
  };

  if (loading) {
    return (
      <main className="detail-shell mx-auto flex w-full max-w-[var(--content-width)] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="detail-skeleton">
          <div className="detail-skeleton-block detail-skeleton-title" />
          <div className="detail-skeleton-grid">
            <div className="detail-skeleton-card detail-skeleton-cover" />
            <div className="detail-skeleton-card detail-skeleton-info" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="detail-shell mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-8 text-center shadow-[0_22px_48px_rgba(15,23,42,0.05)]">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Book not found</h1>
          <p className="mt-3 text-[var(--color-text-muted)]">We could not find the book you were looking for.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(239,68,68,0.28)] hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="detail-shell mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-8 text-center shadow-[0_22px_48px_rgba(15,23,42,0.05)]">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Could not load this book</h1>
          <p className="mt-3 text-[var(--color-text-muted)]">{error || 'Something went wrong while loading this recommendation.'}</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(239,68,68,0.28)] hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Seo
        title={`${book.title} | Little Fox`}
        description={book.fullDescription || `${book.title} by ${book.author}`}
        image={book.coverImage || '/logo/little-fox-logo.jpeg'}
        path={`/book/${id}`}
      />

      <main className="detail-shell mx-auto flex w-full max-w-[var(--content-width)] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="detail-breadcrumb-link">Home</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <Link to="/" className="detail-breadcrumb-link">Books</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <span className="detail-breadcrumb-current">{shortTitle}</span>
        </nav>

        <Link to="/" className="detail-back-link">← Back to books</Link>

        <article className="detail-product-article reveal">
          <div className="detail-gallery-panel">
            <div
              className="detail-gallery-card"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="detail-gallery-stage">
                {displayImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`detail-gallery-image ${index === currentImageIndex ? 'is-active' : ''}`}
                    aria-hidden={index !== currentImageIndex}
                  >
                    <CoverImage
                      src={image}
                      alt={`${book.title} cover ${index + 1}`}
                      className="detail-cover-image"
                    />
                  </div>
                ))}
              </div>

              {displayImages.length > 1 ? (
                <>
                  <button type="button" onClick={previousImage} aria-label="Previous image" className="detail-gallery-nav detail-gallery-nav-prev">
                    ‹
                  </button>
                  <button type="button" onClick={nextImage} aria-label="Next image" className="detail-gallery-nav detail-gallery-nav-next">
                    ›
                  </button>
                </>
              ) : null}
            </div>

            {displayImages.length > 1 ? (
              <div className="detail-thumbnail-row" aria-label="Book gallery thumbnails">
                {displayImages.map((image, index) => (
                  <button
                    key={`${image}-thumb-${index}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`detail-thumbnail ${index === currentImageIndex ? 'is-active' : ''}`}
                  >
                    <CoverImage src={image} alt={`${book.title} thumbnail ${index + 1}`} className="detail-thumbnail-image" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="detail-product-panel">
            <div className="detail-meta-block">
              <span className="detail-category-chip">{book?.category ?? 'Book'}</span>
              <h1 className="detail-title">{book?.shortTitle ?? shortTitle}</h1>
              <p className="detail-original-title">{book?.title ?? title}</p>
            </div>

            <div className="detail-author-row">
              <div className="detail-author-avatar" aria-hidden="true">{(book?.author ?? 'Little Fox').split(' ').filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').slice(0, 2) || 'LF'}</div>
              <p className="detail-author-name">by {book?.author ?? 'Little Fox'}</p>
            </div>

            <div className="detail-price-block">
              <div className="detail-price">${Number(book?.price ?? 0).toFixed(2)}</div>
              <p className="detail-price-note">Free shipping / Available on Amazon</p>
            </div>

            <div className="detail-badges" aria-label="Book highlights">
              {featureBadges.map((badge) => (
                <div key={badge.key} className="detail-badge">
                  <span className="detail-badge-icon">{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="detail-quantity-row">
              <span className="detail-quantity-label">Quantity</span>
              <div className="detail-quantity-stepper" aria-label="Adjust quantity">
                <button type="button" onClick={decrementQuantity} aria-label="Decrease quantity" className="detail-quantity-button">
                  −
                </button>
                <input
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  readOnly
                  className="detail-quantity-input"
                />
                <button type="button" onClick={incrementQuantity} aria-label="Increase quantity" className="detail-quantity-button">
                  +
                </button>
              </div>
            </div>

            <div className="detail-cta-row">
              <a
                href={book?.affiliateUrl || '#'}
                target="_blank"
                rel="noopener sponsored"
                className="detail-button detail-button-primary"
              >
                Buy Now
              </a>
              <a
                href={book?.affiliateUrl || '#'}
                target="_blank"
                rel="noopener sponsored"
                className="detail-button detail-button-secondary"
              >
                View on Amazon
              </a>
            </div>

            <div className="detail-description-card">
              <h2 className="detail-section-heading">About this book</h2>
              <div className={`detail-description ${expandedDescription ? 'is-expanded' : 'is-collapsed'}`}>
                {paragraphs.length ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : null}

                {checklist.length ? (
                  <div className="detail-checklist-wrap">
                    <h3>What's inside</h3>
                    <ul className="detail-checklist">
                      {checklist.map((item, index) => (
                        <li key={`${item}-${index}`}>
                          <span className="detail-check-icon" aria-hidden="true">
                            <svg viewBox="0 0 20 20" focusable="false">
                              <path d="M5 10.5 8.2 13.7 15 6.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {hasToggle ? (
                <button type="button" onClick={() => setExpandedDescription((current) => !current)} className="detail-read-toggle">
                  {expandedDescription ? 'Show less' : 'Read more'}
                </button>
              ) : null}
            </div>
          </div>
        </article>

        <section className="detail-related-section reveal">
          <h2 className="detail-related-heading">More books you may like</h2>

          <div className="detail-related-grid">
            {visibleRelatedBooks.length ? (
              visibleRelatedBooks.map((relatedBook) => (
                <article key={relatedBook.id} className="detail-related-card">
                  <Link to={`/book/${relatedBook.id}`} aria-label={`View ${relatedBook.title}`} className="detail-related-cover-link">
                    <div className="detail-related-cover-wrap">
                      <CoverImage src={relatedBook.coverImage} alt={relatedBook.title} className="detail-related-cover" />
                    </div>
                  </Link>

                  <div className="detail-related-body">
                    <span className="detail-related-chip">{relatedBook?.category ?? 'Book'}</span>
                    <h3>{relatedBook?.shortTitle ?? relatedBook?.title ?? 'Recommended book'}</h3>
                    <p>{relatedBook?.author ?? 'Little Fox'}</p>
                    <a
                      href={relatedBook?.affiliateUrl || '#'}
                      target="_blank"
                      rel="noopener sponsored"
                      className="detail-related-button"
                    >
                      Buy on Amazon
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-[var(--color-text-muted)]">No related books available right now.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default BookDetail;
