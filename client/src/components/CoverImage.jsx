import { useState } from 'react';

function CoverImage({ src, alt, className = '' }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-bold text-white ${className}`}
        aria-label={alt || 'Book cover placeholder'}
      >
        Cover
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Book cover'}
      loading="lazy"
      className={className}
      onLoad={() => setHasError(false)}
      onError={() => setHasError(true)}
    />
  );
}

export default CoverImage;
