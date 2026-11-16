import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/books/book-1/related')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 'book-2',
            title: 'Book Two',
            author: 'Author Two',
            coverImage: '/covers/cover-2.jpg',
            shortDescription: 'Short description two',
            fullDescription: 'Long description two',
            category: 'Self Help',
            affiliateUrl: 'https://example.com/affiliate-2',
          },
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
          shortDescription: 'Short description one',
          fullDescription: 'Long description one',
          category: 'Fiction',
          affiliateUrl: 'https://example.com/affiliate-1',
        }),
      });
    }

    if (url.includes('/books')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 'book-1',
            title: 'Book One',
            author: 'Author One',
            coverImage: '/covers/cover-1.jpg',
            shortDescription: 'Short description one',
            fullDescription: 'Long description one',
            category: 'Fiction',
            affiliateUrl: 'https://example.com/affiliate-1',
          },
        ],
      });
    }

    if (url.includes('/settings')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          logoName: 'Little Fox',
          amazonProfileUrl: 'https://www.amazon.com/',
          pinterestProfileUrl: 'https://www.pinterest.com/',
        }),
      });
    }

    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

describe('Little Fox app shell', () => {
  it('renders header with logo and nav items', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findAllByRole('img', { name: /little fox/i })).not.toHaveLength(0);
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /books/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(0);
  });

  it('toggles dark mode on the document root', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const toggle = await screen.findByRole('button', { name: /toggle dark mode/i });
    await user.click(toggle);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches routes between home and book detail shell', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/my book recommendations/i)).toBeInTheDocument();

    const [bookLink] = await screen.findAllByRole('link', { name: /book one/i });
    await user.click(bookLink);

    expect(await screen.findByRole('heading', { name: /book one/i })).toBeInTheDocument();
  });
});
