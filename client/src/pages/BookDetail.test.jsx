import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookDetail from './BookDetail';

function renderBookRoute(pathname = '/book/book-1') {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BookDetail page', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/books/book-1/related')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 'book-2', title: 'Book Two', author: 'Author Two', affiliateUrl: 'https://example.com/affiliate-2' },
            { id: 'book-3', title: 'Book Three', author: 'Author Three', affiliateUrl: 'https://example.com/affiliate-3' },
          ],
        });
      }

      if (url.includes('/books/book-1')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'book-1',
            title: 'Book One',
            author: 'Author One',
            coverImage: '/covers/cover-1.jpg',
            backCoverImage: '/covers/cover-1-back.jpg',
            price: 19.99,
            fullDescription: 'This is the full description for Book One.',
            affiliateUrl: 'https://example.com/affiliate-1',
          }),
        });
      }

      if (url.includes('/books/book-404')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Book not found' }),
        });
      }

      if (url.includes('/books/book-error')) {
        return Promise.reject(new Error('Network failure'));
      }

      return Promise.resolve({ ok: true, json: async () => [] });
    });
  });

  it('loads the book, supports quantity controls, and shows related books', async () => {
    renderBookRoute('/book/book-1');

    expect(await screen.findByRole('heading', { name: /book one/i })).toBeInTheDocument();
    expect(screen.getByText(/author one/i)).toBeInTheDocument();

    const firstCover = screen.getByRole('img', { name: /book one cover 1/i });
    expect(firstCover).toHaveAttribute('src', '/covers/cover-1.jpg');

    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(screen.getByRole('img', { name: /book one cover 2/i })).toHaveAttribute('src', '/covers/cover-1-back.jpg');

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(quantityInput).toHaveValue(1);

    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }));
    expect(quantityInput).toHaveValue(2);

    fireEvent.click(screen.getByRole('button', { name: /decrease quantity/i }));
    expect(quantityInput).toHaveValue(1);

    fireEvent.click(screen.getByRole('button', { name: /decrease quantity/i }));
    expect(quantityInput).toHaveValue(1);

    const buyNowLink = screen.getByRole('link', { name: /buy now/i });
    expect(buyNowLink).toHaveAttribute('href', 'https://example.com/affiliate-1');
    expect(buyNowLink).toHaveAttribute('target', '_blank');
    expect(buyNowLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(buyNowLink).toHaveAttribute('rel', expect.stringContaining('sponsored'));

    expect(await screen.findByRole('heading', { name: /more books you may like/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view book two/i })).toHaveAttribute('href', '/book/book-2');

    const amazonLinks = screen.getAllByRole('link', { name: /buy on amazon/i });
    expect(amazonLinks).toHaveLength(2);
    expect(amazonLinks[0]).toHaveAttribute('href', 'https://example.com/affiliate-2');
  });

  it.each(['book-1', 'book-2', 'book-3'])('renders %s in light and dark mode', async (bookId) => {
    global.fetch = vi.fn((url) => {
      if (url.includes(`/books/${bookId}/related`)) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      if (url.includes(`/books/${bookId}`)) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: bookId,
            title: `Book ${bookId.replace('book-', '')}`,
            shortTitle: `Book ${bookId.replace('book-', '')}`,
            author: 'Author One',
            coverImage: '/covers/hallowen_front.png',
            backCoverImage: '/covers/hallowen-back.png',
            price: 19.99,
            fullDescription: 'This is the full description for Book One.',
            affiliateUrl: 'https://example.com/affiliate-1',
            category: 'Activity Book',
          }),
        });
      }

      return Promise.resolve({ ok: true, json: async () => [] });
    });

    document.documentElement.classList.remove('dark');
    renderBookRoute(`/book/${bookId}`);

    expect(await screen.findByRole('heading', { name: new RegExp(`book ${bookId.replace('book-', '')}`, 'i') })).toBeInTheDocument();

    document.documentElement.classList.add('dark');
    renderBookRoute(`/book/${bookId}`);

    expect(await screen.findByRole('heading', { name: new RegExp(`book ${bookId.replace('book-', '')}`, 'i') })).toBeInTheDocument();
  });

  it('renders multiline bullet descriptions on separate lines', async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/books/book-1/related')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      if (url.includes('/books/book-1')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'book-1',
            title: 'Book One',
            author: 'Author One',
            coverImage: '/covers/cover-1.jpg',
            backCoverImage: '/covers/cover-1-back.jpg',
            price: 19.99,
            fullDescription: 'This is the intro.\n\n- Large size pages of 8.5x11\n- Single sided pages for Framing and Coloring\n- Challenging Activity Book for Adults\n- Puzzles from 35 to 70 dots!',
            affiliateUrl: 'https://example.com/affiliate-1',
          }),
        });
      }

      return Promise.resolve({ ok: true, json: async () => [] });
    });

    renderBookRoute('/book/book-1');

    expect(await screen.findByRole('heading', { name: /book one/i })).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
    expect(listItems[0]).toHaveTextContent(/large size pages of 8.5x11/i);
    expect(listItems[1]).toHaveTextContent(/single sided pages for framing and coloring/i);
    expect(listItems[2]).toHaveTextContent(/challenging activity book for adults/i);
    expect(listItems[3]).toHaveTextContent(/puzzles from 35 to 70 dots!/i);
  });

  it('shows a friendly not-found state for an unknown book id', async () => {
    renderBookRoute('/book/book-404');

    expect(await screen.findByText(/book not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  it('shows an error state when the API request fails', async () => {
    renderBookRoute('/book/book-error');

    expect(await screen.findByRole('heading', { name: /could not load this book/i })).toBeInTheDocument();
  });
});
